import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <div className="font-sora font-bold text-xl text-blackBlue">
        Form.Me
      </div>
    </Link>
  );
}