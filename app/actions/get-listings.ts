"use server";

import { db } from "@/lib/db";

export const getListings = async () => {
  const listingsArray = await db.listing.findMany({
    where: {},
  });
  return listingsArray;
};
