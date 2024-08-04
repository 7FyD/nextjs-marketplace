"use client";
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
import { Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationText from "./notification-text";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { deleteAllNotifications } from "@/app/actions/delete-notification";
import toast from "react-hot-toast";
import { Notification } from "@prisma/client";
import { getNotifications } from "@/app/actions/get-notifications";
import Bubble from "./notifications-bubble";

const NotificationMenu: React.FC = () => {
  const currentUser = useCurrentUser();
  if (!currentUser?.id)
    return (
      <p className="text-red-500">Small error occured, please refresh page.</p>
    );
  const [notifications, setNotifications] = useState<{
    userNotifications: Notification[];
    reportNotifications: Notification[];
  }>({
    userNotifications: [],
    reportNotifications: [],
  });

  const [notificationsArray, setNotificationsArray] = useState<Notification[]>(
    []
  );
  const [currentCategory, setCurrentCategory] = useState<"USER" | "REPORT">(
    "USER"
  );

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await getNotifications();
      try {
        setNotifications(fetchedNotifications);

        switch (currentCategory) {
          case "USER":
            setNotificationsArray(fetchedNotifications.userNotifications);
            break;
          case "REPORT":
            setNotificationsArray(fetchedNotifications.reportNotifications);
            break;
          default:
            setNotificationsArray([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [currentCategory]);

  const handleDeleteAll = () => {
    deleteAllNotifications(currentCategory).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setNotificationsArray([]);
        setNotifications((prevNotifications) => ({
          ...prevNotifications,
          [`${currentCategory.toLowerCase()}Notifications`]: [],
        }));
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {notifications.userNotifications.length > 0 ||
        notifications.reportNotifications.length > 0 ? (
          <BellRing className="mt-2" />
        ) : (
          <Bell className="mt-2" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100">
        <DropdownMenuLabel className="flex flex-row justify-center">
          <div>
            <Button
              onClick={() => {
                setNotificationsArray(notifications.userNotifications);
                setCurrentCategory("USER");
              }}
              className="pr-2"
              variant="ghost"
              disabled={currentCategory === "USER"}
            >
              User notifications
            </Button>
            <Bubble count={notifications.userNotifications.length} />
          </div>
          {currentUser?.role === "ADMIN" && (
            <div>
              <Button
                onClick={() => {
                  setNotificationsArray(notifications.reportNotifications);
                  setCurrentCategory("REPORT");
                }}
                variant="ghost"
                disabled={currentCategory === "REPORT"}
              >
                Report notifications
              </Button>
              <Bubble count={notifications.reportNotifications.length} />
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col mb-8">
          {notificationsArray.length > 0 ? (
            <>
              {notificationsArray.reverse().map((item, index) => (
                <DropdownMenuItem key={index}>
                  <NotificationText
                    id={item.id}
                    type={item.type}
                    title={item.title}
                    name={item.name}
                    nameId={item.nameId}
                    secondaryName={item.reporterName}
                    secondaryId={item.reporterId}
                  />
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
