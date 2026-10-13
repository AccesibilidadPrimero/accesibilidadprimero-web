/* ---------------------------------------------------------------------------
   Cloudflare Web Analytics (Johnny, 11/10/2026, en lugar de Google Analytics
   y de mapas de calor): cuenta visitas sin cookies, sin almacenamiento local
   y sin huella digital, así que no hace falta banner de consentimiento.

   El token es público: va en el HTML de cada página. Sale del panel de
   Cloudflare → Analytics & Logs → Web Analytics → Add a site → el fragmento
   que da, `data-cf-beacon='{"token": "…"}'`. Mientras esté vacío, Base.astro
   no carga nada.

   ⚠ Privacidad y Cookies ya dicen que la web usa Cloudflare Web Analytics.
   Antes de publicar en la URL final, o se pone el token o se quitan esas
   frases de src/data/legal.ts.
   --------------------------------------------------------------------------- */
export const CF_WEB_ANALYTICS_TOKEN = '';
