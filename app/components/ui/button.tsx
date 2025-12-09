// // components/ui/button.tsx
// "use client";

// import React from "react";
// import { cn } from "@/lib/utils";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
// }

// export function Button({ children, className, ...props }: ButtonProps) {
//   return (
//     <div
//       className={cn(
//         "relative overflow-hidden p-[2px] rounded-full group",
//         "transition-transform duration-300 hover:scale-105 active:scale-100"
//       )}
//     >
//       {/* rainbow border */}
//       <div
//         aria-hidden
//         className="absolute inset-0 z-0 bg-[conic-gradient(var(--tw-ring-color),#ff7a00,#ffea00,#00ff85,#00c8ff,#6a00ff,#ff00ea,#ff005e)] animate-spin-slow"
//         style={{ ["--tw-ring-color" as any]: "#ff005e" }}
//       />

//       <button
//         {...props}
//         className={cn(
//           "relative z-10 bg-gray-900/80 text-white backdrop-blur",
//           "px-8 py-3 text-sm font-medium rounded-full",
//           className ?? ""
//         )}
//       >
//         {children}
//       </button>
//     </div>
//   );
// }

// export default Button;

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
