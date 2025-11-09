import express from "express";
import {
  authenticateUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/authenticate", authenticateUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
