import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipeDetails,
  getRecipes,
  updateRecipe,
} from "../controllers/recipeController.js";
import {auth} from "../middleware/auth.js"

const recipeRouter = express.Router();

recipeRouter.post("/", auth, createRecipe);
recipeRouter.get("/", auth, getRecipes);
recipeRouter.get("/:id", auth, getRecipeDetails);
recipeRouter.put("/:id", auth, updateRecipe);
recipeRouter.delete("/:id", auth, deleteRecipe);

export default recipeRouter;
