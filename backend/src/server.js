import app from './app.js';
import env from './config/env.js';

/**
 * Punto de entrada principal para iniciar el servidor HTTP del backend.
 * Escucha peticiones en el puerto configurado en las variables de entorno.
 */
app.listen(env.port, () => {
  console.log(`OficiosYa API ejecutándose en http://localhost:${env.port}`);
});