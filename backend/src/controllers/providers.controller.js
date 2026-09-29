import {
  registerAsProvider,
  getProviderProfile,
  updateProviderProfileService,
} from '../services/providers.service.js';

/**
 * Controlador para dar de alta a un usuario como prestador de servicios (Worker/Provider).
 * 
 * Flujo:
 * 1. Toma el `req.user.id` del usuario en sesión y los datos del perfil laboral en `req.body`
 *    (bio, experiencia, zona de cobertura, teléfono de contacto, etc.).
 * 2. Invoca a `registerAsProvider` para registrar el perfil en la tabla de prestadores y asignarle el rol 'PROVIDER'.
 * 3. Retorna HTTP 201 (Created) con el perfil de prestador creado.
 */
export async function registerProviderController(req, res, next) {
  try {
    const provider = await registerAsProvider(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: 'Registro como prestador exitoso',
      data: provider,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para consultar el perfil público o propio de un prestador.
 * 
 * Flujo:
 * 1. Determina el ID solicitado: si la ruta es `/providers/me`, utiliza `req.user.id`; si no, `req.params.id`.
 * 2. Llama al servicio `getProviderProfile`.
 * 3. Retorna HTTP 200 con la información laboral y personal del prestador.
 */
export async function getProviderProfileController(req, res, next) {
  try {
    const providerId = req.params.id === 'me' ? req.user.id : req.params.id;
    const provider = await getProviderProfile(providerId);

    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para actualizar los datos laborales del prestador autenticado.
 * 
 * Flujo:
 * 1. Toma el `req.user.id` y los nuevos datos laborales en `req.body`.
 * 2. Invoca el servicio `updateProviderProfileService`.
 * 3. Retorna HTTP 200 con los datos actualizados.
 */
export async function updateProviderProfileController(req, res, next) {
  try {
    const updated = await updateProviderProfileService(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Perfil de prestador actualizado correctamente',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}