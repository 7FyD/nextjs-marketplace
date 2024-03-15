"use client";

import ListingsDisplay from "@/app/components/listings/listings-display";
import { Button } from "@/app/components/ui/button";
import Container from "@/app/components/utilities/Container";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Listing } from "@prisma/client";
import { Ban, MessageSquareWarning, UserPlus } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface UserProfileClientInterface {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    role: "USER" | "ADMIN";
  };
  userListings: Listing[];
  totalListingsCount: number;
  listingsPerPage: number;
}

const UserProfileClient: React.FC<UserProfileClientInterface> = ({
  user,
  userListings,
  totalListingsCount,
  listingsPerPage,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const currentUser = useCurrentUser();
  return (
    <Container>
      <div
        className={`flex ${
          isDesktop ? "flex-row gap-0" : "flex-col gap-10"
        } items-center mt-16 p-6 border-2 rounded-full bg-gray-200 `}
      >
        <Image
          className="rounded-full"
          src={user.image ? user.image : "/images/default.png"}
          width={256}
          height={256}
          alt={`${user.name} image`}
        />
        <div className="flex flex-col justify-between items-center gap-2 mx-auto">
          <h1 className="font-semibold text-xl">{user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Followers: 0</p>
          <p>Role: {user.role}</p>
          {user.id !== currentUser?.id && (
            <div className="flex flex-row gap-4 mt-8">
              <Button className="bg-blue-500 hover:bg-blue-700 mb-2">
                Follow <UserPlus className="ml-3" />
              </Button>
              <Button className="bg-red-500 hover:bg-red-700">
                Report <MessageSquareWarning className="ml-3" />
              </Button>
              {user.role !== "ADMIN" && currentUser?.role === "ADMIN" && (
                <Button className="bg-red-800 hover:bg-red-950">
                  Ban user <Ban className="ml-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <h1 className="text-center font-semibold text-xl mt-6">
        User listings:{" "}
      </h1>
      <ListingsDisplay
        listings={userListings}
        totalListingsCount={totalListingsCount}
        listingsPerPage={listingsPerPage}
        defaultHidden={true}
      />
    </Container>
  );
};

export default UserProfileClient;
