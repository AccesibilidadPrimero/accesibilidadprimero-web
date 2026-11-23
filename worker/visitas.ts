/**
 * Contador de visitas propio (Johnny, 11/11/2026).
 *
 * Cloudflare Web Analytics sigue activo, pero no da la ciudad ni deja
 * excluir los navegadores del estudio. Este contador guarda, por cada página
 * vista, lo mínimo para saber DESDE DÓNDE y POR DÓNDE llega la gente:
 *
 *   ts       momento, en milisegundos
 *   ruta     la página (solo el camino, sin parámetros)
 *   ciudad, region, pais
 *            los calcula Cloudflare a partir de la IP en el momento de la
 *            petición (`request.cf`). La IP NO se guarda.
 *   fuente   directo · interna · buscador · redes · ia · enlace
 *   origen   el sitio o la red de la que viene (LinkedIn, google, otraweb.org)
 *   entrada  1 si es la primera página de la visita (no viene de nuestra
 *            propia web), 0 si es un paso dentro de ella
 *
 * Sin cookies ni almacenamiento en el navegador de quien visita y sin
 * identificador: dos páginas vistas no se pueden unir en una persona.
 *
 * La única cookie es la de no contar (`ap_no_contar`), que solo existe en los
 * navegadores donde alguien del estudio abre /api/no-contar. El Worker la lee
 * en la cabecera de la petición; el script de la web no lee nada del
 * navegador.
 *
 * Los datos van a la base D1 `ap-visitas` (binding VISITAS en wrangler.toml)
 * y se borran a los 13 meses. Los lee el panel de analítica de Johnny.
 */

/** Lo justo de D1 que usamos, sin depender de @cloudflare/workers-types. */
export interface BaseD1 {
  prepare(sql: string): { bind(...valores: unknown[]): { run(): Promise<unknown> } };
}

export const COOKIE_NO_CONTAR = 'ap_no_contar';

/** 13 meses: un año completo para comparar más el mes en curso. */
const CONSERVAR_MS = 395 * 24 * 60 * 60 * 1000;

/* Navegadores automáticos: buscadores, comprobaciones, los tests del propio
   repo. Los que no se anuncian ya se quedan fuera porque no ejecutan el
   script que envía la visita. */
const AUTOMATICO = /bot|crawl|spider|slurp|headless|lighthouse|playwright|puppeteer|preview|monitor|curl|wget|python|httpclient/i;

/* Redes de centros de datos (Johnny, 15/11/2026). Robots que abren la web
   con un navegador normal, ejecutan el script y no se anuncian: en el panel
   salían como visitas desde Boardman y Ashburn (Amazon), Council Bluffs
   (Google), Prineville (Meta, vistas previas de enlaces) o Beauharnois
   (OVH). Una persona casi nunca navega desde estas redes. Se mira el número
   de sistema autónomo (ASN) que Cloudflare pone en `request.cf.asn`: dice de
   qué red viene la conexión, no quién es, y no se guarda. */
const CENTROS_DE_DATOS = new Set([
  16509, 14618, 8987, // Amazon (AWS)
  15169, 396982, 19527, 36040, // Google y Google Cloud
  8075, 8068, // Microsoft (Azure)
  32934, 63293, // Meta
  16276, // OVH
  24940, 213230, // Hetzner
  14061, // DigitalOcean
  63949, // Akamai (Linode)
  20473, // Vultr
  31898, // Oracle Cloud
  45102, // Alibaba Cloud
  132203, // Tencent Cloud
  12876, // Scaleway
  51167, // Contabo
  9009, // M247
  212238, // Datacamp
]);

/* Señales del navegador (Johnny, 19/11/2026). La lista de redes se queda
   corta: el 19/11 entraron 13 páginas desde Ashburn, Nueva York y Washington
   en dos minutos, todas directas, con un Chrome completo que esperaba los 5 s
   y desde redes que no están arriba. El script manda tres señales (ver
   src/scripts/visita.ts) y aquí se mira si son de robot. No se guardan.

   La zona horaria es la más útil: un navegador en un servidor suele ir en
   UTC, y si se hace pasar por otra, casi nunca cuadra con la de la ciudad de
   la conexión, que Cloudflare da en `request.cf.timezone`. Se comparan las
   horas, no los nombres, con margen de 2 h: así Canarias contra Madrid o un
   móvil que sale por otra central siguen contando. Quien navega con VPN a
   otro continente o con un navegador que se declara en UTC para no dejar
   huella (Tor, Mullvad) no cuenta: preferimos contar de menos. */
const ZONA_UTC = /^(utc|gmt|etc\/|universal|zulu)/i;
const MARGEN_MIN = 120;

