import { apiFetch } from './api'
import type { ApiResponse } from './api'
import type { Category } from '../types/Category'
import { mockCategories } from '../data/mockCategories'

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiFetch<ApiResponse<Category[]>>('/categories')
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      return response.data
    }
  } catch (error) {
    console.warn('Backend categories endpoint not reachable, fallback to mocks:', error)
  }
  return mockCategories
}

export async function getCategoryById(idOrSlug: string): Promise<Category | undefined> {
  try {
    const response = await apiFetch<ApiResponse<Category>>(`/categories/${idOrSlug}`)
    if (response.success && response.data) {
      return response.data
    }
  } catch (error) {
    console.warn(`Backend category ${idOrSlug} endpoint not reachable, fallback to mocks:`, error)
  }
  return mockCategories.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
}
