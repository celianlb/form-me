import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  titre: string;
  nombreFormations: number;
  slug: string;
  imageUrl?: string | null;
  size?: "small" | "medium" | "large";
  imagePosition?: string;
}

export default function CategoryCard({
  titre,
  nombreFormations,
  slug,
  imageUrl,
  size = "medium",
  imagePosition = "center",
}: CategoryCardProps) {
  const sizeClasses = {
    small: "h-40",
    medium: "h-52",
    large: "h-full min-h-[432px]",
  };

  return (
    <Link
      href={`/formations/category/${slug}`}
      className={`relative p-6 rounded-3xl w-full ${sizeClasses[size]} flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out group cursor-pointer hover:scale-[1.02] hover:shadow-xl bg-darkBlue`}
    >
      {/* Image de fond */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={titre}
            fill
            className="object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-300"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkBlue/90 via-darkBlue/30 to-darkBlue/10" />
        </div>
      )}

      {/* Contenu de la carte */}
      <div className="relative z-10">
        <h3 className="text-lg font-sora font-bold text-white leading-snug drop-shadow-md">
          {titre}
        </h3>
      </div>

      {/* Footer avec nombre de formations et bouton */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-white/80 font-satoshi text-sm drop-shadow-sm">
          {nombreFormations} formation{nombreFormations > 1 ? "s" : ""}
        </span>
        <div className="bg-white rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
          <ArrowRight className="w-4 h-4 text-darkBlue" />
        </div>
      </div>
    </Link>
  );
}
