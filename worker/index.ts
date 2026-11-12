/**
 * Worker · accesibilidadprimero.com
 *
 * Existe para lo que un sitio estático no puede hacer: recibir el
 * formulario de contacto y, desde el 08/11/2026, dar voz a Itza en esa misma
 * página (/api/itza-contacto, más abajo). Todo lo demás lo sirve el runtime
 * de assets sin pasar por aquí (wrangler.toml: `run_worker_first` solo para
 * /api/*).
 *
 * El recorrido de un mensaje (Johnny, 10/10/2026: Worker + Brevo):
 *
 *   1. El navegador envía el formulario con la ficha de Turnstile.
 *   2. Aquí se comprueban los campos (otra vez: lo que valida el navegador no
 *      cuenta, cualquiera puede saltárselo).
 *   3. Se canjea la ficha en Cloudflare (siteverify). Sin `success`, sin la
 *      acción `contacto` o desde un dominio que no es el nuestro: fuera.
 *   4. Se manda el correo con Brevo a proyectos@, con «Responder a» puesto en
 *      el correo de quien escribe: contestar es darle a Responder.
 *
 * Turnstile en modo invisible, NO un CAPTCHA visual: un reto que hay que
 * resolver es una barrera de accesibilidad, y en esta web sería
 * contradictorio.
 *
 * Si falta un secreto, el endpoint responde 503 y no envía nada. Falla
 * cerrado, nunca abierto.
 *
 * Secretos (panel de Cloudflare → Worker → Settings → Variables and Secrets):
 *   BREVO_API_KEY      clave de API de Brevo
 *   ANTHROPIC_API_KEY  Itza en Contacto; sin ella, Itza no sale en la página
 *   TURNSTILE_SECRET   clave secreta del widget de Turnstile
 * Variables (wrangler.toml, [vars]):
 *   CORREO_DESTINO, CORREO_REMITENTE, TURNSTILE_HOSTNAMES
 */
import { hostSinIndexar } from '../src/data/sitio.ts';
import { llamarClaude, validarConversacion } from '../itza-worker/claude.ts';
import { registrarVisita, cambiarConteo, type BaseD1 } from './visitas.ts';
export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  BREVO_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  CORREO_DESTINO?: string;
  CORREO_REMITENTE?: string;
  /** Dominios desde los que se acepta el formulario, separados por comas. */
  TURNSTILE_HOSTNAMES?: string;
  /** Itza en Contacto (08/11/2026). Sin la clave, Itza no se enseña. */
  ANTHROPIC_API_KEY?: string;
  ITZA_MODELO?: string;
  /** Contador de visitas propio (11/11/2026, worker/visitas.ts). */
  VISITAS?: BaseD1;
}

const ACCION = 'contacto';
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const BREVO = 'https://api.brevo.com/v3/smtp/email';

/* Topes de longitud. No son de diseño: evitan que alguien use el formulario
   para mandar un libro o reventar el asunto del correo. */
const MAX = { nombre: 200, correo: 254, organizacion: 200, mensaje: 5000 } as const;

/* Lo justo para saber que hay una arroba y un dominio con punto. La prueba de
   verdad es que la respuesta llegue. */
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Motivo = 'campos' | 'verificacion' | 'envio' | 'configuracion' | 'origen';

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
const fallo = (motivo: Motivo, status: number) => json({ ok: false, motivo }, status);

/** Lista de dominios permitidos a partir de la variable. */
const dominios = (env: Env) =>
  new Set((env.TURNSTILE_HOSTNAMES ?? '').split(',').map((d) => d.trim()).filter(Boolean));

/** Texto de un campo, sin espacios sobrantes. '' si no viene o no es texto. */
const texto = (datos: FormData, campo: string) => {
  const v = datos.get(campo);
  return typeof v === 'string' ? v.trim() : '';
};

/** Una línea: sin saltos, para el asunto y el nombre del «Responder a». */
const unaLinea = (s: string) => s.replace(/[\r\n]+/g, ' ');

