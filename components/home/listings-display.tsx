import SearchOptions from "../listings/search-options";
import ListingsArray from "../listings/listings-array";
import PaginationMenu from "../home/pagination-menu";
import { ListingQueryProps, getListings } from "@/app/actions/get-listings";

interface ListingsPageInterface {
  params: ListingQueryProps;
  defaultHidden?: boolean;
  showSearch?: boolean;
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
  showSearch,
}) => {
  const { listings, totalListingsCount, listingsPerPage } =
    await getListingsFunction(params);
  return (
    <>
      {showSearch !== false && (
        <SearchOptions defaultHidden={defaultHidden} className="my-6 mx-2" />
      )}
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
