import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const ENCRYPTION_KEY = (process.env.NEXTAUTH_SECRET || "").padEnd(32, "0").slice(0, 32); // 32 bytes for AES-256
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  console.log("🚀 ~ handler ~ session:", session)
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { name, content, recipientId, viewLimit, expiresAt } = req.body;
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Missing or invalid document name" });
  if (!content || typeof content !== "string") return res.status(400).json({ error: "Missing or invalid document content" });
  if (!recipientId || typeof recipientId !== "string") return res.status(400).json({ error: "Missing or invalid recipientId" });

  const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
  if (!recipient) return res.status(400).json({ error: "Recipient user not found" });

  const userId = (session?.user as any)?.id;
  if (!userId) return res.status(400).json({ error: "Sender user not found" });

  const encryptedContent = encrypt(content);
  try {
    const doc = await prisma.document.create({
      data: {
        name,
        content: encryptedContent,
        senderId: userId,          
        recipientId,                
        viewLimit: viewLimit ? Number(viewLimit) : null,
        viewCount: 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return res.status(201).json({ document: doc });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return res.status(500).json({ error: error?.message || "Document upload failed" });
  }
}
