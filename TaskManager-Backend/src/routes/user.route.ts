import express from "express";
import {
  authenticateUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const userRouter = express.Router();

userRouter.get("/authenticate", isAuthenticated, authenticateUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
