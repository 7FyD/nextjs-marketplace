"use client";

import { AspectRatio } from "../ui/aspect-ratio";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="mx-auto w-[300px] md:w-[400px] 2xl:w-[350px] h-[450px]">
      <CardHeader>
        <div className="flex flex-row justify-between">
          <Skeleton className="h-8 w-64 rounded-full" />
        </div>
        {/* <CardDescription> */}
        <Skeleton className="h-6 w-48 rounded-full" />
        {/* </CardDescription> */}
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="size-full" />
        </AspectRatio>
      </CardContent>
      <CardFooter className="font-light flex flex-col items-start gap-6">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
