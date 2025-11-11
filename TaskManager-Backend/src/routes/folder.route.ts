import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  createFolder,
  deleteFolder,
  getfolders,
  updateFolder,
} from "../controllers/folder.controller";

const folderRouter = express.Router();

folderRouter.use(isAuthenticated);

folderRouter.route("/").get(getfolders).post(createFolder);
folderRouter.route("/:id").put(updateFolder).delete(deleteFolder);

export default folderRouter;
