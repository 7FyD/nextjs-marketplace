import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/app/components/ui/checkbox";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const handleCheckboxChange = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const initial_type = type;

    return (
      <>
        <input
          type={isPasswordVisible ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <div className="flex space-x-2">
            <Checkbox
              id="terms1"
              onClick={handleCheckboxChange}
              className="mt-2"
            />
            <div className="grid gap-1.5 leading-none">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-2">
                Show password
              </label>
            </div>
          </div>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
