"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ToggleTheme: React.FC<{ ml?: boolean }> = ({ ml = false }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={`hover:bg-transparent hover:text-white border-0 ${
        ml && "ml-auto"
      }`}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="size-[2.1em] md:size-[1.8em] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[2.1em] md:size-[1.8em] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ToggleTheme;
