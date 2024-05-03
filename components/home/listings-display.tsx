import SearchOptions from "../listings/search-options";
import ListingsArray from "../listings/listings-array";
import PaginationMenu from "../home/pagination-menu";
import { ListingQueryProps, getListings } from "@/app/actions/get-listings";
import { Listing } from "@prisma/client";

interface ListingsPageInterface {
  listings?: Listing[];
  totalListingsCount?: number;
  listingsPerPage?: number;
  params: ListingQueryProps;
  defaultHidden: boolean;
}

const getListingsFunction = async (params: ListingQueryProps) => {
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    params
  );

  return { listings, totalListingsCount, listingsPerPage };
};

const ListingsDisplay: React.FC<ListingsPageInterface> = async ({
  params,
  defaultHidden,
}) => {
  const { listings, totalListingsCount, listingsPerPage } =
    await getListingsFunction(params);
  return (
    <>
      <SearchOptions defaultHidden={defaultHidden} className="my-6 mx-2" />
      {listings.length > 0 ? (
        <ListingsArray listings={listings} />
      ) : (
        "Nothing found."
      )}
      <PaginationMenu
        totalPages={Math.ceil(totalListingsCount / listingsPerPage)}
        className="mt-12"
      />
    </>
  );
};

export default ListingsDisplay;
