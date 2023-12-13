import express from "express";
import cors from "cors";

import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";
import recipeRouter from "./routes/recipeRouter.js";
import dishRouter from "./routes/dishRouter.js";
import storageRouter from "./routes/storageRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/dishes", dishRouter);
app.use("/storages", storageRouter);
app.use("/recipes", recipeRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
