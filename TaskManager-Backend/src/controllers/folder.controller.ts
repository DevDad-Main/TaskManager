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
      include: {
        tasks: true,
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

    if (!folder) {
      return res.status(400).json({ message: "Folder not created" });
    }

    return res
      .status(201)
      .json({ success: true, folder, message: "Folder created successfully" });
  } catch (error) {
    console.log(error);
  }
};
//#endregion