/** Minutos de diferencia con UTC de una zona horaria ahora mismo, o null si no existe. */
export function desfase(zona: string, ahora = new Date()): number | null {
  try {
    const t = new Intl.DateTimeFormat('en-US', { timeZone: zona, timeZoneName: 'longOffset' })
      .formatToParts(ahora).find((p) => p.type === 'timeZoneName')?.value ?? '';
    const m = /GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?$/.exec(t);
    if (!m) return null;
    return m[1] ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0;
  } catch {
    return null;
  }
}

/** Por qué parece un robot, o null si parece una persona. */
export function robot(d: Record<string, unknown>, zonaConexion: string | undefined, ahora = new Date()): string | null {
  if (d.w === 1 || d.w === true) return 'webdriver';
  if (typeof d.l !== 'number' || d.l < 1) return 'sin idiomas';
  const z = typeof d.z === 'string' ? d.z.slice(0, 60) : '';
  if (!z || ZONA_UTC.test(z)) return 'zona UTC';
  const delNavegador = desfase(z, ahora);
  if (delNavegador == null) return 'zona desconocida';
  const deLaConexion = zonaConexion ? desfase(zonaConexion, ahora) : null;
  if (deLaConexion != null && Math.abs(delNavegador - deLaConexion) > MARGEN_MIN) return 'zona no cuadra';
  return null;
}

type Cf = { city?: string; region?: string; country?: string; timezone?: string; asn?: number; asOrganization?: string };

/* Lo que se descarta queda en los registros del Worker (Cloudflare,
   Observabilidad), con la red, para afinar la lista. No va a la base. */
function descartar(motivo: string, cf: Cf) {
  console.log('visitas: fuera', motivo, cf.asn ?? '', cf.asOrganization ?? '', cf.city ?? '');
  return sinContenido();
}

/* Hosts que son nuestra propia web: una visita que viene de aquí es un paso
   dentro de la misma visita, no una entrada. */
const PROPIOS = /(^|\.)accesibilidadprimero\.(eu|com)$|\.workers\.dev$/;

/** Red social por el host del enlace, o por el `utm_source` de la URL. */
const REDES: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$|^linkedin$/, 'LinkedIn'],
  [/(^|\.)instagram\.com$|^ig$|^instagram$/, 'Instagram'],
  [/(^|\.)facebook\.com$|^fb\.me$|^facebook$|^fb$/, 'Facebook'],
  [/(^|\.)threads\.(net|com)$|^threads$/, 'Threads'],
  [/mastodon|(^|\.)fosstodon\.org$|^masto/, 'Mastodon'],
  [/(^|\.)bsky\.app$|^bluesky$/, 'Bluesky'],
  [/^t\.co$|(^|\.)(x|twitter)\.com$|^twitter$|^x$/, 'X'],
  [/(^|\.)youtube\.com$|^youtu\.be$|^youtube$/, 'YouTube'],
  [/(^|\.)whatsapp\.com$|^wa\.me$|^whatsapp$/, 'WhatsApp'],
  [/(^|\.)tiktok\.com$|^tiktok$/, 'TikTok'],
  [/(^|\.)pinterest\.[a-z.]+$|^pin\.it$|^pinterest$/, 'Pinterest'],
  [/(^|\.)telegram\.(org|me)$|^t\.me$|^telegram$/, 'Telegram'],
];

const BUSCADORES = /(^|\.)(google|bing|duckduckgo|ecosia|yahoo|yandex|qwant|startpage|baidu)\.[a-z.]+$|^search\.brave\.com$/;

const IAS: [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$|^chatgpt$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$|^perplexity$/, 'Perplexity'],
  [/(^|\.)claude\.ai$|^claude$/, 'Claude'],
  [/^gemini\.google\.com$|^gemini$/, 'Gemini'],
  [/(^|\.)copilot\.microsoft\.com$|^copilot$/, 'Copilot'],
];

export type Fuente = 'directo' | 'interna' | 'buscador' | 'redes' | 'ia' | 'enlace';

/** El nombre de la lista que encaje, o null. */
const buscar = (lista: [RegExp, string][], valor: string) => lista.find(([re]) => re.test(valor))?.[1] ?? null;

/**
 * De dónde viene una página vista.
 *
 * Primero mira la URL (`utm_source`, `ref`): las apps de Instagram y
 * LinkedIn suelen quitar la referencia al abrir un enlace, y sin esa marca
 * la visita parecería directa. Después, el host de la página anterior.
 */
