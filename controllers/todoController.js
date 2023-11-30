import supabase from "../lib/supabase.js";

export const createTodo = async (req, res) => {
  const { name, amount, date, group_id } = req.body;
  const { data, error } = await supabase.from("todos").insert({
    name,
    amount,
    checked: false,
    date,
    group_id,
  });
  res.json({ data, error });
};

export const getTodos = async (req, res) => {
  const { data, error } = await supabase.from("todos").select();
  res.json({ data, error });
};
