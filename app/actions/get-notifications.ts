"use server";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        followNotifications: [],
        listingNotifications: [],
        reportNotifications: [],
      };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return {
        followNotifications: [],
        listingNotifications: [],
        reportNotifications: [],
      };
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
      },
    });

    const followNotifications = notifications.filter(
      (notification) => notification.type === "FOLLOW"
    );
    const listingNotifications = notifications.filter(
      (notification) => notification.type === "LISTING"
    );
    const reportNotifications = notifications.filter(
      (notification) => notification.type === "REPORT"
    );

    return {
      followNotifications,
      listingNotifications,
      reportNotifications,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
