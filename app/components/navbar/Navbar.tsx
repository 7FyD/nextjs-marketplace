"use client";

import { useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";

const Navbar = () => {
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

  return (
    <div className="">
      <button
        className="text-3xl cursor-pointer inline-block"
        onClick={openNav}
      >
        &#9776;
      </button>
      {width && (
        <div
          id="sideBar"
          className="w-0 h-full fixed z-[1] top-0 left-0 bg-[#111] overflow-x-hidden transition-[width] duration-300 text-white"
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
