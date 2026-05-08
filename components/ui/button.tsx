import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
  {
    variants: {
      variant: {
        "liquid-glass": "liquid-glass text-white hover:scale-[1.03]",
        solid: "bg-white text-black hover:bg-white/90 hover:scale-[1.02]",
        ghost: "text-white/70 hover:text-white",
      },
      size: {
        sm: "rounded-full px-4 py-2 text-xs",
        md: "rounded-full px-6 py-2.5 text-sm",
        lg: "rounded-full px-14 py-5 text-base",
      },
    },
    defaultVariants: {
      variant: "liquid-glass",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
