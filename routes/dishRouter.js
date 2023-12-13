import express from "express";
import {
  createDish,
  deleteDish,
  getDishDetails,
  getDishes,
  updateDish,
} from "../controllers/dishController";

const dishRouter = express.Router();

dishRouter.post("/", createDish);
dishRouter.get("/", getDishes);
dishRouter.get("/:id", getDishDetails);
dishRouter.put("/:id", updateDish);
dishRouter.delete("/:id", deleteDish);

export default dishRouter;
