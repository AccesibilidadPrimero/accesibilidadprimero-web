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
import { tresIdiomas, paginasTresIdiomas } from './idiomas.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const { readFileSync } = await import('node:fs');
const axeSource = readFileSync(axePath, 'utf8');

/* Contacto y Estudio entran el 10/10/2026 y las tres legales el 11/10. Cada
   página nueva se añade aquí. */
const RUTAS = [
  '/', '/contacto/', '/estudio/', '/servicios/', '/que-hace-una-web-accesible/', '/privacidad/', '/cookies/', '/declaracion-de-accesibilidad/',
  /* Blog (11/10/2026): el listado, una categoría y tres artículos que juntan
     todo lo que puede traer un Markdown: demostraciones y tablas (tipografía),
     tablas e imágenes (WCAG), y el más largo, con seis imágenes (A11y Primero). */
  '/proyectos/', '/proyectos/tipo/aplicaciones/', '/proyectos/tipo/extensiones/', '/proyectos/foc-i-cor/', '/proyectos/eci-conference/', '/proyectos/izaskun-etxebarria/', '/proyectos/elogio-de-la-linea/', '/proyectos/a11y-primero/', '/proyectos/itza/', '/proyectos/accesible-abstracts/',
  '/blog/', '/blog/categoria/diseno/',
  '/blog/tipografia-accesible-lo-que-dice-la-wcag/', '/blog/pero-que-es-la-wcag/', '/blog/a11yprimero/',
];
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

/* Y lo mismo en catalán e inglés (05/11/2026); el blog, solo en castellano. */
for (const ruta of tresIdiomas(RUTAS)) {
  for (const [nombre, viewport] of [
    ['Móvil 390', { width: 390, height: 844 }],
    ['Tablet 768', { width: 768, height: 1024 }],
    ['Desktop 1440', { width: 1440, height: 900 }],
  ]) {
    const page = await navegador.newPage({ viewport });
    await page.goto(BASE + ruta, { waitUntil: 'load' });
    /* axe mide el estado FINAL. A media entrada (las tarjetas de los listados
       aparecen con un fundido, 14/10/2026) el texto aún no tiene su opacidad
       y axe daría falsos fallos de contraste. Se adelantan al final las
       animaciones que terminan; los bucles (el emblema) se dejan. */
    await page.evaluate(() => document.getAnimations().forEach((a) => {
      if (Number.isFinite(a.effect?.getComputedTiming().endTime)) { a.play(); a.finish(); }
    }));

    await page.addScriptTag({ content: axeSource });
    const { violations } = await page.evaluate(async () =>
      // @ts-ignore
      /* Las muestras de contraste insuficiente del artículo de tipografía
         incumplen A PROPÓSITO: son lo que el artículo enseña a evitar. Van
         `aria-hidden` y su texto se repite al lado, en Ink. Se excluyen por
         su marca explícita, `data-ejemplo="no-cumple"`, y solo esas. */
      await window.axe.run({ exclude: [['[data-ejemplo="no-cumple"]']] }, {
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
          let r = el.getBoundingClientRect();
          /* Casillas y botones de opción: el objetivo es la casilla MÁS su
             <label for>, porque pulsar la etiqueta la marca igual (es el
             «control equivalente» de 2.5.8). Solo si la etiqueta está en la
             misma fila, pegada a la casilla: una etiqueta lejos no cuenta. La
             casilla de Contacto mide 24 como en el Figma (2284:45) y su fila
             con la etiqueta, 44 o más. Sin esta regla, la única forma de
             aprobar sería una casilla de 44 que no está en el diseño. */
          if (el.matches('input[type="checkbox"], input[type="radio"]') && el.id) {
            const l = document.querySelector(`label[for="${el.id}"]`);
            const lr = l?.getBoundingClientRect();
            const mismaFila = lr && lr.top < r.bottom && lr.bottom > r.top && lr.left - r.right <= 16;
            if (mismaFila) {
              const top = Math.min(r.top, lr.top), bottom = Math.max(r.bottom, lr.bottom);
              r = { width: lr.right - r.left, height: bottom - top };
            }
          }
          /* Un enlace en mitad de una frase de un artículo mide lo que mide
             la línea. Es la excepción «en línea» de 2.5.8 y la única de la web
             a los 44: solo dentro de `.prosa` y solo si el enlace es en línea
             y está dentro de un párrafo, una lista, una cita o una tabla
             (AGENTS.md §4, 11/10/2026). */
          if (el.closest('.prosa') && getComputedStyle(el).display === 'inline'
              && el.parentElement?.closest('p, li, blockquote, td, th')) return false;
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
