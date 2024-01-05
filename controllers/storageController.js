import supabase from "../lib/supabase.js";

export const createStorage = async (req, res) => {
  const { group_id, name, amount, image_url, stored_at, expire_date } =
    req.body;
  const { data, error } = await supabase
    .from("storages")
    .insert({ group_id, name, amount, stored_at, expire_date, image_url })
    .select()
    .single();
  res.json({ data, error });
};

export const getStorages = async (req, res) => {
  const { group_id } = req.query;
  const { data, error } = await supabase
    .from("storages")
    .select("*")
    .eq("group_id", group_id);
  res.json({ data, error });
};

export const getStorageDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateStorage = async (req, res) => {
  const { id } = req.params;
  const { name, amount, image_url, stored_at, expire_date } = req.body;
  const { data, error } = await supabase
    .from("storages")
    .update({ name, amount, stored_at, expire_date, image_url })
    .eq("id", id)
    .select()
    .single();
  res.json({ data, error });
};

export const deleteStorage = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("storages").delete().eq("id", id);
  res.json({ error });
};
