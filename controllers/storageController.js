import supabase from "../lib/supabase.js";
import { scheduleJob, rescheduleJob } from "node-schedule";
import { sendPushNotification } from "../services/notification.js";
import dayjs from "dayjs";

export const createStorage = async (req, res) => {
  const { group_id, name, amount, image_url, stored_in, expire_date } =
    req.body;
  const { data, error } = await supabase
    .from("storages")
    .insert({ group_id, name, amount, stored_in, expire_date, image_url })
    .select()
    .single();

  // Schedule a job to send notification
  const jobId = data.id.toString(); // jobId must be a string
  const scheduledDate = dayjs().add(5, "seconds").toDate();
  const push_token = "ExponentPushToken[vvSWZjKZRF0j8-KL35kPqP]";
  const title = "Thực phẩm sắp hết hạn";
  const body = `${name} trong ${stored_in} sẽ hết hạn trong 3 ngày tới`;
  scheduleJob(jobId, scheduledDate, () =>
    sendPushNotification(push_token, title, body)
  );

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
  const { name, amount, image_url, stored_in, expire_date } = req.body;
  const { data, error } = await supabase
    .from("storages")
    .update({ name, amount, stored_in, expire_date, image_url })
    .eq("id", id)
    .select()
    .single();

  // Reschedule send notification job
  const jobId = id.toString();
  const scheduledDate = dayjs(expire_date).add(5, "seconds");
  rescheduleJob(jobId, scheduledDate);

  res.json({ data, error });
};

export const deleteStorage = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("storages").delete().eq("id", id);
  res.json({ error });
};

const scheduleSendNotificationJob = () => {};