export function clasificar(referencia: string, marca: string): { fuente: Fuente; origen: string | null; entrada: boolean } {
  let host = '';
  try { host = referencia ? new URL(referencia).hostname.toLowerCase().replace(/^www\./, '') : ''; } catch { host = ''; }

  if (host && PROPIOS.test(host)) return { fuente: 'interna', origen: null, entrada: false };

  const m = marca.toLowerCase().trim().slice(0, 60);
  if (m) {
    const red = buscar(REDES, m);
    if (red) return { fuente: 'redes', origen: red, entrada: true };
    const ia = buscar(IAS, m);
    if (ia) return { fuente: 'ia', origen: ia, entrada: true };
  }

  if (!host) return m ? { fuente: 'enlace', origen: m, entrada: true } : { fuente: 'directo', origen: null, entrada: true };

  const red = buscar(REDES, host);
  if (red) return { fuente: 'redes', origen: red, entrada: true };
  const ia = buscar(IAS, host);
  if (ia) return { fuente: 'ia', origen: ia, entrada: true };
  if (BUSCADORES.test(host)) return { fuente: 'buscador', origen: host.split('.')[0], entrada: true };
  return { fuente: 'enlace', origen: host, entrada: true };
}

/** ¿Lleva este navegador la cookie de no contar? */
export const noContar = (request: Request) =>
  (request.headers.get('cookie') ?? '').split(';').some((c) => c.trim().startsWith(`${COOKIE_NO_CONTAR}=`));

const recortar = (v: unknown, tope: number) => (typeof v === 'string' ? v.slice(0, tope) : '');

const sinContenido = () => new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });

/**
 * Lo que comparten /api/v y /api/i antes de leer nada: solo POST, solo desde
 * nuestras páginas y nada de robots, centros de datos ni navegadores del
 * estudio. Devuelve la respuesta si la petición se queda aquí, o null si
 * sigue.
 */
function filtrar(request: Request, base: BaseD1 | undefined): Response | null {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } });

  /* Solo desde nuestras páginas. `sec-fetch-site` cubre los navegadores que
     no mandan `Origin` en un sendBeacon del mismo sitio. */
  const url = new URL(request.url);
  const mismoSitio = request.headers.get('origin') === url.origin || request.headers.get('sec-fetch-site') === 'same-origin';
  if (!mismoSitio) return new Response(null, { status: 403 });

  if (!base || noContar(request) || AUTOMATICO.test(request.headers.get('user-agent') ?? '')) return sinContenido();
  const red = (request as Request & { cf?: { asn?: number } }).cf?.asn;
  if (red && CENTROS_DE_DATOS.has(red)) return sinContenido();
  return null;
}

/**
 * POST /api/v · una página vista.
 *
 * Responde 204 siempre que la petición tenga buena forma, se cuente o no:
 * quien visita no tiene por qué enterarse de nada. La escritura va después
 * de responder (`waitUntil`), así la página no espera a la base de datos.
 */
export async function registrarVisita(
  request: Request,
  base: BaseD1 | undefined,
  esperar: (p: Promise<unknown>) => void,
): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } });

  const filtro = filtrar(request, base);
  if (filtro || !base) return filtro ?? sinContenido();
  const vacio = sinContenido();

  let datos: Record<string, unknown>;
  try { datos = JSON.parse(await request.text()); } catch { return new Response(null, { status: 400 }); }

  const ruta = recortar(datos.p, 200);
  if (!ruta.startsWith('/')) return new Response(null, { status: 400 });
  const { fuente, origen, entrada } = clasificar(recortar(datos.r, 500), recortar(datos.u, 60));

  /* `request.cf` lo rellena Cloudflare; en local no existe. */
  const cf = (request as Request & { cf?: Cf }).cf ?? {};
  const motivo = robot(datos, cf.timezone);
  if (motivo) return descartar(motivo, cf);
  const ahora = Date.now();

  esperar(
    base
      .prepare('INSERT INTO visitas (ts, ruta, ciudad, region, pais, fuente, origen, entrada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(ahora, ruta, cf.city ?? null, cf.region ?? null, cf.country ?? null, fuente, origen, entrada ? 1 : 0)
      .run()
      .catch((e) => console.error('visitas: no se pudo guardar', e)),
  );
  /* Limpieza de lo que pasa de 13 meses, de vez en cuando: no hace falta en
     cada visita. */
  if (Math.random() < 0.02) {
    esperar(base.prepare('DELETE FROM visitas WHERE ts < ?').bind(ahora - CONSERVAR_MS).run().catch(() => {}));
  }
  return vacio;
}

