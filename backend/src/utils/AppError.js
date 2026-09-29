/**
 * Clase personalizada de Error para la aplicación.
 * Permite lanzar excepciones controladas con un código de estado HTTP específico
 * y detalles adicionales opcionales para una respuesta clara al cliente.
 */
export class AppError extends Error {
  /**
   * Crea una nueva instancia de AppError.
   * @param {string} message - Mensaje descriptivo del error para el cliente.
   * @param {number} statusCode - Código de estado HTTP (ej. 400, 401, 403, 404, 409, 500).
   * @param {any} details - Información o detalles adicionales sobre el error.
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;

    // Captura la traza de la pila excluyendo el constructor de esta clase
    Error.captureStackTrace(this, this.constructor);
  }
}