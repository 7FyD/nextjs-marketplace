"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const deleteOneNotification = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Invalid request" };
  }
  const notification = await db.notification.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });
  if (notification.count === 0) {
    return { error: "Invalid request" };
  }
  return { success: "Notification deleted" };
};

export const deleteAllNotifications = async (
  type: "REPORT" | "LISTING" | "FOLLOW"
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Invalid request" };
  }
  const notifications = await db.notification.deleteMany({
    where: {
      type,
      userId: user.id,
    },
  });
  if (notifications.count === 0) {
    return { error: "Invalid request" };
  }
  return { success: "Notifications deleted" };
};
