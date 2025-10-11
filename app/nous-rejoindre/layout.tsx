import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Nous rejoindre - Devenez formateur ou partenaire",
  description:
    "Rejoignez Form Me en tant que formateur ou partenaire. Partagez votre expertise, bénéficiez de tarifs préférentiels et développez votre activité au sein de notre réseau de formation professionnelle.",
  keywords: [
    "devenir formateur",
    "partenaire formation",
    "recrutement formateur",
    "réseau formation",
    "tarifs partenaire",
    "opportunités formateur",
    "rejoindre organisme de formation",
  ],
  path: "/nous-rejoindre",
});

export default function NousRejoindreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
