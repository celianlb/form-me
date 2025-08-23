import HeroSection from "@/components/HeroSection";
import CTADevis from "@/components/Section/CTADevis";
import Top10Formations from "@/components/Section/Top10Formations";
import Badge from "@/components/UI/Badge";
import Heading from "@/components/UI/Heading";
import { CategoriesService } from "@/services/categories.service";
import { FormationsService } from "@/services/formations.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CategoryPageClient from "./CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const topFormations = await FormationsService.getRandomFormations(10);

  // Récupérer la catégorie et les formations en parallèle
  const [category, formations] = await Promise.all([
    CategoriesService.getCategoryBySlug(slug),
    FormationsService.getFormationsByCategory(slug),
  ]);

  // Si la catégorie n'existe pas, retourner 404
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Titre principal */}
      <HeroSection className="min-h-auto pt-[160px] pb-[80px]">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-grayBlue">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Accueil
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link
                href="/formations"
                className="hover:text-primary transition-colors"
              >
                Formations
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-blackBlue font-medium">{category.name}</li>
          </ol>
        </nav>
        <Heading level={1} className="flex flex-col items-center gap-2">
          Toutes nos formations <br />{" "}
          <Badge className=" text-center">{category.name}</Badge>
        </Heading>
        <p className="text-grayBlue max-w-[650px] text-center mt-8">
          {category.description}
        </p>
      </HeroSection>

      {/* Contenu client avec filtres et formations */}
      <Suspense
        fallback={
          <div className="px-5 lg:px-[120px] py-[80px] text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des filtres...</p>
          </div>
        }
      >
        <CategoryPageClient category={category} formations={formations} />
      </Suspense>

      <Top10Formations formations={topFormations} />

      {/* CTA Section */}
      {formations.length > 0 && <CTADevis />}
    </div>
  );
}

// Générer les métadonnées pour SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await CategoriesService.getCategoryBySlug(
    (
      await params
    ).slug
  );

  if (!category) {
    return {
      title: "Catégorie non trouvée - Form Me",
    };
  }

  return {
    title: `Formations ${category.name} - Form Me`,
    description:
      category.description ||
      `Découvrez toutes nos formations en ${category.name}. Formation professionnelle de qualité avec Form Me.`,
  };
}

// Générer les paramètres statiques pour la construction
export async function generateStaticParams() {
  try {
    const categories = await CategoriesService.getAllCategories();

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Permettre la génération dynamique des pages non pré-générées
export const dynamicParams = true;
