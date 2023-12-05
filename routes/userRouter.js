import express from "express";
import {signUp, signIn, getUser} from "../controllers/userController.js";
import  {auth} from "../middleware/auth.js"
const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/signIn", signIn);
userRouter.get("/:id", auth, getUser);

export default userRouter;
