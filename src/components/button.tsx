import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/40",
        success:
          "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40",
        danger:
          "bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-500/40",
        warning:
          "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/40",
        dark: "bg-gradient-to-r from-gray-800 to-gray-900 hover:shadow-gray-800/40",
      },
      size: {
        sm: "text-xs px-4 py-2",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-6 py-3",
      },
      glow: {
        true: "shadow-xl hover:shadow-2xl",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-[8px]",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glow: true,
      rounded: "lg",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Buttona = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      fullWidth,
      rounded,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          glow,
          fullWidth,
          rounded,
          className,
        })}
        ref={ref}
        disabled={loading}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {icon && iconPosition === "left" && !loading && (
            <span className="inline-flex">{icon}</span>
          )}
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {children}
          {icon && iconPosition === "right" && !loading && (
            <span className="inline-flex">{icon}</span>
          )}
        </span>
      </button>
    );
  }
);

Buttona.displayName = "Button";

export { Buttona, buttonVariants };
