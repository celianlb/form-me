import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  picto: string;
  titre: string;
  nombreFormations: number;
  slug: string;
}

export default function CategoryCard({
  picto,
  titre,
  nombreFormations,
  slug,
}: CategoryCardProps) {
  return (
    <Link
      href={`/formations/category/${slug}`}
      className="relative p-8 rounded-3xl w-[300px] h-full flex flex-col border border-grayBlue/20 hover:border-transparent bg-gradient-to-tr from-white to-[rgba(223,223,223,0.4)] hover:bg-none shadow-[0_0_20px_rgba(18,94,255,0.1)] hover:shadow-none overflow-hidden transition-all duration-500 ease-in-out group cursor-pointer"
    >
      {/* Pattern SVG en arrière-plan */}
      <div className="absolute top-0 right-0 w-[140px] h-[140px]">
        <Image
          src="/formation/dot-pattern.svg"
          alt=""
          width={140}
          height={140}
          className="object-cover"
        />
      </div>

      {/* Contenu de la carte */}
      <div className="relative z-10 flex flex-col items-start justify-between">
        {/* Picto */}
        <div className="flex flex-col gap-3">
          <Image src={picto} alt={titre} width={24} height={24} />

          {/* Titre */}
          <h3 className="text-xl font-satoshi font-medium text-blackBlue/70">
            {titre}
          </h3>
        </div>

        {/* Nombre de formations */}
        <p className="text-sm font-satoshi text-grayBlue">
          {nombreFormations} formation{nombreFormations > 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
