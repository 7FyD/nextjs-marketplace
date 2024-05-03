"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Followers from "@/components/user-profile/follow-list";
import { User } from "@prisma/client";

interface FollowersDialogInterface {
  label: "followers" | "following";
  message: string;
  followCount: number;
  displayName: string | null;
  userList: User[];
}

const FollowersDialog: React.FC<FollowersDialogInterface> = ({
  label,
  message,
  followCount,
  displayName,
  userList,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="hover:cursor-pointer">
          <span className="font-medium">{followCount}</span>
          {label === "followers"
            ? followCount != 1
              ? " followers"
              : " follower"
            : " following"}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {displayName}'s {label}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {userList.length > 0 ? (
            userList.map((user: User) => (
              <Followers key={user.id} user={user} />
            ))
          ) : (
            <h2 className="text-center font-semibold">Nothing found.</h2>
          )}
        </div>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
