import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrpt from "bcrypt";
import generateJWT from "../utils/generateJWT.util";
import { LoginBody, RegisterBody } from "../interfaces/user.interfaces";

//#region Constants
const prisma = new PrismaClient();
const SALT_ROUNDS = 12;
//#endregion

//#region User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as RegisterBody;

    console.log("Request body:", req.body);

    // Simple validation for now - TODO: Add express-validator
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, Password or Name are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrpt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = await generateJWT(user.id);
    // NOTE: Return the user back to the client so they can authenticate and log the user in.
    return res
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({ message: "User created", success: true, user });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
//#endregion

//#region User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isPasswordCorrect = await bcrpt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = await generateJWT(user.id);

    return res
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "User Logged In", success: true, user });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
//#endregion
