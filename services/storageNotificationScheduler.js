import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import "dayjs/locale/vi.js";
dayjs.locale("vi");
import { scheduleJob, rescheduleJob, cancelJob } from "node-schedule";
import { sendPushNotification } from "../services/notification.js";
import supabase from "../lib/supabase.js";

dayjs.extend(relativeTime);

export const createJob = (storage) => {
  // const push_token = "ExponentPushToken[vvSWZjKZRF0j8-KL35kPqP]";
  // Schedule a job to send notification
  const { id, name, amount, stored_in, expire_date, group_id } = storage;
  const jobId = id.toString(); // jobId must be a string
  cancelJob(jobId);
  const { title, body, scheduledDate } = createData(storage);
  scheduleJob(jobId, scheduledDate, () => {
    supabase
      .from("notifications")
      .insert({
        group_id,
        storage_id: id,
        title,
        body,
      })
      .then(({ data, error }) => {
        console.log({ data, error });
      });
    sendPushNotification(group_id, title, body, { storage_id: id });
  });
};

const createData = (storage) => {
  const { id, name, amount, stored_in, expire_date } = storage;
  const threeDaysBeforeExpireDate = dayjs(expire_date).subtract(3, "days");
  const today = dayjs();
  const scheduledDate = threeDaysBeforeExpireDate.isBefore(today)
    ? dayjs().add(2, "seconds").toDate()
    : threeDaysBeforeExpireDate.set("hour", 9).toDate();

  if (dayjs(expire_date).isBefore(today)) {
    const title = "Thực phẩm đã hết hạn";
    const body = `${name} trong ${stored_in} đã hết hạn ${dayjs(
      expire_date
    ).fromNow()}`;
    return { title, body, scheduledDate };
  }

  const title = "Thực phẩm sắp hết hạn";
  const body = `${name} trong ${stored_in} sẽ hết hạn trong ${dayjs(
    expire_date
  ).fromNow()}`;
  return { title, body, scheduledDate };
};
