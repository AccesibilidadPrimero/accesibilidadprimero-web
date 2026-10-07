/* ---------------------------------------------------------------------------
   Comprueba que los tamaños y los interlineados que PINTA EL NAVEGADOR
   coinciden con los estilos del Figma en los tres anchos del documento.

   No lee el CSS: mide el valor calculado sobre un elemento real de la página.
   Es la única forma de cazar una escala fluida que no pasa por donde debe.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

/* Estilo del Figma → selector de un elemento que lo use, y tamaño/interlínea
   esperados en Móvil 390, Tablet 768 y Desktop 1440. */
const CASOS = [
  { estilo: "h1 (Body Small)", sel: ".hero__titular",       esperado: { 390: [17, 24], 768: [18, 22], 1440: [22, 28] } },
  { estilo: 'Display/H2',      sel: '.productos__intro',    esperado: { 390: [34, 40], 768: [40, 48], 1440: [48, 56] } },
  { estilo: 'Display/H3',      sel: '.proyecto__titulo',    esperado: { 390: [24, 34], 768: [26, 32], 1440: [30, 37] } },
  { estilo: 'Text/Body',       sel: '.proyecto__resumen',   esperado: { 390: [20, 28], 768: [22, 30], 1440: [30, 37] } },
  { estilo: 'Text/Body Small', sel: '.hero__frase',         esperado: { 390: [17, 24], 768: [18, 22], 1440: [22, 28] } },
  { estilo: 'Nav',             sel: '.header__logo',        esperado: { 390: [18, 22], 768: [18, 22], 1440: [20, 24] } },
  { estilo: 'Meta',            sel: '.pie__copy',           esperado: { 390: [15, 20], 768: [15, 20], 1440: [16, 20] } },
];

/* Si un selector no aparece en la página, ESO ES UN FALLO, no un aviso.
   El 07/10/2026 este script imprimió «no encuentro» siete veces en cada ancho
   y terminó diciendo «Todos los estilos coinciden con el Figma». No coincidían:
   no había medido nada. Una comprobación que aprueba sin medir es peor que no
   tener comprobación, porque además da confianza. */
const PUERTO = 4393;
const servidor = await servir(PUERTO);
const ejec = '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejec) ? { executablePath: ejec } : {});
let fallos = 0;
let medidos = 0;

for (const ancho of [390, 768, 1440]) {
  const page = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  console.log(`\n── ${ancho} px ───────────────────────────────`);
  for (const c of CASOS) {
    const medido = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { px: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) };
    }, c.sel);
    if (!medido) {
      fallos++;
      console.error(`  ✗ ${c.estilo.padEnd(16)} NO MEDIDO — ${c.sel} no existe en la página`);
      continue;
    }
    medidos++;
    const [epx, elh] = c.esperado[ancho];
    const dpx = Math.abs(medido.px - epx);
    const dlh = Math.abs(medido.lh - elh);
    const bien = dpx <= 0.5 && dlh <= 1;
    if (!bien) fallos++;
    console.log(
      `  ${bien ? '✓' : '✗'} ${c.estilo.padEnd(16)} ${medido.px.toFixed(1)}/${medido.lh.toFixed(0)}` +
      `  (Figma ${epx}/${elh})${bien ? '' : `   desvío ${(medido.px - epx).toFixed(1)}px`}`,
    );
  }
  await page.close();
}

await nav.close();
servidor.close();
const esperados = CASOS.length * 3;
if (fallos) {
  console.error(`\n${fallos} de ${esperados} comprobaciones fallan (medidas: ${medidos}).`);
  process.exit(1);
}
if (medidos !== esperados) {
  console.error(`\nSolo se midieron ${medidos} de ${esperados}. No doy por buena una pasada incompleta.`);
  process.exit(1);
}
console.log(`\n${medidos} medidas. Todos los estilos coinciden con el Figma en los tres anchos.`);
