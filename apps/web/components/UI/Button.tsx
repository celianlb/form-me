import { cn } from "@/utils/cn";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "dark" | "light" | "outline";

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  showIcon?: boolean;
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

const getVariantStyles = (variant: ButtonVariant) => {
  const variants = {
    // Fond blanc, texte darkBlue, cercle gris - pour fonds clairs
    primary: {
      container: "bg-white border border-gray-200 text-darkBlue shadow-sm hover:shadow-md",
      circle: "bg-gray-100",
      icon: "text-darkBlue",
    },
    // Fond transparent avec bordure, texte darkBlue - pour CTAs secondaires
    secondary: {
      container: "bg-transparent border border-gray-300 text-darkBlue hover:bg-gray-50",
      circle: "bg-gray-100",
      icon: "text-darkBlue",
    },
    // Fond darkBlue, texte blanc, cercle primary - style inversé
    dark: {
      container: "bg-darkBlue border border-darkBlue text-white hover:bg-darkBlue/90",
      circle: "bg-primary",
      icon: "text-white",
    },
    // Fond blanc, texte darkBlue, cercle primary - pour fonds foncés
    light: {
      container: "bg-white border border-white text-darkBlue hover:bg-gray-50",
      circle: "bg-primary",
      icon: "text-white",
    },
    // Style outline minimal
    outline: {
      container: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
      circle: "bg-gray-100",
      icon: "text-gray-700",
    },
    // Style tertiary - bouton texte simple sans fond
    tertiary: {
      container: "bg-transparent border-none text-gray-600 hover:text-red-600 hover:bg-red-50",
      circle: "bg-transparent",
      icon: "text-gray-600",
    },
  };
  return variants[variant];
};

export default function Button({
  children,
  variant = "primary",
  className,
  disabled = false,
  icon: Icon = ArrowRight,
  showIcon = true,
  ...props
}: ButtonProps) {
  const styles = getVariantStyles(variant);

  const baseClasses =
    "font-satoshi font-semibold rounded-full transition-all duration-200 inline-flex items-center gap-3 cursor-pointer";

  const paddingClasses = showIcon ? "pl-6 pr-2 py-2" : "px-6 py-3";

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const combinedClasses = cn(
    baseClasses,
    paddingClasses,
    styles.container,
    disabledClasses,
    className
  );

  const content = (
    <>
      <span className="text-sm inline-flex items-center">{children}</span>
      {showIcon && (
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shrink-0", styles.circle)}>
          <Icon className={cn("w-5 h-5", styles.icon)} />
        </div>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cn(combinedClasses, "group")}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn(combinedClasses, "group")}
      disabled={disabled}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {content}
    </button>
  );
}
