"use server";

import * as z from "zod";
import { NewListingSchema } from "@/schemas/listing-schemas";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/user";
import { db } from "@/lib/db";

export const createNewListing = async (
  data: z.infer<typeof NewListingSchema>
) => {
  const user = await currentUser();
  if (!user || !user.id) return { error: "Unauthorized." };
  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized." };

  const validatedFields = NewListingSchema.safeParse(data);
  if (!validatedFields.success) return { error: "Missing or invalid fields. " };

  const {
    title,
    description,
    price,
    imageUrl,
    category,
    country,
    details,
    optionalDetails,
    currency,
  } = data;

  if (category === "Hardware" && !optionalDetails) {
    return { error: "Missing or invalid fields. " };
  }
  const sanitizedTitle = title.trim().replace(/\s+/g, " ");
  const newListing = await db.listing.create({
    data: {
      title: sanitizedTitle,
      description,
      price,
      imageUrl,
      category,
      details,
      optionalDetails,
      currency,
      country,
      userId: user.id,
    },
  });
  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      activeListings: dbUser.activeListings + 1,
    },
  });
  return { success: "Listing created.", id: newListing.id };
};
