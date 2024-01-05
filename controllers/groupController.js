import supabase from "../lib/supabase.js";
import dayjs from "dayjs";

export const createGroup = async (req, res) => {
  const { name, image_url, manager_id, member_ids } = req.body;
  const { data: group, error } = await supabase
    .from("groups")
    .insert({ name, image_url })
    .select()
    .single();

  if (error) res.json({ error });

  const rows = member_ids.map((account_id) => ({
    account_id,
    group_id: group.id,
    is_admin: false,
  }));

  const { error: createMemberError } = await supabase.from("members").insert([
    {
      account_id: manager_id,
      group_id: group.id,
      is_admin: true,
    },
    ...rows,
  ]);
  res.json({ data: group, error: createMemberError });
};

export const getGroups = async (req, res) => {
  const { account_id } = req.query;
  const { data, error } = await supabase
    .from("members")
    .select("group:groups(*)")
    .eq("account_id", account_id);
  res.json({ data: data.map((e) => ({ ...e.group })), error });
};

export const getGroupDetails = async (req, res) => {
  const { id } = req.params;
};

export const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, image_url } = req.body;
  const { data, error } = await supabase
    .from("groups")
    .update({ name, image_url })
    .eq("id", id)
    .select()
    .single();
  res.json({ data, error });
};

export const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const { error: deleteMemberError } = await supabase
    .from("members")
    .delete()
    .eq("group_id", id);
  if (deleteMemberError) return res.json({ error: deleteMemberError });

  const { error } = await supabase.from("groups").delete().eq("id", id);
  res.json({ error });
};
