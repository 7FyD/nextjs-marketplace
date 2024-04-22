"use client";

import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Listing } from "@prisma/client";
import Image from "next/image";
import { Bookmark, StarIcon, X } from "lucide-react";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { deleteListing } from "@/app/actions/delete-listing";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface ListingClientProps {
  listing: Listing;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [isDeletePending, startTransition] = useTransition();
  const handleDelete = (id: string) => {
    startTransition(() => {
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
  return (
    <div className="flex flex-col max-w-6xl px-4 mx-auto gap-6 lg:gap-12 py-6 mt-12">
      <div className="flex flex-row gap-4">
        <div className="flex flex-row justify-between min-w-[450px] max-w-[450px] ml-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl">{listing.title}</h1>
            <div className="flex flex-row items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div>
            <div>
              <p>{listing.details}</p>
              {listing.optionalDetails && (
                <p>Usage: {listing.optionalDetails}</p>
              )}
            </div>
          </div>
          <div className="text-4xl font-bold ml-auto">{listing.price}€</div>
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
              >
                <Bookmark className="w-4 h-4 mr-2 min-w-min" />
                Add to bookmarks
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