export async function contacto(request: Request, env: Env): Promise<Response> {
  const permitidos = dominios(env);
  if (!env.BREVO_API_KEY || !env.TURNSTILE_SECRET || !env.CORREO_DESTINO || !env.CORREO_REMITENTE || permitidos.size === 0) {
    return fallo('configuracion', 503);
  }

  /* El formulario solo se envía desde nuestras páginas. Un navegador siempre
     manda `Origin` en un POST; si no coincide, la petición viene de otro
     sitio. */
  const origen = request.headers.get('origin');
  let hostOrigen = '';
  try { hostOrigen = origen ? new URL(origen).hostname : ''; } catch { /* origen ilegible */ }
  if (!permitidos.has(hostOrigen)) return fallo('origen', 403);

  let datos: FormData;
  try {
    datos = await request.formData();
  } catch {
    return fallo('campos', 400);
  }

  const nombre = texto(datos, 'nombre');
  const correo = texto(datos, 'correo');
  const organizacion = texto(datos, 'organizacion');
  const mensaje = texto(datos, 'mensaje');
  const consentimiento = texto(datos, 'consentimiento');
  /* Por Itza no hay casilla (Johnny, 08/11/2026: «Nada de la política de
     privacidad, que funcione tal cual Itza»). La base para contestar es que
     la persona lo pide (RGPD 6.1.b, medidas precontractuales), no un
     consentimiento; el formulario de respaldo sigue con su casilla. */
  const porItza = texto(datos, 'via') === 'itza';
  const ficha = texto(datos, 'cf-turnstile-response');

  const camposMal =
    !nombre || nombre.length > MAX.nombre ||
    !correo || correo.length > MAX.correo || !CORREO_VALIDO.test(correo) ||
    organizacion.length > MAX.organizacion ||
    !mensaje || mensaje.length > MAX.mensaje ||
    (!porItza && consentimiento !== 'on');
  if (camposMal) return fallo('campos', 400);

  /* Siteverify, en la forma canónica de Cloudflare. Cualquier cosa rara —red
     caída, respuesta que no es JSON, acción o dominio que no cuadran— cuenta
     como no verificado. Las fichas son de un solo uso: una repetida falla. */
  if (!ficha || ficha.length > 2048) return fallo('verificacion', 403);
  let resultado: { success?: boolean; action?: string; hostname?: string };
  try {
    const r = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: ficha,
        remoteip: request.headers.get('cf-connecting-ip') ?? '',
      }),
    });
    if (!r.ok) throw new Error(`siteverify respondió ${r.status}`);
    resultado = await r.json();
  } catch (e) {
    console.error('[contacto] siteverify no responde:', String(e));
    return fallo('verificacion', 403);
  }
  if (resultado.success !== true || resultado.action !== ACCION || !permitidos.has(resultado.hostname ?? '')) {
    /* Al registro va el porqué (los códigos de error de Cloudflare, la acción
       y el dominio), nunca la ficha ni nada de lo que escribió la persona. */
    console.error('[contacto] Turnstile rechaza:', JSON.stringify({
      success: resultado.success,
      codigos: (resultado as { 'error-codes'?: string[] })['error-codes'],
      accion: resultado.action,
      dominio: resultado.hostname,
    }));
    return fallo('verificacion', 403);
  }

  /* El correo. Solo texto, sin HTML: nada de lo que escriba alguien llega a
     interpretarse como marcado en el buzón. */
  const cuerpo = [
    `Nombre: ${nombre}`,
    `Correo: ${correo}`,
    `Organización o proyecto: ${organizacion || '(no lo ha indicado)'}`,
    '',
    mensaje,
    '',
    '-- ',
    porItza
      ? 'Enviado con Itza desde accesibilidadprimero.com/contacto/. Para contestar, responde a este correo.'
      : 'Enviado desde el formulario de accesibilidadprimero.com/contacto/.',
    ...(porItza ? [] : ['Ha aceptado la política de privacidad. Para contestar, responde a este correo.']),
  ].join('\n');

  try {
    const r = await fetch(BREVO, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        sender: { name: 'Web de Accesibilidad Primero', email: env.CORREO_REMITENTE },
        to: [{ email: env.CORREO_DESTINO }],
        replyTo: { email: correo, name: unaLinea(nombre) },
        subject: `Contacto web · ${unaLinea(nombre)}`,
        textContent: cuerpo,
      }),
    });
    if (!r.ok) {
      /* Brevo explica el fallo en su respuesta ({ code, message }): clave no
         válida, cuenta sin activar, IP no autorizada, remitente sin
         verificar… Se apunta en el registro del Worker (Observability) para
         no tener que adivinarlo. Brevo no devuelve la clave ni el mensaje, así
         que en el registro no queda nada privado. */
      const detalle = await r.text().catch(() => '');
      throw new Error(`Brevo respondió ${r.status}: ${detalle.slice(0, 300)}`);
    }
  } catch (e) {
    console.error('[contacto] el envío falla:', String(e));
    return fallo('envio', 502);
  }

  return json({ ok: true });
}

