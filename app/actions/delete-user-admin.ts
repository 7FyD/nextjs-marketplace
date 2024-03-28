"use server";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const deleteUser = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Invalid access" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Invalid access" };
  }
  if (id === user.id) {
    return { error: "You cannot ban yourself..." };
  }
  if (user.role !== "ADMIN") {
    return { error: "Invalid access" };
  }
  const targetUser = await getUserById(id);
  if (!targetUser) {
    return { error: "Invalid request" };
  }
  if (targetUser.role === "ADMIN") {
    return { error: "You cannot ban another admin" };
  }
  const deletedUser = await db.user.delete({
    where: {
      id,
    },
  });
  return { success: "User successfully deleted. Redirecting..." };
};
