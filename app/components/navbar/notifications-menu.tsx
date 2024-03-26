"use client";
import { getNotifications } from "@/app/actions/get-notifications";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Notification } from "@prisma/client";
import Link from "next/link";

interface NotificationMenuInterface {
  followNotifications: Notification[];
  listingNotifications: Notification[];
  reportNotifications: Notification[];
}

const NotificationMenu: React.FC<NotificationMenuInterface> = ({
  followNotifications,
  listingNotifications,
  reportNotifications,
}) => {
  const [notificationsArray, setNotificationsArray] =
    useState<Notification[]>(followNotifications);

  const [currentCategory, setCurrentCategory] = useState<string>("follow");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Bell className="mt-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100">
        <DropdownMenuLabel className="flex flex-row justify-between">
          <Button
            onClick={() => {
              setNotificationsArray(followNotifications);
              setCurrentCategory("follow");
            }}
            variant="ghost"
            disabled={currentCategory === "follow"}
          >
            Follow notifications
          </Button>
          <Button
            onClick={() => {
              setNotificationsArray(listingNotifications);
              setCurrentCategory("listing");
            }}
            variant="ghost"
            disabled={currentCategory === "listing"}
          >
            Listing notifications
          </Button>
          <Button
            onClick={() => {
              setNotificationsArray(reportNotifications);
              setCurrentCategory("report");
            }}
            variant="ghost"
            disabled={currentCategory === "report"}
          >
            Report notifications
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="mb-8">
          {notificationsArray.length > 0 ? (
            notificationsArray.map((item, index) => (
              <DropdownMenuItem key={index}>
                {item.title}!
                <Link className="mx-1" href={`/user/profile/${item.nameId}`}>
                  {item.name}
                </Link>
                just followed you!
              </DropdownMenuItem>
            ))
          ) : (
            <h1 className="text-center font-semibold mt-4">Nothing found.</h1>
          )}
          {}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
