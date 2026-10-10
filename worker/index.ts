/**
 * Worker · accesibilidadprimero.com
 *
 * Existe para una sola cosa que un sitio estático no puede hacer: recibir el
 * formulario de contacto. Todo lo demás lo sirve el runtime de assets sin
 * pasar por aquí (wrangler.toml: `run_worker_first` solo para /api/*).
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
 *   TURNSTILE_SECRET   clave secreta del widget de Turnstile
 * Variables (wrangler.toml, [vars]):
 *   CORREO_DESTINO, CORREO_REMITENTE, TURNSTILE_HOSTNAMES
 */
export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  BREVO_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  CORREO_DESTINO?: string;
  CORREO_REMITENTE?: string;
  /** Dominios desde los que se acepta el formulario, separados por comas. */
  TURNSTILE_HOSTNAMES?: string;
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
  const ficha = texto(datos, 'cf-turnstile-response');

  const camposMal =
    !nombre || nombre.length > MAX.nombre ||
    !correo || correo.length > MAX.correo || !CORREO_VALIDO.test(correo) ||
    organizacion.length > MAX.organizacion ||
    !mensaje || mensaje.length > MAX.mensaje ||
    consentimiento !== 'on';
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
    'Enviado desde el formulario de accesibilidadprimero.com/contacto/.',
    'Ha aceptado la política de privacidad. Para contestar, responde a este correo.',
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contacto') {
      if (request.method !== 'POST') {
        return new Response('Método no permitido', { status: 405, headers: { allow: 'POST' } });
      }
      return contacto(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
