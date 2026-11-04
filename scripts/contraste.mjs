/* ---------------------------------------------------------------------------
   Contraste medido por píxel, no leído del CSS.

   Es la regla propia de la casa (claude/regla-velo-sobre-fotografia.md):
   cualquier medidor que lea el `background-color` de un ancestro «falla en las
   dos direcciones: marca fallos que no existen y se traga los que sí». Pasa
   con velos sobre fotografía, con degradados y con cualquier fondo que no sea
   un color plano declarado justo encima.

   El método: se renderiza la página, se captura, y se vuelve a capturar con
   todo el texto en transparente. La segunda captura da el fondo REAL que hay
   detrás de cada caja de texto. Se muestrea el píxel más claro y el más oscuro
   bajo cada caja y se compara con el color del texto.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';
import { recorrer } from './recorrer.mjs';

const PUERTO = 4397;

function luminancia([r, g, b]) {
  const c = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}
const ratio = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const parse = (css) => (css.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
/* Páginas que se miden. Contacto entra el 10/10/2026, en reposo y con los
   errores abiertos: los mensajes de error no existen hasta que alguien envía
   mal, y son justo el texto que más tiene que leerse. `minimo` es el suelo de
   cajas por página, por el mismo motivo que el de abajo. */
const RUTAS = [
  { nombre: 'Home', url: '/', minimo: 20 },
  { nombre: 'Contacto', url: '/contacto/', minimo: 15 },
  { nombre: 'Contacto con errores', url: '/contacto/', minimo: 15,
    preparar: async (p) => { await p.click('.boton'); await p.waitForTimeout(150); } },
  { nombre: 'Estudio', url: '/estudio/', minimo: 30 },
  /* Servicios: la banda del hero pasa por tres colores. Se mide en cada uno
     (30/10/2026) y con todos los desplegables abiertos: lo que está cerrado
     no se pinta y no se mediría (03/11/2026). */
  ...['var(--mint)', 'var(--rose-ap)', 'var(--yellow-ap)'].map((color) => ({
    nombre: `Servicios · ${color.slice(6, -1)}`, url: '/servicios/', minimo: 40,
    preparar: async (p) => {
      /* Con «reducir movimiento» (así se mide aquí) el botón no se pinta y
         el color ya no cambia: basta con ponerlo. */
      await p.evaluate((c) => {
        const b = document.querySelector('[data-fondos-control]');
        if (b && !b.hidden) b.click();
        document.querySelector('[data-fondos]').style.setProperty('--surface-accent', c);
        document.querySelectorAll('[data-plegable-boton][aria-expanded="false"]').forEach((x) => x.click());
      }, color);
      await p.waitForTimeout(1000);
    },
  })),
  { nombre: 'Privacidad', url: '/privacidad/', minimo: 30 },
  { nombre: 'Cookies', url: '/cookies/', minimo: 15 },
  { nombre: 'Accesibilidad', url: '/declaracion-de-accesibilidad/', minimo: 25 },
  { nombre: 'Proyectos', url: '/proyectos/', minimo: 10 },
  { nombre: 'Proyectos · Aplicaciones', url: '/proyectos/tipo/aplicaciones/', minimo: 4 },
  { nombre: 'Caso Foc i Cor', url: '/proyectos/foc-i-cor/', minimo: 40 },
  { nombre: 'Caso ECI Conference', url: '/proyectos/eci-conference/', minimo: 30 },
  { nombre: 'Caso Izaskun Etxebarria', url: '/proyectos/izaskun-etxebarria/', minimo: 20 },
  { nombre: 'Caso A11y Primero', url: '/proyectos/a11y-primero/', minimo: 20 },
  { nombre: 'Caso Itza', url: '/proyectos/itza/', minimo: 20 },
  { nombre: 'Caso Accessible Abstracts', url: '/proyectos/accessible-abstracts/', minimo: 20 },
  { nombre: 'Caso Elogio de la línea', url: '/proyectos/elogio-de-la-linea/', minimo: 20 },
  { nombre: 'Blog', url: '/blog/', minimo: 20 },
  { nombre: 'Blog · tipografía', url: '/blog/tipografia-accesible-lo-que-dice-la-wcag/', minimo: 40 },
  { nombre: 'Blog · WCAG', url: '/blog/pero-que-es-la-wcag/', minimo: 60 },
];

