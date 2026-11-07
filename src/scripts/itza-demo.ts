/* ---------------------------------------------------------------------------
   La demo de Itza en su landing (07/11/2026).

   Una conversación de verdad con /api/chat (itza-worker/index.ts), con lo
   que el caso de estudio dice que hace Itza:
   · <dialog> con showModal(): la página queda inerte, el foco entra en la
     ventana, Escape la cierra y el foco vuelve a la barra que la abrió.
   · Cada mensaje entra en un role="log": el lector de pantalla lo anuncia
     sin que el foco se mueva del campo de texto.
   · Primero pregunta cómo llamarte; después ofrece las preguntas sugeridas,
     que se recogen al hacer la primera pregunta.
   · Voz solo en castellano, como el plugin (es-ES): se puede hablar y
     escuchar la respuesta. Los botones solo salen si el navegador lo admite.
   · Un tope de mensajes: es una demo, y cada respuesta cuesta una llamada a
     la API. El Worker pone el mismo tope.

   Sin JavaScript la barra no se pinta y la página dice cómo ver Itza.
   --------------------------------------------------------------------------- */

interface Textos {
  bienvenida: string; escribiendo: string; error: string; hablar: string; escuchando: string;
  tu: string; itza: string; limite: string; lang: 'es' | 'ca' | 'en'; voz: boolean;
}
interface Mensaje { role: 'user' | 'assistant'; content: string }

const TOPE = 12;

function iniciar() {
  const dialogo = document.querySelector<HTMLDialogElement>('[data-itza-chat]');
  const abrir = document.querySelector<HTMLButtonElement>('[data-itza-abrir]');
  if (!dialogo || !abrir || typeof dialogo.showModal !== 'function') return;

  const T = JSON.parse(dialogo.dataset.itzaChat ?? '{}') as Textos;
  const log = dialogo.querySelector<HTMLElement>('[data-itza-log]')!;
  const form = dialogo.querySelector<HTMLFormElement>('[data-itza-form]')!;
  const campo = form.querySelector('textarea')!;
  const enviar = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const sugerencias = dialogo.querySelector<HTMLElement>('[data-itza-sugerencias]')!;
  const cerrar = dialogo.querySelector<HTMLButtonElement>('[data-itza-cerrar]')!;
  const botonHablar = dialogo.querySelector<HTMLButtonElement>('[data-itza-hablar]')!;
  const botonLeer = dialogo.querySelector<HTMLButtonElement>('[data-itza-leer]')!;

  const historia: Mensaje[] = [];
  let ocupado = false;
  let empezada = false;

  /* Una línea en la conversación. Quién habla va escrito para el lector de
     pantalla («Tú:», «Itza:»); a la vista lo dice la posición y el color. */
  function linea(texto: string, quien: 'tu' | 'itza') {
    const p = document.createElement('p');
    p.className = quien;
    const etiqueta = document.createElement('span');
    etiqueta.className = 'sr-only';
    etiqueta.textContent = `${quien === 'tu' ? T.tu : T.itza} `;
    p.append(etiqueta, document.createTextNode(texto));
    log.append(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  abrir.hidden = false;
  abrir.addEventListener('click', () => {
    dialogo.showModal();
    if (!empezada) { empezada = true; linea(T.bienvenida, 'itza'); }
    campo.focus();
  });
  cerrar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('close', () => { window.speechSynthesis?.cancel(); abrir.focus(); });

  async function preguntar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || ocupado) return;
    if (historia.filter((m) => m.role === 'user').length >= TOPE) { linea(T.limite, 'itza'); return; }
    ocupado = true;
    enviar.disabled = true;
    /* Las sugeridas, solo hasta la primera pregunta: en el móvil se comían
       la conversación. */
    if (historia.length >= 2) sugerencias.hidden = true;
    linea(limpio, 'tu');
    historia.push({ role: 'user', content: limpio });
    campo.value = '';
    const espera = linea(T.escribiendo, 'itza');
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: historia, lang: T.lang }),
      });
      const datos = (await r.json().catch(() => ({}))) as { reply?: string };
      if (!r.ok || !datos.reply) throw new Error(String(r.status));
      espera.remove();
      historia.push({ role: 'assistant', content: datos.reply });
      linea(datos.reply, 'itza');
      if (botonLeer.getAttribute('aria-pressed') === 'true') leer(datos.reply);
      /* Las sugeridas, después de la primera respuesta: la del nombre. */
      if (historia.length === 2) sugerencias.hidden = false;
    } catch {
      espera.remove();
      historia.pop();
      linea(T.error, 'itza');
    } finally {
      ocupado = false;
      enviar.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); preguntar(campo.value); });
  /* Intro envía; Mayúsculas + Intro hace un salto de línea. */
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  sugerencias.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) { preguntar(b.textContent ?? ''); campo.focus(); }
  });

  /* ---- Voz, solo en castellano ---- */
  function leer(texto: string) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    speechSynthesis.speak(u);
  }
  if (T.voz && 'speechSynthesis' in window) {
    botonLeer.hidden = false;
    botonLeer.addEventListener('click', () => {
      const activo = botonLeer.getAttribute('aria-pressed') === 'true';
      botonLeer.setAttribute('aria-pressed', String(!activo));
      if (activo) speechSynthesis.cancel();
    });
  }
  type Reconocimiento = { lang: string; interimResults: boolean; start(): void; stop(): void;
    onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
  const SR = (window as unknown as { SpeechRecognition?: new () => Reconocimiento; webkitSpeechRecognition?: new () => Reconocimiento });
  const Constructor = SR.SpeechRecognition ?? SR.webkitSpeechRecognition;
  if (T.voz && Constructor) {
    const rec = new Constructor();
    rec.lang = 'es-ES';
    rec.interimResults = false;
    let escuchando = false;
    const parar = () => { escuchando = false; botonHablar.textContent = T.hablar; };
    rec.onresult = (e) => { parar(); preguntar(e.results[0][0].transcript); };
    rec.onend = parar;
    rec.onerror = parar;
    botonHablar.hidden = false;
    botonHablar.addEventListener('click', () => {
      if (escuchando) { rec.stop(); parar(); return; }
      escuchando = true;
      botonHablar.textContent = T.escuchando;
      rec.start();
    });
  }
}

iniciar();
