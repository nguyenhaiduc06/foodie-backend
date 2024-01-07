import { Expo } from "expo-server-sdk";
import supabase from "../lib/supabase.js";

let expo = new Expo();

export const sendPushNotification = async (
  group_id,
  title,
  body,
  notificationData
) => {
  const { data, error } = await supabase
    .from("members")
    .select("accounts (push_token)")
    .eq("group_id", group_id);
  if (error) return;
  const push_tokens = data
    .map((e) => e.accounts.push_token)
    .filter((token) => !!token);
  const messages = push_tokens.map((token) => ({
    to: token,
    title,
    body,
    data: notificationData,
  }));
  const chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
};
