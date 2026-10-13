// @ts-check
import { defineConfig } from 'astro/config';
import { SITIO } from './src/data/sitio.ts';

/**
 * accesibilidadprimero.com v2.
 *
 * Reglas que esta configuración hace cumplir:
 * - Sin integraciones de UI. Si una página necesita interactividad, se escribe
 *   en JavaScript progresivo dentro del componente, no se importa un framework.
 * - i18n montado para los tres idiomas desde el principio, pero solo `es` tiene
 *   contenido. Ver src/i18n/config.ts: el selector de idioma no se pinta hasta
 *   que haya un segundo idioma activo. Tres códigos de los que dos llevan a un
 *   404 son peores que no tener selector.
 * - prefixDefaultLocale: false → el castellano vive en la raíz y no se rompen
 *   las URLs actuales. El catalán y el inglés entrarán en /ca/ y /en/.
 *
 * Los SVG NO se limpian aquí. Astro convierte un .svg en componente durante su
 * propia fase de carga, antes de que pueda entrar un plugin de Vite con
 * `enforce: 'pre'`: lo comprobé y al plugin le llega ya JavaScript, no el SVG.
 * La limpieza vive en `npm run svg`, que escribe en disco y se puede leer.
 */
export default defineConfig({
  // Sale de src/data/sitio.ts: .eu sin indexar hasta el 20/01/2027, después el .com.
  site: SITIO,
  trailingSlash: 'always',
  i18n: {
    locales: ['es', 'ca', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  build: {
    // Un archivo CSS por página, no un bundle global: menos bytes bloqueantes.
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  prefetch: false,
  devToolbar: { enabled: false },
});
