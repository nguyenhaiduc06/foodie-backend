import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todoController.js";
import {auth} from "../middleware/auth.js";

const todoRouter = express.Router();

todoRouter.post("/", auth, createTodo);
todoRouter.get("/", auth, getTodos);
todoRouter.put("/:id", auth, updateTodo);
todoRouter.delete("/:id", auth, deleteTodo);

export default todoRouter;
