/* ---------------------------------------------------------------------------
   Contador de visitas propio (Johnny, 11/11/2026). La parte del Worker y lo
   que se guarda está en worker/visitas.ts.

   Manda una sola petición por página con tres datos: la página, la página
   de la que viene (`document.referrer`) y la marca `utm_source` o `ref` de
   la URL, si la hay. La ciudad la pone Cloudflare en el servidor.

   No lee ni escribe nada en el navegador: ni cookies, ni almacenamiento
   local. Solo cuenta en los dominios de verdad, no en local ni en la web de
   pruebas, para que los tests del repo no sumen visitas.
   --------------------------------------------------------------------------- */
import { DOMINIO_FINAL, DOMINIO_PROVISIONAL } from '../data/sitio';

const host = location.hostname.replace(/^www\./, '');

if ((host === DOMINIO_FINAL || host === DOMINIO_PROVISIONAL) && 'sendBeacon' in navigator) {
  const params = new URLSearchParams(location.search);
  const datos = JSON.stringify({
    p: location.pathname,
    r: document.referrer,
    u: params.get('utm_source') ?? params.get('ref') ?? '',
  });
  /* text/plain: así el envío no necesita una petición previa de permiso. */
  navigator.sendBeacon('/api/v', new Blob([datos], { type: 'text/plain' }));
}
