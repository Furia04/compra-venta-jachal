export type UserRole = 'client' | 'provider' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  workerId?: string
  favoriteWorkerIds?: string[]
  isSuspended?: boolean
}