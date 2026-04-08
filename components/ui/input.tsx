import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full min-w-0 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d] px-3 py-2 text-sm text-[#fffffe] shadow-sm transition-colors",
          "placeholder:text-[#abd1c6]/45",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/35 focus-visible:border-[#f9bc60]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#fffffe]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
