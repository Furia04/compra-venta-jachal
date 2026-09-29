import type { Worker } from '../types/worker'

/**
 * Fórmula de ranking simple y explicable:
 * - 50% puntuación promedio (normalizada a 0-1, sobre 5 estrellas)
 * - 30% cantidad de reseñas (normalizada, con un tope para que no crezca sin límite)
 * - 20% bonus por ser Premium (fijo, no depende de la calidad)
 *
 * Esto asegura que un Premium con mala puntuación NO pueda superar
 * a un trabajador excelente con muchas reseñas, porque el 20% de bonus
 * nunca compensa una diferencia grande en el 80% restante (rating + reseñas).
 */
const MAX_REVIEWS_FOR_SCORE = 30

export function getWorkerScore(worker: Worker): number {
  const ratingScore = worker.averageRating / 5
  const reviewScore = Math.min(worker.reviewCount / MAX_REVIEWS_FOR_SCORE, 1)
  const premiumBonus = worker.premiumStatus === 'premium' ? 1 : 0

  return ratingScore * 0.5 + reviewScore * 0.3 + premiumBonus * 0.2
}

/**
 * Un trabajador se considera "Destacado" por reseñas (no por Premium)
 * cuando tiene buena puntuación Y una cantidad mínima de reseñas confiable.
 */
export function isExcellentByReviews(worker: Worker): boolean {
  return worker.reviewCount >= 3 && worker.averageRating >= 4.5
}

export function getTopWorkers(workers: Worker[], limit: number): Worker[] {
  return [...workers]
    .sort((a, b) => getWorkerScore(b) - getWorkerScore(a))
    .slice(0, limit)
}