import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipeDetails,
  getRecipes,
  updateRecipe,
} from "../controllers/recipeController";

const recipeRouter = express.Router();

recipeRouter.post("/", createRecipe);
recipeRouter.get("/", getRecipes);
recipeRouter.get("/:id", getRecipeDetails);
recipeRouter.put("/:id", updateRecipe);
recipeRouter.delete("/:id", deleteRecipe);

export default recipeRouter;
