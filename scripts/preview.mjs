/* Construye una copia autónoma de dist/ para publicarla como Artifact.
   Dos ajustes obligados por el servicio de artifacts:
   · los prefijos «_» están reservados, así que _astro pasa a llamarse activos
   · el CSS va embebido, porque la página se sirve sin hoja externa
   No toca dist/. Salida: /home/claude/preview-ap/ */
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const DIST = path.join(RAIZ, 'dist');
const SALIDA = '/home/claude/preview-ap';

await rm(SALIDA, { recursive: true, force: true });
await mkdir(path.join(SALIDA, 'activos'), { recursive: true });

for (const f of await readdir(path.join(DIST, '_astro'))) {
  if (f.endsWith('.css')) continue;
  await cp(path.join(DIST, '_astro', f), path.join(SALIDA, 'activos', f));
}
await cp(path.join(DIST, 'fonts'), path.join(SALIDA, 'fonts'), { recursive: true });

let html = await readFile(path.join(DIST, 'index.html'), 'utf8');

/* El CSS: lo embebo y le corrijo las rutas de las fuentes. */
const hojas = (await readdir(path.join(DIST, '_astro'))).filter((f) => f.endsWith('.css'));
let css = '';
for (const h of hojas) css += await readFile(path.join(DIST, '_astro', h), 'utf8');
css = css.replaceAll('/fonts/', 'fonts/');

html = html.replace(/<link rel="stylesheet" href="[^"]*\.css"\s*\/?>/g, '');
html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);

/* Rutas absolutas → relativas, y _astro → activos. */
html = html.replaceAll('/_astro/', 'activos/');
html = html.replaceAll('"/fonts/', '"fonts/');

await writeFile(path.join(SALIDA, 'home.html'), html);
console.log(`Vista previa en ${SALIDA}/home.html — ${(html.length / 1024).toFixed(0)} KB de HTML`);
