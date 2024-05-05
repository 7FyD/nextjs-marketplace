import { ListingQueryProps } from "./actions/get-listings";
import Container from "@/components/utilities/Container";
import ListingsDisplay from "@/components/home/listings-display";
import CategorySelection from "@/components/home/category-selection";
import Loading from "@/components/listings/loading";
import { Suspense } from "react";
import SearchBar from "@/components/home/search-bar";
interface HomeProps {
  searchParams: ListingQueryProps;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  return (
    <Container className="mb-64">
      <SearchBar />
      <CategorySelection />
      <Suspense fallback={<Loading />}>
        <ListingsDisplay showSearch={false} params={searchParams} />
      </Suspense>
    </Container>
  );
};

export default HomePage;
