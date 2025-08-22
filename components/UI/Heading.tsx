import { cn } from "@/utils/cn";
import React from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  children: React.ReactNode;
  level: HeadingLevel;
  className?: string;
}

const getHeadingClasses = (level: HeadingLevel): string => {
  const sizeClasses = {
    1: "text-[32px] md:text-[48px] tracking-[-2px] md:tracking-[-4px]",
    2: "text-[28px] md:text-[32px]",
    3: "text-[24px] md:text-[28px]",
    4: "text-[20px] md:text-[24px]",
    5: "text-[18px] md:text-[20px]",
    6: "text-[16px] md:text-[18px]",
  };

  return sizeClasses[level];
};

export default function Heading({ children, level, className }: HeadingProps) {
  const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const baseClasses = "text-darkBlue font-sora font-bold";
  const sizeClasses = getHeadingClasses(level);

  const combinedClasses = cn(baseClasses, sizeClasses, className);

  return React.createElement(
    Component,
    { className: combinedClasses },
    children
  );
}
