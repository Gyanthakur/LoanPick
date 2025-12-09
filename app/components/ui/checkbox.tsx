// components/ui/checkbox.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        {...props}
        className={cn(
          "h-4 w-4 rounded border-gray-600 bg-transparent text-blue-500 focus:ring-blue-500",
          className ?? ""
        )}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
