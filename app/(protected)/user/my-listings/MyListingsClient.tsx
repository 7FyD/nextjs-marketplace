"use client";

import ListingsDisplay from "@/app/components/listings/listings-display";
import Container from "@/app/components/utilities/Container";
import { ExtendedUser } from "@/types";
import { Listing } from "@prisma/client";

interface MyListingsClientInterface {
  user: ExtendedUser | null;
  listings: Listing[];
  totalListingsCount: number;
  listingsPerPage: number;
}

const MyListingsClient: React.FC<MyListingsClientInterface> = ({
  user,
  listings,
  totalListingsCount,
  listingsPerPage,
}) => {
  return (
    <Container>
      <div className="mt-12">
        <h1 className="text-center text-3xl font-semibold">
          These are your listings.
        </h1>
      </div>
      <ListingsDisplay
        listings={listings}
        totalListingsCount={totalListingsCount}
        listingsPerPage={listingsPerPage}
      />
    </Container>
  );
};

export default MyListingsClient;
