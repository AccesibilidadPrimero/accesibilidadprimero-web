/* ---------------------------------------------------------------------------
   Itza en Contacto (08/11/2026). Itza hace todo el proceso y sustituye al
   formulario (Johnny: «si no, no tiene sentido Itza»), con SU interfaz: la
   barra y la ventana del plugin.

   1. La barra «¿Cómo podemos ayudarte?», abajo del hero, es un campo. La
      conversación no sale hasta que se pregunta algo: entonces se abre la
      ventana encima, la barra se retira y el foco pasa al campo de la
      ventana. La ✕ y Escape la cierran y el foco vuelve a la barra.
   2. Charla: Itza pregunta por el proyecto (/api/itza-contacto, la IA).
      Cuando tiene bastante, devuelve listo + un resumen.
   3. Nombre y correo, juntos, como el formulario del plugin. Los pide la
      página, no la IA: no salen hacia Anthropic, van solo a /api/contacto.
   4. Revisión: lo que va a llegar, a la vista, con «Cambiar algo».
   5. Envío por /api/contacto (Turnstile invisible, Brevo), con via=itza.

   Lo que dice Itza entra en un role="log", que el lector de pantalla
   anuncia sin mover el foco. Cada paso nuevo se lleva el foco a su campo.

   Respaldo: si Itza no está configurada o la API falla, html.sin-itza y
   vuelve la página de siempre con su formulario.
   --------------------------------------------------------------------------- */
import { fichero } from './turnstile';

interface Textos {
  lang: 'es' | 'ca' | 'en';
  escribiendo: string; error: string; pideDatos: string;
  faltaNombre: string; faltaCorreo: string; pideRevision: string; enviado: string;
  tu: string; yo: string; hablar: string; escuchando: string;
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
  const barra = seccion.querySelector<HTMLFormElement>('[data-itza-barra]')!;
  const campoBarra = barra.querySelector('input')!;
  const panel = seccion.querySelector<HTMLElement>('#itza-panel')!;
  const cerrar = panel.querySelector<HTMLButtonElement>('[data-itza-cerrar]')!;
  const log = panel.querySelector<HTMLElement>('[data-itza-log]')!;
  const paso = (n: string) => panel.querySelector<HTMLFormElement>(`[data-paso="${n}"]`)!;
  const charla = paso('charla'), pDatos = paso('datos'), revision = paso('revision');
  const campoCharla = charla.querySelector('input')!;
  const campoNombre = pDatos.querySelector<HTMLInputElement>('#itza-nombre')!;
  const campoCorreo = pDatos.querySelector<HTMLInputElement>('#itza-correo')!;
  const hecho = panel.querySelector<HTMLElement>('[data-itza-hecho]')!;
  const errorEnvio = panel.querySelector<HTMLElement>('[data-itza-error-envio]')!;
  const logo = panel.querySelector<HTMLImageElement>('.itza-chat__firma .logo-itza');
  const turnstile = fichero(
    panel.querySelector<HTMLElement>('[data-itza-turnstile]')!,
    seccion.dataset.sitekey ?? '', seccion.dataset.accion ?? '',
  );

  const historia: Mensaje[] = [];
  const datos = { nombre: '', correo: '', organizacion: '', mensaje: '' };
  let actual: HTMLElement = charla;
  let ocupado = false;

  /* Una burbuja. Quién habla va escrito para el lector de pantalla; a la
     vista lo dicen el lado y el color. «Itza», con su logo. */
  function linea(texto: string, quien: 'tu' | 'itza') {
    const p = document.createElement('p');
    p.className = quien;
    const etiqueta = document.createElement('span');
    etiqueta.className = 'sr-only';
    etiqueta.textContent = `${quien === 'tu' ? T.tu : T.yo} `;
    p.append(etiqueta);
    texto.split(/(Itza)/).forEach((trozo) => {
      if (trozo === 'Itza' && logo) {
        const img = logo.cloneNode() as HTMLImageElement;
        img.removeAttribute('style');
        p.append(img);
      } else if (trozo) p.append(document.createTextNode(trozo));
    });
    log.append(p);
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    return p;
  }

