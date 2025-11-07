import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import "dotenv/config";

const prisma = new PrismaClient();

export default async function generateJWT(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return token;
}
