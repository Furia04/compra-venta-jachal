import { z } from 'zod';

/**
 * Esquema de validación para el registro de nuevos usuarios.
 * Valida formato de email, longitud mínima de contraseña (8 caracteres),
 * nombre y apellido obligatorios, y formato opcional de teléfono.
 */
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email('El email no es válido'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),

  firstName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),

  lastName: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres'),

  phone: z
    .string()
    .trim()
    .min(6, 'El teléfono no es válido')
    .optional(),
});

/**
 * Esquema de validación para el inicio de sesión.
 * Requiere un email con formato válido y una contraseña no vacía.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('El email no es válido'),

  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
});