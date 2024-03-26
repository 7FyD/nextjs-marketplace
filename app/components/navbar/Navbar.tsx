"use client";

import { useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import { useRouter } from "next/navigation";
import Container from "../utilities/Container";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { logout } from "@/app/actions/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import NotificationMenu from "./notifications-menu";

const Navbar = () => {
  const user = useCurrentUser();
  const widthRef = useRef(769);
  const [width, setWidth] = useState(769);

  useEffect(() => {
    // Check if window is defined (to avoid server-side rendering issues)
    if (typeof window !== "undefined") {
      widthRef.current = window.innerWidth;
      setWidth(window.innerWidth);

      // Add event listener for window resize
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const openNav = () => {
    document.getElementById("sideBar")!.style.width = "320px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  };

  const closeNav = () => {
    document.getElementById("sideBar")!.style.width = "0";
    document.body.style.backgroundColor = "white";
  };
  const router = useRouter();
  const signOut = () => {
    logout();
  };
  return (
    <div className="">
      <div className="w-full bg-[#212529] z-[1] text-l pt-3 pb-3 border-b-[2px] border-black">
        <Container>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-12 md:gap-16">
              <button
                className="text-3xl cursor-pointer inline-block text-white"
                onClick={openNav}
              >
                &#9776;
              </button>

              <p
                className="text-3xl text-white cursor-pointer"
                onClick={() => router.push("/")}
              >
                F
              </p>
            </div>
            <div className="flex flex-row items-start gap-6 md:gap-12 lg:gap-18 text-white">
              {!user?.id ? (
                <>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className={`transition px-4 py-2 cursor-pointer rounded-md border-2 border-transparent hover:bg-[#495057] hover:border-[#495057]`}
                  >
                    Sign In
                  </button>
                  <button
                    className={`transition px-4 py-2 cursor-pointer rounded-md border-2 border-transparent hover:bg-[#495057] hover:border-[#495057]`}
                    onClick={() => router.push("/auth/register")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="flex flex-row gap-6 items-center">
                  <NotificationMenu />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="rounded-full hover:cursor-pointer"
                    >
                      <Image
                        className="rounded-full h-[48px] w-[48px] max-w-[48px] max-h-[48px] mt-3 object-cover"
                        src={user.image ? user.image : "/public/public.png"}
                        width={48}
                        height={48}
                        alt={`${user?.name}'s image`}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="flex flex-row items-center gap-4">
                        <Image
                          src={user.image ? user.image : ""}
                          alt="User image"
                          width={48}
                          height={48}
                        />
                        {user.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href={`/user/profile/${user.id}`}>
                          <DropdownMenuItem className="hover:cursor-pointer">
                            My profile
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/user/my-bookmarks">
                          <DropdownMenuItem className="hover:cursor-pointer">
                            My bookmarks
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/user/my-listings">
                          <DropdownMenuItem className="hover:cursor-pointer">
                            My listings
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <Link href="/user/settings">
                        <DropdownMenuItem className="hover:cursor-pointer">
                          User settings
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/auth/signout">
                        <DropdownMenuItem className="hover:cursor-pointer">
                          Sign out
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      {width && (
        <div
          id="sideBar"
          className="w-0 h-full fixed z-[2] top-0 left-0 bg-[#111] overflow-x-hidden transition-[width] duration-300 text-white"
        >
          <div className="p-8 pb-0 flex flex-row justify-between content-center">
            <p>
              logo
              <br />
              logo
            </p>
            <a
              className="cursor-pointer right-[25px] text-2xl w-[50px] h-[50px] text-center"
              onClick={closeNav}
            >
              &times;
            </a>
          </div>
          <div className="flex flex-col gap-8 p-12">
            <MenuItem href="https://www.7fyd.dev" label="Home" />
            <MenuItem href="https://www.7fyd.dev" label="Rest" />
            <MenuItem href="https://www.7fyd.dev" label="Of" />
            <MenuItem href="https://www.7fyd.dev" label="Things" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
