export interface Rating {
  id: string
  workerId: string
  clientId: string
  clientName: string
  score: number
  comment?: string
  createdAt: string
  isHidden?: boolean
}