import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { getfolders } from "../controllers/folder.controller";

const folderRouter = express.Router();

folderRouter.get("/", isAuthenticated, getfolders);

export default folderRouter;
