import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo/noBgColor.png"
        alt="Logo FormMe"
        width={64}
        height={64}
        className="rounded-full"
      />
    </Link>
  );
}
