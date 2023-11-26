import supabase from "../lib/supabase.js";

export const getTodos = async (req, res) => {
  const { data, error } = await supabase.from("todos").select();
  res.json({ data, error });
};
