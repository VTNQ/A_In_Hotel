import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
    inline-flex items-center justify-center gap-2 whitespace-nowrap
    rounded-md text-sm font-medium transition-all
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none
    [&_svg:not([class*='size-'])]:size-4
    shrink-0 [&_svg]:shrink-0
    outline-none

    focus-visible:border-ring
    focus-visible:ring-ring/50
    focus-visible:ring-[3px]

    aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    aria-invalid:border-destructive
  `,
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground shadow-xs
          hover:bg-primary/90

          dark:bg-indigo-500
          dark:text-white
          dark:hover:bg-indigo-600
        `,

        destructive: `
          bg-destructive text-white shadow-xs
          hover:bg-destructive/90

          focus-visible:ring-destructive/20
          dark:focus-visible:ring-destructive/40

          dark:bg-red-600
          dark:hover:bg-red-700
        `,

        outline: `
          border border-gray-300
          bg-white text-gray-800 shadow-xs
          hover:bg-gray-100 hover:text-gray-900

          dark:border-neutral-700
          dark:bg-neutral-900
          dark:text-neutral-100
          dark:hover:bg-neutral-800
        `,

        secondary: `
          bg-secondary text-secondary-foreground shadow-xs
          hover:bg-secondary/80

          dark:bg-neutral-800
          dark:text-white
          dark:hover:bg-neutral-700
        `,

        ghost: `
          hover:bg-accent hover:text-accent-foreground

          dark:text-neutral-200
          dark:hover:bg-neutral-800
          dark:hover:text-white
        `,

        link: `
          text-primary underline-offset-4
          hover:underline

          dark:text-indigo-400
        `,
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),

        disabled &&
          `
            opacity-50
            cursor-not-allowed
            pointer-events-none
          `,

        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };