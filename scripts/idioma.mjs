/* ---------------------------------------------------------------------------
   Idioma según el navegador (Johnny, 25/11/2026), comprobado de verdad.

   Lo que tiene que ser cierto (AGENTS.md §6, «Idioma según el navegador»):
   · Al llegar a `/` desde fuera: ca y ca-ES → /ca/, es y es-* → se queda,
     cualquier otro → /en/. Manda el PRIMER idioma del navegador.
   · Los parámetros viajan con la redirección (utm_source).
   · Nunca se redirige otra página que no sea `/`.
   · Nunca se redirige si se llega desde otra página de la web (el selector,
     el logo), ni al recargar.
   · Con navigator.webdriver (robots y las demás comprobaciones), nada.
   · No se guarda nada en el navegador: ni localStorage, ni sessionStorage,
     ni cookies.

   Las demás comprobaciones abren `/` con webdriver activo, así que el script
   no las redirige. Aquí se apaga webdriver a mano para ver al visitante.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

const PUERTO = 4402;
const BASE = `http://localhost:${PUERTO}`;
const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
const comprobaciones = [];
const anota = (ok, texto) => { comprobaciones.push({ ok, texto }); console.log(`${ok ? '✓' : '✗'} ${texto}`); };

/** Un visitante con estos idiomas y sin webdriver. */
async function visitante(languages, { webdriver = false } = {}) {
  const ctx = await navegador.newContext({ locale: languages[0] });
  await ctx.addInitScript(({ languages, webdriver }) => {
    Object.defineProperty(Navigator.prototype, 'languages', { get: () => languages });
    Object.defineProperty(Navigator.prototype, 'language', { get: () => languages[0] });
    Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => webdriver });
  }, { languages, webdriver });
  return ctx;
}

/** Abre una dirección y devuelve dónde acaba, cuando ya no se mueve. */
async function llegaA(ctx, ruta, opciones = {}) {
  const p = await ctx.newPage();
  await p.goto(BASE + ruta, { waitUntil: 'load', ...opciones });
  await p.waitForLoadState('load');
  const u = new URL(p.url());
  return { p, ruta: u.pathname + u.search };
}

/* 1 · Al entrar por la portada desde fuera. */
for (const [langs, esperado] of [
  [['ca'], '/ca/'],
  [['ca-ES', 'es-ES'], '/ca/'],
  [['es-ES', 'ca'], '/'],
  [['es'], '/'],
  [['es-419'], '/'],
  [['en-GB'], '/en/'],
  [['fr-FR', 'es-ES'], '/en/'],
  [['de'], '/en/'],
]) {
  const ctx = await visitante(langs);
  const { ruta } = await llegaA(ctx, '/');
  anota(ruta === esperado, `navegador en ${langs.join(', ')} · / → ${ruta} (esperado ${esperado})`);
  await ctx.close();
}

/* 2 · Los parámetros viajan. */
{
  const ctx = await visitante(['en-GB']);
  const { ruta } = await llegaA(ctx, '/?utm_source=linkedin');
  anota(ruta === '/en/?utm_source=linkedin', `los parámetros viajan · ${ruta}`);
  await ctx.close();
}

/* 3 · Un enlace profundo no se toca. */
for (const ruta of ['/estudio/', '/servicios/', '/contacto/']) {
  const ctx = await visitante(['ca']);
  const r = await llegaA(ctx, ruta);
  anota(r.ruta === ruta, `enlace profundo ${ruta} con navegador en catalán · se queda (${r.ruta})`);
  await ctx.close();
}

/* 4 · Navegación interna: el selector y el logo llevan a `/` y ahí se queda. */
{
  const ctx = await visitante(['ca']);
  const { p } = await llegaA(ctx, '/estudio/');
  await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.evaluate(() => { location.href = '/'; })]);
  await p.waitForTimeout(300);
  anota(new URL(p.url()).pathname === '/', `desde otra página de la web a / · se queda (${new URL(p.url()).pathname})`);

  /* Recargar tampoco redirige. */
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(300);
  anota(new URL(p.url()).pathname === '/', `al recargar / · se queda (${new URL(p.url()).pathname})`);

  /* Y el selector de verdad: desde /ca/, «Español» lleva a / y se queda. */
  await p.goto(BASE + '/ca/', { waitUntil: 'load' });
  const enlace = p.locator('a[hreflang="es"]').first();
  if (await enlace.count()) {
    await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), enlace.click({ force: true })]);
    await p.waitForTimeout(300);
    anota(new URL(p.url()).pathname === '/', `selector «Español» desde /ca/ · se queda en / (${new URL(p.url()).pathname})`);
  } else {
    anota(false, 'no se encuentra el enlace del selector con hreflang="es" en /ca/');
  }
  await ctx.close();
}

/* 5 · Desde otra web (un buscador) sí redirige: la referencia no es nuestra. */
{
  const ctx = await visitante(['ca']);
  const { ruta } = await llegaA(ctx, '/', { referer: 'https://www.google.com/' });
  anota(ruta === '/ca/', `desde un buscador a / con navegador en catalán · ${ruta}`);
  await ctx.close();
}

/* 6 · Robots y comprobaciones automáticas: nada. */
{
  const ctx = await visitante(['en-GB'], { webdriver: true });
  const { ruta } = await llegaA(ctx, '/');
  anota(ruta === '/', `con navigator.webdriver · / se queda (${ruta})`);
  await ctx.close();
}

/* 7 · No se guarda nada en el navegador. */
for (const langs of [['ca'], ['es-ES'], ['en-GB']]) {
  const ctx = await visitante(langs);
  const { p } = await llegaA(ctx, '/');
  const guardado = await p.evaluate(() => ({ local: localStorage.length, sesion: sessionStorage.length }));
  const cookies = await ctx.cookies();
  anota(guardado.local === 0 && guardado.sesion === 0 && cookies.length === 0,
    `navegador en ${langs[0]} · nada guardado (local ${guardado.local}, sesión ${guardado.sesion}, cookies ${cookies.length})`);
  await ctx.close();
}

/* 8 · El script solo está en la portada castellana. */
{
  const ctx = await visitante(['es-ES']);
  for (const ruta of ['/ca/', '/en/', '/estudio/']) {
    const { p } = await llegaA(ctx, ruta);
    const html = await p.content();
    anota(!html.includes('navigator.webdriver'), `${ruta} · no lleva el script de idioma`);
  }
  const { p } = await llegaA(ctx, '/');
  anota((await p.content()).includes('navigator.webdriver'), '/ · lleva el script de idioma');
  await ctx.close();
}

await navegador.close();
servidor.close();
const fallos = comprobaciones.filter((c) => !c.ok);
console.log(`\n${comprobaciones.length - fallos.length}/${comprobaciones.length} comprobaciones`);
process.exit(fallos.length ? 1 : 0);
