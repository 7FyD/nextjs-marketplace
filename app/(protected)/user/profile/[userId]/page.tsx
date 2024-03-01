import { getListings } from "@/app/actions/get-listings";
import { getUserById } from "@/data/user";
import UserProfileClient from "./UserProfileClient";

interface IParams {
  userId?: string;
}

const UserProfilePage = async ({ params }: { params: IParams }) => {
  if (!params.userId || typeof params.userId !== "string")
    return <p>Invalid search.</p>;
  const user = await getUserById(params.userId);
  if (!user) return <p>Not found!</p>;
  const { listings, totalListingsCount, listingsPerPage } = await getListings({
    userId: user.id,
  });
  const safeUser = {
    id: user.id,
    name: user.name,
    image: user.image,
    email: user.email,
    role: user.role,
  };
  return (
    <UserProfileClient
      user={safeUser}
      userListings={listings}
      totalListingsCount={totalListingsCount}
      listingsPerPage={listingsPerPage}
    />
  );
};

export default UserProfilePage;
