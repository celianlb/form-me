import { NextResponse } from 'next/server'
import { FormationsService } from '@/services/formations.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const formation = await FormationsService.getFormationBySlug(slug)

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ formation })
  } catch (error) {
    console.error('Error fetching formation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch formation' },
      { status: 500 }
    )
  }
}