/* ---------------------------------------------------------------------------
   Lo que pasa por aquí le pasa a TODAS las páginas, en `astro dev` y en el
   build estático (el middleware corre al prerenderizar).

   Hoy, una cosa: fijar las partículas a final de línea (src/lib/particulas.ts).
   En castellano, catalán e inglés, cada uno con su lista (05/11/2026).
   --------------------------------------------------------------------------- */
import { defineMiddleware } from 'astro:middleware';
import { sinParticulasAlFinal } from './lib/particulas';

export const onRequest = defineMiddleware(async (_contexto, siguiente) => {
  const respuesta = await siguiente();
  if (!(respuesta.headers.get('content-type') ?? '').includes('text/html')) return respuesta;
  const html = await respuesta.text();
  const idioma = /<html[^>]*\blang="([^"]+)"/.exec(html)?.[1] ?? '';
  const lang = idioma.slice(0, 2);
  const salida = ['es', 'ca', 'en'].includes(lang) ? sinParticulasAlFinal(html, lang) : html;
  return new Response(salida, { status: respuesta.status, statusText: respuesta.statusText, headers: respuesta.headers });
});
