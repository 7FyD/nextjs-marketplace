import * as React from "react";

import { cn } from "@/lib/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  displayShowPassword?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, displayShowPassword = true, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const showPassword = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <div className="relative max-w-full">
        <input
          type={isPasswordVisible ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {displayShowPassword && type === "password" && (
          <button
            type="button"
            onClick={showPassword}
            className="h-100 aspect-square absolute right-3 top-2"
          >
            {!isPasswordVisible ? (
              <FaEye className="h-5 w-5" />
            ) : (
              <FaEyeSlash className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
