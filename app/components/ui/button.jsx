import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/app/components/svg/svg";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm hover:shadow-md",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 shadow-sm hover:shadow-md",
        tertiary: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100",
        danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md",
        success: "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow-md",
        outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        link: "text-blue-500 underline-offset-4 hover:underline active:text-blue-700",
      },
      size: {
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-2 text-sm",
        default: "h-10 px-2 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