/* ------------------------------------------------------------------------
   Itza en Contacto (Johnny, 08/11/2026: «algo más inteligente e intuitivo
   que un formulario aburrido»). Itza hace tres o
   cuatro preguntas y prepara el mensaje; después la página pide el nombre y
   el correo (sin pasar por la IA), enseña el mensaje para revisarlo y lo
   envía por el camino de siempre (/api/contacto, con Turnstile y Brevo).
   Johnny, 08/11/2026: Itza hace todo el proceso y sustituye al formulario,
   que queda como respaldo si Itza no está disponible.

   GET  /api/itza-contacto  → { disponible }: la página solo enseña a Itza si
                              el Worker tiene la clave. Así no sale un chat
                              roto mientras no esté configurado.
   POST /api/itza-contacto  → { reply, listo, resumen?, organizacion? }

   Nombre y correo NO pasan por aquí: los pide la página, no la IA. Lo que se escribe a Itza va a la API de Anthropic (dicho en
   la página y en la política de privacidad) y aquí no se guarda.
   ------------------------------------------------------------------------ */
const ITZA_TOPE_PREGUNTAS = 8;
const ITZA_TOPE_TEXTO = 1200;
const ITZA_IDIOMA = { es: 'castellano', ca: 'catalán', en: 'inglés' } as const;

/* Sin enlaces en Contacto (Johnny, 08/11/2026: «quizás sea mejor no poner
   links en la conversación de contacto, despistan; si contactan, ya saben lo
   que quieren»). El mapa de src/data/itza-mapa.ts queda para la versión de
   Itza en toda la web. */

