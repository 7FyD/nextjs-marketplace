"use client";

import { Listing, User } from "@prisma/client";
import Image from "next/image";
import { startTransition, useState } from "react";

interface ListingClientProps {
  listing: Listing & {
    user: User;
  };
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  return (
    <div>
      <Image
        src={listing?.imageUrl}
        alt="Listing image"
        width={250}
        height={250}
      />
    </div>
  );
};

export default ListingClient;
