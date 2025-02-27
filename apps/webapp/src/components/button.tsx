import { Slot } from "@radix-ui/react-slot";
import cn from "classnames";
import { ComponentProps, forwardRef, ReactNode } from "react";

import { cva, VariantProps } from "class-variance-authority";

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: ReactNode;
    iconSize?: string | number;
    isActive?: boolean;
    activeIcon?: ReactNode;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      activeIcon,
      iconSize = "1em",
      isActive = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconStyle = { fontSize: iconSize };

    const currentIcon = isActive && activeIcon ? activeIcon : icon;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2">
          {currentIcon && (
            <span className="icon-container mr-2" style={iconStyle}>
              {currentIcon}
            </span>
          )}
          {children}
        </div>
      </Comp>
    );
  },
);

Button.displayName = "Button";

export default Button;

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold ring-offset-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:brightness-75",
        outline:
          "border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "hover:bg-neutral-200",
        subtle: "bg-[#D6FED7] text-primary hover:brightness-75",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 px-2 !text-sm",
        lg: "h-14 px-6 !text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
