/* ---------------------------------------------------------------------------
   Renglones · cómo se reparten las líneas del texto (Johnny, 14/10/2026).

   Recorre TODAS las páginas del build a 390, 768 y 1440 y, línea a línea, en
   el render real:
     · ninguna línea que no sea la última de su párrafo acaba en una
       partícula («y», «de», «la»…: la lista de src/lib/particulas.ts);
     · ningún párrafo de dos o más líneas acaba con una palabra sola
       (`text-wrap: pretty`, base.css).

   Mide texto corrido y encabezados: p, li, dd, figcaption, blockquote y
   h1–h4. Las celdas de tabla no: en una columna estrecha una palabra sola en
   la última línea es inevitable, y a 390 las tablas del blog parten palabras
   por la mitad (eso es otro problema, anotado aparte). No mide lo oculto, los <sup>, las muestras del blog
   (`data-ejemplo`) ni los golpes del titular de Estudio, que se parten a
   propósito donde dice el diseño («Código, / diseño y / palabra.»).
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { servir } from './serve.mjs';

const RAIZ = fileURLToPath(new URL('../dist/', import.meta.url));
/* Una lista por idioma (05/11/2026): la de cada página según su <html lang>. */
const fuente = readFileSync(new URL('../src/lib/particulas.ts', import.meta.url), 'utf8');
const leer = (n) => fuente.match(new RegExp(`PARTICULAS_${n} = \\[([\\s\\S]*?)\\]`))[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
const LISTAS = { es: leer('ES'), ca: leer('CA'), en: leer('EN') };

const rutas = [];
(function andar(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (!n.startsWith('_')) andar(p); }
    else if (n === 'index.html') rutas.push('/' + relative(RAIZ, dir).split('\\').join('/') + (dir === RAIZ.replace(/\/$/, '') ? '' : '/'));
  }
})(RAIZ.replace(/\/$/, ''));
const RUTAS = [...new Set(rutas.map((r) => r.replace(/\/+$/, '/').replace(/^\/\/$/, '/')))].sort();

/* Comillas y rayas de la casa (Johnny, 30/10/2026): comillas curvas “ ” y
   guiones cortos en toda la web. Ni «», ni raya (—), ni semirraya (–). Se
   mira el HTML del build, texto y atributos que se leen (alt, aria-label,
   title), sin scripts, estilos ni comentarios. */
let rayas = 0;
for (const ruta of RUTAS) {
  const html = readFileSync(join(RAIZ, ruta, 'index.html'), 'utf8')
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  for (const m of html.matchAll(/[«»—–]/g)) {
    rayas += 1;
    console.error(`✗ ${ruta} · “${m[0]}” en: ${html.slice(Math.max(0, m.index - 50), m.index + 30).replace(/\s+/g, ' ')}`);
  }
}
if (rayas) { console.error(`${rayas} comillas o rayas que no son de la casa: “ ” y -.`); process.exit(1); }
console.log(`✓ ${RUTAS.length} páginas sin «», sin raya y sin semirraya.`);

const PUERTO = 4401;
const servidor = await servir(PUERTO);
const ejecutable = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});

let fallos = 0, lineas = 0, parrafos = 0;
for (const ancho of [390, 768, 1440]) {
  const p = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  for (const ruta of RUTAS) {
    await p.goto(`http://localhost:${PUERTO}${ruta}`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate((particulas) => {
      const PART = new Set(particulas);
      const CORRIDO = 'p, li, dd, figcaption, blockquote';
      const mal = []; let nl = 0, np = 0;
      for (const el of document.querySelectorAll(`body :is(${CORRIDO}, h1, h2, h3, h4)`)) {
        /* `data-renglones="libre"`: el escape de src/lib/particulas.ts para
           columnas muy estrechas. Si alguien lo usa, lo verá en el código. */
        if (el.closest('.sr-only, [data-ejemplo], table, [data-renglones="libre"], [hidden], [aria-hidden="true"]')) continue;
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
        /* Solo el texto propio: si dentro hay otro bloque medible, ese se mide aparte. */
        if (el.querySelector(`:is(${CORRIDO}, h1, h2, h3, h4)`)) continue;
        const renglones = [];
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) {
          if (n.parentElement.closest('sup, .sr-only, .golpe')) continue;
          for (let i = 0; i < n.length; i++) {
            const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1);
            const c = rg.getClientRects()[0]; if (!c || !c.height) continue;
            const medio = (c.top + c.bottom) / 2;
            let l = renglones.find((x) => medio >= x.top && medio <= x.bottom);
            if (!l) { l = { top: c.top, bottom: c.bottom, texto: '' }; renglones.push(l); }
            l.texto += n.data[i];
          }
        }
        renglones.sort((a, b) => a.top - b.top);
        const ls = renglones.map((l) => l.texto.replace(/\s+$/, '')).filter((t) => t.trim());
        if (ls.length < 2) continue;
        np++; nl += ls.length;
        const quien = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '');
        ls.slice(0, -1).forEach((l) => {
          const ult = l.trim().split(/[\s\u00A0]+/).pop().replace(/^[(«“"¿¡]+/, '').toLowerCase();
          if (PART.has(ult)) mal.push(`acaba en «${ult}» · ${quien} · …${l.slice(-40)}`);
        });
        if (el.matches(CORRIDO)) {
          const palabras = ls.at(-1).trim().split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
          if (palabras.length === 1 && !palabras[0].includes('\u00A0')) mal.push(`palabra sola al final · ${quien} · «${ls.at(-1).trim()}»`);
        }
      }
      return { mal, nl, np };
    }, LISTAS[ruta.startsWith('/ca/') ? 'ca' : ruta.startsWith('/en/') ? 'en' : 'es']);
    lineas += r.nl; parrafos += r.np;
    if (r.mal.length) {
      fallos += r.mal.length;
      console.error(`  ✗ ${String(ancho).padStart(4)} ${ruta}`);
      for (const m of r.mal.slice(0, 6)) console.error(`      ${m}`);
      if (r.mal.length > 6) console.error(`      … y ${r.mal.length - 6} más`);
    } else console.log(`  ✓ ${String(ancho).padStart(4)} ${ruta}`);
  }
  await p.close();
}
await nav.close();
servidor.close();
console.log(`\n${RUTAS.length} páginas × 3 anchos · ${parrafos} bloques de varias líneas · ${lineas} líneas medidas.`);
if (fallos) { console.error(`${fallos} renglones mal repartidos.`); process.exit(1); }
console.log('Ninguna línea acaba en partícula y ningún párrafo acaba con una palabra sola.');
