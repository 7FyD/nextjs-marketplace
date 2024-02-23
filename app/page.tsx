import { getListings, ListingQueryProps } from "./actions/get-listings";
import ListingsDisplay from "./components/home/listings-diplay";
import PaginationMenu from "./components/home/pagination-menu";
import SearchOptions from "./components/home/search-options";
import NewListingModal from "./components/modals/new-listing";
import Container from "./components/utilities/Container";

interface HomeProps {
  searchParams: ListingQueryProps;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    searchParams
  );
  return (
    <Container>
      <NewListingModal />
      <SearchOptions className="my-6 mx-2" />
      {listings.length > 0 ? (
        <ListingsDisplay listings={listings} />
      ) : (
        "Nothing found."
      )}
      <PaginationMenu
        totalPages={Math.ceil(totalListingsCount / listingsPerPage)}
        className="mt-12"
      />
    </Container>
  );
};

export default HomePage;
