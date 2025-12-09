"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning" | "info"
}

const alertVariants: Record<string, string> = {
  default: "bg-background text-foreground border border-border",
  destructive: "bg-destructive/10 text-destructive border border-destructive",
  success: "bg-green-100 text-green-900 border border-green-200",
  warning: "bg-yellow-100 text-yellow-900 border border-yellow-200",
  info: "bg-blue-100 text-blue-900 border border-blue-200",
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
          alertVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm [&_a]:underline [&_a]:hover:underline", className)}
      {...props}
    />
  )
})
AlertDescription.displayName = "AlertDescription"
