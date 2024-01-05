import supabase from "../lib/supabase.js";
import dayjs from "dayjs";

export const createDish = async (req, res) => {
  const { group_id, date, name, meal, image_url } = req.body;
  const { data, error } = await supabase
    .from("dishes")
    .insert({ group_id, date, name, meal, image_url })
    .select()
    .single();
  res.json({ data, error });
};

export const getDishes = async (req, res) => {
  const { group_id, date } = req.query;
  const startOfDate = dayjs(date).startOf("date").toISOString();
  const endOfDate = dayjs(date).endOf("date").toISOString();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .lte("date", endOfDate)
    .gte("date", startOfDate)
    .eq("group_id", group_id);
  res.json({ data, error });
};

export const getDishDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateDish = async (req, res) => {
  const { id } = req.params;
  const { group_id, date, name, image_url, meal } = req.body;
  const { data, error } = await supabase
    .from("dishes")
    .update({ group_id, date, name, meal, image_url })
    .eq("id", id)
    .select()
    .single();
  res.json({ data, error });
};

export const deleteDish = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("dishes").delete().eq("id", id);
  res.json({ error });
};
