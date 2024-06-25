"use client";

interface ListingCardProps {
  title: string;
  country: string;
  price: number;
  details: string;
  optionalDetails: string | null;
  currency: string;
  image: string;
  id: string;
  userId: string;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";

import { useCurrentUser } from "@/app/hooks/use-current-user";
import Bookmark from "../utilities/bookmark";

const ListingCard: React.FC<ListingCardProps> = ({
  title,
  country,
  price,
  details,
  optionalDetails,
  currency,
  image,
  id,
  userId,
}) => {
  const user = useCurrentUser();
  return (
    <Link href={`/listings/${id}`} className="inline-block">
      <Card className="mx-auto w-[300px] md:w-[400px] 2xl:w-[350px] hover:scale-105 transition-all h-[450px]">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <Bookmark
              listingId={id}
              isAlreadyBookmarked={
                user?.favoriteIds.includes(id) ? true : false
              }
            />
          </div>
          <CardDescription>
            Country: {country} - Currency: {currency}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9}>
            <Image
              className="object-cover"
              src={image}
              alt={`${title} image.`}
              fill
            />
          </AspectRatio>
        </CardContent>
        <CardFooter className="font-light flex flex-col items-start gap-6">
          <p>
            {price.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: price % 1 !== 0 ? 2 : 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>{details}</p>
          <p>{optionalDetails}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ListingCard;
