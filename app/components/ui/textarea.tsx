// components/ui/textarea.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        rows={4}
        className={cn(
          "block w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500",
          className ?? ""
        )}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
