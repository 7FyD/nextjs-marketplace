import { getListings } from "./actions/get-listings";
import ListingsDisplay from "./components/home/listings-diplay";
import NewListingModal from "./components/modals/new-listing";

const HomePage = async () => {
  const listingArray = await getListings();
  return (
    <div>
      <NewListingModal />
      <ListingsDisplay listings={listingArray} />
    </div>
  );
};

export default HomePage;
