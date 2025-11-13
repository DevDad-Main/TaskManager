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

//#region Update Folder
export const updateFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name } = req.body;

    const isFolder = await prisma.folder.findUnique({
      where: { id, userId },
    });

    if (!isFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: { name },
    });

    if (!folder) {
      return res.status(400).json({ message: "Folder not updated" });
    }

    return res
      .status(200)
      .json({ success: true, folder, message: "Update Folder Successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion

//#region Delete Folder
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "No folder id provided" });
    }

    //NOTE: This will either delete all the tasks in a folder or just be an empty array if there is no tasks in the folder.
    await prisma.task.deleteMany({
      where: { folderId: id },
    });

    const folder = await prisma.folder.delete({
      where: { id: req.params.id },
    });

    if (!folder) {
      return res.status(400).json({ message: "Folder Couldn't be deleted" });
    }

    return res.status(200).json({
      success: true,
      message: "Folder Deleted Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion
