import express from "express";
import cors from "cors";

import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/todos", todoRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
