"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const toggleFavoriteListing = async (listingId: string) => {
  try {
    if (!listingId || typeof listingId !== "string") {
      return { error: "Invalid request." };
    }
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized." };
    }
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      return { error: "Unauthorized." };
    }

    let updatedFavoriteIds = user.favoriteIds;

    let operation;

    if (updatedFavoriteIds.includes(listingId)) {
      const index = updatedFavoriteIds.indexOf(listingId);
      updatedFavoriteIds.splice(index, 1);
      operation = "removed";
    } else {
      updatedFavoriteIds.push(listingId);
      operation = "added";
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        favoriteIds: updatedFavoriteIds,
      },
    });
    return { success: `Bookmark ${operation}.`, operation: operation };
  } catch (error: any) {
    throw new Error(error);
  }
};
