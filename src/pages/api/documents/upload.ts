import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET!.slice(0, 32); // 32 bytes for AES-256
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
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { name, content, recipientId, viewLimit, expiresAt } = req.body;
  if (!name || !content || !recipientId) return res.status(400).json({ error: "Missing fields" });

  const encryptedContent = encrypt(content);
  const doc = await prisma.document.create({
    data: {
      name,
      content: encryptedContent,
  senderId: (session?.user as any)?.id,
      recipientId,
      viewLimit: viewLimit ? Number(viewLimit) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  return res.status(201).json({ document: doc });
}
