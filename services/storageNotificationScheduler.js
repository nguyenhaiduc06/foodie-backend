import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import "dayjs/locale/vi.js";
dayjs.locale("vi");
import { scheduleJob, rescheduleJob, cancelJob } from "node-schedule";
import { sendPushNotification } from "../services/notification.js";

dayjs.extend(relativeTime);

export const createJob = (storage) => {
  const push_token = "ExponentPushToken[vvSWZjKZRF0j8-KL35kPqP]";
  // Schedule a job to send notification
  const { id, name, amount, stored_in, expire_date } = storage;
  const jobId = id.toString(); // jobId must be a string
  cancelJob(jobId);
  const { title, body, scheduledDate } = createData(storage);
  scheduleJob(jobId, scheduledDate, () =>
    sendPushNotification(push_token, title, body)
  );
};

const createData = (storage) => {
  const { id, name, amount, stored_in, expire_date } = storage;
  const threeDaysBeforeExpireDate = dayjs(expire_date).subtract(3, "days");
  const today = dayjs();
  if (threeDaysBeforeExpireDate.isBefore(today)) {
    const title = "Thực phẩm đã hết hạn";
    const body = `${name} trong ${stored_in} đã hết hạn ${dayjs(
      expire_date
    ).fromNow()}`;
    const scheduledDate = dayjs().add(2, "seconds").toDate();
    return { title, body, scheduledDate };
  }

  const title = "Thực phẩm sắp hết hạn";
  const body = `${name} trong ${stored_in} sẽ hết hạn trong ${dayjs(
    expire_date
  ).fromNow()}`;
  const scheduledDate = threeDaysBeforeExpireDate.set("hour", 9).toDate();
  return { title, body, scheduledDate };
};