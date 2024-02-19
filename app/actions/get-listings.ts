"use server";

import { db } from "@/lib/db";

export interface ListingQueryProps {
  userId?: string;
  category?: string;
  country?: string;
  page?: string;
  perPage?: string;
  free?: boolean;
}

export const getListings = async (params: ListingQueryProps) => {
  try {
    const { userId, category, country, page, perPage, free } = params;
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (category) {
      query.category = {
        // Use 'contains' for case-insensitive search
        contains: category,
        mode: "insensitive",
      };
    }

    if (country) {
      query.country = category;
    }
    if (free) {
      query.price = {
        lte: 0,
      };
    }
    const pageNumber = page ? parseInt(page) : 1;
    const take = perPage ? parseInt(perPage) : 20;
    const skip = (pageNumber - 1) * take;
    const listings = await db.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      take: take,
      skip: skip,
    });

    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
};
