import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[url('/footer/bg-footer.svg')] bg-cover pt-20 pb-10 px-[48px] md:px-[120px] z-50 rounded-t-4xl">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div>
          <Link href={"/"}>
            <p className="font-sora font-bold text-4xl text-platinium">
              Form.Me
            </p>
          </Link>
          <p className="font-satoshi text-white text-[16px] max-w-[250px]">
            Des formations professionnelles pour la sécurité et la prévention.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/caces-&-autorisation-conduite"}
          >
            Formations CACES® et autorisation de conduite
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/aipr"}
          >
            Formations AIPR
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/gestes-&-postures"}
          >
            Formations Gestes & postures
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-primary transition-colors duration-300"
            href={"/formation/habilitations-electriques"}
          >
            Formations Habilitations électriques
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/travaux-hauteurs-&-echafaudage"}
          >
            Formations Travaux en hauteurs & échafaudages
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/incendie-&-evacuation"}
          >
            Formations Incendie & évacuation
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/elingage"}
          >
            Formations Elingage
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/atex"}
          >
            Formations ATEX
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/sauveteurs-secouristes-au-travail"}
          >
            Formations Sauveteurs et secouristes au travail (SST)
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/nous-rejoindre"}
          >
            Nous rejoindre
          </Link>
          <Link
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
            href={"/formation/nous-rejoindre"}
          >
            Nos partenaires
          </Link>
        </div>
      </div>

      <div className="flex gap-8 flex-col-reverse md:flex-row justify-between">
        <p className="mx-auto md:mx-0 text-white font-satoshi text-[16px]">
          © forme.me 2025
        </p>
        <div className="flex gap-2 flex-col md:flex-row">
          <Link
            href={"/mentions-legales"}
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
          >
            Mentions légales
          </Link>
          <p className="text-white">-</p>
          <Link
            href={"/politiques-de-confidentialité"}
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
          >
            Politique de confidentialité
          </Link>
          <p className="text-white">-</p>
          <Link
            href={"/contact"}
            className="font-satoshi text-white text-[16px] font-medium hover:text-platinium transition-colors duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
