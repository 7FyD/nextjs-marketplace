"use client";

import { followUser } from "@/app/actions/follow-user";
import ListingsDisplay from "@/app/components/listings/listings-display";
import { Button } from "@/app/components/ui/button";
import Container from "@/app/components/utilities/Container";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Listing } from "@prisma/client";
import {
  Ban,
  MessageSquareWarning,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";

interface UserProfileClientInterface {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    allowFollow: boolean | null;
    role: "USER" | "ADMIN";
    followers: string[];
    followings: string[];
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
  const [isFollowPending, startFollowTransition] = useTransition();
  const [followers, setFollowers] = useState<number>(user.followers.length);
  const currentUser = useCurrentUser();
  const [isFollowed, setIsFollowed] = useState<boolean>(
    currentUser ? user.followers.includes(currentUser.id) : false
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const followAction = () => {
    startFollowTransition(() => {
      followUser(user.id)
        .then((data) => {
          const operation = data.operation;

          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            if (operation === "added") setFollowers(followers + 1);
            else setFollowers(followers - 1);
            toast.custom(
              (t) => (
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-4 shadow-lg w-80 ${
                    t.visible ? "animate-enter" : "animate-leave"
                  }`}
                >
                  <div className="flex items-center gap-10">
                    {operation === "added" ? (
                      <UserPlusIcon size={24} className="text-green-500 mr-2" />
                    ) : (
                      <UserMinusIcon size={24} className="text-red-500 mr-2" />
                    )}
                    <div className="w-40">
                      <p className="text-lg font-medium text-center">
                        Success!
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        {data.success}
                      </p>
                    </div>
                  </div>
                </div>
              ),
              {
                duration: 2500,
              }
            );
            setIsFollowed(!isFollowed);
          }
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <p className="hover:cursor-pointer">
                <span className="font-medium">{followers}</span>{" "}
                {followers != 1 ? "followers" : "follower"}
              </p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{user.name}'s followers</DialogTitle>
                <DialogDescription>All followers are public</DialogDescription>
              </DialogHeader>
              {user.followers}
              <DialogFooter>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p>Role: {user.role}</p>
          {user.id !== currentUser?.id && (
            <div className="flex flex-row gap-4 mt-8">
              {user.allowFollow && (
                <Button
                  disabled={isFollowPending}
                  type="button"
                  onClick={followAction}
                  className={`w-[150px] mb-2 ${
                    !isFollowed &&
                    "bg-white border-[1px] text-black border-black hover:bg-slate-100"
                  }`}
                >
                  {isFollowed ? (
                    <>
                      Unfollow <UserMinusIcon className="ml-3" />
                    </>
                  ) : (
                    <>
                      Follow <UserPlusIcon className="ml-3" />
                    </>
                  )}
                </Button>
              )}
              <Button
                type="button"
                className="w-[150px] bg-red-500 hover:bg-red-700"
              >
                Report <MessageSquareWarning className="ml-3" />
              </Button>
              {user.role !== "ADMIN" && currentUser?.role === "ADMIN" && (
                <Button
                  type="button"
                  className="w-[150px] bg-red-800 hover:bg-red-950"
                >
                  Delete user <Ban className="ml-3" />
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
