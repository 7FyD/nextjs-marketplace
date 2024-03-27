import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUsersByIds = async (userIds: string[]) => {
  try {
    const users = await db.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return users;
  } catch {
    return [];
  }
};
