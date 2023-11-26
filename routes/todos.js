import express from "express";
import { getTodos } from "../controllers/todoController.js";

const todosRouter = express.Router();

todosRouter.get("/", getTodos);

export default todosRouter;
