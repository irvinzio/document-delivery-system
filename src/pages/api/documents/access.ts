import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const ENCRYPTION_KEY = (process.env.NEXTAUTH_SECRET || "").padEnd(32, "0").slice(0, 32); // 32 bytes for AES-256
const IV_LENGTH = 16;

function decrypt(text: string) {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { documentId } = req.body;
  if (!documentId) return res.status(400).json({ error: "Missing documentId" });

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // Only sender or recipient can access
  const userId = (session.user as any)?.id;
  if (userId !== doc.senderId && userId !== doc.recipientId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Check expiration
  if (doc.expiresAt && new Date() > doc.expiresAt) {
    await prisma.document.delete({ where: { id: documentId } });
    return res.status(410).json({ error: "Document expired and deleted" });
  }

  // Check view limit
  if (doc.viewLimit && doc.viewCount >= doc.viewLimit) {
    await prisma.document.delete({ where: { id: documentId } });
    return res.status(410).json({ error: "Document view limit reached and deleted" });
  }

  // Increment view count
  await prisma.document.update({
    where: { id: documentId },
    data: { viewCount: { increment: 1 } },
  });

  // Decrypt content
  const decryptedContent = decrypt(doc.content);

  return res.status(200).json({ document: { ...doc, content: decryptedContent } });
}
