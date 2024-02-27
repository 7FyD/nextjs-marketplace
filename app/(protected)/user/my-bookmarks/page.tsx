import { ListingQueryProps, getListings } from "@/app/actions/get-listings";
import { currentUser } from "@/lib/user";
import BookmarksClient from "./BookmarksClient";

interface HomeProps {
  searchParams: ListingQueryProps;
}

const BookmarksPage = async ({ searchParams }: HomeProps) => {
  const user = await currentUser();
  if (!user) return <div>Unauthorized</div>;
  searchParams.listingsId = user.favoriteIds;
  const { listings, totalListingsCount, listingsPerPage } = await getListings(
    searchParams
  );
  return (
    <BookmarksClient
      user={user}
      listings={listings}
      totalListingsCount={totalListingsCount}
      listingsPerPage={listingsPerPage}
    />
  );
};

export default BookmarksPage;
