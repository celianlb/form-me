import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-platinium/30 py-12 px-[48px] md:px-[120px] z-50">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-8">
        <div>
          <Link href={"/"}>
            <p className="font-sora font-bold text-4xl text-primary">Form.Me</p>
          </Link>
          <p className="font-satoshi text-grayBlue text-[16px] max-w-[250px]">
            Des formations professionnelles pour la sécurité et la prévention.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/caces-&-autorisation-conduite"}
          >
            Formations CACES® et autorisation de conduite
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/aipr"}
          >
            Formations AIPR
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/gestes-&-postures"}
          >
            Formations Gestes & postures
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/habilitations-electriques"}
          >
            Formations Habilitations électriques
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/travaux-hauteurs-&-echafaudage"}
          >
            Formations Travaux en hauteurs & échafaudages
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/incendie-&-evacuation"}
          >
            Formations Incendie & évacuation
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/elingage"}
          >
            Formations Elingage
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/atex"}
          >
            Formations ATEX
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/sauveteurs-secouristes-au-travail"}
          >
            Formations Sauveteurs et secouristes au travail (SST)
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/nous-rejoindre"}
          >
            Nous rejoindre
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/nous-rejoindre"}
          >
            Nos engagements et valeurs
          </Link>
          <Link
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/nous-rejoindre"}
          >
            Nos partenaires
          </Link>
        </div>
      </div>

      <div className="flex gap-8 flex-col-reverse justify-between">
        <p className="mx-auto font-satoshi text-[16px]">© forme.me 2025</p>
        <div className="flex gap-2 flex-col md:flex-row">
          <Link
            href={"/mentions-legales"}
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
          >
            Mentions légales
          </Link>
          <Link
            href={"/politiques-de-confidentialité"}
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
          >
            Politique de confidentialité
          </Link>
          <Link
            href={"/contact"}
            className="font-satoshi text-grayBlue text-[16px] font-medium hover:text-primary transition-colors duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
