"use client";

import { deleteListing } from "@/app/actions/delete-listing";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { Listing, User } from "@prisma/client";
import Image from "next/image";
import { startTransition, useState } from "react";

interface ListingClientProps {
  listing: Listing & {
    user: User;
  };
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const onSubmit = (listingId: string) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      deleteListing(listingId)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <div>
      <Image
        src={listing?.imageUrl}
        alt="Listing image"
        width={250}
        height={250}
      />
      <Button onClick={() => onSubmit(listing.id)} variant={"destructive"}>
        Delete listing
      </Button>
      <FormError message={error} />
      <FormSuccess message={success} />
    </div>
  );
};

export default ListingClient;
