import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { getTasks } from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.get("/", isAuthenticated, getTasks);

export default taskRouter;
