import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.use(isAuthenticated);

taskRouter.route("/").get(getTasks).post(createTask);
taskRouter.route("/:id").put(updateTask).delete(deleteTask);

export default taskRouter;
