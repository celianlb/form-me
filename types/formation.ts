export interface Formation {
  id: number
  title: string
  slug: string
  shortDescription?: string
  durationHours?: number
  durationDays?: number
  priceExclTax?: number
  availableInCenter: boolean
  availableElearning: boolean
  minParticipants?: number
  maxParticipants?: number
  category: {
    name: string
    slug: string
  }
}

export interface FormationCardData {
  id: number
  title: string
  slug: string
  duration?: number // en heures (calculé depuis durationHours ou durationDays * 7)
  location: 'center' | 'elearning' | 'both'
  capacity: {
    min?: number
    max?: number
  }
  price?: number // prix HT
}

// Données brutes depuis Prisma
export interface FormationFromDB {
  id: number
  title: string
  slug: string
  durationHours?: number | null
  durationDays?: number | null
  minParticipants?: number | null
  maxParticipants?: number | null
  availableInCenter: boolean
  availableElearning: boolean
  priceExclTax?: any | null // Prisma Decimal type
}