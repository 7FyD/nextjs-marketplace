"use server";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const followUser = async (userId: string) => {
  try {
    if (!userId) {
      return { error: "Invalid request. " };
    }

    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized." };
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Invalid request." };
    }

    if (!targetUser.allowFollow) {
      return { error: "User does not accept followers." };
    }

    let updatedFollowers = targetUser.followers;

    let operation;

    if (updatedFollowers.includes(user.id)) {
      const index = updatedFollowers.indexOf(user.id);
      updatedFollowers.splice(index, 1);
      operation = "removed";
    } else {
      updatedFollowers.push(user.id);
      operation = "added";
    }

    await db.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        followers: updatedFollowers,
      },
    });

    let updatedFollowings = dbUser.followings;

    if (updatedFollowings.includes(targetUser.id)) {
      const index = updatedFollowings.indexOf(targetUser.id);
      updatedFollowings.splice(index, 1);
    } else {
      updatedFollowings.push(targetUser.id);
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        followings: updatedFollowings,
      },
    });

    if (operation === "added") {
      await db.notification.create({
        data: {
          userId: targetUser.id,
          type: "FOLLOW",
          title: "New follower",
          name: user.name ? user.name : "NULL",
          nameId: user.id,
        },
      });
    }

    return { success: `Follow ${operation}.`, operation: operation };
  } catch (error: any) {
    throw new Error(error);
  }
};
