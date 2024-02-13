"use client";

import { Listing } from "@prisma/client";
import Image from "next/image";

interface ListingsDisplayProps {
  listings: Listing[];
}

const ListingsDisplay: React.FC<ListingsDisplayProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-4">
      {listings.map((listing: Listing) => (
        <div className="flex flex-col gap-4 items-center">
          <p>ID: {listing.id}</p>
          <Image
            src={listing.imageUrl}
            width={250}
            height={250}
            alt="Listing"
          />
        </div>
      ))}
    </div>
  );
};

export default ListingsDisplay;
