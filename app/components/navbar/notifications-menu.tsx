"use client";
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
const NotificationMenu = () => {
  const followNotifs = ["1", "2"];
  const listingNotifs = ["3", "4"];
  const reportNotifs = ["5", "6"];
  const [notificationsArray, setNotificationsArray] =
    useState<string[]>(followNotifs);
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
              setNotificationsArray(followNotifs);
              setCurrentCategory("follow");
            }}
            variant="ghost"
            disabled={currentCategory === "follow"}
          >
            Follow notifications
          </Button>
          <Button
            onClick={() => {
              setNotificationsArray(listingNotifs);
              setCurrentCategory("listing");
            }}
            variant="ghost"
            disabled={currentCategory === "listing"}
          >
            Listing notifications
          </Button>
          <Button
            onClick={() => {
              setNotificationsArray(reportNotifs);
              setCurrentCategory("report");
            }}
            variant="ghost"
            disabled={currentCategory === "report"}
          >
            Report notifications
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notificationsArray.map((item, index) => (
            <DropdownMenuItem key={index}>Notification {item}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
