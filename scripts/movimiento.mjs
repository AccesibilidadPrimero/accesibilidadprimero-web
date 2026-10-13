/* ---------------------------------------------------------------------------
   Movimiento que empieza solo · 2.2.2 (Pausar, detener, ocultar), medido.

   Lo que se mueve sin que nadie lo pida y dura más de 5 s junto a otro
   contenido necesita un mecanismo para pararlo. El símbolo de Estudio
   chispea en bucle y lleva un botón de pausa (Johnny, 13/10/2026). Esto lo
   MIDE en el navegador, con las animaciones reales de la página y no con el
   CSS escrito (AGENTS.md §2.9):

   · Sin JS: no hay botón, así que no puede haber bucle. Todo acaba antes de
     5 s y el símbolo queda completo.
   · Con JS: hay bucle y hay botón, de 44 × 44, con nombre; al pulsarlo se
     paran TODAS las animaciones y el nombre pasa a «Reproducir…»; al
     pulsarlo otra vez vuelven.
   · Con «reducir movimiento»: ninguna animación y ningún botón.
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
  const boton = document.querySelector('[data-simbolo-control]');
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

/* 1 · Sin JavaScript. */
{
  const ctx = await navegador.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(PAGINA, { waitUntil: 'load' });
  const m = await medir(p);
  anota(m.cuadrados === CUADRADOS, `sin JS · el símbolo está en el hero (${m.cuadrados} cuadrados)`);
  // Un suelo: si no hay animaciones, esta comprobación no está mirando nada.
  anota(m.animaciones === CUADRADOS, `sin JS · cada cuadrado lleva su animación (${m.animaciones})`);
  anota(m.infinitas === 0 && m.finMax <= LIMITE_MS, `sin JS · sin bucle: todo acaba antes de 5 s (a los ${(m.finMax / 1000).toFixed(2)} s)`);
  anota(!m.boton, 'sin JS · no se pinta un botón que no haría nada');
  await p.waitForTimeout(m.finMax + 300);
  const opacos = await p.evaluate(() => [...document.querySelectorAll('[data-simbolo-animado] rect')].every((r) => getComputedStyle(r).opacity === '1'));
  anota(opacos, 'sin JS · al terminar, el símbolo queda completo');
  await ctx.close();
}

/* 2 · Con JavaScript, en los tres anchos. */
for (const [ancho, alto] of [[1440, 900], [768, 1024], [390, 844]]) {
  const p = await navegador.newPage({ viewport: { width: ancho, height: alto } });
  await p.goto(PAGINA, { waitUntil: 'load' });
  let m = await medir(p);
  anota(m.infinitas === CUADRADOS && m.enMarcha === CUADRADOS, `${ancho} · en bucle (${m.infinitas} de ${CUADRADOS})`);
  anota(m.boton && m.medida[0] >= 44 && m.medida[1] >= 44, `${ancho} · hay botón de pausa de ${m.medida.join(' × ')}`);
  anota(m.nombre === 'Pausar la animación del símbolo', `${ancho} · se llama «${m.nombre}»`);
  await p.click('[data-simbolo-control]');
  m = await medir(p);
  anota(m.pausadas === CUADRADOS && m.enMarcha === 0, `${ancho} · al pulsar, se paran todas (${m.pausadas})`);
  anota(m.nombre === 'Reproducir la animación del símbolo', `${ancho} · y pasa a llamarse «${m.nombre}»`);
  await p.click('[data-simbolo-control]');
  m = await medir(p);
  anota(m.enMarcha === CUADRADOS, `${ancho} · al pulsar otra vez, vuelven (${m.enMarcha})`);
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

await navegador.close();
servidor.close();
if (fallos) { console.error(`\n${fallos} comprobaciones fallan.`); process.exit(1); }
console.log('\nEl movimiento que empieza solo se puede parar, y sin JS acaba antes de 5 s.');
