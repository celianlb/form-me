import { cn } from "@/utils/cn";

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroSection({ children, className }: HeroSectionProps) {
  return (
    <section className="relative pt-10 md:pt-20">
      {/* Background pattern */}
      <div
        className="absolute w-full h-full bg-cover bg-top bg-no-repeat left-0 top-0"
        style={{
          backgroundImage: "url('/hero/hero-dotted.png')",
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 px-4 flex flex-col items-center justify-center min-h-screen",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