let fallos = 0, medidas = 0;
for (const ruta of RUTAS) {
  let medidasRuta = 0;
  const page = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}${ruta.url}`, { waitUntil: 'load' });
  // El carrusel se para para que el fondo no cambie entre las dos capturas.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  // Con reducir movimiento, lo que aún no ha entrado en pantalla está en
  // opacidad 0 y el medidor lo saltaría. Se recorre la página antes de medir.
  await recorrer(page);
  /* Las fuentes, cargadas ANTES de medir. Si la primera pasada se hace con la
     tipografía de reserva, el texto ocupa más líneas, la página es más alta y
     las cajas caen sobre otra cosa en la captura (que ya lleva Instrument
     Sans). Pasó con los artículos largos del blog el 11/10: «fallos» de 2,3:1
     que eran el texto medido encima de las portadas de «Sigue leyendo». */
  await page.evaluate(() => document.fonts.ready);
  /* La ventana, ya del alto de la página entera. La captura de página entera
     de Chromium estira la ventana para hacerse, y todo lo que dependa de su
     alto (unidades vh, imágenes diferidas que entran de golpe) puede moverse
     ENTRE medir y capturar. Midiendo ya con ese alto, las dos pasadas ven la
     misma página. Lo destaparon los artículos largos del blog el 11/10:
     «fallos» de 2,3:1 que eran texto medido encima de una portada. */
  /* Los heros a pantalla entera (100svh) crecerían con la ventana y la
     página no dejaría de alargarse: se congelan al alto que tienen con la
     ventana normal antes de estirarla (13/10/2026). */
  await page.evaluate(() => {
    for (const h of document.querySelectorAll('.apertura, .hero')) h.style.minHeight = `${h.getBoundingClientRect().height}px`;
  });
  for (let i = 0; i < 3; i++) {
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1440, height: alto });
    await page.waitForTimeout(250);
    if (alto === await page.evaluate(() => document.documentElement.scrollHeight)) break;
  }
  // Estados que solo existen tras una acción (los errores de Contacto).
  if (ruta.preparar) {
    await ruta.preparar(page);
    /* Los mensajes de error alargan la página. Si la ventana no se vuelve a
       ajustar, la captura de página entera la estira ENTRE medir y capturar
       y las cajas caen sobre otra cosa (el botón negro): «fallos» de 1:1 que
       salían a ratos en el CI (04/11/2026). */
    for (let i = 0; i < 3; i++) {
      const alto = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: 1440, height: alto });
      await page.waitForTimeout(250);
      if (alto === await page.evaluate(() => document.documentElement.scrollHeight)) break;
    }
  }

  /* Cajas de texto visibles, con su color y su tamaño efectivo. */
  const cajas = await page.evaluate(() => {
    const salida = [];
    const andar = (nodo) => {
      for (const hijo of nodo.childNodes) {
        if (hijo.nodeType === Node.TEXT_NODE && hijo.textContent.trim().length > 1) {
          const el = hijo.parentElement;
          if (!el) continue;
          /* Las dos muestras de gris que NO cumplen, a propósito (artículo de
             tipografía). Solo esas: las que cumplen se miden. */
          if (el.closest('[data-ejemplo="no-cumple"]')) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
          // sr-only: está en el árbol pero no se ve. Medirlo es el falso
          // positivo clásico (ya nos pasó con los títulos de Izaskun).
          const r = el.getBoundingClientRect();
          if (r.width <= 1 || r.height <= 1) continue;
          const px = parseFloat(cs.fontSize);
          const peso = parseInt(cs.fontWeight, 10) || 400;
          salida.push({
            texto: hijo.textContent.trim().slice(0, 48),
            color: cs.color,
            px, peso,
            grande: px >= 24 || (px >= 18.66 && peso >= 700),
            rect: { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height },
          });
        } else if (hijo.nodeType === Node.ELEMENT_NODE) andar(hijo);
      }
    };
    andar(document.body);
    return salida;
  });

  /* Segunda pasada: todo el texto transparente. Lo que queda es el fondo real. */
  await page.addStyleTag({ content: '*, *::before, *::after { color: transparent !important; text-shadow: none !important; }' });
  await page.waitForTimeout(120);
  const fondo = await page.screenshot({ fullPage: true });

  const { createCanvas, loadImage } = await import('./png.mjs');
  const img = await loadImage(fondo);

  for (const caja of cajas) {
    const muestras = img.muestrear(caja.rect);
    if (!muestras.length) continue;
    const color = parse(caja.color);
    const peores = muestras
      .map((p) => ({ p, r: ratio(color, p) }))
      .sort((a, b) => a.r - b.r);
    const peor = peores[0];
    const minimo = caja.grande ? 3 : 4.5;
    medidas++; medidasRuta++;
    if (peor.r < minimo) {
      fallos++;
      console.error(
        `✗ ${ruta.nombre} · ${peor.r.toFixed(2)}:1 (mínimo ${minimo}) · ${caja.px}px · «${caja.texto}» · texto rgb(${color}) sobre rgb(${peor.p})`,
      );
    }
  }
  await page.close();
  console.log(`${ruta.nombre}: ${medidasRuta} cajas.`);
  if (medidasRuta < ruta.minimo) {
    console.error(`✗ ${ruta.nombre}: solo ${medidasRuta} cajas (se esperan al menos ${ruta.minimo}). ¿Se construyó la página?`);
    process.exit(1);
  }
}

await navegador.close();
servidor.close();

console.log(`\n${medidas} cajas de texto medidas por píxel.`);
if (fallos) { console.error(`${fallos} por debajo del mínimo.`); process.exit(1); }
/* Un suelo, por el mismo motivo que en tipografia.mjs: si el servidor sirve una
   página vacía o un 404, aquí no hay cajas que medir y «0 medidas, todas pasan»
   se lee como un aprobado. La Home tiene decenas de cajas de texto; por debajo
   de 20 es que estamos auditando otra cosa. */
const MINIMO_CAJAS = 20;
if (medidas < MINIMO_CAJAS) {
  console.error(
    `Solo ${medidas} cajas (se esperan al menos ${MINIMO_CAJAS}).\n` +
    'La página auditada no es la web. Revisa que dist/ se haya construido.',
  );
  process.exit(1);
}
console.log('Todas pasan 1.4.3.');
