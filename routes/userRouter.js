import express from "express";
import { signUp } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", signUp);

export default userRouter;
