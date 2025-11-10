import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { getTasks, createTask } from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.use(isAuthenticated);

taskRouter.route("/").get(getTasks).post(createTask);

export default taskRouter;
