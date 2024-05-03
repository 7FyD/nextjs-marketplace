"use client";
import { getNotifications } from "@/app/actions/get-notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Notification } from "@prisma/client";
import NotificationText from "./notification-text";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { deleteAllNotifications } from "@/app/actions/delete-notification";
import toast from "react-hot-toast";

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
  const currentUser = useCurrentUser();
  const [notificationsArray, setNotificationsArray] =
    useState<Notification[]>(followNotifications);

  const [currentCategory, setCurrentCategory] = useState<
    "FOLLOW" | "REPORT" | "LISTING"
  >("FOLLOW");

  const handleDeleteAll = () => {
    deleteAllNotifications(currentCategory).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setNotificationsArray([]);
        switch (currentCategory) {
          case "FOLLOW":
            followNotifications = [];
            break;
          case "REPORT":
            reportNotifications = [];
            break;
          case "LISTING":
            listingNotifications = [];
            break;
        }
      }
    });
  };

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
              setCurrentCategory("FOLLOW");
            }}
            variant="ghost"
            disabled={currentCategory === "FOLLOW"}
          >
            Follow notifications
          </Button>
          <Button
            onClick={() => {
              setNotificationsArray(listingNotifications);
              setCurrentCategory("LISTING");
            }}
            variant="ghost"
            disabled={currentCategory === "LISTING"}
          >
            Listing notifications
          </Button>
          {currentUser?.role === "ADMIN" && (
            <Button
              onClick={() => {
                setNotificationsArray(reportNotifications);
                setCurrentCategory("REPORT");
              }}
              variant="ghost"
              disabled={currentCategory === "REPORT"}
            >
              Report notifications
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col mb-8">
          {notificationsArray.length > 0 ? (
            <>
              {notificationsArray.reverse().map((item, index) => (
                <DropdownMenuItem key={index}>
                  {1 && (
                    <NotificationText
                      id={item.id}
                      type={currentCategory}
                      title={item.title}
                      name={item.name}
                      nameId={item.nameId}
                      secondaryName={item.reporterName}
                      secondaryId={item.reporterId}
                    />
                  )}
                </DropdownMenuItem>
              ))}
              <Button
                onClick={handleDeleteAll}
                type="button"
                variant={"ghost"}
                className="text-red-500 hover:text-red-700 w-min mx-auto mt-2"
              >
                Delete all {currentCategory.toLowerCase()} notifications
              </Button>
            </>
          ) : (
            <h1 className="text-center font-semibold mt-4">Nothing found.</h1>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
