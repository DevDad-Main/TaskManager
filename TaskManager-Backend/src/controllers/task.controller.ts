import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { NewTaskBody } from "../interfaces/task.interfaces";
import { Priority } from "@prisma/client";

const priorityMap: Record<string, Priority> = {
  low: Priority.LOW,
  medium: Priority.MEDIUM,
  high: Priority.HIGH,
};

//#region Get All Tasks
export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No tasks found",
      });
    }

    return res.status(200).json({
      success: true,
      tasks,
      message: "All tasks fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion

//#region Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, priority, completed, tags, dueDate, folderId } =
      req.body as NewTaskBody;

    const priorityEnum = priorityMap[priority.toLowerCase()];

    if (!priorityEnum) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    // TODO: Add Validation for req.body properties

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priorityEnum, // ← "medium" → "MEDIUM"
        // priority,
        //TODO: Add field to Task model -  completed,
        tags,
        dueDate: new Date(dueDate),
        folderId,
        userId,
      },
    });

    if (!task) {
      return res.status(400).json({ message: "Task not created" });
    }

    return res
      .status(201)
      .json({ success: true, task, message: "Task created" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion
