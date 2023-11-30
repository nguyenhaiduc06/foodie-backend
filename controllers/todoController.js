import supabase from "../lib/supabase.js";

export const createTodo = async (req, res) => {
  const { name, amount, checked = false, date, group_id } = req.body;
  const { data: todo, error } = await supabase.from("todos").insert({
    name,
    amount,
    checked,
    date,
    group_id,
  });
  res.json({ todo, error });
};

export const getTodos = async (req, res) => {
  const { data: todos, error } = await supabase.from("todos").select();
  res.json({ todos, error });
};

export const updateTodo = async (req, res) => {};

export const deleteTodo = async (req, res) => {};
