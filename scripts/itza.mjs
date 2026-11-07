/* ---------------------------------------------------------------------------
   La landing de Itza, fuera de la web de AP (07/11/2026). Corre detrás de
   `astro build`, antes del sitemap.

   Astro construye la landing con la web, en dist/itza/, para que use los
   mismos tokens, componentes y comprobaciones. Este script:
     1. la saca a dist-itza/, con lo que su Worker sirve en la raíz de
        itza.accesibilidadprimero.eu (wrangler.itza.toml);
     2. copia solo los archivos que esas páginas piden: los de _astro/ que
        nombra su HTML o su CSS, las fuentes, los iconos y los vídeos;
     3. escribe su _headers (noindex mientras el .eu sea provisional, igual
        que la web) y una página 404 mínima;
     4. borra dist/itza/: en la web de AP, /itza/ no existe.

   Sin dependencias. Si una página de la landing no está, se para: mejor un
   build roto que un Worker que publica una carpeta vacía.
   --------------------------------------------------------------------------- */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const dist = join(raiz, 'dist');
const origen = join(dist, 'itza');
const destino = join(raiz, 'dist-itza');

for (const p of ['index.html', 'ca/index.html', 'en/index.html']) {
  if (!existsSync(join(origen, p))) throw new Error(`itza: falta dist/itza/${p}. ¿Ha cambiado src/pages/itza/?`);
}

rmSync(destino, { recursive: true, force: true });
cpSync(origen, destino, { recursive: true });

/* Lo que piden las páginas: rutas absolutas a /_astro/, /fonts/, /video/… */
const pedidos = new Set();
const anotar = (texto) => {
  /* Los vídeos de VideoPausable van en data-video-*: los pide su script. */
  for (const m of texto.matchAll(/(?:href|src|poster|data-[a-z-]+)="(\/[^"#?]+)/g)) pedidos.add(m[1]);
  for (const m of texto.matchAll(/srcset="([^"]+)"/g)) for (const parte of m[1].split(',')) pedidos.add(parte.trim().split(/\s+/)[0]);
  for (const m of texto.matchAll(/url\((?:'|")?(\/[^)'"]+)/g)) pedidos.add(m[1]);
};
const html = (dir) => readdirSync(dir).flatMap((n) => {
  const r = join(dir, n);
  return statSync(r).isDirectory() ? html(r) : n.endsWith('.html') ? [r] : [];
});
for (const f of html(destino)) anotar(readFileSync(f, 'utf8'));
/* El CSS también pide cosas (las fuentes); se lee el que piden las páginas. */
for (const p of [...pedidos].filter((p) => p.endsWith('.css'))) {
  const f = join(dist, p);
  if (existsSync(f)) anotar(readFileSync(f, 'utf8'));
}
/* Los iconos y las fuentes van siempre: los piden el navegador y el CSS. */
for (const p of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png']) pedidos.add(p);
for (const n of readdirSync(join(dist, 'fonts'))) pedidos.add(`/fonts/${n}`);

let copiados = 0;
for (const p of pedidos) {
  if (!p.startsWith('/') || p.startsWith('//') || p.endsWith('/')) continue;
  const de = join(dist, p);
  if (!existsSync(de)) continue;
  const a = join(destino, p);
  mkdirSync(dirname(a), { recursive: true });
  cpSync(de, a);
  copiados++;
}

writeFileSync(join(destino, '_headers'), `# La landing de Itza. Mismo criterio que la web (public/_headers): el .eu
# provisional y la web de pruebas no se indexan.
https://:worker.:subdomain.workers.dev/*
  X-Robots-Tag: noindex

https://itza.accesibilidadprimero.eu/*
  X-Robots-Tag: noindex
`);
writeFileSync(join(destino, 'robots.txt'), 'User-agent: *\nAllow: /\n');
writeFileSync(join(destino, '404.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página no encontrada · Itza</title><meta name="robots" content="noindex">
<style>body{font:1.125rem/1.5 system-ui,sans-serif;color:#171717;background:#fff;margin:0;padding:48px 24px}a{color:#171717;display:inline-flex;align-items:center;min-height:44px}</style>
</head><body><main><h1 style="font-weight:400">Esta página no existe.</h1>
<p><a href="/">Ir al inicio de Itza</a></p></main></body></html>
`);

rmSync(origen, { recursive: true, force: true });
console.log(`itza: 3 páginas y ${copiados} archivos en dist-itza/`);
