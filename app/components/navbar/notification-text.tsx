"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { deleteOneNotification } from "@/app/actions/delete-notification";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
interface NotificationTextInterface {
  id: string;
  type: "FOLLOW" | "LISTING" | "REPORT";
  title: string;
  name: string;
  nameId: string;
  secondaryName?: string | null;
  secondaryId?: string | null;
}

const NotificationText: React.FC<NotificationTextInterface> = ({
  id,
  type,
  nameId,
  name,
  secondaryName,
  title,
  secondaryId,
}) => {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const handleClick = (event: any) => {
    event.preventDefault();
    startTransition(() => {
      deleteOneNotification(id).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
    setIsDeleted(true);
  };
  if (isDeleted === true) {
    return <div>Notification deleted.</div>;
  }
  if (type === "FOLLOW") {
    return (
      <div className="flex flex-row">
        {title}!
        <Link className="mx-1" href={`/user/profile/${nameId}`}>
          {name}
        </Link>
        <p>just followed you</p>
      </div>
    );
  }
  if (type === "REPORT") {
    return (
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row">
          {title}!
          <Link className="mx-1" href={`/user/profile/${nameId}`}>
            {name}
          </Link>
          <p>has been reported by</p>
          <Link className="mx-1" href={`/user/profile/${secondaryId}`}>
            {secondaryName}
          </Link>
        </div>
        <Button
          type="button"
          className="ml-auto text-red-500 hover:text-red-700"
          variant={"ghost"}
          onClick={handleClick}
        >
          Delete
        </Button>
      </div>
    );
  }
};

export default NotificationText;
