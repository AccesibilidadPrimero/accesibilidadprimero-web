/* ---------------------------------------------------------------------------
   Mide los ANCHOS que pinta el navegador y los compara con el Figma.

   Por qué existe: `tipografia.mjs` comprueba cuerpos e interlineados, pero la
   medida de un párrafo —cuántos caracteres entran por línea— es tan decisión de
   diseño como el cuerpo de letra, y no lo miraba nadie. El 07/10/2026 salieron
   a producción dos anchos mal (la ilustración del hero a 640 en vez de 693, y
   el cierre de contacto a 479 en vez de 962) sin que ninguna comprobación se
   quejara.

   La causa era de las que no se ven leyendo el CSS: Astro da scope a los
   estilos de cada componente —.clase[data-astro-cid-…]— y eso GANA por
   especificidad a la misma clase escrita en una hoja aparte como home.css. Las
   reglas de home.css existían, se servían al navegador y no se aplicaban. Solo
   midiendo el render se ve.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

/* [selector, ancho del Figma en px a 1440, nota] */
const CASOS = [
  ['.hero__pila',                       693,  'Hero · ilustración'],
  ['.proyecto--eci .proyecto__resumen', 689,  'ECI · Project Copy'],
  ['.proyecto--foc .proyecto__resumen', 579,  'Foc i Cor · copia'],
  ['.proyecto--izaskun .proyecto__resumen', 663, 'Izaskun · copia'],
  ['.producto--itza',                   432,  'Productos · Itza'],
  ['.producto--a11y',                   546,  'Productos · A11y Primero'],
  ['.producto--aa',                     318,  'Productos · Accessible Abstracts'],
  ['.estudio__texto',                  1068,  'Estudio · texto centrado'],
  ['.contacto__titulo',                 962,  'Contacto · titular'],
];
const TOLERANCIA = 2;   // px. Por debajo de esto es redondeo del navegador.

const PUERTO = 4391;
const servidor = await servir(PUERTO);
const ejec = '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejec) ? { executablePath: ejec } : {});
const page = await nav.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

let fallos = 0, medidos = 0;
console.log('\n── Anchos a 1440 px (Figma → medido) ──\n');
for (const [sel, esperado, nota] of CASOS) {
  const w = await page.evaluate(
    (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().width : null; },
    sel,
  );
  if (w === null) {
    fallos++;
    console.error(`  ✗ ${nota.padEnd(34)} NO MEDIDO — ${sel} no existe`);
    continue;
  }
  medidos++;
  const bien = Math.abs(w - esperado) <= TOLERANCIA;
  if (!bien) fallos++;
  console.log(
    `  ${bien ? '✓' : '✗'} ${nota.padEnd(34)} ${String(esperado).padStart(4)} → ${w.toFixed(1).padStart(6)}` +
    (bien ? '' : `   desvío ${(w - esperado).toFixed(1)} px`),
  );
}

await nav.close();
servidor.close();

if (fallos) {
  console.error(`\n${fallos} ancho(s) no coinciden con el Figma.`);
  console.error('Si la regla parece correcta en home.css, mira si el componente');
  console.error('declara esa misma clase: su estilo con scope gana por especificidad.');
  process.exit(1);
}
if (medidos !== CASOS.length) {
  console.error(`\nSolo se midieron ${medidos} de ${CASOS.length}. Pasada incompleta.`);
  process.exit(1);
}
console.log(`\n${medidos} anchos medidos. Todos cuadran con el Figma.`);
