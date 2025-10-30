import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import "dotenv/config";

const prisma = new PrismaClient();

export default async function generateJWT(userId: string, res: Response) {
  try {
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { token };
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
