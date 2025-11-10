import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createFolder, getfolders } from "../controllers/folder.controller";

const folderRouter = express.Router();

folderRouter.use(isAuthenticated);

folderRouter.route("/").get(getfolders).post(createFolder);

export default folderRouter;
