/* ---------------------------------------------------------------------------
   Itza en Contacto (08/11/2026). Itza hace todo el proceso y sustituye al
   formulario (Johnny: «si no, no tiene sentido Itza»).

   1. La pastilla «Itza · ¿Cómo podemos ayudarte?» es el h1 y un botón de
      desplegar. Al abrirla empieza la conversación y el foco va al campo.
   2. Charla: Itza pregunta por el proyecto (/api/itza-contacto, la IA).
      Cuando tiene bastante, devuelve listo + un resumen.
   3. Nombre y correo: los pide la página, no la IA. No salen hacia
      Anthropic: van solo a /api/contacto, como en el formulario.
   4. Revisión: lo que va a llegar, a la vista, con «Cambiar algo».
   5. Envío por /api/contacto (Turnstile invisible, Brevo), con via=itza.

   Cada paso es un <form> con su etiqueta visible; uno a la vez, y el foco
   va al campo del paso nuevo. Lo que dice Itza entra en un role="log", que
   el lector de pantalla anuncia sin mover el foco.

   Respaldo: si Itza no está configurada o la API falla, html.sin-itza y
   vuelve la página de siempre con su formulario.
   --------------------------------------------------------------------------- */
import { fichero } from './turnstile';

interface Textos {
  lang: 'es' | 'ca' | 'en';
  bienvenida: string; escribiendo: string; error: string;
  pideNombre: string; faltaNombre: string; pideCorreo: string; faltaCorreo: string;
  pideRevision: string; enviado: string; tu: string; yo: string;
}
interface Mensaje { role: 'user' | 'assistant'; content: string }
interface Respuesta { reply?: string; listo?: boolean; resumen?: string; organizacion?: string }

/* El mismo tope que el Worker (ITZA_TOPE_PREGUNTAS). */
const TOPE = 8;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sinItza() {
  document.documentElement.classList.add('sin-itza');
}

