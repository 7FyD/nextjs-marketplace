"use client";

import { Listing } from "@prisma/client";
import ListingCard from "./listing-card";

interface ListingsDisplayProps {
  listings: Listing[];
}

const ListingsArray: React.FC<ListingsDisplayProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4 items-center">
      {listings.map((listing: Listing) => (
        <div key={listing.id}>
          <ListingCard
            title={listing.title}
            country={listing.country}
            price={listing.price}
            details={listing.details}
            optionalDetails={listing.optionalDetails}
            currency={listing.currency}
            image={listing.imageUrl}
            id={listing.id}
            userId={listing.userId}
          />
        </div>
      ))}
    </div>
  );
};

export default ListingsArray;
