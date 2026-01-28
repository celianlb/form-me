export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
}

export interface CategoryOption {
  value: string
  label: string
}

export interface CategoryWithCount {
  id: number
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  trainingCount: number
  picto?: string
}