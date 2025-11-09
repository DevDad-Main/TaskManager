import prisma from "../configs/prisma.config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SafeUser } from "../types/user.types";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearerHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = req.cookies.token ?? bearerHeader;

  if (!token)
    return res
      .status(401)
      .json({ message: "You are not logged in. Please log in to get access" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user)
      return res.status(401).json({
        message: "Token is invalid or has expired. Please log in again",
      });

    req.user = user as SafeUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid or has expired. Please log in again",
    });
  }
};
