/* Páginas 404 por idioma (15/11/2026).
   Astro solo escribe 404.html en la raíz; src/pages/ca/404.astro sale como
   dist/ca/404/index.html. Cloudflare (`not_found_handling = "404-page"`)
   busca el 404.html más cercano a la dirección pedida, así que se mueven a
   dist/ca/404.html y dist/en/404.html. */
import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
for (const lang of ['ca', 'en']) {
  const dir = join(dist, lang, '404');
  const origen = join(dir, 'index.html');
  if (!existsSync(origen)) throw new Error(`Falta ${origen}`);
  renameSync(origen, join(dist, lang, '404.html'));
  rmSync(dir, { recursive: true });
  console.log(`404 · ${lang}/404.html`);
}
