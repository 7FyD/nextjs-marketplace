"use client";

import { Button } from "@/app/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import SettingsNavigation from "./settings-navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { User } from "@prisma/client";
import SettingsGeneral from "./SettingsGeneral";
import SettingsSecurity from "./SettingsSecurity";

interface SettingsInterface {
  user: User | null;
}

const SettingsClient: React.FC<SettingsInterface> = ({ user }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const query = useSearchParams().get("type");
  const [isDeleteFAHidden, setIsDeleteFAHidden] = useState<boolean>(true);
  const handleDeleteClick = () => {
    if (isDeleteFAHidden === true) {
      setIsDeleteFAHidden(false);
    } else {
    }
  };
  return (
    <div className="border bg-card text-card-foreground shadow-md w-3/4 md:w-1/2 mx-auto mt-24 rounded-sm mb-24">
      <div className={`flex ${isDesktop ? "flex-row" : "flex-col"}`}>
        <SettingsNavigation
          isDesktop={isDesktop}
          pathname={pathname}
          currentRoute={query}
        />
        <div className="flex flex-col mt-4 w-full">
          {query !== null &&
            query !== "security" &&
            query !== "general" &&
            query !== "delete account" && <div>Nothing found.</div>}
          {(query === null || query === "general") && (
            <SettingsGeneral user={user} />
          )}
          {query === "security" && <SettingsSecurity user={user} />}
          {query === "delete account" && (
            <>
              <h2 className="mt-4 text-center font-semibold">
                Permanently delete your account
              </h2>
              <div className="mt-6 mb-24">
                <p className="ml-12 mb-16">
                  This is a permanent action. Please note that it cannot be
                  undone, and contacting support afterwards is pointless.
                </p>
                <AlertDialog
                  onOpenChange={() => {
                    setIsDeleteFAHidden(true);
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="block mx-auto">
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div
                      className={`mx-4 ${
                        isDeleteFAHidden ? "hidden" : "block"
                      }`}
                    >
                      <p className="mb-2">
                        A confirmation code has been sent to your email.
                      </p>
                      <Label>2FA Code:</Label>
                      <Input type="text" placeholder="123456"></Input>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button onClick={handleDeleteClick} className="mt-2">
                        Continue
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
