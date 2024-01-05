import supabase from "../lib/supabase.js";

export const createRecipe = async (req, res) => {
  const { group_id, name, content, image_url } = req.body;
  // Example:
  // const {data, error} = await supabase.from().insert();
  // res.json({data, error});
};

export const getRecipes = async (req, res) => {
  const { group_id } = req.query;
  // Get recipes by group_id
  // If !group_id, return error = Group id must be provided
};

export const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { group_id, name, content, image_url } = req.body;
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
};
