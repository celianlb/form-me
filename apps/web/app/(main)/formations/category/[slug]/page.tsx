import Top10Formations from "@/components/Section/Top10Formations";
import { createMetadata } from "@/lib/metadata";
import {
  getAllCategoriesCached,
  getCategoryBySlugCached,
  getFormationsByCategoryCached,
  getRandomFormationsCached,
} from "@/lib/cached-queries";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CategoryPageClient from "./CategoryPageClient";

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Uses React cache() to deduplicate with page component call
  const category = await getCategoryBySlugCached(slug);

  if (!category) {
    return createMetadata({
      title: "Catégorie non trouvée",
      description: "La catégorie demandée n'existe pas.",
      path: `/formations/category/${slug}`,
      noIndex: true,
    });
  }

  const keywords = [
    category.name,
    "formation professionnelle",
    "certification",
    `formations ${category.name}`,
  ];

  return createMetadata({
    title: `Formations ${category.name} - Formation Professionnelle`,
    description:
      category.description ||
      `Découvrez toutes nos formations en ${category.name}. Formation professionnelle de qualité avec Form Me.`,
    keywords,
    path: `/formations/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Uses React cache() for deduplication within request
  // Récupérer la catégorie et les formations en parallèle
  const [category, formations, topFormations] = await Promise.all([
    getCategoryBySlugCached(slug),
    getFormationsByCategoryCached(slug),
    getRandomFormationsCached(10),
  ]);

  // Si la catégorie n'existe pas, retourner 404
  if (!category) {
    notFound();
  }

  return (
    <div className="pt-32 md:pt-40">
      {/* Breadcrumb */}
      <nav className="px-5 lg:px-[120px] mb-6">
        <ol className="flex items-center space-x-2 text-sm text-grayBlue">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/formations"
              className="hover:text-primary transition-colors"
            >
              Formations
            </Link>
          </li>
          <li>/</li>
          <li className="text-darkBlue font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Liste des formations */}
      <Suspense
        fallback={
          <div className="px-5 lg:px-[120px] py-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des formations...</p>
          </div>
        }
      >
        <CategoryPageClient category={category} formations={formations} />
      </Suspense>

      <Top10Formations formations={topFormations} />
    </div>
  );
}

// Générer les paramètres statiques pour la construction
export async function generateStaticParams() {
  try {
    const categories = await getAllCategoriesCached();

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
