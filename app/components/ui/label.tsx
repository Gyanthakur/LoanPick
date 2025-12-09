// components/ui/label.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={cn("block text-sm font-medium text-gray-600", className ?? "")}
    >
      {children}
    </label>
  );
}

export default Label;