const ITZA_SISTEMA = `Eres Itza, la asistente de Accesibilidad Primero, un estudio de diseño y accesibilidad digital de Valencia. Estás en su página de Contacto. Tu trabajo es ayudar a la persona a contar su proyecto para que el equipo le responda bien. No vendes ni das presupuestos.

La persona empieza escribiendo en una barra que dice «¿Cómo podemos ayudarte?», así que su primer mensaje responde a eso. Si pregunta algo sobre el estudio, contéstalo en una frase si lo sabes y sigue. Sin enlaces ni direcciones web: quien llega aquí ya sabe lo que quiere y un enlace le saca de la conversación (Johnny, 08/11/2026).

Cuando la persona dice qué necesita y es uno de los servicios (una web, una auditoría, formación), responde con una sola frase que la invite a seguir, en esta forma: «Si quieres recibir más información sobre nuestras formaciones, cuéntanos un poco más y te escribimos.» (cambia «nuestras formaciones» por «nuestras auditorías» o «el diseño y desarrollo de webs» según el caso) y sigue con tu siguiente pregunta. No repitas lo que ha dicho ni resumas el servicio.

Si solo quiere el correo o contactar sin más (por ejemplo «quiero contactar», «¿cuál es vuestro email?», «¿me podéis llamar?»): dale el correo, proyectos@accesibilidadprimero.com, y dile en la misma frase que, si quiere, también puede dejar aquí su mensaje y su contacto en un momento. Si dice que sí, sigue con las preguntas. Si dice que no, o que solo quiere que le escriban, termina ya (listo) con un resumen corto de lo que haya dicho, aunque sea una frase. No hay teléfono que dar: si pide que le llamen, dile que puede pedirlo en el mensaje.

Haz estas preguntas, de una en una y con pocas palabras, saltándote lo que la persona ya haya contado:
1. Qué hace su organización o su proyecto.
2. Qué necesita: una web nueva o rediseñar la que tiene, una auditoría de accesibilidad, formación para su equipo, documentos accesibles, trabajo en marca blanca para una agencia, una colaboración u otra cosa.
3. Si quiere añadir algo más. Si dice que sí, lee lo que añade y termina (listo): no vuelvas a preguntar si quiere añadir algo.
Como mucho tres preguntas. No preguntes por plazos, subvenciones, licitaciones ni normativa: casi nadie lo sabe y no hace falta para contactar. Si la persona quiere terminar antes, termina.

No pidas nombre, correo, teléfono ni otros datos personales: la página los pide después, sin pasar por ti. Si los escribe, no los repitas ni los pongas en el resumen.
Nunca des precios, plazos de entrega ni compromisos: el equipo responde con una propuesta. Si pregunta por precios, no digas que no los hay: las tarifas de las auditorías están publicadas en el apartado Qué hacemos de la web (nómbralo, sin enlace), y para una propuesta a su medida le escribe el equipo; luego sigue con tu pregunta. No inventes nada sobre el estudio. Si te preguntan algo que no sabes, dilo y sigue.
Lenguaje claro, frases cortas, sin rellenos de cortesía, sin markdown y sin el masculino genérico cuando haya una alternativa natural.
Trata a la persona de tú, en segunda persona del singular, siempre: «¿Qué hace tu organización?», «¿Quieres añadir algo?». Nunca «vosotros», «vuestra», «tenéis» ni «usted», aunque hable en nombre de un equipo. En catalán, «tu» («la teva organització»); en inglés, «you».
No empieces con rellenos ni valoraciones: nada de «Perfecto», «Perfecte», «Genial», «Estupendo», «Claro», «Great» ni «Gracias», «Gracias por contarlo» o «Gracias por la información» al principio de cada respuesta. La primera palabra de cada respuesta ya es la pregunta o el dato. Solo das las gracias una vez, al terminar (listo: true).

Responde SIEMPRE con un único objeto JSON y nada más:
Mientras preguntas: {"respuesta": "tu pregunta", "listo": false, "opciones": ["…"]}
"opciones" son las respuestas cortas que la persona puede pulsar en vez de escribir: ["Sí", "No"] si la pregunta es de sí o no; si es de elegir, de 2 a 5 opciones de pocas palabras (por ejemplo, para qué necesita: ["Una web nueva", "Rediseñar mi web", "Una auditoría", "Formación", "Una colaboración"]). Si la respuesta tiene que escribirla (qué hace su organización, por ejemplo), no pongas "opciones". En el idioma de la persona.
Cuando tengas lo necesario: {"respuesta": "Gracias." (la página no la enseña: ella misma da las gracias y pide los datos; nunca pongas aquí una pregunta), "listo": true, "resumen": "el mensaje para el equipo, en primera persona, como si lo escribiera la persona («Somos…», «Queremos…», nunca «Quiere…» ni «Es una…»), sin datos personales y sin repetir la misma idea. SOLO lo que la persona ha dicho, con sus datos: no añadas deseos, preguntas ni frases que no haya escrito, aunque suenen naturales. Si ha dicho poco, el resumen es corto: una frase vale", "organizacion": "el NOMBRE PROPIO de su organización o proyecto, solo si lo ha escrito (por ejemplo «Fundación Ejemplo»); una descripción como «una fundación cultural de Barcelona» no es un nombre: entonces cadena vacía"}`;

/* La respuesta del modelo, leída con cuidado: si no es el JSON pedido, se
   usa el texto tal cual como una pregunta más. */
