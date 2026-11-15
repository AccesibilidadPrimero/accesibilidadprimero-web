/* ---------------------------------------------------------------------------
   Contador de visitas propio (Johnny, 11/11/2026). La parte del Worker y lo
   que se guarda está en worker/visitas.ts.

   Manda una sola petición por página con tres datos: la página, la página
   de la que viene (`document.referrer`) y la marca `utm_source` o `ref` de
   la URL, si la hay. La ciudad la pone Cloudflare en el servidor.

   Solo cuenta visitas con señal humana (Johnny, 15/11/2026: «quiero que la
   analítica sea muy muy fiable»). La petición NO sale al cargar, sino con la
   primera de estas dos cosas:
   - la página lleva 5 segundos visible en pantalla (si la pestaña se oculta,
     la cuenta vuelve a empezar), o
   - alguien hace scroll, pulsa, toca o usa el teclado (solo eventos reales
     del navegador, `isTrusted`, no los que dispara un script).
   Así no cuentan los robots que cargan la página y se van, ni las pestañas
   abiertas en segundo plano que nadie llega a mirar, ni las páginas que el
   navegador prepara por adelantado (`prerendering`). Preferimos contar de
   menos a inflar.

   No lee ni escribe nada en el navegador: ni cookies, ni almacenamiento
   local. Solo cuenta en los dominios de verdad, no en local ni en la web de
   pruebas, para que los tests del repo no sumen visitas.
   --------------------------------------------------------------------------- */
import { DOMINIO_FINAL, DOMINIO_PROVISIONAL } from '../data/sitio';

const ESPERA_MS = 5000;
const GESTOS = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

const host = location.hostname.replace(/^www\./, '');

if ((host === DOMINIO_FINAL || host === DOMINIO_PROVISIONAL) && 'sendBeacon' in navigator) {
  /* Se leen al cargar: la URL y la referencia son las de la llegada. */
  const params = new URLSearchParams(location.search);
  const datos = JSON.stringify({
    p: location.pathname,
    r: document.referrer,
    u: params.get('utm_source') ?? params.get('ref') ?? '',
  });

  let enviado = false;
  let reloj: ReturnType<typeof setTimeout> | undefined;

  const preparando = () => (document as Document & { prerendering?: boolean }).prerendering === true;

  const enviar = () => {
    if (enviado) return;
    enviado = true;
    clearTimeout(reloj);
    GESTOS.forEach((g) => removeEventListener(g, alGesto, true));
    document.removeEventListener('visibilitychange', medirTiempo);
    document.removeEventListener('prerenderingchange', medirTiempo);
    /* text/plain: así el envío no necesita una petición previa de permiso. */
    navigator.sendBeacon('/api/v', new Blob([datos], { type: 'text/plain' }));
  };

  function alGesto(e: Event) {
    if (e.isTrusted && !preparando()) enviar();
  }

  /* El reloj solo corre mientras la página se ve. */
  function medirTiempo() {
    if (document.visibilityState === 'visible' && !preparando()) {
      reloj ??= setTimeout(enviar, ESPERA_MS);
    } else {
      clearTimeout(reloj);
      reloj = undefined;
    }
  }

  GESTOS.forEach((g) => addEventListener(g, alGesto, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', medirTiempo);
  document.addEventListener('prerenderingchange', medirTiempo);
  medirTiempo();
}
