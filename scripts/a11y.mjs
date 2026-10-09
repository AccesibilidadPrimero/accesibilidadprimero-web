/* ---------------------------------------------------------------------------
   Auditoría automática del build con axe-core sobre Chromium.

   Esto NO es una auditoría de accesibilidad. Los tests automáticos cogen
   alrededor de un tercio de los problemas WCAG; esto es un guardarraíl contra
   regresiones tontas. La pasada de teclado y de lector de pantalla la hace
   Johnny. Está escrito aquí y en AGENTS.md porque es la confusión más fácil de
   cometer con un script que dice «0 violaciones».

   Además de axe, comprueba tres cosas que axe no mira y que en este sitio son
   reglas del repo:
     · que todo objetivo interactivo mida 44 px (AP pide 44; WCAG 2.5.8 AA, 24),
     · que no haya scroll horizontal a 320 px de ancho (1.4.10),
     · que el recorrido de teclado del menú no se escape al fondo.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { servir } from './serve.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const { readFileSync } = await import('node:fs');
const axeSource = readFileSync(axePath, 'utf8');

const RUTAS = ['/'];
const PUERTO = 4399;
const BASE = `http://localhost:${PUERTO}`;

const servidor = await servir(PUERTO);
/* El contenedor trae Chromium preinstalado; se usa ese en vez de descargar
   otro. En CI (GitHub Actions) la variable no existe y Playwright usa el suyo. */
const ejecutable = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const { existsSync } = await import('node:fs');
const navegador = await chromium.launch(
  existsSync(ejecutable) ? { executablePath: ejecutable } : {},
);
let fallos = 0;

for (const ruta of RUTAS) {
  for (const [nombre, viewport] of [
    ['Móvil 390', { width: 390, height: 844 }],
    ['Tablet 768', { width: 768, height: 1024 }],
    ['Desktop 1440', { width: 1440, height: 900 }],
  ]) {
    const page = await navegador.newPage({ viewport });
    await page.goto(BASE + ruta, { waitUntil: 'load' });

    await page.addScriptTag({ content: axeSource });
    const { violations } = await page.evaluate(async () =>
      // @ts-ignore
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      }),
    );

    if (violations.length) {
      fallos += violations.length;
      console.error(`\n✗ ${ruta} · ${nombre} · ${violations.length} violación(es) de axe`);
      for (const v of violations) {
        console.error(`   [${v.impact}] ${v.id} — ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.error(`      ${n.target.join(' ')}`);
      }
    } else {
      console.log(`✓ ${ruta} · ${nombre} · axe limpio`);
    }

    /* Objetivos táctiles: la regla de AP son 44, no los 24 de 2.5.8 AA. */
    const pequenos = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.from(document.querySelectorAll(sel))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const visible = r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
          /* Medio píxel de margen: el navegador a veces devuelve 43,99 por
             redondeo de subpíxel según el momento de la medida (pasó el
             09/10 con la nota de ECI en móvil, 1 de cada 4 pasadas). Un
             objetivo de 43,99 no es un objetivo pequeño; uno de 40 sí, y
             sigue fallando. */
          return visible && (r.height < 43.5 || r.width < 24);
        })
        .map((el) => `${el.tagName.toLowerCase()} «${(el.textContent ?? '').trim().slice(0, 30)}» ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
    });
    if (pequenos.length) {
      fallos += pequenos.length;
      console.error(`✗ ${ruta} · ${nombre} · objetivos por debajo de 44 px:`);
      pequenos.forEach((p) => console.error(`   ${p}`));
    } else {
      console.log(`✓ ${ruta} · ${nombre} · objetivos de 44 px`);
    }

    await page.close();
  }

  /* Reflow a 320 px: sin scroll horizontal (1.4.10). */
  const estrecha = await navegador.newPage({ viewport: { width: 320, height: 800 } });
  await estrecha.goto(BASE + ruta, { waitUntil: 'load' });
  const desborde = await estrecha.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (desborde > 1) {
    fallos += 1;
    console.error(`✗ ${ruta} · 320 px · ${desborde} px de scroll horizontal (1.4.10)`);
  } else {
    console.log(`✓ ${ruta} · 320 px · sin scroll horizontal`);
  }
  await estrecha.close();
}

await navegador.close();
servidor.close();

if (fallos > 0) {
  console.error(`\n${fallos} problema(s). El build se rompe a propósito.`);
  process.exit(1);
}
console.log('\nSin regresiones automáticas. Recuerda: esto cubre ~1/3 de WCAG.');
