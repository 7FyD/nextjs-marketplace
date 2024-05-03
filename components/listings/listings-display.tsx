import SearchOptions from "./search-options";
import ListingsArray from "./listings-array";
import PaginationMenu from "../home/pagination-menu";
import { ListingQueryProps, getListings } from "@/app/actions/get-listings";

interface ListingsPageInterface {
  params: ListingQueryProps;
  defaultHidden: boolean;
}

const ListingsDisplay: React.FC<ListingsPageInterface> = async ({
  params,
  defaultHidden,
}) => {
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    params
  );
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
