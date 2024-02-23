"use client";

import { ExtendedUser } from "@/types";
import { Button } from "../ui/button";
import { toggleFavoriteListing } from "@/app/actions/toggle-favorite";
import { BookmarkCheckIcon, BookmarkIcon, BookmarkX } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useTransition } from "react";

interface BookmarkProps {
  listingId: string;
  currentUser?: ExtendedUser;
}

const Bookmark: React.FC<BookmarkProps> = ({ listingId, currentUser }) => {
  const [isBookmarked, setIsBookmarked] = useState(
    currentUser?.favoriteIds?.includes(listingId)
  );
  const [isPending, startTransition] = useTransition();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    startTransition(() => {
      toggleFavoriteListing(listingId)
        .then((data) => {
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
                  <div className="flex items-center gap-12">
                    {!isBookmarked ? (
                      <BookmarkIcon size={24} className="text-green-500 mr-2" />
                    ) : (
                      <BookmarkX size={24} className="text-red-500 mr-2" />
                    )}
                    <div>
                      <div className="text-lg font-medium text-center">
                        Success!
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-center">
                        {data.success}
                      </div>
                    </div>
                  </div>
                </div>
              ),
              {
                duration: 2500,
              }
            );
            setIsBookmarked(!isBookmarked);
          }
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <Button
      variant={"ghost"}
      onClick={(event) => handleClick(event)}
      disabled={isPending}
    >
      {!isBookmarked ? <BookmarkIcon /> : <BookmarkCheckIcon />}
    </Button>
  );
};

export default Bookmark;
