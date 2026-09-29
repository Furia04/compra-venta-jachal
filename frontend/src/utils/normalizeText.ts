/**
 * Normaliza un texto para comparaciones de búsqueda:
 * - Pasa todo a minúsculas.
 * - Elimina tildes/diacríticos (á, é, í, ó, ú, ñ se mantiene como ñ solo si hace falta,
 *   pero para búsquedas simples la tratamos igual que la "n" con tilde).
 *
 * Ejemplo: "Plomería" -> "plomeria", "PLOMERÍA" -> "plomeria"
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}