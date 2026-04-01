import { prisma } from '@/lib/prisma'
import { Category, CategoryOption, CategoryWithCount } from '@/types/category'

// Ordre d'affichage personnalisé (noms exacts de la DB)
const CATEGORY_DISPLAY_ORDER = [
  "CACES & autorisations de conduite",
  "Prévention, santé & sécurité au travail",
  "Électricité & habilitations électriques",
  "Travail en hauteur & levage",
  "Formation de formateur",
  "Sécurité incendie & sûreté",
  "Digital, Web & développement",
];

function sortByDisplayOrder<T extends { name: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const indexA = CATEGORY_DISPLAY_ORDER.indexOf(a.name);
    const indexB = CATEGORY_DISPLAY_ORDER.indexOf(b.name);
    const posA = indexA === -1 ? CATEGORY_DISPLAY_ORDER.length : indexA;
    const posB = indexB === -1 ? CATEGORY_DISPLAY_ORDER.length : indexB;
    return posA - posB;
  });
}

export class CategoriesService {
  static async getAllCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories.map(category => ({
      ...category,
      description: category.description ?? undefined,
      imageUrl: category.imageUrl ?? undefined,
    }))
  }

  static async getCategoriesForDropdown(): Promise<CategoryOption[]> {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: {
            trainings: {
              where: { isActive: true, status: 'PUBLISHED' }
            }
          }
        }
      },
    })

    const filtered = categories.filter(c => c._count.trainings > 0);
    const sorted = sortByDisplayOrder(filtered);

    return sorted.map(category => ({
      value: category.slug,
      label: category.name,
    }))
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      }
    })

    if (!category) return null

    return {
      ...category,
      description: category.description ?? undefined,
      imageUrl: category.imageUrl ?? undefined,
    }
  }

  static async getCategoriesWithTrainingCount(): Promise<CategoryWithCount[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        _count: {
          select: {
            trainings: {
              where: {
                isActive: true,
                status: 'PUBLISHED'
              }
            }
          }
        }
      },
    })

    // Mapping des pictos par catégorie (à adapter selon tes catégories)
    const categoryPictos: Record<string, string> = {
      'caces': '/formation/picto/person.svg',
      'habilitation-electrique': '/formation/picto/Euro symbol.svg',
      // Ajoute d'autres mappings selon tes catégories
    }

    const mapped = categories
      .filter(category => category._count.trainings > 0)
      .map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        imageUrl: category.imageUrl ?? undefined,
        trainingCount: category._count.trainings,
        picto: categoryPictos[category.slug] || '/formation/picto/person.svg'
      }));

    return sortByDisplayOrder(mapped);
  }
}