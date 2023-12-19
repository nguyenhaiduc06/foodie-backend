import express from "express";
import {
  createDish,
  deleteDish,
  getDishDetails,
  getDishes,
  updateDish,
} from "../controllers/dishController.js";
import  {auth} from "../middleware/auth.js"


const dishRouter = express.Router();

dishRouter.post("/", auth, createDish);
dishRouter.get("/", auth, getDishes);
dishRouter.get("/:id", auth, getDishDetails);
dishRouter.put("/:id", auth, updateDish);
dishRouter.delete("/:id", auth, deleteDish);

export default dishRouter;
