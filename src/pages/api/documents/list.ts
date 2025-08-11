import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const userId = (session.user as any)?.id;

  // Get sent and received documents
  const sent = await prisma.document.findMany({ where: { senderId: userId } });
  const received = await prisma.document.findMany({ where: { recipientId: userId } });

  res.status(200).json({ sent, received });
}
