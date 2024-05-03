import { getListings, ListingQueryProps } from "./actions/get-listings";
import Container from "@/components/utilities/Container";
import ListingsDisplay from "@/components/listings/listings-display";
import CategorySelection from "@/components/home/category-selection";

interface HomeProps {
  searchParams: ListingQueryProps;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    searchParams
  );
  return (
    <Container>
      <CategorySelection />
      <ListingsDisplay
        listings={listings}
        totalListingsCount={totalListingsCount}
        listingsPerPage={listingsPerPage}
        defaultHidden={true}
      />
    </Container>
  );
};

export default HomePage;