/* ---------------------------------------------------------------------------
   Mapa de interacción (Johnny, 15/11/2026). Qué se pulsa y hasta dónde se
   lee, por página. Sustituye a un mapa de calor de terceros: sin
   identificador, sin nada en el navegador y sin guardar lo que se escribe.

   tipo         pulsar · lectura
   control      nombre visible del enlace o botón («Cuéntanoslo»), hasta 80
   destino      a dónde lleva un enlace: la ruta si es nuestra, el dominio si
                es de fuera, «correo» o «teléfono». Sin parámetros.
   modo         raton · tactil · teclado
   ancho        movil (< 768) · tableta (< 1024) · escritorio
   profundidad  25 · 50 · 75 · 100: hasta dónde llegó la página (lectura)
   --------------------------------------------------------------------------- */
const TIPOS = new Set(['pulsar', 'lectura']);
const MODOS = new Set(['raton', 'tactil', 'teclado']);
const ANCHOS = new Set(['movil', 'tableta', 'escritorio']);
const PROFUNDIDADES = new Set([25, 50, 75, 100]);

/** POST /api/i · una pulsación o la lectura de una página. */
export async function registrarInteraccion(
  request: Request,
  base: BaseD1 | undefined,
  esperar: (p: Promise<unknown>) => void,
): Promise<Response> {
  const filtro = filtrar(request, base);
  if (filtro || !base) return filtro ?? sinContenido();

  let d: Record<string, unknown>;
  try { d = JSON.parse(await request.text()); } catch { return new Response(null, { status: 400 }); }

  const ruta = recortar(d.p, 200);
  const tipo = recortar(d.t, 10);
  const ancho = recortar(d.a, 12);
  if (!ruta.startsWith('/') || !TIPOS.has(tipo) || !ANCHOS.has(ancho)) return new Response(null, { status: 400 });
  const cf = (request as Request & { cf?: Cf }).cf ?? {};
  const motivo = robot(d, cf.timezone);
  if (motivo) return descartar(motivo, cf);

  let control: string | null = null, destino: string | null = null, modo: string | null = null, profundidad: number | null = null;
  if (tipo === 'pulsar') {
    control = recortar(d.c, 80).replace(/\s+/g, ' ').trim() || null;
    destino = recortar(d.d, 120) || null;
    modo = recortar(d.m, 10);
    if (!control || !MODOS.has(modo)) return new Response(null, { status: 400 });
  } else {
    profundidad = Number(d.h);
    if (!PROFUNDIDADES.has(profundidad)) return new Response(null, { status: 400 });
  }

  esperar(
    base
      .prepare('INSERT INTO interacciones (ts, ruta, tipo, control, destino, modo, ancho, profundidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(Date.now(), ruta, tipo, control, destino, modo, ancho, profundidad)
      .run()
      .catch((e) => console.error('interacciones: no se pudo guardar', e)),
  );
  if (Math.random() < 0.02) {
    esperar(base.prepare('DELETE FROM interacciones WHERE ts < ?').bind(Date.now() - CONSERVAR_MS).run().catch(() => {}));
  }
  return sinContenido();
}

/* Página de confirmación de /api/no-contar y /api/contar. Es una utilidad
   interna del estudio, no una página de la web: no sale en ningún menú ni en
   el sitemap, y no se indexa. */
const pagina = (titulo: string, texto: string, enlace: string, textoEnlace: string) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titulo} · Accesibilidad Primero</title><style>body{font:19px/1.5 system-ui,sans-serif;color:#1a1a1a;background:#fff;max-width:36rem;margin:0 auto;padding:48px 24px}a{color:inherit;display:inline-block;min-height:44px;line-height:44px}</style></head><body><main><h1>${titulo}</h1><p>${texto}</p><p><a href="${enlace}">${textoEnlace}</a></p></main></body></html>`;

/** GET /api/no-contar y /api/contar · poner o quitar la cookie. */
export function cambiarConteo(request: Request, contar: boolean): Response {
  const segura = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  const cookie = contar
    ? `${COOKIE_NO_CONTAR}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${segura}`
    : `${COOKIE_NO_CONTAR}=1; Path=/; Max-Age=63072000; HttpOnly; SameSite=Lax${segura}`;
  const html = contar
    ? pagina('Este navegador vuelve a contar', 'Las visitas desde este navegador vuelven a sumar en las estadísticas.', '/api/no-contar', 'Dejar de contar este navegador')
    : pagina('Este navegador ya no cuenta', 'Las visitas desde este navegador no suman en las estadísticas del estudio. Dura dos años o hasta que borres las cookies de este sitio. Hay que hacerlo en cada navegador y en cada dispositivo.', '/api/contar', 'Volver a contar este navegador');
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': cookie, 'x-robots-tag': 'noindex' },
  });
}
