"use client";

import { ExtendedUser } from "@/types";
import { Button } from "../ui/button";
import { toggleFavoriteListing } from "@/app/actions/toggle-favorite";
import { BookmarkCheckIcon, BookmarkIcon, BookmarkX } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useTransition } from "react";

interface BookmarkProps {
  listingId: string;
  isAlreadyBookmarked: boolean;
  className?: string;
  variant?: "icon" | "button";
}

const Bookmark: React.FC<BookmarkProps> = ({
  listingId,
  className,
  isAlreadyBookmarked,
  variant = "icon",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isAlreadyBookmarked);
  const [isPending, startTransition] = useTransition();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    startTransition(() => {
      toggleFavoriteListing(listingId)
        .then((data) => {
          const operation = data.operation;
          if (data.error) {
            console.log(data.error);
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
                      <BookmarkCheckIcon
                        size={24}
                        className="text-green-500 mr-2"
                      />
                    ) : (
                      <BookmarkX size={24} className="text-red-500 mr-2" />
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
            setIsBookmarked(!isBookmarked);
          }
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  if (variant === "icon")
    return (
      <Button
        className={className}
        variant={"ghost"}
        onClick={(event) => handleClick(event)}
        disabled={isPending}
      >
        {!isBookmarked ? <BookmarkIcon /> : <BookmarkCheckIcon />}
      </Button>
    );
  if (variant === "button")
    return (
      <Button
        className={`w-[200px] ${className}`}
        size="lg"
        variant="outline"
        onClick={(event) => handleClick(event)}
        disabled={isPending}
      >
        {!isBookmarked ? (
          <>
            <BookmarkIcon className="w-4 h-4 mr-2 min-w-min" />
            Add bookmark
          </>
        ) : (
          <>
            <BookmarkX className="w-4 h-4 mr-2 min-w-min" /> Remove bookmark
          </>
        )}
      </Button>
    );
};

export default Bookmark;
