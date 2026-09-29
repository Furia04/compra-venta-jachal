import type { Worker } from '../types/worker'

/**
 * Tope máximo de reseñas considerado para la normalización del puntaje.
 * Evita que trabajadores antiguos con cientos de reseñas monopolicen indefinidamente la puntuación.
 */
const MAX_REVIEWS_FOR_SCORE = 30

/**
 * Calcula el puntaje algorítmico ponderado de un trabajador (Worker Score).
 * 
 * Fórmula de ranking multicriterio:
 * - 50% Puntuación promedio (Rating): Calidad del servicio percibida por los clientes (0 a 5 estrellas -> normalizado 0 a 1).
 * - 30% Volumen de reseñas (Review Count): Nivel de experiencia y fiabilidad estadística (normalizado con tope de 30).
 * - 20% Bonus de suscripción (Premium Status): Impulso para prestadores suscritos a cuenta destacada.
 * 
 * Justificación técnica:
 * Garantiza equidad; el 20% de bonus Premium nunca compensará un mal servicio o calificaciones negativas,
 * priorizando siempre la excelencia y satisfacción de los usuarios.
 * 
 * @param {Worker} worker - Datos del trabajador.
 * @returns {number} Puntuación ponderada de 0 a 1.
 */
export function getWorkerScore(worker: Worker): number {
  const ratingScore = worker.averageRating / 5
  const reviewScore = Math.min(worker.reviewCount / MAX_REVIEWS_FOR_SCORE, 1)
  const premiumBonus = worker.premiumStatus === 'premium' ? 1 : 0

  return ratingScore * 0.5 + reviewScore * 0.3 + premiumBonus * 0.2
}

/**
 * Determina si un trabajador califica como "Excelente por Reseñas" (destacado orgánico).
 * 
 * Criterio:
 * - Tener al menos 3 reseñas registradas.
 * - Mantener un promedio igual o superior a 4.5 estrellas.
 * 
 * @param {Worker} worker - Datos del trabajador.
 * @returns {boolean} true si cumple los criterios de excelencia.
 */
export function isExcellentByReviews(worker: Worker): boolean {
  return worker.reviewCount >= 3 && worker.averageRating >= 4.5
}

/**
 * Ordena y retorna los trabajadores con mejor puntaje ponderado.
 * 
 * @param {Worker[]} workers - Lista de trabajadores.
 * @param {number} limit - Cantidad máxima de resultados a retornar.
 * @returns {Worker[]} Lista de los mejores trabajadores ordenados de mayor a menor puntuación.
 */
export function getTopWorkers(workers: Worker[], limit: number): Worker[] {
  return [...workers]
    .sort((a, b) => getWorkerScore(b) - getWorkerScore(a))
    .slice(0, limit)
}