import { cn } from "@/utils/cn";
import WavyBackground from "./WavyBackground";

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroSection({ children, className }: HeroSectionProps) {
  return (
    <section className="relative pt-32 md:pt-44 pb-24 px-10">
      {/* Background aurora/wavy animé */}
      <WavyBackground />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center justify-center",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
