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
  const startOfDate = dayjs(date).startOf("day").toISOString();
  const endOfDate = dayjs(date).endOf("day").toISOString();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .lte("date", endOfDate)
    .gte("date", startOfDate)
    .eq("group_id", group_id);
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
  const { error } = await supabase.from("todos").delete().eq("id", id);
  return { error };
};
