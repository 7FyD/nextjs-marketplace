import { getListingById } from "@/app/actions/get-listing-by-id";
import ListingClient from "./ListingClient";
import { getUserById } from "@/data/user";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  if (!listing) return <p>Not found!</p>;
  const user = await getUserById(listing?.userId);
  if (!user) return <p>Not found!</p>;
  return <ListingClient listing={listing} user={user} />;
};

export default ListingPage;
