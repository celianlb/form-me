import { cn } from "@/utils/cn";
import Image from "next/image";
import WavyBackground from "./WavyBackground";

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
}

const partners = [
  { name: "FDM", logo: "/partners/fdm-logo.png", height: "h-6 md:h-7" },
  { name: "FO-SEC Prévention", logo: "/partners/fosec-logo.png", height: "h-6 md:h-7" },
  { name: "Lysafe Pro", logo: "/partners/lysafe-logo.png", height: "h-5 md:h-6" },
  { name: "Liva", logo: "/partners/liva-logo.png", height: "h-6 md:h-7" },
];

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

      {/* Partenaires */}
      <div className="relative z-10 mt-24 md:mt-32">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {partners.map((partner) => (
            <div key={partner.name}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={56}
                className={`${partner.height} w-auto object-contain`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
