/* ---------------------------------------------------------------------------
   Turnstile invisible, compartido por el formulario (formulario.ts) y por
   Itza en Contacto (itza-contacto.ts). El script de Cloudflare se pide una
   sola vez y solo cuando hace falta, no al abrir la página.

   `fichero(caja, sitekey, accion)` devuelve `pedir()`, que entrega una ficha
   (en invisible, en uno o dos segundos) o '' si no llega en 10 s, y
   `gastada()`, que pide otra para el siguiente intento: cada ficha vale una
   sola vez.
   --------------------------------------------------------------------------- */
type Turnstile = {
  render: (el: HTMLElement, opciones: Record<string, unknown>) => string;
  reset: (id: string) => void;
};
declare global {
  interface Window { turnstile?: Turnstile }
}

const API_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let cargando: Promise<Turnstile> | null = null;
export function cargarTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  cargando ??= new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = API_TURNSTILE;
    s.async = true;
    s.addEventListener('load', () => (window.turnstile ? ok(window.turnstile) : mal(new Error('turnstile'))), { once: true });
    s.addEventListener('error', () => { cargando = null; mal(new Error('turnstile')); }, { once: true });
    document.head.append(s);
  });
  return cargando;
}

export function fichero(caja: HTMLElement | null, sitekey?: string, accion?: string) {
  let widget: string | undefined;
  let ficha = '';
  let esperando: Array<(f: string) => void> = [];
  const entregar = (f: string) => { ficha = f; esperando.forEach((r) => r(f)); esperando = []; };

  async function preparar() {
    if (widget !== undefined || !caja) return;
    const ts = await cargarTurnstile();
    if (widget !== undefined) return;
    widget = ts.render(caja, {
      sitekey,
      action: accion,
      callback: entregar,
      'expired-callback': () => { ficha = ''; },
      'error-callback': () => { ficha = ''; entregar(''); },
    });
  }

  function pedir(): Promise<string> {
    if (ficha) return Promise.resolve(ficha);
    return new Promise((r) => {
      esperando.push(r);
      preparar().catch(() => entregar(''));
      setTimeout(() => entregar(ficha), 10_000);
    });
  }

  function gastada() {
    ficha = '';
    if (widget !== undefined) window.turnstile?.reset(widget);
  }

  return { preparar, pedir, gastada };
}