async function iniciar() {
  const seccion = document.querySelector<HTMLElement>('[data-itza-contacto]');
  if (!seccion) return;

  /* ¿Está Itza? Si no, la página de siempre. */
  const disponible = await fetch('/api/itza-contacto')
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { disponible?: boolean } | null) => Boolean(d?.disponible))
    .catch(() => false);
  if (!disponible) { sinItza(); return; }

  const T = JSON.parse(seccion.dataset.itzaContacto ?? '{}') as Textos;
  const pildora = seccion.querySelector<HTMLButtonElement>('#itza-pildora')!;
  const panel = seccion.querySelector<HTMLElement>('#itza-panel')!;
  const log = seccion.querySelector<HTMLElement>('[data-itza-log]')!;
  const paso = (n: string) => seccion.querySelector<HTMLFormElement>(`[data-paso="${n}"]`)!;
  const charla = paso('charla'), pNombre = paso('nombre'), pCorreo = paso('correo'), revision = paso('revision');
  const campoCharla = charla.querySelector('textarea')!;
  const campoNombre = pNombre.querySelector('input')!;
  const campoCorreo = pCorreo.querySelector('input')!;
  const hecho = seccion.querySelector<HTMLElement>('[data-itza-hecho]')!;
  const errorEnvio = seccion.querySelector<HTMLElement>('[data-itza-error-envio]')!;
  const logo = pildora.querySelector<HTMLImageElement>('.logo-itza');
  const turnstile = fichero(
    seccion.querySelector<HTMLElement>('[data-itza-turnstile]')!,
    seccion.dataset.sitekey ?? '', seccion.dataset.accion ?? '',
  );

  const historia: Mensaje[] = [];
  const datos = { nombre: '', correo: '', organizacion: '', mensaje: '' };
  let empezada = false;
  let ocupado = false;

  /* Una línea de la conversación. Quién habla va escrito para el lector de
     pantalla; a la vista lo dicen el lado y el fondo. «Itza», con su logo. */
  function linea(texto: string, quien: 'tu' | 'itza') {
    const p = document.createElement('p');
    p.className = quien;
    const etiqueta = document.createElement('span');
    etiqueta.className = 'sr-only';
    etiqueta.textContent = `${quien === 'tu' ? T.tu : T.yo} `;
    p.append(etiqueta);
    texto.split(/(Itza)/).forEach((trozo) => {
      if (trozo === 'Itza' && logo) p.append(logo.cloneNode() as HTMLImageElement);
      else if (trozo) p.append(document.createTextNode(trozo));
    });
    log.append(p);
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    return p;
  }

  function mostrar(siguiente: HTMLFormElement | HTMLElement, foco: HTMLElement) {
    for (const f of [charla, pNombre, pCorreo, revision]) f.hidden = f !== siguiente;
    hecho.hidden = siguiente !== hecho;
    foco.focus();
  }

  /* ---- 1. La pastilla ---- */
  pildora.addEventListener('click', () => {
    /* Turnstile se carga al abrir, no con la página. */
    turnstile.preparar().catch(() => {});
    const abrir = pildora.getAttribute('aria-expanded') !== 'true';
    pildora.setAttribute('aria-expanded', String(abrir));
    panel.hidden = !abrir;
    if (!abrir) return;
    if (!empezada) {
      empezada = true;
      linea(T.bienvenida, 'itza');
    }
    const visible = [campoCharla, campoNombre, campoCorreo].find((c) => !c.closest('form')!.hidden);
    (visible ?? panel.querySelector<HTMLElement>('form:not([hidden]) h2, [data-itza-hecho]:not([hidden])'))?.focus();
  });

  /* ---- 2. La charla con la IA ---- */
  function aNombre(r: Respuesta) {
    const delUsuario = historia.filter((m) => m.role === 'user').map((m) => m.content);
    datos.mensaje = (r.resumen ?? '').trim() || delUsuario.join('\n\n');
    datos.organizacion = (r.organizacion ?? '').trim();
    linea(T.pideNombre, 'itza');
    mostrar(pNombre, campoNombre);
  }

  charla.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = campoCharla.value.trim();
    if (!texto || ocupado) return;
    ocupado = true;
    linea(texto, 'tu');
    historia.push({ role: 'user', content: texto });
    campoCharla.value = '';
    const espera = linea(T.escribiendo, 'itza');
    try {
      const r = await fetch('/api/itza-contacto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: historia, lang: T.lang }),
      });
      const d = (await r.json().catch(() => ({}))) as Respuesta;
      if (!r.ok || !d.reply) throw new Error(String(r.status));
      espera.remove();
      historia.push({ role: 'assistant', content: d.reply });
      linea(d.reply, 'itza');
      /* Listo, o el tope de preguntas: a por el nombre. */
      if (d.listo || historia.filter((m) => m.role === 'user').length >= TOPE) aNombre(d);
      else campoCharla.focus();
    } catch {
      /* La IA no responde: lo dice y deja el formulario de siempre, con lo
         que ya había escrito la persona en el mensaje. */
      espera.remove();
      linea(T.error, 'itza');
      const mensaje = document.querySelector<HTMLTextAreaElement>('#mensaje');
      if (mensaje) mensaje.value = historia.filter((m) => m.role === 'user').map((m) => m.content).join('\n\n');
      setTimeout(() => {
        sinItza();
        document.querySelector<HTMLElement>('#formulario')!.hidden = false;
        document.querySelector<HTMLElement>('#nombre')?.focus();
      }, 2500);
    } finally {
      ocupado = false;
    }
  });
  /* Intro responde; Mayúsculas + Intro hace un salto de línea. */
  campoCharla.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); charla.requestSubmit(); }
  });

  /* ---- 3. Nombre y correo, sin IA ---- */
  function error(form: HTMLFormElement, campo: HTMLInputElement, mensaje: string) {
    const p = form.querySelector<HTMLElement>('.campo__error')!;
    p.textContent = mensaje;
    p.hidden = !mensaje;
    if (mensaje) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    campo.focus();
  }

  pNombre.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = campoNombre.value.trim();
    if (!nombre) { error(pNombre, campoNombre, T.faltaNombre); return; }
    error(pNombre, campoNombre, '');
    datos.nombre = nombre;
    linea(nombre, 'tu');
    linea(T.pideCorreo.replace('{nombre}', nombre), 'itza');
    mostrar(pCorreo, campoCorreo);
  });

  pCorreo.addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = campoCorreo.value.trim();
    if (!CORREO.test(correo)) { error(pCorreo, campoCorreo, T.faltaCorreo); return; }
    error(pCorreo, campoCorreo, '');
    datos.correo = correo;
    linea(correo, 'tu');
    aRevision();
  });

  /* ---- 4. Revisión ---- */
  const editar = revision.querySelector<HTMLElement>('#itza-editar')!;
  const cambiar = revision.querySelector<HTMLButtonElement>('.itza__cambiar')!;
  const e = {
    nombre: revision.querySelector<HTMLInputElement>('#itza-e-nombre')!,
    correo: revision.querySelector<HTMLInputElement>('#itza-e-correo')!,
    organizacion: revision.querySelector<HTMLInputElement>('#itza-e-organizacion')!,
    mensaje: revision.querySelector<HTMLTextAreaElement>('#itza-e-mensaje')!,
  };

  function pintarResumen() {
    for (const k of Object.keys(datos) as (keyof typeof datos)[]) {
      revision.querySelector<HTMLElement>(`[data-r="${k}"]`)!.textContent = datos[k];
    }
    revision.querySelector<HTMLElement>('[data-r-org]')!.hidden = !datos.organizacion;
  }

  function aRevision() {
    for (const k of Object.keys(e) as (keyof typeof e)[]) e[k].value = datos[k];
    pintarResumen();
    linea(T.pideRevision, 'itza');
    mostrar(revision, revision.querySelector<HTMLElement>('h2')!);
  }

  cambiar.addEventListener('click', () => {
    const abrir = editar.hidden;
    editar.hidden = !abrir;
    cambiar.setAttribute('aria-expanded', String(abrir));
    if (abrir) e.mensaje.focus();
  });
  for (const k of Object.keys(e) as (keyof typeof e)[]) {
    e[k].addEventListener('input', () => { datos[k] = e[k].value.trim(); pintarResumen(); });
  }

  /* ---- 5. Envío ---- */
  revision.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (ocupado) return;
    /* Si al cambiar algo ha quedado vacío o mal, vuelve a ese campo. */
    if (!datos.nombre) { editar.hidden = false; cambiar.setAttribute('aria-expanded', 'true'); e.nombre.focus(); return; }
    if (!CORREO.test(datos.correo)) { editar.hidden = false; cambiar.setAttribute('aria-expanded', 'true'); e.correo.focus(); return; }
    if (!datos.mensaje) { editar.hidden = false; cambiar.setAttribute('aria-expanded', 'true'); e.mensaje.focus(); return; }
    ocupado = true;
    errorEnvio.hidden = true;
    const boton = revision.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    boton.disabled = true;
    try {
      const cuerpo = new FormData();
      cuerpo.set('nombre', datos.nombre);
      cuerpo.set('correo', datos.correo);
      cuerpo.set('organizacion', datos.organizacion);
      cuerpo.set('mensaje', datos.mensaje);
      cuerpo.set('via', 'itza');
      cuerpo.set('cf-turnstile-response', await turnstile.pedir());
      const r = await fetch('/api/contacto', { method: 'POST', body: cuerpo, headers: { accept: 'application/json' } });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean };
      if (!r.ok || d.ok !== true) throw new Error(String(r.status));
      /* La confirmación lleva el foco, y se lee al llegar: no va también
         al log, que la anunciaría dos veces. */
      hecho.textContent = T.enviado.replace('{nombre}', datos.nombre).replace('{correo}', datos.correo);
      mostrar(hecho, hecho);
    } catch {
      turnstile.gastada();
      errorEnvio.hidden = false;
      errorEnvio.focus();
    } finally {
      ocupado = false;
      boton.disabled = false;
    }
  });
}

iniciar();

export {};
