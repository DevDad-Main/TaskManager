import { Request, Response } from "express";
import prisma from "../configs/prisma.config";

//#region Get All Tasks
export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const tasks = await prisma.task.findMany({});

    return res.status(200).json({
      success: true,
      tasks,
      message: "All tasks fetched successfully",
    });
  } catch (error) {}
};
//#endregion
