/* ---------------------------------------------------------------------------
   Itza en la página de Contacto (08/11/2026).

   Itza ayuda a contar el proyecto y deja el mensaje ESCRITO en el formulario
   de siempre; quien escribe lo revisa, pone su nombre y su correo y lo envía
   con «Enviar mensaje». Itza no envía nada (3.3.4: lo que se manda se puede
   revisar y corregir antes).

   · Solo se enseña si el Worker tiene la clave (GET /api/itza-contacto).
     Sin JS, sin clave o si la consulta falla, la página es la de siempre.
   · Cada línea entra en un role="log": el lector la anuncia sin que el foco
     se mueva del campo. Quién habla va escrito para el lector («Tú:»,
     «Itza:») y a la vista lo dicen el lado y el color.
   · Al terminar, el resumen va al campo «Tu mensaje» (si estaba vacío; si
     no, debajo de lo que hubiera) y la organización, si se dijo, a su campo.
     Aparece un botón que lleva al formulario y el campo de Itza se retira;
     como tenía el foco, el foco pasa a ese botón.
   · Tope de 8 preguntas, como el Worker.
   --------------------------------------------------------------------------- */

interface Textos {
  bienvenida: string; escribiendo: string; error: string; limite: string; revisar: string;
  tu: string; yo: string; lang: 'es' | 'ca' | 'en';
}
interface Mensaje { role: 'user' | 'assistant'; content: string }
interface Respuesta { reply?: string; listo?: boolean; resumen?: string; organizacion?: string }

const TOPE = 8;
const API = '/api/itza-contacto';

async function iniciar() {
  const caja = document.querySelector<HTMLElement>('[data-itza-contacto]');
  if (!caja) return;
  try {
    const r = await fetch(API, { headers: { accept: 'application/json' } });
    const d = (await r.json()) as { disponible?: boolean };
    if (!r.ok || !d.disponible) return;
  } catch {
    return;
  }

  const T = JSON.parse(caja.dataset.itzaContacto ?? '{}') as Textos;
  const log = caja.querySelector<HTMLElement>('[data-itza-log]')!;
  const form = caja.querySelector<HTMLFormElement>('[data-itza-form]')!;
  const campo = form.querySelector('textarea')!;
  const enviar = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const logo = caja.querySelector<HTMLImageElement>('.itza__titulo .logo-itza');
  const historia: Mensaje[] = [];
  let ocupado = false;
  let terminado = false;

  function linea(texto: string, quien: 'tu' | 'yo') {
    const p = document.createElement('p');
    p.className = quien;
    const etiqueta = document.createElement('span');
    etiqueta.className = 'sr-only';
    etiqueta.textContent = `${quien === 'tu' ? T.tu : T.yo} `;
    p.append(etiqueta);
    /* «Itza» con su logo también aquí, como en el resto de la página. */
    texto.split(/(Itza)/).forEach((trozo) => {
      if (trozo === 'Itza' && logo) p.append(logo.cloneNode() as HTMLImageElement);
      else if (trozo) p.append(document.createTextNode(trozo));
    });
    log.append(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  /* El mensaje, al formulario de verdad. Se lanza `input` para que el
     formulario quite un error que estuviera puesto. */
  function alFormulario(resumen: string, organizacion: string) {
    const mensaje = document.querySelector<HTMLTextAreaElement>('#mensaje');
    const org = document.querySelector<HTMLInputElement>('#organizacion');
    if (mensaje) {
      mensaje.value = mensaje.value.trim() ? `${mensaje.value.trim()}\n\n${resumen}` : resumen;
      mensaje.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (org && organizacion && !org.value.trim()) {
      org.value = organizacion;
      org.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const ir = document.createElement('button');
    ir.type = 'button';
    ir.className = 'itza__ir';
    ir.textContent = T.revisar;
    ir.addEventListener('click', () => {
      const destino = document.querySelector<HTMLElement>('#nombre') ?? mensaje;
      destino?.focus();
      destino?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    log.append(ir);
    log.scrollTop = log.scrollHeight;
    /* La conversación ha terminado: el campo de Itza ya no sirve y se
       retira. Tenía el foco, así que el foco pasa al paso siguiente, el
       botón que lleva al formulario (si no, caería al principio de la
       página). */
    form.hidden = true;
    ir.focus({ preventScroll: true });
    /* Con el campo retirado la caja cambia de alto: el final de la
       conversación (y el botón) a la vista, entero. */
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
  }

  async function responder(texto: string) {
    const limpio = texto.trim();
    if (!limpio || ocupado || terminado) return;
    if (historia.filter((m) => m.role === 'user').length >= TOPE) { linea(T.limite, 'yo'); return; }
    ocupado = true;
    enviar.disabled = true;
    linea(limpio, 'tu');
    historia.push({ role: 'user', content: limpio });
    campo.value = '';
    const espera = linea(T.escribiendo, 'yo');
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: historia, lang: T.lang }),
      });
      const d = (await r.json().catch(() => ({}))) as Respuesta;
      if (!r.ok || !d.reply) throw new Error(String(r.status));
      espera.remove();
      historia.push({ role: 'assistant', content: d.reply });
      linea(d.reply, 'yo');
      if (d.listo && d.resumen) {
        terminado = true;
        alFormulario(d.resumen, d.organizacion ?? '');
      }
    } catch {
      espera.remove();
      historia.pop();
      linea(T.error, 'yo');
    } finally {
      ocupado = false;
      enviar.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); responder(campo.value); });
  /* Intro responde; Mayúsculas + Intro hace un salto de línea. */
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });

  linea(T.bienvenida, 'yo');
  caja.hidden = false;
}

iniciar();

/* Módulo, no script global: sin esto TypeScript junta sus nombres con los de
   itza-demo.ts (los dos tienen `iniciar` y `TOPE`). */
export {};
