import { Expo } from "expo-server-sdk";

let expo = new Expo();

export const sendPushNotification = async (push_token, title, body, data) => {
  const messages = [
    {
      to: push_token,
      title,
      body,
      data,
    },
  ];
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
