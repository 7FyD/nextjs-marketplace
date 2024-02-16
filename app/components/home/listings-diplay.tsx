"use client";

import { Listing } from "@prisma/client";
import Image from "next/image";
import ListingCard from "./listing-card";

interface ListingsDisplayProps {
  listings: Listing[];
}

const ListingsDisplay: React.FC<ListingsDisplayProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-4">
      {listings.map((listing: Listing) => (
        <div key={listing.id} className="flex flex-col gap-4 items-center">
          <ListingCard
            title={listing.title}
            country={listing.country}
            price={listing.price}
            specific={listing.condition}
            image={listing.imageUrl}
            id={listing.id}
          />
        </div>
      ))}
    </div>
  );
};

export default ListingsDisplay;
