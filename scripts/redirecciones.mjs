/* ---------------------------------------------------------------------------
   npm run redirecciones · que la mudanza desde WordPress no deje enlaces rotos.

   1. Cada línea de public/_redirects lleva a una página que EXISTE en dist/.
      Una 301 hacia un 404 es peor que el 404: Google la sigue y no encuentra
      nada, y además deja de mirar la dirección vieja.
   2. Cada artículo con `urlAntigua` tiene su 301 a /blog/<slug>/.
   3. Ningún origen se repite y ninguno apunta a sí mismo.

   Las aplica Cloudflare, no Astro: aquí solo se comprueba el archivo. Tras
   publicar en el dominio final, la prueba de verdad es
   curl -sI https://www.accesibilidadprimero.com/pero-que-es-la-wcag/
   --------------------------------------------------------------------------- */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('../', import.meta.url).pathname;
const reglas = readFileSync(join(RAIZ, 'public/_redirects'), 'utf8')
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split(/\s+/));

let fallos = 0;
const mal = (m) => { fallos++; console.error(`✗ ${m}`); };
const vistos = new Set();
for (const [origen, destino, codigo] of reglas) {
  if (!['301', '302'].includes(codigo)) mal(`${origen}: código ${codigo} (solo 301 o 302)`);
  if (vistos.has(origen)) mal(`${origen} aparece dos veces`);
  vistos.add(origen);
  if (origen === destino) mal(`${origen} se redirige a sí misma`);
  /* Un destino puede llevar ancla (/servicios/#auditoria, 07/11/2026): la
     página tiene que existir y el ancla, ser un id de esa página. */
  const [ruta, ancla] = destino.split('#');
  const pagina = join(RAIZ, 'dist', ruta, 'index.html');
  if (!existsSync(pagina)) mal(`${origen} → ${destino}: esa página no existe en dist/`);
  else if (ancla && !readFileSync(pagina, 'utf8').includes(`id="${ancla}"`)) mal(`${origen} → ${destino}: la página no tiene id="${ancla}"`);
  /* Y al revés: una redirección no puede tapar una página que existe. Pasó el
     30/10/2026: /servicios/ seguía redirigiendo a /estudio/ (de la web de
     WordPress) y la página nueva de Servicios no se veía en producción. */
  if (existsSync(join(RAIZ, 'dist', origen, 'index.html'))) mal(`${origen} → ${destino}: ${origen} es una página de la web y la redirección la tapa`);
}

const dir = join(RAIZ, 'src/content/blog');
for (const archivo of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const slug = archivo.replace(/\.md$/, '');
  const antigua = readFileSync(join(dir, archivo), 'utf8').match(/^urlAntigua:\s*(\S+)/m)?.[1];
  if (!antigua) continue;
  const r = reglas.find(([o]) => o === antigua);
  if (!r) mal(`${slug}: falta la 301 de ${antigua}`);
  else if (r[1] !== `/blog/${slug}/` || r[2] !== '301') mal(`${slug}: ${antigua} va a ${r[1]} (${r[2]}), toca /blog/${slug}/ (301)`);
}

if (fallos) { console.error(`\n${fallos} problema(s) en public/_redirects.`); process.exit(1); }
console.log(`✓ ${reglas.length} redirecciones, todas hacia páginas que existen; los artículos, con su 301.`);
