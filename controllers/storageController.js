import supabase from "../lib/supabase";

export const createStorage = async (req, res) => {
  const { group_id, name, amount, image_url, stored_at, expire_date } =
    req.body;
  // Example:
  // const {data, error} = await supabase.from().insert();
  // res.json({data, error});
};

export const getStorages = async (req, res) => {
  const { group_id } = req.query;
  // Get Storages by group_id
  // If !group_id, return error = Group id must be provided
};

export const getStorageDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateStorage = async (req, res) => {
  const { id } = req.params;
  const { group_id, name, amount, image_url, stored_at, expire_date } =
    req.body;
};

export const deleteStorage = async (req, res) => {
  const { id } = req.params;
};
