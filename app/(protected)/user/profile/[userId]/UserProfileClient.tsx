"use client";

import { followUser } from "@/app/actions/follow-user";
import ListingsDisplay from "@/components/listings/listings-display";
import { Button } from "@/components/ui/button";
import Container from "@/components/utilities/Container";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Listing, User } from "@prisma/client";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import ReportModal from "@/components/user-profile/report-modal";
import FollowersDialog from "@/components/user-profile/followers-dialog";

import DeleteUser from "@/components/user-profile/delete-user-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface UserProfileClientInterface {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    allowFollow: boolean | null;
    role: "USER" | "ADMIN";
    followers: User[];
    followings: User[];
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
  const following = user.followings.length;
  const currentUser = useCurrentUser();
  const [isFollowed, setIsFollowed] = useState<boolean>(
    currentUser
      ? user.followers.some((follower) => follower.id === currentUser.id)
      : false
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
        } items-center mt-16 p-6 border-2 rounded-full bg-gray-200 dark:bg-gray-800`}
      >
        <Avatar className="size-[256px]">
          <AvatarImage
            src={user.image ? user.image : "/public/public.png"}
            alt={user?.name ? user.name : "User"}
            className="object-cover"
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-between items-center gap-2 mx-auto">
          <h1 className="font-semibold text-xl">{user.name}</h1>
          <p>Email: {user.email}</p>
          <FollowersDialog
            label="followers"
            message="All followers are public"
            followCount={followers}
            displayName={user.name}
            userList={user.followers}
          />
          <FollowersDialog
            label="following"
            message="All the people you follow are public"
            followCount={following}
            displayName={user.name}
            userList={user.followings}
          />
          <p>Role: {user.role}</p>
          {user.id !== currentUser?.id && (
            <div
              className={`flex ${
                isDesktop ? "flex-row" : "flex-col"
              } gap-4 mt-8`}
            >
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
              <ReportModal userId={user.id} name={user.name} />
              {user.role !== "ADMIN" && currentUser?.role === "ADMIN" && (
                <DeleteUser id={user.id} />
              )}
            </div>
          )}
        </div>
      </div>
      {userListings.length > 0 && (
        <>
          <h1 className="text-center font-semibold text-xl mt-6">
            User listings:{" "}
          </h1>
          <ListingsDisplay
            listings={userListings}
            totalListingsCount={totalListingsCount}
            listingsPerPage={listingsPerPage}
            defaultHidden={true}
          />
        </>
      )}
    </Container>
  );
};

export default UserProfileClient;
