import express from "express";
import cors from "cors";

import todosRouter from "./routes/todos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/todos", todosRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
