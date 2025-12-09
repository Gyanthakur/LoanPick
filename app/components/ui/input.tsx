// components/ui/input.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "block w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-black placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500",
          className ?? ""
        )}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
