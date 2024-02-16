interface ListingCardProps {
  title: string;
  country: string;
  price: number;
  specific: string;
  image: string;
  id: string;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";

const ListingCard: React.FC<ListingCardProps> = ({
  title,
  country,
  price,
  specific,
  image,
  id,
}) => {
  return (
    <Link href={id}>
      <Card className="mx-auto w-[300px] md:w-[400px] 2xl:w-[350px] hover:scale-105 transition-all">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{country}</CardDescription>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9}>
            <Image src={image} alt={`${title} image.`} fill />
          </AspectRatio>
        </CardContent>
        <CardFooter className="font-light flex flex-col items-start gap-6">
          <p>
            {price.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: price % 1 !== 0 ? 2 : 0, // Adjust as needed
              maximumFractionDigits: 2,
            })}
          </p>
          <p>{specific}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ListingCard;
