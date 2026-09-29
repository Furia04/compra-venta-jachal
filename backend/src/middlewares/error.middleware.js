/**
 * Middleware Centralizado para el Manejo Global de Errores.
 * 
 * ¿Qué hace?
 * Captura todas las excepciones y errores no controlados que ocurren en la cadena
 * de middlewares y controladores durante el ciclo de vida de una petición HTTP.
 * 
 * Ventajas para la arquitectura:
 * - Evita que el servidor se caiga ante fallos inesperados.
 * - Estandariza la respuesta de error enviada al cliente frontend en formato JSON uniforme.
 * - Discrimina entre errores personalizados de la aplicación (AppError) y errores 500 no controlados.
 * 
 * @param {Error|AppError} err - Objeto de error capturado.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para continuar la cadena de middlewares.
 */
export function errorMiddleware(err, req, res, next) {
  console.error(err);

  // Determinar el código de estado HTTP (por defecto 500 Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Devolver respuesta estructurada al cliente
  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Error interno del servidor'
        : err.message,
    ...(err.details && { details: err.details }),
  });
}