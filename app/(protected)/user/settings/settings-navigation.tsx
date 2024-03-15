"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface SettingsNavigationInterface {
  isDesktop: boolean;
  pathname: string;
  currentRoute: string | null;
}

const SettingsNavigation: React.FC<SettingsNavigationInterface> = ({
  isDesktop,
  pathname,
  currentRoute,
}) => {
  const link = (path: string, className?: string) => {
    if (path === currentRoute)
      return (
        <p
          className={cn(
            `block w-max ml-3 mt-4 
                font-medium underline hover:cursor-default
            }`,
            className
          )}
        >
          {path[0].toUpperCase() + path.substring(1)}
        </p>
      );
    return (
      <Link
        className={cn(
          `block w-max ml-3 mt-4 font-normal hover:underline
          }`,
          className
        )}
        href={`${pathname}?type=${path}`}
      >
        {path[0].toUpperCase() + path.substring(1)}
      </Link>
    );
  };
  return (
    <div
      className={` ${
        isDesktop
          ? "flex-col w-1/4 border-r"
          : "w-full border-b justify-between"
      } flex gap-4 p-2`}
    >
      {link("general")}
      {link("security", "mt-1")}
      {link("test", "mt-1")}
    </div>
  );
};

export default SettingsNavigation;
