import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, textColor = "text-white", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        textColor,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };