import { prisma } from '@/lib/prisma'
import { Category, CategoryOption, CategoryWithCount } from '@/types/category'

export class CategoriesService {
  static async getAllCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories.map(category => ({
      ...category,
      description: category.description ?? undefined
    }))
  }

  static async getCategoriesForDropdown(): Promise<CategoryOption[]> {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories.map(category => ({
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
      }
    })

    if (!category) return null

    return {
      ...category,
      description: category.description ?? undefined
    }
  }

  static async getCategoriesWithTrainingCount(): Promise<CategoryWithCount[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
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
      orderBy: {
        name: 'asc'
      }
    })

    // Mapping des pictos par catégorie (à adapter selon tes catégories)
    const categoryPictos: Record<string, string> = {
      'caces': '/formation/picto/person.svg',
      'habilitation-electrique': '/formation/picto/Euro symbol.svg',
      // Ajoute d'autres mappings selon tes catégories
    }

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      trainingCount: category._count.trainings,
      picto: categoryPictos[category.slug] || '/formation/picto/person.svg' // picto par défaut
    }))
  }
}