"use client";

import { useCurrentUser } from "@/app/hooks/use-current-user";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { followUser } from "@/app/actions/follow-user";
import toast from "react-hot-toast";
import Link from "next/link";

interface FollowListInterface {
  user: User;
}

const FollowList: React.FC<FollowListInterface> = ({ user }) => {
  const currentUser = useCurrentUser();
  const [isFollowPending, startFollowTransition] = useTransition();
  const [isFollowed, setIsFollowed] = useState<boolean>(
    currentUser ? currentUser.followings.includes(user.id) : false
  );
  const followAction = () => {
    startFollowTransition(() => {
      followUser(user.id)
        .then((data) => {
          const operation = data.operation;

          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
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
    <div className="flex flex-row items-center">
      <Image
        className="rounded-full max-w-[44px] max-h-[44px] w-[44px] h-[44px]"
        src={user.image}
        alt={`${user.name}'s image`}
        width={44}
        height={44}
      />
      <div className="flex flex-col gap-1 mt-0.5 ml-1">
        <Link href={`/user/profile/${user.id}`}>
          <p className="font-normal text-sm">{user.name}</p>
        </Link>
        <p className="font-light text-sm">{user.username}</p>
      </div>
      {user.id !== currentUser?.id && user.allowFollow && (
        <Button
          disabled={isFollowPending}
          type="button"
          onClick={followAction}
          className="ml-auto mr-4 w-[125px]"
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
    </div>
  );
};

export default FollowList;
