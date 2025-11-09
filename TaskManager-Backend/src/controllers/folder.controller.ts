import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { NewfolderBody } from "../interfaces/folder.interfaces";

//#region Get All Folders
export const getfolders = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId,
      },
    });

    if (!folders || folders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No folders found",
      });
    }

    return res.status(200).json({
      success: true,
      folders,
      message: "Folders fetched successfully",
    });
  } catch (error) {
    console.log(error);
  }
  return res.status(200);
};
//#endregion

//#region Create Folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body as NewfolderBody;
    const folder = await prisma.folder.create({
      data: { name, userId },
    });
  } catch (error) {
    console.log(error);
  }
};
//#endregion
