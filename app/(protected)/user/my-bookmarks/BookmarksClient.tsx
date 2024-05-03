"use client";

import ListingsDisplay from "@/components/listings/listings-display";
import Container from "@/components/utilities/Container";
import { ExtendedUser } from "@/types";
import { Listing } from "@prisma/client";

interface BookmarksClientInterface {
  user: ExtendedUser | null;
  listings: Listing[];
  totalListingsCount: number;
  listingsPerPage: number;
}

const BookmarksClient: React.FC<BookmarksClientInterface> = ({
  user,
  listings,
  totalListingsCount,
  listingsPerPage,
}) => {
  return (
    <Container>
      {listings.length > 0 ? (
        <>
          <div className="mt-12">
            <h1 className="text-center text-3xl font-semibold">
              These are your bookmarks.
            </h1>
          </div>
          <ListingsDisplay
            listings={listings}
            totalListingsCount={totalListingsCount}
            listingsPerPage={listingsPerPage}
            defaultHidden={false}
          />
        </>
      ) : (
        <h1 className="mt-12  text-red-500 text-center font-semibold text-xl">
          You don't have any saved listings.
        </h1>
      )}
    </Container>
  );
};

export default BookmarksClient;
