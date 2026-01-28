import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center group transition-all duration-300"
    >
      {/* Logo textuel créatif: "Form" + "Me" en badge */}
      <div className="flex items-center">
        {/* "Form" - texte principal */}
        <span className="font-sora font-bold text-2xl text-darkBlue tracking-tight">
          Form
        </span>
        {/* "Me" - dans un badge */}
        <span className="inline-flex items-center justify-center bg-primary text-white font-sora font-bold text-lg px-2 py-0.5 rounded-lg ml-0.5 transition-transform duration-300 group-hover:scale-105">
          Me
        </span>
      </div>
    </Link>
  );
}
