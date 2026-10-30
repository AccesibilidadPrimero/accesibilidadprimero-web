/* ---------------------------------------------------------------------------
   La escala tipográfica del STACK (src/styles/escala.css), medida en el
   navegador. No mira la web de AP —eso es `npm run tipografia`—: monta una
   página de prueba con escala.css + escala-elementos.css y la tipografía
   servida, y mide lo que pinta.

   Falla si:
     · algún rol no da el tamaño o el interlineado de la tabla en 390 y 1440
       (en 768 tiene que salir la recta entre los dos, no un tramo raro);
     · algo baja de 14 px en cualquier ancho, 320 incluido;
     · un rol pequeño supera a uno grande en algún ancho;
     · el peso no es el de la tabla, o el 600 no es real (si la tipografía no
       trae el 600, el navegador lo fabrica y 600 y 700 miden igual);
     · un rol cambia de «normal» a «grande» (o al revés) para el contraste sin
       que cambie la tabla de escala.css;
     · la relación máximo/mínimo de un rol pasa de 2,5 (con eso el zoom ya no
       garantiza llegar al doble, 1.4.4).

   `npm run escala -- --json` imprime además la escala medida en JSON: es lo
   que se lleva a las variables de la Librería AP en Figma.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const css = (p) => readFileSync(raiz(p), 'utf8');
const fuente = readFileSync(raiz('public/fonts/instrument-sans-latin.woff2')).toString('base64');

/* La tabla. Es la misma que la de escala.css y la de Notion: si cambia una,
   cambian las tres. [móvil 390, escritorio 1440], interlineado, peso, grande. */
const ESCALA = {
  etiqueta:   { px: [14, 14], lh: 1.4, peso: 600, grande: false },
  texto:      { px: [17, 18], lh: 1.6, peso: 400, grande: false },
  entradilla: { px: [20, 22], lh: 1.5, peso: 400, grande: false },
  h4:         { px: [20, 22], lh: 1.3, peso: 600, grande: false },
  h3:         { px: [24, 28], lh: 1.3, peso: 600, grande: true },
  h2:         { px: [28, 36], lh: 1.2, peso: 600, grande: true },
  h1:         { px: [34, 48], lh: 1.1, peso: 600, grande: true },
  display:    { px: [40, 60], lh: 1.1, peso: 600, grande: true },
};
const ORDEN = Object.keys(ESCALA);
const SUELO = 14;
const GRANDE_PX = 24;   // 18 pt. El 600 no cuenta como negrita: ver escala.css.

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
@font-face { font-family: 'Instrument Sans'; font-weight: 400 700;
  src: url(data:font/woff2;base64,${fuente}) format('woff2'); }
${css('src/styles/escala.css')}
${css('src/styles/escala-elementos.css')}
body { margin: 0; font-family: 'Instrument Sans', sans-serif; }
</style></head><body><main>
  <p data-rol="etiqueta" style="font-size:var(--tipo-etiqueta-size);line-height:var(--tipo-etiqueta-leading);font-weight:var(--tipo-etiqueta-peso)">Etiqueta</p>
  <p data-rol="texto">Texto corrido con <strong data-rol="strong">énfasis</strong>.</p>
  <p data-rol="entradilla" style="font-size:var(--tipo-entradilla-size);line-height:var(--tipo-entradilla-leading);font-weight:var(--tipo-entradilla-peso)">Entradilla</p>
  <h4 data-rol="h4">H4</h4><h3 data-rol="h3">H3</h3><h2 data-rol="h2">H2</h2><h1 data-rol="h1">H1</h1>
  <p data-rol="display" style="font-size:var(--tipo-display-size);line-height:var(--tipo-display-leading);font-weight:var(--tipo-display-peso)">Display</p>
  <small data-rol="small">pequeño</small>
  <span id="peso" style="font-size:40px;white-space:nowrap">Hamburgefonstiv Quijote</span>
