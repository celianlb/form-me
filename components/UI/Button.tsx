import { cn } from "@/utils/cn";
import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends BaseButtonProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

interface ButtonAsLink extends BaseButtonProps {
  href: string;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    primary:
      "bg-primary text-white border-white hover:bg-white hover:text-primary hover:border-primary active:bg-platinium",
    secondary:
      "bg-white text-primary border-primary hover:border-white active:bg-platinium active:border-primary",
    tertiary:
      "bg-grayBlue text-white border-white hover:bg-white hover:text-grayBlue hover:border-grayBlue active:bg-platinium",
  };
  return variants[variant];
};

export default function Button({
  children,
  variant = "primary",
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 font-satoshi font-bold border rounded-md transition-colors duration-200 inline-flex items-center justify-center rounded-full cursor-pointer";
  const variantClasses = getVariantClasses(variant);
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const combinedClasses = cn(
    baseClasses,
    variantClasses,
    disabledClasses,
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {children}
    </button>
  );
}
