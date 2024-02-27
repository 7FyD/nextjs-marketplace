import { ListingQueryProps, getListings } from "@/app/actions/get-listings";
import { currentUser } from "@/lib/user";
import MyListingsClient from "./MyListingsClient";

interface HomeProps {
  searchParams: ListingQueryProps;
}

const MyListingsPage = async ({ searchParams }: HomeProps) => {
  const user = await currentUser();
  if (!user) return <div>Unauthorized.</div>;
  searchParams.userId = user.id;
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    searchParams
  );
  return (
    <MyListingsClient
      user={user}
      listings={listings}
      totalListingsCount={totalListingsCount}
      listingsPerPage={listingsPerPage}
    />
  );
};

export default MyListingsPage;
