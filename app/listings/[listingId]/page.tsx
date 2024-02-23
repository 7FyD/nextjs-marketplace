import { getListingById } from "@/app/actions/get-listing-by-id";
import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  if (!listing) return <p>Not found!</p>;
  return <ListingClient listing={listing} />;
};

export default ListingPage;
