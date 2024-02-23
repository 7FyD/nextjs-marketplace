"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";

export const deleteListing = async (listingId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized." };
    }

    if (!listingId || typeof listingId !== "string") {
      return { error: "Invalid listing." };
    }

    const listing = await db.listing.findUnique({
      where: {
        id: listingId,
        userId: user.id,
      },
    });

    if (!listing) return { error: "Unauthorized." };

    await db.listing.delete({
      where: {
        id: listing.id,
        userId: user.id,
      },
    });
    return { success: "Listing deleted.", listing: listing };
  } catch (error: any) {
    throw new Error(error);
  }
};
