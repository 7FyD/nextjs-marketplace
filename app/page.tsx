import { getListings } from "./actions/get-listings";
import ListingsDisplay from "./components/home/listings-diplay";
import NewListingModal from "./components/modals/new-listing";
import Container from "./components/utilities/Container";

const HomePage = async () => {
  const listingArray = await getListings();
  return (
    <Container>
      <NewListingModal />
      <ListingsDisplay listings={listingArray} />
    </Container>
  );
};

export default HomePage;
