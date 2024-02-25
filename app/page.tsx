import { getListings, ListingQueryProps } from "./actions/get-listings";
import NewListingModal from "./components/modals/new-listing";
import Container from "./components/utilities/Container";
import ListingsDisplay from "./components/listings/listings-display";

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
      <ListingsDisplay
        listings={listings}
        totalListingsCount={totalListingsCount}
        listingsPerPage={listingsPerPage}
      />
    </Container>
  );
};

export default HomePage;
