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

/** ¿Estamos en la web de verdad? Fuera (local, workers.dev, tests) no se mide nada. */
export const midiendo = (host === DOMINIO_FINAL || host === DOMINIO_PROVISIONAL) && 'sendBeacon' in navigator;

/* Señales de navegador automático (Johnny, 19/11/2026). Robots con un Chrome
   completo desde servidores de Ashburn y Nueva York esperaban los 5 s y
   contaban. Se mandan con cada envío y el Worker las mira y las tira; no se
   guardan:
   - z: la zona horaria del navegador. En un servidor suele ser UTC, o no
     cuadra con la de la ciudad de la conexión.
   - w: `navigator.webdriver`, que encienden Playwright, Puppeteer y Selenium.
   - l: cuántos idiomas declara el navegador. Un navegador sin interfaz puede
     no declarar ninguno; una persona siempre tiene al menos uno. */
export const senales = () => {
  let z = '';
  try { z = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''; } catch { z = ''; }
  return { z, w: navigator.webdriver === true ? 1 : 0, l: navigator.languages?.length ?? 0 };
};

/* Se cumple cuando la visita cuenta (hay señal humana). El mapa de
   interacción (interaccion.ts) espera a esto antes de mandar la lectura. */
let marcarHumano: () => void = () => {};
export const humano = new Promise<void>((r) => { marcarHumano = r; });

if (midiendo) {
  /* Se leen al cargar: la URL y la referencia son las de la llegada. */
  const params = new URLSearchParams(location.search);
  const datos = JSON.stringify({
    p: location.pathname,
    r: document.referrer,
    u: params.get('utm_source') ?? params.get('ref') ?? '',
    ...senales(),
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
    marcarHumano();
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
