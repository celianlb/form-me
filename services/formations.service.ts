import { prisma } from '@/lib/prisma'
import { FormationCardData, FormationFromDB } from '@/types/formation'

export class FormationsService {
  // Transformation des données DB vers FormationCardData
  static transformToCardData(formation: FormationFromDB): FormationCardData {
    // Calcul de la durée en heures
    let duration: number | undefined
    if (formation.durationHours) {
      duration = formation.durationHours
    } else if (formation.durationDays) {
      duration = formation.durationDays * 7 // 7h par jour
    }

    // Calcul du lieu
    let location: 'center' | 'elearning' | 'both'
    if (formation.availableInCenter && formation.availableElearning) {
      location = 'both'
    } else if (formation.availableElearning) {
      location = 'elearning'
    } else {
      location = 'center'
    }

    return {
      id: formation.id,
      title: formation.title,
      slug: formation.slug,
      duration,
      location,
      capacity: {
        min: formation.minParticipants ?? undefined,
        max: formation.maxParticipants ?? undefined,
      },
      price: formation.priceExclTax ? Number(formation.priceExclTax) : undefined,
    }
  }

  // Récupérer toutes les formations actives
  static async getAllFormations(): Promise<FormationCardData[]> {
    const formations = await prisma.training.findMany({
      where: {
        isActive: true,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        durationHours: true,
        durationDays: true,
        minParticipants: true,
        maxParticipants: true,
        availableInCenter: true,
        availableElearning: true,
        priceExclTax: true,
      },
      orderBy: {
        title: 'asc'
      }
    })

    return formations.map(this.transformToCardData)
  }

  // Récupérer des formations aléatoires (pour Top 10)
  static async getRandomFormations(limit: number = 10): Promise<FormationCardData[]> {
    // Première requête pour compter le total
    const totalCount = await prisma.training.count({
      where: {
        isActive: true,
        status: 'PUBLISHED'
      }
    })

    if (totalCount === 0) return []

    // Générer des IDs aléatoires
    const randomSkips = Array.from({ length: Math.min(limit, totalCount) }, () => 
      Math.floor(Math.random() * totalCount)
    )

    // Récupérer les formations à ces positions
    const formations = await Promise.all(
      randomSkips.map(skip => 
        prisma.training.findMany({
          where: {
            isActive: true,
            status: 'PUBLISHED'
          },
          select: {
            id: true,
            title: true,
            slug: true,
            durationHours: true,
            durationDays: true,
            minParticipants: true,
            maxParticipants: true,
            availableInCenter: true,
            availableElearning: true,
            priceExclTax: true,
          },
          skip,
          take: 1
        })
      )
    )

    // Aplatir le tableau et éliminer les doublons
    const flatFormations = formations.flat()
    const uniqueFormations = flatFormations.filter((formation, index, self) => 
      self.findIndex(f => f.id === formation.id) === index
    )

    return uniqueFormations.map(this.transformToCardData)
  }

  // Récupérer les formations par catégorie
  static async getFormationsByCategory(categorySlug: string): Promise<FormationCardData[]> {
    const formations = await prisma.training.findMany({
      where: {
        isActive: true,
        status: 'PUBLISHED',
        category: {
          slug: categorySlug
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        durationHours: true,
        durationDays: true,
        minParticipants: true,
        maxParticipants: true,
        availableInCenter: true,
        availableElearning: true,
        priceExclTax: true,
      },
      orderBy: {
        title: 'asc'
      }
    })

    return formations.map(this.transformToCardData)
  }

  // Récupérer une formation par slug
  static async getFormationBySlug(slug: string): Promise<FormationCardData | null> {
    const formation = await prisma.training.findUnique({
      where: { 
        slug,
        isActive: true,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        durationHours: true,
        durationDays: true,
        minParticipants: true,
        maxParticipants: true,
        availableInCenter: true,
        availableElearning: true,
        priceExclTax: true,
      }
    })

    return formation ? this.transformToCardData(formation) : null
  }
}