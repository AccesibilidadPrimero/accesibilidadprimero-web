/* ---------------------------------------------------------------------------
   Movimiento que empieza solo · 2.2.2 (Pausar, detener, ocultar), medido.

   Regla de la casa: lo que se mueve solo y dura más de 5 s junto a otro
   contenido lleva un control para pararlo, o termina antes de 5 s.

   UNA EXCEPCIÓN DECLARADA: el emblema de Estudio chispea en bucle y sin botón
   (licencia de Johnny, 13/10/2026). Está nombrada como incumplimiento en la
   Declaración de accesibilidad. Esto comprueba que sigue siendo la ÚNICA:
   · el emblema: 241 cuadrados en bucle, con y sin JS, y quieto con «reducir
     movimiento»;
   · la Declaración lo sigue nombrando (si se quita el bucle, se quita de
     allí; si se quita de allí, falla);
   · y el titular de Estudio: entero en el h1, quieto sin JS, y todo en su
     sitio antes de 2 s.
   Lo mide en el navegador, con las animaciones reales (AGENTS.md §2.9).
   No recorre el resto de la web: el carrusel de la Home tiene su propia
   comprobación (teclado), y cualquier bucle nuevo se añade aquí.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

const PUERTO = 4399;
const PAGINA = `http://localhost:${PUERTO}/estudio/`;
const LIMITE_MS = 5000;
const CUADRADOS = 241;
const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
let fallos = 0;
const anota = (ok, texto) => { if (!ok) fallos++; console.log(`${ok ? '✓' : '✗'} ${texto}`); };

const medir = (page) => page.evaluate(() => {
  const svg = document.querySelector('[data-simbolo-animado]');
  const anims = svg ? svg.getAnimations({ subtree: true }) : [];
  const fin = anims.map((a) => a.effect.getComputedTiming().endTime);
  const boton = document.querySelector('.simbolo button');
  const r = boton?.getBoundingClientRect();
  return {
    cuadrados: svg ? svg.querySelectorAll('rect').length : 0,
    animaciones: anims.length,
    infinitas: fin.filter((t) => !Number.isFinite(t)).length,
    finMax: fin.filter(Number.isFinite).reduce((a, b) => Math.max(a, b), 0),
    enMarcha: anims.filter((a) => a.playState === 'running').length,
    pausadas: anims.filter((a) => a.playState === 'paused').length,
    boton: Boolean(r && r.width > 0 && r.height > 0),
    medida: r ? [Math.round(r.width), Math.round(r.height)] : [0, 0],
    nombre: boton ? boton.textContent.trim().replace(/\s+/g, ' ') : '',
  };
});

for (const js of [false, true]) {
  const ctx = await navegador.newContext({ javaScriptEnabled: js, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const n = js ? 'con JS' : 'sin JS';
  await p.goto(PAGINA, { waitUntil: 'load' });
  const m = await medir(p);
  anota(m.cuadrados === CUADRADOS, `${n} · el emblema está en el hero (${m.cuadrados} cuadrados)`);
  anota(m.infinitas === CUADRADOS, `${n} · en bucle, la excepción declarada (${m.infinitas} de ${CUADRADOS})`);
  anota(!m.boton, `${n} · sin botón de pausa, como se decidió`);
  await ctx.close();
}
{
  const p = await navegador.newPage();
  await p.goto(`http://localhost:${PUERTO}/declaracion-de-accesibilidad/`, { waitUntil: 'load' });
  const dice = await p.evaluate(() => document.body.innerText.includes('2.2.2') && /emblema de la página Estudio/.test(document.body.innerText));
  anota(dice, 'la Declaración de accesibilidad nombra el bucle del emblema como incumplimiento (2.2.2)');
  await p.close();
}

/* 3 · Reducir movimiento. */
{
  const ctx = await navegador.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(PAGINA, { waitUntil: 'load' });
  const m = await medir(p);
  anota(m.animaciones === 0 && !m.boton, `reducido · quieto y sin botón (${m.animaciones} animaciones)`);
  await ctx.close();
}

/* 4 · La entrada del titular de Estudio, en golpes. El <h1> tiene que estar
   entero en el HTML, sin JS no se anima nada, y con JS todo acaba antes de
   2 s: tres golpes y después el texto. */
{
  const TITULAR = 'Código, diseño y palabra.';
  const golpes = (page) => page.evaluate(() => {
    const h1 = document.querySelector('.apertura__titulo');
    const piezas = [...document.querySelectorAll('.apertura--golpes .golpe__dentro, .apertura--golpes .apertura__texto')];
    const anims = piezas.flatMap((e) => e.getAnimations());
    return {
      texto: h1.textContent.replace(/\s+/g, ' ').trim(),
      golpes: document.querySelectorAll('.golpe__dentro').length,
      animaciones: anims.length,
      fin: anims.reduce((m, a) => Math.max(m, a.effect.getComputedTiming().endTime), 0),
      quietos: piezas.every((e) => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(e).transform) && getComputedStyle(e).opacity === '1'),
    };
  });
  for (const [n, opciones] of [['sin JS', { javaScriptEnabled: false }], ['con JS', {}], ['reducido', { reducedMotion: 'reduce' }]]) {
    const ctx = await navegador.newContext({ ...opciones, viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(PAGINA, { waitUntil: 'load' });
    let g = await golpes(p);
    anota(g.texto === TITULAR && g.golpes === 3, `titular · ${n} · el h1 dice «${g.texto}» entero, en ${g.golpes} golpes`);
    if (n === 'sin JS') anota(g.animaciones === 0 && g.quietos, `titular · ${n} · no se anima: se ve quieto desde el principio`);
    else anota(g.animaciones === 4 && g.fin <= 2000, `titular · ${n} · tres golpes y el texto, todo acaba a los ${(g.fin / 1000).toFixed(2)} s`);
    await p.waitForTimeout(2100);
    g = await golpes(p);
    anota(g.quietos, `titular · ${n} · al terminar, todo en su sitio y opaco`);
    await ctx.close();
  }
}

await navegador.close();
servidor.close();
if (fallos) { console.error(`\n${fallos} comprobaciones fallan.`); process.exit(1); }
console.log('\nEl bucle del emblema de Estudio está declarado y se para con «reducir movimiento».');
