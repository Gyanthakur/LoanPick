// "use client"

// import * as React from "react"
// import * as SheetPrimitive from "@radix-ui/react-dialog"

// import { cn } from "@/lib/utils"

// const Sheet = SheetPrimitive.Root

// const SheetTrigger = SheetPrimitive.Trigger

// const SheetClose = SheetPrimitive.Close

// const SheetPortal = SheetPrimitive.Portal

// const SheetOverlay = React.forwardRef<
//   React.ElementRef<typeof SheetPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <SheetPrimitive.Overlay
//     ref={ref}
//     className={cn(
//       "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
//       className
//     )}
//     {...props}
//   />
// ))
// SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

// const SheetContent = React.forwardRef<
//   React.ElementRef<typeof SheetPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
//     side?: "left" | "right" | "top" | "bottom"
//   }
// >(({ side = "right", className, children, ...props }, ref) => (
//   <SheetPortal>
//     <SheetOverlay />
//     <SheetPrimitive.Content
//       ref={ref}
//       className={cn(
//         "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
//         "data-[state=open]:animate-in data-[state=closed]:animate-out",
//         "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
//         side === "right" &&
//           "top-0 right-0 h-full w-3/4 sm:w-1/3 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
//         side === "left" &&
//           "top-0 left-0 h-full w-3/4 sm:w-1/3 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
//         side === "top" &&
//           "top-0 left-0 w-full h-1/2 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
//         side === "bottom" &&
//           "bottom-0 left-0 w-full h-1/2 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </SheetPrimitive.Content>
//   </SheetPortal>
// ))
// SheetContent.displayName = SheetPrimitive.Content.displayName

// const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div className={cn("flex flex-col space-y-2 text-left", className)} {...props} />
// )

// const SheetTitle = React.forwardRef<
//   React.ElementRef<typeof SheetPrimitive.Title>,
//   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
// >(({ className, ...props }, ref) => (
//   <SheetPrimitive.Title
//     ref={ref}
//     className={cn("text-lg font-semibold tracking-tight", className)}
//     {...props}
//   />
// ))
// SheetTitle.displayName = SheetPrimitive.Title.displayName

// export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose }

"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "left" | "right" | "top" | "bottom"
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        side === "right" &&
          "top-0 right-0 h-full w-3/4 sm:w-1/3 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
        side === "left" &&
          "top-0 left-0 h-full w-3/4 sm:w-1/3 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
        side === "top" &&
          "top-0 left-0 w-full h-1/2 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
        side === "bottom" &&
          "bottom-0 left-0 w-full h-1/2 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-left", className)} {...props} />
)

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<"p">,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />
))
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose }
