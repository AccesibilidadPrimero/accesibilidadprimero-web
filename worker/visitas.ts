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

  /* Solo desde nuestras páginas. `sec-fetch-site` cubre los navegadores que
     no mandan `Origin` en un sendBeacon del mismo sitio. */
  const url = new URL(request.url);
  const mismoSitio = request.headers.get('origin') === url.origin || request.headers.get('sec-fetch-site') === 'same-origin';
  if (!mismoSitio) return new Response(null, { status: 403 });

  const vacio = new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  if (!base || noContar(request) || AUTOMATICO.test(request.headers.get('user-agent') ?? '')) return vacio;

  let datos: Record<string, unknown>;
  try { datos = JSON.parse(await request.text()); } catch { return new Response(null, { status: 400 }); }

  const ruta = recortar(datos.p, 200);
  if (!ruta.startsWith('/')) return new Response(null, { status: 400 });
  const { fuente, origen, entrada } = clasificar(recortar(datos.r, 500), recortar(datos.u, 60));

  /* `request.cf` lo rellena Cloudflare; en local no existe. */
  const cf = (request as Request & { cf?: { city?: string; region?: string; country?: string } }).cf ?? {};
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
