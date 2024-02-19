import { getListings, ListingQueryProps } from "./actions/get-listings";
import ListingsDisplay from "./components/home/listings-diplay";
import SearchOptions from "./components/home/search-options";
import NewListingModal from "./components/modals/new-listing";
import Container from "./components/utilities/Container";

interface HomeProps {
  searchParams: ListingQueryProps;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const listingArray = await getListings(searchParams);
  return (
    <Container>
      <NewListingModal />
      <SearchOptions />
      {listingArray.length > 0 ? (
        <ListingsDisplay listings={listingArray} />
      ) : (
        "Nothing found."
      )}
    </Container>
  );
};

export default HomePage;