  /* «Escribiendo»: los tres puntos del plugin, y la frase para el lector. */
  function escribiendo() {
    const p = document.createElement('p');
    p.className = 'itza escribiendo';
    const texto = document.createElement('span');
    texto.className = 'sr-only';
    texto.textContent = T.escribiendo;
    p.append(texto);
    for (let i = 0; i < 3; i++) {
      const punto = document.createElement('span');
      punto.className = 'punto';
      p.append(punto);
    }
    log.append(p);
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    return p;
  }

  function mostrar(siguiente: HTMLElement, foco: HTMLElement) {
    for (const f of [charla, pDatos, revision, hecho]) f.hidden = f !== siguiente;
    actual = siguiente;
    foco.focus();
  }

  function focoDelPaso() {
    if (actual === charla) return campoCharla;
    if (actual === pDatos) return campoNombre;
    if (actual === revision) return revision.querySelector<HTMLElement>('h3')!;
    return hecho;
  }

  /* ---- 1. La barra y la ventana ---- */
  function abrir() {
    panel.hidden = false;
    barra.hidden = true;
    /* Turnstile se carga al abrir, no con la página. */
    turnstile.preparar().catch(() => {});
    focoDelPaso().focus();
  }
  function cerrarVentana() {
    panel.hidden = true;
    barra.hidden = false;
    campoBarra.focus();
  }
  barra.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = campoBarra.value.trim();
    /* Vacía, solo reabre una conversación que ya existe. */
    if (!texto && !historia.length) { campoBarra.focus(); return; }
    campoBarra.value = '';
    alEscribir();
    abrir();
    if (texto && actual === charla) preguntar(texto);
  });
  /* Vacía, el micrófono; con texto, enviar (el CSS cambia el botón). */
  const alEscribir = () => barra.classList.toggle('con-texto', campoBarra.value.trim() !== '');
  campoBarra.addEventListener('input', alEscribir);
  cerrar.addEventListener('click', cerrarVentana);
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); cerrarVentana(); }
  });

  /* ---- 2. La charla con la IA ---- */
  function aDatos(r: Respuesta) {
    const delUsuario = historia.filter((m) => m.role === 'user').map((m) => m.content);
    datos.mensaje = (r.resumen ?? '').trim() || delUsuario.join('\n\n');
    datos.organizacion = (r.organizacion ?? '').trim();
    linea(T.pideDatos, 'itza');
    mostrar(pDatos, campoNombre);
  }

  charla.addEventListener('submit', (e) => {
    e.preventDefault();
    preguntar(campoCharla.value);
  });

  async function preguntar(bruto: string) {
    const texto = bruto.trim();
    if (!texto || ocupado) return;
    ocupado = true;
    linea(texto, 'tu');
    historia.push({ role: 'user', content: texto });
    campoCharla.value = '';
    const espera = escribiendo();
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
      /* Listo, o el tope de preguntas: a por los datos. */
      if (d.listo || historia.filter((m) => m.role === 'user').length >= TOPE) aDatos(d);
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
  }

  /* El micrófono, como en el plugin: lo que se dice se escribe en el campo
     y se envía. Usa el reconocimiento de voz del navegador, en el idioma de
     la página. Solo se enseña si el navegador lo tiene. */
  type Reconocimiento = { lang: string; interimResults: boolean; start(): void; stop(): void;
    onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
  const SR = window as unknown as { SpeechRecognition?: new () => Reconocimiento; webkitSpeechRecognition?: new () => Reconocimiento };
  const Constructor = SR.SpeechRecognition ?? SR.webkitSpeechRecognition;
  /* Dos micrófonos: el de la barra y el de la ventana. Cada uno, con lo
     que oye, hace lo mismo que su campo al enviarse. */
  const micros: [HTMLButtonElement, HTMLFormElement, HTMLInputElement][] = [
    [barra.querySelector('[data-itza-voz]')!, barra, campoBarra],
    [charla.querySelector('[data-itza-voz]')!, charla, campoCharla],
  ];
  if (Constructor) {
    const rec = new Constructor();
    rec.lang = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' }[T.lang] ?? 'es-ES';
    rec.interimResults = false;
    let activo: (typeof micros)[number] | null = null;
    const parar = () => {
      if (!activo) return;
      activo[0].classList.remove('escuchando');
      activo[0].querySelector('[data-itza-voz-texto]')!.textContent = T.hablar;
      activo = null;
    };
    rec.onresult = (e) => {
      const m = activo;
      parar();
      if (!m) return;
      m[2].value = e.results[0][0].transcript;
      m[1].requestSubmit();
    };
    rec.onend = parar;
    rec.onerror = parar;
    barra.classList.add('con-voz');
    for (const m of micros) {
      const [voz] = m;
      voz.hidden = false;
      voz.addEventListener('click', () => {
        if (activo) { rec.stop(); parar(); return; }
        activo = m;
        voz.classList.add('escuchando');
        voz.querySelector('[data-itza-voz-texto]')!.textContent = T.escuchando;
        rec.start();
      });
    }
  }

  /* ---- 3. Nombre y correo, sin IA ---- */
  function marcar(campo: HTMLInputElement, mensaje: string) {
    const p = document.getElementById(`${campo.id}-error`)!;
    p.textContent = mensaje;
    p.hidden = !mensaje;
    if (mensaje) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
  }

  pDatos.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();
    marcar(campoNombre, nombre ? '' : T.faltaNombre);
    marcar(campoCorreo, CORREO.test(correo) ? '' : T.faltaCorreo);
    /* El foco, al primero que falla. */
    if (!nombre) { campoNombre.focus(); return; }
    if (!CORREO.test(correo)) { campoCorreo.focus(); return; }
    datos.nombre = nombre;
    datos.correo = correo;
    linea(`${nombre} · ${correo}`, 'tu');
    aRevision();
  });

  /* ---- 4. Revisión ---- */
  const editar = revision.querySelector<HTMLElement>('#itza-editar')!;
  const cambiar = revision.querySelector<HTMLButtonElement>('.itza-chat__cambiar')!;
  const ed = {
    nombre: revision.querySelector<HTMLInputElement>('#itza-e-nombre')!,
    correo: revision.querySelector<HTMLInputElement>('#itza-e-correo')!,
    organizacion: revision.querySelector<HTMLInputElement>('#itza-e-organizacion')!,
    mensaje: revision.querySelector<HTMLTextAreaElement>('#itza-e-mensaje')!,
  };
  const claves = Object.keys(ed) as (keyof typeof ed)[];

  function pintarResumen() {
    for (const k of claves) revision.querySelector<HTMLElement>(`[data-r="${k}"]`)!.textContent = datos[k];
    revision.querySelector<HTMLElement>('[data-r-org]')!.hidden = !datos.organizacion;
  }

  function aRevision() {
    for (const k of claves) ed[k].value = datos[k];
    pintarResumen();
    linea(T.pideRevision, 'itza');
    mostrar(revision, revision.querySelector<HTMLElement>('h3')!);
  }

  function abrirEdicion(campo?: HTMLElement) {
    editar.hidden = false;
    cambiar.setAttribute('aria-expanded', 'true');
    (campo ?? ed.mensaje).focus();
  }
  cambiar.addEventListener('click', () => {
    if (editar.hidden) { abrirEdicion(); return; }
    editar.hidden = true;
    cambiar.setAttribute('aria-expanded', 'false');
  });
  for (const k of claves) {
    ed[k].addEventListener('input', () => { datos[k] = ed[k].value.trim(); pintarResumen(); });
  }

  /* ---- 5. Envío ---- */
  revision.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (ocupado) return;
    /* Si al cambiar algo ha quedado vacío o mal, vuelve a ese campo. */
    if (!datos.nombre) { abrirEdicion(ed.nombre); return; }
    if (!CORREO.test(datos.correo)) { abrirEdicion(ed.correo); return; }
    if (!datos.mensaje) { abrirEdicion(ed.mensaje); return; }
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
      /* La confirmación lleva el foco y se lee al llegar: no va también al
         log, que la anunciaría dos veces. */
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
