import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrpt from "bcrypt";
import generateJWT from "../utils/generateJWT.util";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

//#region User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Simple validation for now - TODO: Add express-validator
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrpt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//#endregion