</main></body></html>`;

const ejec = '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejec) ? { executablePath: ejec } : {});
const json = process.argv.includes('--json');
let fallos = 0;
const mal = (m) => { fallos++; console.error(`  ✗ ${m}`); };
const esperado = ([m, d], ancho) => m + (d - m) * (Math.min(Math.max(ancho, 390), 1440) - 390) / 1050;

async function medir(ancho) {
  const page = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('[data-rol]')) {
      const cs = getComputedStyle(el);
      out[el.dataset.rol] = { px: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight), peso: Number(cs.fontWeight) };
    }
    const s = document.getElementById('peso');
    out.anchos = [500, 600, 700].map((w) => { s.style.fontWeight = w; return s.getBoundingClientRect().width; });
    out.cargada = document.fonts.check('600 16px "Instrument Sans"');
    return out;
  });
  await page.close();
  return r;
}

const tabla = {};
for (const ancho of [320, 390, 768, 1440]) {
  const r = await medir(ancho);
  console.log(`\n── ${ancho} px ──`);
  let previo = 0;
  for (const rol of ORDEN) {
    const m = r[rol], e = ESCALA[rol];
    const px = esperado(e.px, ancho);
    if (Math.abs(m.px - px) > 0.3) mal(`${rol} mide ${m.px} y debería medir ${px.toFixed(2)}`);
    if (Math.abs(m.lh / m.px - e.lh) > 0.01) mal(`${rol}: interlineado ${(m.lh / m.px).toFixed(2)}, la tabla dice ${e.lh}`);
    if (m.peso !== e.peso) mal(`${rol}: peso ${m.peso}, la tabla dice ${e.peso}`);
    if (m.px < SUELO) mal(`${rol} baja del suelo: ${m.px} px`);
    if (m.px + 0.01 < previo) mal(`${rol} (${m.px}) es más pequeño que el rol anterior (${previo})`);
    previo = m.px;
    (tabla[rol] ??= {})[ancho] = m.px;
    console.log(`  ${rol.padEnd(11)} ${m.px.toFixed(2).padStart(6)} px · ${(m.lh / m.px).toFixed(2)} · ${m.peso}`);
  }
  if (r.strong.peso !== 600) mal(`<strong> sale a ${r.strong.peso}, no a 600`);
  if (r.small.px < SUELO) mal(`<small> baja del suelo: ${r.small.px} px`);
  const [a5, a6, a7] = r.anchos;
  if (!r.cargada || !(a5 < a6 && a6 < a7)) mal(`el 600 no es real: 500/600/700 miden ${r.anchos.map((a) => a.toFixed(1)).join(' / ')}`);
}

console.log('\n── Contraste: qué cuenta como texto grande (≥ 24 px en su tamaño mínimo) ──');
for (const rol of ORDEN) {
  const minimo = Math.min(...Object.values(tabla[rol]));
  const grande = minimo >= GRANDE_PX;
  if (grande !== ESCALA[rol].grande) mal(`${rol}: medido ${grande ? 'grande' : 'normal'}, la tabla dice lo contrario`);
  const [m, d] = ESCALA[rol].px;
  if (d / m > 2.5) mal(`${rol}: máximo/mínimo ${(d / m).toFixed(2)} > 2,5 (1.4.4)`);
  console.log(`  ${rol.padEnd(11)} ${grande ? 'grande · 3:1  ' : 'normal · 4,5:1'}  máx/mín ${(d / m).toFixed(2)}`);
}

/* Zoom: con el navegador al Z %, una ventana de 1440 se comporta como una de
   1440/Z px CSS y cada px CSS mide Z px. Se busca el zoom al que cada rol ya
   mide el doble que al 100 %. El texto corrido tiene que llegar antes del
   250 %; los titulares crecen menos a propósito, pero llegan antes del 500. */
console.log('\n── Zoom: a qué zoom cada rol mide el doble (ventana de 1440) ──');
for (const rol of ORDEN) {
  const base = esperado(ESCALA[rol].px, 1440);
  let z = 1;
  while (z <= 5 && esperado(ESCALA[rol].px, 1440 / z) * z < 2 * base) z += 0.05;
  const tope = rol === 'texto' || rol === 'etiqueta' ? 2.5 : 5;
  if (z > tope) mal(`${rol} no llega al doble antes del ${tope * 100} %`);
  console.log(`  ${rol.padEnd(11)} ${Math.round(z * 100)} %`);
}

await nav.close();
if (json) console.log('\n' + JSON.stringify(ESCALA, null, 2));
if (fallos) { console.error(`\n${fallos} fallos en la escala del stack.`); process.exit(1); }
console.log('\nLa escala del stack cuadra: tamaños, suelo de 14, orden, pesos reales, texto grande y zoom.');
