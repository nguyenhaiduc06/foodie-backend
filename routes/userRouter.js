import express from "express";
import {
  signUp,
  signIn,
  getUser,
  updateAccount,
  getAccount,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.get("/", getUser);
userRouter.put("/:id", updateAccount);
userRouter.post("/account", getAccount);

export default userRouter;
