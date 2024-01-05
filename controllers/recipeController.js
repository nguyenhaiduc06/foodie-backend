import supabase from "../lib/supabase.js";

export const createRecipe = async (req, res) => {
  const { group_id, name, content, image_url } = req.body;
  const { data, error } = await supabase
    .from("recipes")
    .insert({ group_id, name, content, image_url })
    .select()
    .single();
  res.json({ data, error });
};

export const getRecipes = async (req, res) => {
  const { group_id } = req.query;
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("group_id", group_id);
  res.json({ data, error });
};

export const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { group_id, name, content, image_url } = req.body;
  const { data, error } = await supabase
    .from("recipes")
    .update({ name, content, image_url })
    .eq("id", id)
    .select()
    .single();
  res.json({ data, error });
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  res.json({ error });
};
