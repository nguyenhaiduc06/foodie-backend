import supabase from "../lib/supabase.js";

export const createDish = async (req, res) => {
  const { group_id, name, image_url, date, meal } = req.body;
  // Example:
  // const {data, error} = await supabase.from().insert();
  // res.json({data, error});
};

export const getDishes = async (req, res) => {
  const { group_id } = req.query;
  // Get dishes by group_id
  // If !group_id, return error = Group id must be provided
};

export const getDishDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateDish = async (req, res) => {
  const { id } = req.params;
  const { group_id, name, image_url, date, meal } = req.body;
};

export const deleteDish = async (req, res) => {
  const { id } = req.params;
};
