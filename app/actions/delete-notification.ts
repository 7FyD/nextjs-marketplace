"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { NotificationType } from "@prisma/client";

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

export const deleteAllNotifications = async (type: "USER" | "REPORT") => {
  const user = await currentUser();
  if (!user) {
    return { error: "Invalid request" };
  }

  const types: NotificationType[] =
    type === "USER" ? ["FOLLOW", "LISTING"] : ["REPORT"];
  const notifications = await db.notification.deleteMany({
    where: {
      type: {
        in: types,
      },
      userId: user.id,
    },
  });
  if (notifications.count === 0) {
    return { error: "Invalid request" };
  }
  return { success: "Notifications deleted" };
};
