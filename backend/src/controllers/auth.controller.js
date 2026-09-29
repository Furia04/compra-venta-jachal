import {
  registerUser,
  loginUser,
} from '../services/auth.service.js';

/**
 * Controlador para el registro de nuevos usuarios (Clientes).
 * 
 * Flujo:
 * 1. Recibe en `req.body` los datos del formulario: email, contraseña, nombre, apellido y teléfono.
 * 2. Llama al servicio `registerUser` para crear la cuenta en Supabase Auth, el perfil y el rol CLIENT.
 * 3. Retorna código HTTP 201 (Created) con los datos del usuario y la sesión creada.
 */
export async function register(req, res, next) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
    } = req.body;

    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para el inicio de sesión de usuarios existentes.
 * 
 * Flujo:
 * 1. Recibe las credenciales `email` y `password` en el cuerpo de la petición.
 * 2. Invoca a `loginUser` que valida la autenticación contra Supabase Auth.
 * 3. Retorna código HTTP 200 (OK) con el token JWT de sesión y la información del usuario.
 */
export async function login(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para obtener el perfil y estado de la sesión actual del usuario autenticado.
 * 
 * Flujo:
 * 1. Lee la propiedad `req.user` inyectada previamente por el middleware `authenticate`.
 * 2. Retorna código HTTP 200 (OK) con los datos del usuario logueado.
 */
export async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
}