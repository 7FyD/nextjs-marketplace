"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Listing } from "@prisma/client";
import Image from "next/image";
import {
  Bookmark,
  BookmarkCheckIcon,
  BookmarkX,
  StarIcon,
  X,
} from "lucide-react";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { deleteListing } from "@/app/actions/delete-listing";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { toggleFavoriteListing } from "@/app/actions/toggle-favorite";

interface ListingClientProps {
  listing: Listing;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const getCurrencySymbolByCode = (code: string) => {
    switch (code) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CHF":
        return "₣";
      case "RON":
        return "L";
      default:
        return "$";
    }
  };
  const currency = getCurrencySymbolByCode(listing.currency);

  const handleDelete = (id: string) => {
    startDeleteTransition(() => {
      deleteListing(id).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/");
          router.refresh();
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    });
  };

  const [isBookmarked, setIsBookmarked] = useState(
    currentUser?.favoriteIds?.includes(listing.id)
  );
  const [isBookmarkPending, startBookmarkTransition] = useTransition();
  const handleBookmark = (id: string) => {
    startBookmarkTransition(() => {
      toggleFavoriteListing(id)
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
  return (
    <div className="flex flex-col max-w-6xl px-4 mx-auto gap-6 lg:gap-12 py-6 mt-12">
      <div className="flex flex-row gap-4">
        <div className="flex flex-row justify-between min-w-[450px] max-w-[450px] ml-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl">{listing.title}</h1>

            <p className="text-2xl font-bold mt-1 max-w-[300px]">
              {currency === "$"
                ? `${currency}${listing.price}`
                : `${listing.price}${currency}`}
            </p>

            {/* <div className="flex flex-row items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div> */}
            <div>
              <p>{listing.details}</p>
              {listing.optionalDetails && (
                <p>Usage: {listing.optionalDetails}</p>
              )}
            </div>
          </div>
          <Separator className="mx-4" orientation="vertical" />
        </div>

        <div className="flex flex-col justify-between w-[900px]">
          <div className="grid gap-4 text-sm leading-loose">
            <p className="max-w-[620px]">{listing.description}</p>
          </div>

          <div className="flex flex-row">
            {listing.userId === currentUser?.id ? (
              <Button
                className="max-w-[200px] mx-auto hover:bg-red-700"
                size="lg"
                variant="destructive"
                onClick={() => {
                  handleDelete(listing.id);
                }}
                disabled={isDeletePending}
              >
                <X className="w-4 h-4 mr-2 min-w-min" />
                Delete listing
              </Button>
            ) : (
              <Button
                className="max-w-[200px] mx-auto"
                size="lg"
                variant="outline"
                onClick={() => {
                  handleBookmark(listing.id);
                }}
                disabled={isBookmarkPending}
              >
                {!isBookmarked ? (
                  <>
                    <Bookmark className="w-4 h-4 mr-2 min-w-min" />
                    Add bookmark
                  </>
                ) : (
                  <>
                    <BookmarkX className="w-4 h-4 mr-2 min-w-min" /> Remove
                    bookmark
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* mobile version */}
      {/* <div className="grid gap-3 items-start">
        <div className="flex md:hidden items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-2xl sm:text-3xl">{listing.title}</h1>
            <div>
              <p>60% combed ringspun cotton/40% polyester jersey tee.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold ml-auto">{listing.price}€</div>
        </div>
      </div> */}
      <Image
        alt={`${listing.title} image`}
        className="object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
        height={400}
        src={listing.imageUrl}
        width={900}
      />
    </div>
  );
};

export default ListingClient;
