import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { NewTaskBody, UpdateTaskBody } from "../interfaces/task.interfaces";
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
        priority: priorityEnum,
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

//#region Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, priority, completed, tags, dueDate, folderId } =
      req.body as UpdateTaskBody;

    const priorityEnum = priorityMap[priority.toLowerCase()];

    if (!priorityEnum) {
      return res.status(400).json({ message: "Invalid priority value" });
    }
    // {
    // fullstack-backend   |   id: '1e3f08b7-b887-440f-8769-8ccae67cc7bb',
    // fullstack-backend   |   title: 'asda',
    // fullstack-backend   |   description: 'asdad',
    // fullstack-backend   |   priority: 'MEDIUM',
    // fullstack-backend   |   dueDate: '2025-11-10T00:00:00.000Z',
    // fullstack-backend   |   folderId: 'a58781e4-aaa3-41c4-bc2b-930736a53af7',
    // fullstack-backend   |   tags: [ 'asda' ],
    // fullstack-backend   |   userId: 'bcc7f547-c988-41bb-a69f-537c2f1fe9a8'
    // fullstack-backend   | }
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority: priorityEnum,
        dueDate: new Date(dueDate),
        folderId,
        tags,
      },
    });

    console.log(task);

    if (!task) {
      return res.status(400).json({ message: "Task Couldn't be updated" });
    }

    return res
      .status(200)
      .json({ success: true, task, message: "Task updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion

//#region Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    console.log("DELETE task ID:", req.params.id);
    const userId = req.user?.id;

    const task = await prisma.task.delete({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(400).json({ message: "Task Couldn't be deleted" });
    }

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
//#endregion
