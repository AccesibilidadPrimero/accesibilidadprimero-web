/* ---------------------------------------------------------------------------
   Formulario de contacto · validación accesible

   Sin JS el formulario ya funciona: los campos llevan `required` y
   `type="email"`, y el navegador no deja enviar sin ellos. Este script
   SUSTITUYE esa validación por una que se puede leer y anunciar, porque los
   globos nativos desaparecen solos, no se pueden ampliar y cada navegador los
   dice a su manera. Decisiones tomadas en el formulario de Foc i Cor
   (25/08/2026) y reutilizadas aquí:

   · Al fallar el envío, un resumen ARRIBA lista los errores, con un enlace a
     cada campo, y recibe el foco. Es lo que evita que quien usa lector de
     pantalla se quede sin saber por qué no se ha enviado (3.3.1).
   · Cada mensaje va pegado a su campo con `aria-describedby`, y el campo
     lleva `aria-invalid`.
   · Después del primer intento de envío, el error se quita mientras se
     escribe y se pone al salir del campo (ver más abajo por qué). Avisar en cada pulsación interrumpe a quien escribe, y en un campo
     de correo significa gritar «formato inválido» desde la primera letra.
   · El error no va en color: el mensaje se escribe y el borde engorda (1.4.1).

   Y el envío (Johnny, 10/10: Worker + Brevo + Turnstile):

   · Sin JS el formulario no se pinta: la página lo trae `hidden` y lo enseña
     este script. Turnstile necesita JS y el Worker rechaza un envío sin su
     ficha, así que un formulario visible sin JS sería un botón muerto.
   · El script de Turnstile (de challenges.cloudflare.com) se pide la primera
     vez que alguien toca el formulario, no al abrir la página: quien solo
     viene a por el correo no llama a Cloudflare.
   · Las fichas son de un solo uso: tras cada intento, se pide una nueva.
   --------------------------------------------------------------------------- */

type Turnstile = {
  render: (el: HTMLElement, opciones: Record<string, unknown>) => string;
  reset: (id: string) => void;
};
declare global {
  interface Window { turnstile?: Turnstile }
}

