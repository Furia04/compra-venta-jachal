import { z } from 'zod';

/**
 * Esquema de validación para el registro o actualización del perfil de un prestador.
 * Permite especificar la descripción de su trabajo, ciudad y departamento.
 */
export const registerProviderSchema = z.object({
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .optional()
    .nullable(),

  city: z
    .string()
    .trim()
    .max(100, 'La ciudad no puede superar los 100 caracteres')
    .optional()
    .nullable(),

  department: z
    .string()
    .trim()
    .max(100, 'El departamento no puede superar los 100 caracteres')
    .optional()
    .nullable(),
});

export const updateProviderProfileSchema = registerProviderSchema;