"use server";

import * as z from "zod";
import { NewListingSchema } from "@/schemas/listing-schemas";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/user";
import { db } from "@/lib/db";

export const newListing = async (data: z.infer<typeof NewListingSchema>) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };
  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized." };

  const validatedFields = NewListingSchema.safeParse(data);
  if (!validatedFields.success) return { error: "Invalid fields." };

  const {
    title,
    description,
    price,
    imageUrl,
    category,
    country,
    phone,
    condition,
  } = data;

  // to do: check if the category requires a specific condition

  await db.listing.create({
    data: {
      title,
      description,
      price,
      imageUrl,
      category,
      country,
      phone,
      condition,
      userId: user.id,
    },
  });

  return { success: "Listing created." };
};