function leerItza(texto: string, lang: 'es' | 'ca' | 'en') {
  const a = texto.indexOf('{'), b = texto.lastIndexOf('}');
  try {
    const d = JSON.parse(texto.slice(a, b + 1)) as { respuesta?: unknown; listo?: unknown; resumen?: unknown; organizacion?: unknown };
    if (typeof d.respuesta !== 'string' || !d.respuesta.trim()) throw new Error('sin respuesta');
    const listo = d.listo === true && typeof d.resumen === 'string' && d.resumen.trim().length > 0;
    /* Las respuestas rápidas: solo texto corto, como mucho cinco. */
    const opciones = !listo && Array.isArray((d as { opciones?: unknown }).opciones)
      ? ((d as { opciones: unknown[] }).opciones).filter((o): o is string => typeof o === 'string')
          .map((o) => o.trim()).filter((o) => o && o.length <= 40).slice(0, 5)
      : [];
    return {
      reply: d.respuesta.trim(),
      listo,
      ...(opciones.length ? { opciones } : {}),
      ...(listo ? {
        resumen: String(d.resumen).trim().slice(0, MAX.mensaje),
        organizacion: typeof d.organizacion === 'string' ? d.organizacion.trim().slice(0, MAX.organizacion) : '',
      } : {}),
    };
  } catch {
    /* JSON roto (pasó el 08/11/2026: el modelo dejó la dirección del
       apartado suelta dentro del objeto). Nunca se enseña el JSON a quien
       escribe: se rescata «respuesta» y las direcciones del mapa que haya
       por el texto. Si no hay nada que rescatar y parece JSON, una frase
       neutra; si no parece JSON, el texto tal cual. */
    const m = texto.match(/"respuesta"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    let respuesta = '';
    try { respuesta = m ? (JSON.parse(`"${m[1]}"`) as string).trim() : ''; } catch { respuesta = ''; }
    if (!respuesta && !texto.trim().startsWith('{')) return { reply: texto.trim(), listo: false };
    /* Sin enlaces en Contacto: las direcciones sueltas no se recuperan. */
    const reply = respuesta || ITZA_SIN_RESPUESTA[lang];
    return { reply, listo: false };
  }
}

/* Si la respuesta del modelo no se puede leer, esto, en vez del JSON. */
const ITZA_SIN_RESPUESTA = {
  es: 'Perdona, no te he entendido bien. ¿Me lo cuentas de otra manera?',
  ca: 'Perdona, no t’he entès bé. M’ho expliques d’una altra manera?',
  en: 'Sorry, I didn’t quite get that. Could you put it another way?',
} as const;

export async function itzaContacto(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') return json({ disponible: Boolean(env.ANTHROPIC_API_KEY) });
  if (request.method !== 'POST') return new Response('Método no permitido', { status: 405, headers: { allow: 'GET, POST' } });
  const url = new URL(request.url);
  if (request.headers.get('origin') !== url.origin) return json({ ok: false, motivo: 'origen' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ ok: false, motivo: 'configuracion' }, 503);

  const datos = validarConversacion(await request.json().catch(() => null), { topePreguntas: ITZA_TOPE_PREGUNTAS, topeTexto: ITZA_TOPE_TEXTO });
  if (!datos) return json({ ok: false, motivo: 'conversacion' }, 400);

  const texto = await llamarClaude(env.ANTHROPIC_API_KEY, {
    modelo: env.ITZA_MODELO,
    sistema: `${ITZA_SISTEMA}\n\nLa página está en ${ITZA_IDIOMA[datos.lang]}; responde en el idioma en que te escriba la persona.`,
    mensajes: datos.mensajes,
    maxTokens: 700,
    registro: 'itza-contacto',
  });
  if (!texto) return json({ ok: false, motivo: 'api' }, 502);
  return json(leerItza(texto, datos.lang));
}

export default {
  async fetch(request: Request, env: Env, ctx?: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const url = new URL(request.url);

    /* Contador de visitas (11/11/2026). Ver worker/visitas.ts. */
    if (url.pathname === '/api/v') {
      return registrarVisita(request, env.VISITAS, (p) => (ctx ? ctx.waitUntil(p) : void p));
    }
    if (url.pathname === '/api/no-contar' || url.pathname === '/api/contar') {
      return cambiarConteo(request, url.pathname === '/api/contar');
    }

    if (url.pathname === '/api/contacto') {
      if (request.method !== 'POST') {
        return new Response('Método no permitido', { status: 405, headers: { allow: 'POST' } });
      }
      const r = await contacto(request, env);
      /* La web de pruebas no se indexa (public/_headers). Esa regla solo
         cubre los estáticos; lo que responde el Worker lleva la cabecera
         desde aquí. */
      if (hostSinIndexar(url.hostname)) r.headers.set('X-Robots-Tag', 'noindex');
      return r;
    }

    if (url.pathname === '/api/itza-contacto') {
      const r = await itzaContacto(request, env);
      if (hostSinIndexar(url.hostname)) r.headers.set('X-Robots-Tag', 'noindex');
      return r;
    }

    return env.ASSETS.fetch(request);
  },
};
