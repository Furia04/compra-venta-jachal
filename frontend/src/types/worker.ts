export type CoverageType = 'centro' | 'rural' | 'centro_rural'

export type PremiumStatus = 'premium' | 'normal'

export interface WorkSchedule {
  days: string
  hours: string
}

export interface Worker {
  id: string
  firstName: string
  lastName: string
  photoUrl: string
  categoryIds: string[]
  description?: string
  phone: string
  whatsapp: string
  department: string
  zone: string
  coverage: CoverageType
  schedules: WorkSchedule[]
  yearsOfExperience: number
  workPhotos: string[]
  premiumStatus: PremiumStatus
  averageRating: number
  reviewCount: number
}