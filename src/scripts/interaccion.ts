/* ---------------------------------------------------------------------------
   Mapa de interacción (Johnny, 15/11/2026). La parte del Worker está en
   worker/visitas.ts (`registrarInteraccion`).

   Dos cosas, y nada más:
   1. Qué se pulsa: cada enlace o botón usado, con su nombre visible, a dónde
      lleva y si fue con ratón, con el dedo o con el teclado. El teclado
      cuenta igual que el ratón: un mapa de calor de píxeles no lo ve, y en
      un estudio de accesibilidad es justo lo que más interesa.
   2. Hasta dónde se lee: el punto más bajo de la página que llegó a verse,
      en tramos de 25, 50, 75 y 100 %. Una petición por página vista, al
      salir de ella, y solo si la visita contó (señal humana, visita.ts).

   No se mide nunca lo que alguien escribe: ni campos de texto ni la
   conversación de Itza, que puede llevar datos personales. Las respuestas
   rápidas de Itza las escribe el modelo a partir de la conversación, así
   que tampoco. Cualquier zona con `data-sin-medir` queda fuera.

   Sin identificador y sin nada en el navegador, como el contador.
   --------------------------------------------------------------------------- */
import { midiendo, humano } from './visita';

const CONTROLES = 'a[href], button, summary, [role="button"], input[type="checkbox"], input[type="radio"], input[type="submit"]';
const FUERA = '[data-sin-medir], [data-itza-log], [data-itza-rapidas]';

const ancho = () => (innerWidth < 768 ? 'movil' : innerWidth < 1024 ? 'tableta' : 'escritorio');

const mandar = (datos: object) =>
  navigator.sendBeacon('/api/i', new Blob([JSON.stringify(datos)], { type: 'text/plain' }));

const limpio = (t: string | null | undefined) => (t ?? '').replace(/\s+/g, ' ').trim();

/** El nombre que oiría un lector de pantalla, sin ARIA de más: aria-label,
    aria-labelledby, el texto, el alt de la imagen o la etiqueta del campo. */
function nombre(el: Element): string {
  const etiqueta = el.getAttribute('aria-label');
  if (limpio(etiqueta)) return limpio(etiqueta);
  const ids = el.getAttribute('aria-labelledby');
  if (ids) {
    const t = ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
    if (limpio(t)) return limpio(t);
  }
  if (el instanceof HTMLInputElement) {
    const t = Array.from(el.labels ?? []).map((l) => l.textContent).join(' ');
    return limpio(t) || limpio(el.value);
  }
  const texto = limpio((el as HTMLElement).innerText ?? el.textContent);
  if (texto) return texto;
  const img = el.querySelector('img[alt], svg title');
  return limpio(img?.getAttribute('alt') ?? img?.textContent) || limpio(el.getAttribute('title'));
}

/** A dónde lleva un enlace, sin parámetros ni direcciones de correo. */
function destino(el: Element): string | undefined {
  if (!(el instanceof HTMLAnchorElement)) return undefined;
  const href = el.getAttribute('href') ?? '';
  if (href.startsWith('mailto:')) return 'correo';
  if (href.startsWith('tel:')) return 'teléfono';
  try {
    const u = new URL(el.href);
    if (u.origin === location.origin) return u.pathname + (u.hash && u.pathname === location.pathname ? u.hash : '');
    return u.hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

if (midiendo) {
  /* 1. Pulsaciones */
  let ultimoPuntero = 'raton';
  addEventListener('pointerdown', (e) => {
    ultimoPuntero = e.pointerType === 'mouse' ? 'raton' : 'tactil';
  }, { capture: true, passive: true });

  addEventListener('click', (e) => {
    if (!e.isTrusted || !(e.target instanceof Element)) return;
    const el = e.target.closest(CONTROLES);
    if (!el || el.closest(FUERA)) return;
    const control = nombre(el).slice(0, 80);
    if (!control) return;
    /* Un clic que llega del teclado (Intro o espacio) trae `detail` 0. */
    const modo = (e as MouseEvent).detail === 0 ? 'teclado' : ultimoPuntero;
    mandar({ t: 'pulsar', p: location.pathname, c: control, d: destino(el), m: modo, a: ancho() });
  }, { capture: true, passive: true });

  /* 2. Hasta dónde se lee */
  let maximo = 0;
  const medir = () => {
    const alto = document.documentElement.scrollHeight;
    if (alto > 0) maximo = Math.max(maximo, (scrollY + innerHeight) / alto);
  };
  addEventListener('scroll', medir, { passive: true });
  medir();

  let contado = false;
  let enviada = false;
  humano.then(() => { contado = true; });

  const alSalir = () => {
    if (!contado || enviada) return;
    medir();
    enviada = true;
    const h = maximo >= 0.98 ? 100 : maximo >= 0.75 ? 75 : maximo >= 0.5 ? 50 : 25;
    mandar({ t: 'lectura', p: location.pathname, h, a: ancho() });
  };
  /* `visibilitychange` cubre el móvil, donde `pagehide` a veces no llega. */
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') alSalir(); });
  addEventListener('pagehide', alSalir);
}