const API_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Carga el script de Turnstile una sola vez. */
let cargando: Promise<Turnstile> | null = null;
function cargarTurnstile(): Promise<Turnstile> {
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

type Campo = HTMLInputElement | HTMLTextAreaElement;

function iniciar(form: HTMLFormElement) {
  // A partir de aquí manda este script, no los globos del navegador.
  form.noValidate = true;
  form.hidden = false;

  const errorEnvio = form.querySelector<HTMLElement>('[data-error-envio]');
  const confirmacion = document.querySelector<HTMLElement>('[data-confirmacion]');
  const cajaTurnstile = form.querySelector<HTMLElement>('[data-turnstile]');

  /* La ficha de Turnstile. `pedirFicha()` devuelve una promesa que se cumple
     cuando Cloudflare la entrega (en invisible, en uno o dos segundos). */
  let widget: string | undefined;
  let ficha = '';
  let esperando: Array<(f: string) => void> = [];
  const entregar = (f: string) => { ficha = f; esperando.forEach((r) => r(f)); esperando = []; };

  async function prepararTurnstile() {
    if (widget !== undefined || !cajaTurnstile) return;
    const ts = await cargarTurnstile();
    if (widget !== undefined) return;
    widget = ts.render(cajaTurnstile, {
      sitekey: form.dataset.sitekey,
      action: form.dataset.accion,
      callback: entregar,
      'expired-callback': () => { ficha = ''; },
      'error-callback': () => { ficha = ''; entregar(''); },
    });
  }
  // Al primer contacto con el formulario, no antes.
  form.addEventListener('focusin', () => { prepararTurnstile().catch(() => {}); }, { once: true });

  function pedirFicha(): Promise<string> {
    if (ficha) return Promise.resolve(ficha);
    return new Promise((r) => {
      esperando.push(r);
      prepararTurnstile().catch(() => entregar(''));
      // Diez segundos como mucho: si no llega, se trata como fallo de envío.
      setTimeout(() => entregar(ficha), 10_000);
    });
  }

  const resumen = form.querySelector<HTMLElement>('[data-resumen]');
  const lista = resumen?.querySelector('ul');
  const campos = Array.from(form.querySelectorAll<Campo>('[data-validar]'));
  let intentado = false;

  /** El mensaje que le toca a un campo, o '' si está bien. */
  function mensaje(c: Campo): string {
    const v = c.validity;
    if (v.valueMissing) return c.dataset.faltaMsg ?? '';
    if (v.typeMismatch) return c.dataset.formatoMsg ?? '';
    return '';
  }

  /** Pinta (o quita) el error de un campo. Devuelve el mensaje. */
  function marcar(c: Campo): string {
    const texto = mensaje(c);
    const caja = document.getElementById(`${c.id}-error`);
    if (caja) {
      caja.textContent = texto;
      caja.hidden = texto === '';
    }
    if (texto) c.setAttribute('aria-invalid', 'true');
    else c.removeAttribute('aria-invalid');
    return texto;
  }

  /* Quitar y poner, en momentos distintos (10/10). Si el error de un campo
     se quitara al SALIR de él, todo lo de debajo subiría un renglón justo
     cuando la persona está pulsando lo siguiente, y el clic caería en otro
     sitio: pasó con la casilla de privacidad. Así que el error se QUITA
     mientras escribe, en cuanto el campo está bien, y al salir solo se PONE
     o se cambia. */
  for (const c of campos) {
    c.addEventListener('input', () => {
      if (intentado && c.getAttribute('aria-invalid') === 'true' && mensaje(c) === '') marcar(c);
    });
    c.addEventListener('blur', () => {
      if (intentado && mensaje(c) !== '') marcar(c);
    });
    // La casilla no tiene «salir»: se corrige al marcarla.
    if (c instanceof HTMLInputElement && c.type === 'checkbox') {
      c.addEventListener('change', () => {
        if (intentado) marcar(c);
      });
    }
  }

  form.addEventListener('submit', (e) => {
    intentado = true;
    const errores = campos
      .map((c) => ({ c, texto: marcar(c) }))
      .filter((x) => x.texto !== '');

    e.preventDefault();
    if (errores.length === 0) {
      if (resumen) resumen.hidden = true;
      enviar();
      return;
    }

    if (!resumen || !lista) {
      errores[0].c.focus();
      return;
    }
    lista.replaceChildren(
      ...errores.map(({ c, texto }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${c.id}`;
        a.textContent = texto;
        // El enlace lleva el foco AL CAMPO, no solo el scroll: un ancla
        // a un <input> mueve la vista pero no siempre el foco.
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          c.focus();
        });
        li.append(a);
        return li;
      }),
    );
    resumen.hidden = false;
    // El foco va al TITULAR del resumen (tabindex="-1"), no a la caja: un
    // <div> sin tabindex no lo admite y el foco se quedaría en el botón.
    resumen.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
  });

  /* El envío. Un solo intento a la vez: pulsar dos veces no manda dos
     correos. El botón no se desactiva (un botón desactivado pierde el foco y
     no explica por qué); simplemente se ignora el segundo clic. */
  let enviando = false;
  async function enviar() {
    if (enviando) return;
    enviando = true;
    if (errorEnvio) errorEnvio.hidden = true;
    let bien = false;
    try {
      const f = await pedirFicha();
      if (f) {
        const datos = new FormData(form);
        datos.set('cf-turnstile-response', f);
        const r = await fetch(form.action, { method: 'POST', body: datos, headers: { accept: 'application/json' } });
        const cuerpo = await r.json().catch(() => ({}));
        bien = r.ok && cuerpo.ok === true;
      }
    } catch {
      bien = false;
    } finally {
      enviando = false;
      // La ficha ya se ha gastado (o ha fallado): se pide otra para el
      // siguiente intento.
      ficha = '';
      if (widget !== undefined) window.turnstile?.reset(widget);
    }

    if (bien && confirmacion) {
      const correo = (form.elements.namedItem('correo') as HTMLInputElement | null)?.value ?? '';
      const hueco = confirmacion.querySelector('[data-confirmacion-correo]');
      if (hueco) hueco.textContent = correo;
      form.hidden = true;
      confirmacion.hidden = false;
      confirmacion.focus();
    } else if (errorEnvio) {
      errorEnvio.hidden = false;
      errorEnvio.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
    }
  }

}

document.querySelectorAll<HTMLFormElement>('form[data-formulario]').forEach(iniciar);

export {};
