"use client";

import ListingsArray from "@/app/components/listings/listings-array";
import Container from "@/app/components/utilities/Container";
import { Listing } from "@prisma/client";
import Image from "next/image";

interface UserProfileClientInterface {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
  };
  userListings: Listing[];
}

const UserProfileClient: React.FC<UserProfileClientInterface> = ({
  user,
  userListings,
}) => {
  return (
    <Container>
      <div className="flex flex-col justify-center items-center gap-4 mt-16">
        <Image
          src={user.image ? user.image : "/images/default.png"}
          width={256}
          height={256}
          alt="User image"
        />
        <h2>{user.name}</h2>
      </div>
      <p>User listings: </p>
      {userListings.length > 0 ? (
        <ListingsArray listings={userListings} />
      ) : (
        "Nothing found."
      )}
    </Container>
  );
};

export default UserProfileClient;
