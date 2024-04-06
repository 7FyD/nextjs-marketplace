import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Listing } from "@prisma/client";
import Image from "next/image";
import { Bookmark, StarIcon } from "lucide-react";

interface ListingClientProps {
  listing: Listing;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
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
              <p>Servers: any</p>
              <p>Ranks: unranked - Challenger 1000LP</p>
            </div>
          </div>
          <div className="text-4xl font-bold ml-auto">{listing.price}€</div>
          <Separator className="mx-4" orientation="vertical" />
        </div>

        <div className="flex flex-col justify-between w-[900px]">
          <div className="grid gap-4 text-sm leading-loose">
            <p className="max-w-[620px]">
              Selling Challenger, Grandmaster, Master accounts from all servers!
              EUW, EUNE, NA, LAN, anything you might want! Korea accounts are
              LEVEL 30 UNRANKED Master accounts from all servers! EUW, EUNE, NA,
              LAN, anything you might want! Korea accounts are LEVEL 30
              UNRANKED.
            </p>
          </div>
          <Button className="max-w-[200px] mx-auto" size="lg" variant="outline">
            <Bookmark className="w-4 h-4 mr-2 min-w-min" />
            Add to bookmarks
          </Button>
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
