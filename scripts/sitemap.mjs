/* ---------------------------------------------------------------------------
   sitemap.xml y robots.txt · SEO, 07/11/2026. Corre detrás de `astro build`.

   Sin dependencias (§1): recorre dist/ y apunta cada página que existe de
   verdad, así el mapa no puede nombrar una dirección que no esté publicada.
   Cada página lleva sus versiones en otros idiomas (xhtml:link), las mismas
   que su <head>.

   La URL base sale de src/data/sitio.ts, el único interruptor: con MODO
   'provisional' el mapa nombra el .eu (que no se indexa: noindex por página
   y por cabecera), y el día que pase a 'final' nombra el .com sin tocar nada.
   Se lee el archivo como texto para no depender de que Node entienda
   TypeScript en el build de Cloudflare.

   robots.txt NO bloquea nada en ningún modo: si bloqueara el .eu, Google no
   llegaría a leer el noindex y podría listar las direcciones igualmente.
   --------------------------------------------------------------------------- */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
const dist = join(raiz, 'dist');

const sitio = readFileSync(join(raiz, 'src/data/sitio.ts'), 'utf8');
const lee = (re) => {
  const m = sitio.match(re);
  if (!m) throw new Error(`sitemap: no encuentro ${re} en src/data/sitio.ts`);
  return m[1];
};
const modo = lee(/export const MODO = '(\w+)'/);
const base = modo === 'final'
  ? `https://www.${lee(/DOMINIO_FINAL = '([^']+)'/)}`
  : `https://${lee(/DOMINIO_PROVISIONAL = '([^']+)'/)}`;

function paginas(dir) {
  const fuera = [];
  for (const n of readdirSync(dir)) {
    const r = join(dir, n);
    if (statSync(r).isDirectory()) {
      if (n === '_astro' || n === 'fonts' || n === 'video') continue;
      fuera.push(...paginas(r));
    } else if (n === 'index.html') fuera.push(r);
  }
  return fuera;
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const entradas = [];
for (const archivo of paginas(dist).sort()) {
  const html = readFileSync(archivo, 'utf8');
  /* Lo que no se quiere en un buscador tampoco va al mapa: un 404 y
     cualquier página que se marque noindex por sí misma en modo final. */
  if (/<title>[^<]*404/.test(html)) continue;
  if (modo === 'final' && /<meta name="robots" content="noindex"/.test(html)) continue;
  const ruta = '/' + relative(dist, archivo).split(sep).slice(0, -1).join('/');
  const loc = new URL(ruta.endsWith('/') ? ruta : `${ruta}/`, base).href;
  const alternos = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map(([, h, href]) => `    <xhtml:link rel="alternate" hreflang="${esc(h)}" href="${esc(href)}" />`);
  entradas.push(`  <url>\n    <loc>${esc(loc)}</loc>\n${alternos.join('\n')}${alternos.length ? '\n' : ''}  </url>`);
}

writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entradas.join('\n')}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap: ${entradas.length} páginas (${modo}, ${base})`);
