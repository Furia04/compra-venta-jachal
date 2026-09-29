/**
 * Middleware de Validación de Datos de Entrada (Request Body) utilizando Zod.
 * 
 * ¿Qué hace?
 * Es una función de orden superior (factory) que recibe un esquema de validación de Zod
 * y valida el cuerpo de la petición (`req.body`).
 * 
 * Beneficios:
 * - Valida tipos de datos, longitudes, formatos (ej. email, UUID, números positivos) antes
 *   de que la petición alcance la capa de servicios o base de datos.
 * - Si la validación falla: responde inmediatamente con código HTTP 400 (Bad Request)
 *   y un array detallado de los campos con errores.
 * - Si es exitosa: asigna a `req.body` los datos limpios y tipados, continuando la ejecución.
 * 
 * @param {import('zod').ZodSchema} schema - Esquema de validación de Zod.
 * @returns {Function} Middleware de Express.
 */
export function validate(schema) {
  return (req, res, next) => {
    // Validar el body de forma segura (sin lanzar excepciones no controladas)
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    // Sobrescribir req.body con los datos parseados y transformados por Zod
    req.body = result.data;

    next();
  };
}