"use client";

import { Listing } from "@prisma/client";
import SearchOptions from "../home/search-options";
import ListingsArray from "./listings-array";
import PaginationMenu from "../home/pagination-menu";

interface ListingsPageInterface {
  listings: Listing[];
  totalListingsCount: number;
  listingsPerPage: number;
}

const ListingsDisplay: React.FC<ListingsPageInterface> = ({
  listings,
  totalListingsCount,
  listingsPerPage,
}) => {
  return (
    <div>
      <SearchOptions className="my-6 mx-2" />
      {listings.length > 0 ? (
        <ListingsArray listings={listings} />
      ) : (
        "Nothing found."
      )}
      <PaginationMenu
        totalPages={Math.ceil(totalListingsCount / listingsPerPage)}
        className="mt-12"
      />
    </div>
  );
};

export default ListingsDisplay;
