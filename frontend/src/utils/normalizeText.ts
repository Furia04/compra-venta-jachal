/**
 * Normaliza una cadena de texto para facilitar comparaciones y búsquedas flexibles:
 * 1. Convierte todo el texto a minúsculas (`toLowerCase`).
 * 2. Descompone caracteres con tildes y diacríticos (`normalize('NFD')`).
 * 3. Elimina los signos diacríticos mediante expresión regular Unicode (`replace(/[\u0300-\u036f]/g, '')`).
 * 4. Remueve espacios innecesarios al inicio y al final (`trim`).
 * 
 * Ejemplos:
 * - "Plomería" -> "plomeria"
 * - "ELECTRICISTA" -> "electricista"
 * 
 * @param {string} text - Texto original a normalizar.
 * @returns {string} Texto limpio y normalizado sin tildes ni mayúsculas.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}