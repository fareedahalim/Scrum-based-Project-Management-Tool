import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost" | "outline";
}

export function Button({
  className,
  isLoading = false,
  variant = "primary",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60",

        variant === "primary" &&
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700",

        variant === "ghost" &&
          "bg-transparent text-blue-600 hover:bg-blue-50",

        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {children}
    </button>
  );
}