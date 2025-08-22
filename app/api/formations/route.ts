import { NextResponse } from 'next/server'
import { FormationsService } from '@/services/formations.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const random = searchParams.get('random')
    const limit = searchParams.get('limit')

    let formations

    if (random === 'true') {
      // Récupérer des formations aléatoires
      const limitNumber = limit ? parseInt(limit) : 10
      formations = await FormationsService.getRandomFormations(limitNumber)
    } else if (category) {
      // Récupérer par catégorie
      formations = await FormationsService.getFormationsByCategory(category)
    } else {
      // Récupérer toutes les formations
      formations = await FormationsService.getAllFormations()
    }

    return NextResponse.json({ 
      formations,
      count: formations.length 
    })
  } catch (error) {
    console.error('Error fetching formations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch formations' },
      { status: 500 }
    )
  }
}