import supabase from "../lib/supabase.js";
import dayjs from "dayjs";

export const createTodo = async (req, res) => {
  const { group_id, date, name, amount } = req.body;
  const { data, error } = await supabase
    .from("todos")
    .insert({
      group_id,
      name,
      amount,
      date,
    })
    .select()
    .single();
  res.json({ data, error });
};

export const getTodos = async (req, res) => {
  const { group_id, date } = req.query;
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("date", dayjs(date).toString())
    .eq("group_id", group_id)
    .order("created_at", { ascending: false });
  res.json({ data, error });
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { name, amount, checked, date } = req.body;
  const { data, error } = await supabase
    .from("todos")
    .update({
      name,
      amount,
      checked,
      date,
    })
    .eq("id", id)
    .select()
    .single();
  res.json({ data, error });
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  console.log("delete todo");
  const { error } = await supabase.from("todos").delete().eq("id", id);
  res.json({ error });
};
