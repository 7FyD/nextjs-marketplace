"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import SettingsNavigation from "./settings-navigation";
import { User } from "@prisma/client";
import SettingsGeneral from "./SettingsGeneral";
import SettingsSecurity from "./SettingsSecurity";
import SettingsDeleteAccount from "./SettingsDeleteAccount";

interface SettingsInterface {
  user: User | null;
}

const SettingsClient: React.FC<SettingsInterface> = ({ user }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const query = useSearchParams().get("type");

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
          {query === "delete account" && <SettingsDeleteAccount />}
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
