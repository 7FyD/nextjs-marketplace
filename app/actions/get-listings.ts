"use server";

import { db } from "@/lib/db";

export interface ListingQueryProps {
  userId?: string;
  listingsId?: string[];
  category?: string;
  country?: string;
  free?: boolean;
  input?: string;
  page?: string;
}

export const getListings = async (params: ListingQueryProps) => {
  try {
    const { userId, listingsId, category, country, free, input, page } = params;
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (listingsId) {
      query.id = {
        in: listingsId,
      };
    }
    if (category) {
      const formattedCategory =
        category[0].toUpperCase() + category.toLowerCase().slice(1);
      query.category = {
        equals: formattedCategory,
      };
    }

    if (country) {
      query.country = {
        contains: country,
        mode: "insensitive",
      };
    }
    if (free) {
      query.price = {
        lte: 0,
      };
    }
    if (input) {
      const sanitizedInput = input.trim().replace(/\s+/g, " ");
      query.title = {
        contains: sanitizedInput,
        mode: "insensitive",
      };
    }
    const pageNumber = page ? parseInt(page) : 1;
    const listingsPerPage = 3;
    const listingsAlreadyDisplayed = (pageNumber - 1) * listingsPerPage;
    const listings = await db.listing.findMany({
      skip: listingsAlreadyDisplayed,
      take: listingsPerPage,
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalListingsCount = await db.listing.count({
      where: query,
    });

    return { listings, totalListingsCount, listingsPerPage };
  } catch (error: any) {
    throw new Error(error);
  }
};
