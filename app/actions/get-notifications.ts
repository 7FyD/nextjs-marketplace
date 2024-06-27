"use server";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        userNotifications: [],
        reportNotifications: [],
      };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return {
        userNotifications: [],
        reportNotifications: [],
      };
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
      },
    });

    const userNotifications = notifications.filter(
      (notification) =>
        notification.type === "FOLLOW" || notification.type == "LISTING"
    );
    const reportNotifications = notifications.filter(
      (notification) => notification.type === "REPORT"
    );

    return {
      userNotifications,
      reportNotifications,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
