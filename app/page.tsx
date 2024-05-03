import { ListingQueryProps } from "./actions/get-listings";
import Container from "@/components/utilities/Container";
import ListingsDisplay from "@/components/home/listings-display";
import CategorySelection from "@/components/home/category-selection";
import Loading from "@/components/listings/loading";
import { Suspense } from "react";
interface HomeProps {
  searchParams: ListingQueryProps;
}

const HomePage = async ({ searchParams }: HomeProps) => {
  return (
    <Container>
      <CategorySelection />
      <Suspense fallback={<Loading />}>
        <ListingsDisplay params={searchParams} defaultHidden={true} />
      </Suspense>
    </Container>
  );
};

export default HomePage;
