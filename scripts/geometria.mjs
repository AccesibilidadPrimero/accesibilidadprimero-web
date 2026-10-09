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

/* [selector, ancho del Figma en px a 1440, nota]

   El escenario del hero mide 560 y no 693: lo fija el HTML de referencia que
   mandó Johnny el 07/10/2026 —min(90vw, 560px), proporción 338,4 / 299,43—,
   que sustituye a la medida del frame antiguo del Figma. */
/* 09/10: margen 24 y columna de 1392 (antes 48 y 1344), en la web y en el
   Figma. Comprobado contra el documento el mismo día: productos 448, campo de
   ECI 1392, Foc 688 desde 728, Izaskun 684 desde 732 y campo de 1159. Las
   medidas de lectura (copias, Estudio, contacto) siguen en píxeles fijos. */
const CASOS = [

  ['.proyecto--eci .proyecto__resumen', 689,  'ECI · Project Copy (fijo)'],
  ['.proyecto--foc .proyecto__resumen', 579,  'Foc i Cor · copia (fijo)'],
  ['.proyecto--izaskun .proyecto__resumen', 684, 'Izaskun · copia (columna derecha)'],
  ['.producto--itza',                   448,  'Productos · Itza'],
  ['.producto--a11y',                   448,  'Productos · A11y Primero'],
  ['.producto--aa',                     448,  'Productos · Accessible Abstracts'],
  ['.estudio__texto',                  1068,  'Estudio · texto centrado (fijo)'],
  ['.contacto__titulo',                 962,  'Contacto · titular (tope fijo)'],
];
const TOLERANCIA = 2;   // px. Por debajo de esto es redondeo del navegador.

/* El hero no entra en la tabla de anchos: su escenario lo manda la ALTURA
   —las mesas de trabajo de Illustrator miden 400 px de alto y el ancho que
   cada dibujo necesite—, así que el ancho es el del contenedor y medirlo no
   dice nada. Se comprueba el alto aparte, abajo. */
const ALTO_ESCENARIO = { 1440: 558, 768: 412, 390: 305 };

const PUERTO = 4391;
const servidor = await servir(PUERTO);
const ejec = '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejec) ? { executablePath: ejec } : {});
const page = await nav.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

let fallos = 0, medidos = 0;
/* Cuántas comprobaciones DEBERÍA haber hecho esta pasada. Cada bloque suma
   las suyas al declararse, en vez de un total escrito a mano: ese total se
   quedó desfasado en cuanto añadí la retícula y la columna, y el script se
   rompió a sí mismo diciendo «solo se midieron 27 de 11». Un contador que hay
   que acordarse de actualizar acaba mintiendo. */
let esperadas = 0;
esperadas += CASOS.length;
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

/* ---- La retícula vertical del hero, frame por frame del Figma -------------
   Home / Desktop 1440 · 145:852. El escenario pinta la ilustración con su
   aire —79 + 400 + 79 = 558—; el Slider Control del documento no se dibuja,
   por decisión de Johnny. El hero ocupa la ventana entera. */
console.log('\n── Retícula del hero a 1440 (Figma → medido) ──\n');
{
  const p2 = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await p2.evaluate(() => document.fonts.ready);
  /* El carrusel está rotando, y el control cambia de ancho con cada lámina.
     Enfocarlo lo para —misma paridad que el puntero— y así se mide una lámina
     quieta en vez de pillar el fundido a medias. */
  await p2.focus('.hero__control');
  await p2.waitForTimeout(800);
  const m = await p2.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
    const hero = r('.hero'), head = r('header'), esc = r('.hero__escenario'),
          pila = r('.hero__pila'), ctrl = r('.hero__control'), banda = r('.hero__banda'),
          txt = r('.hero__frase--base'), cta = r('.hero__banda a'),
          dibujo = r('.hero__lamina[data-activa] img');
    if (!hero || !head || !esc || !pila || !ctrl || !banda || !txt || !cta || !dibujo) return null;
    return {
      /* Texto a 24 del borde (09/10): 24 + 26 + 24. Antes 96. */
      'Header · alto': [74, head.height],
      'Carousel Stage · alto': [558, esc.height],
      'Ilustración · alto': [400, pila.height],
      /* 15 + 44 + 15: el texto queda a 24 arriba y abajo. Antes 84. */
      'Hero Band · alto': [74, banda.height],
      'Hero Section · ventana': [900, hero.height],
      'Texto de banda · y dentro': [24, txt.top - banda.top],
      /* 804 era el ancho que OCUPABA la frase a 22 px en el Figma, no una
         medida de diseño. Con el cuerpo a 19 (09/10) ocupa menos. Lo que se
         comprueba es lo que importa: una sola línea y dentro de los 804. */
      'Texto de banda · una línea, ≤ 804': [1, (txt.width <= 804 && txt.height < 40) ? 1 : 0],
      'CTA de banda · y dentro': [15, cta.top - banda.top],
      /* El control es transparente y mide lo que la ilustración que esté
         delante (Johnny, 08/10/2026): la zona que responde al cursor es el
         dibujo, no la franja de 1344 de ancho que llegaba hasta los márgenes.

         No se compara contra un número fijo, sino contra la caja del dibujo
         que esté activo: el ancho lo manda cada ilustración y un número a
         mano aquí solo mediría cuál tocó enseñar. Lo que se comprueba es que
         SIGUE ESTANDO, que calca el dibujo y que está centrado sobre él: el
         mecanismo de pausa de 2.2.2 no puede desaparecer, encogerse ni
         descolocarse sin que nadie se entere. */
      'Control · alto = dibujo': [dibujo.height, ctrl.height],
      'Control · ancho = dibujo': [dibujo.width, ctrl.width],
      'Control · centrado en x': [0, (ctrl.left + ctrl.width / 2) - (dibujo.left + dibujo.width / 2)],
      'Control · centrado en y': [0, (ctrl.top + ctrl.height / 2) - (dibujo.top + dibujo.height / 2)],
      /* Y que no se ha quedado en un sello: 2.5.8 pide 24 × 24 y aquí el
         dibujo más estrecho da 287 de ancho. Si alguien rompe el cálculo y el
         botón se queda en 0, esto lo caza. */
      'Control · bastante más de 24': [1, ctrl.width >= 24 && ctrl.height >= 24 ? 1 : 0],
    };
  });
  await p2.close();
  if (!m) { fallos++; console.error('  ✗ no encuentro las piezas del hero'); }
  else { esperadas += Object.keys(m).length;
  for (const [nombre, [esperado, real]] of Object.entries(m)) {
    medidos++;
    const bien = Math.abs(real - esperado) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(28)} ${String(esperado).padStart(4)} → ${real.toFixed(1).padStart(7)}`);
  } }
}

/* ---- Las TRES composiciones de proyecto -----------------------------------
   Figma `Producción · Home` (2239:573). No es el mismo bloque tres veces, y
   darlo por hecho fue el error del 09/10: medí los `Content slider` sueltos y
   monté los tres proyectos iguales. Cada caso tiene su maquetación:

     ECI      apilado, todo a ancho completo
     Foc      copia a la izquierda a media altura, campo a la derecha (664)
     Izaskun  texto a dos columnas, campo estrecho (1119) y CTA a la derecha

   Se mide el render con el «Leer más» de Izaskun ABIERTO, porque su ampliación
   es la segunda columna y cerrada no ocupa nada. */
console.log('\n── Las tres composiciones de proyecto a 1440 (Figma → medido) ──\n');
{
  const p4 = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p4.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await p4.evaluate(() => document.fonts.ready);
  await p4.click('.proyecto--izaskun [data-disclosure-trigger]');
  await p4.waitForTimeout(250);
  const CASOS = [
    ['ECI · campo a ancho completo', '.proyecto--eci .slider', 1392, 'width'],
    ['Foc · campo a la derecha', '.proyecto--foc .slider', 688, 'width'],
    ['Foc · campo empieza en 728', '.proyecto--foc .slider', 728, 'left'],
    ['Foc · copia a la izquierda', '.proyecto--foc .proyecto__resumen', 579, 'width'],
    ['Izaskun · resumen en x 732', '.proyecto--izaskun .proyecto__resumen', 732, 'left'],
    ['Izaskun · resumen', '.proyecto--izaskun .proyecto__resumen', 684, 'width'],
    ['Izaskun · ampliación en x 732', '.proyecto--izaskun .disclosure__panel', 732, 'left'],
    ['Izaskun · ampliación', '.proyecto--izaskun .disclosure__panel', 684, 'width'],
    ['Izaskun · campo estrecho', '.proyecto--izaskun .slider', 1159, 'width'],
    ['Izaskun · CTA alineado a 732', '.proyecto--izaskun .proyecto__cta', 732, 'left'],
  ];
  const medidas = await p4.evaluate((casos) => casos.map(([n, sel, esp, q]) => {
    const e = document.querySelector(sel);
    if (!e) return { n, esp, real: null };
    const b = e.getBoundingClientRect();
    return { n, esp, real: q === 'width' ? b.width : b.left };
  }), CASOS);
  await p4.close();
  esperadas += medidas.length;
  for (const m of medidas) {
    medidos++;
    if (m.real === null) { fallos++; console.error(`  ✗ ${m.n.padEnd(32)} no encuentro el elemento`); continue; }
    const bien = Math.abs(m.real - m.esp) <= 4;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${m.n.padEnd(32)} ${String(m.esp).padStart(4)} → ${m.real.toFixed(0).padStart(5)}`);
  }
}

/* ---- El símbolo de Estudio ------------------------------------------------
   Figma `2080:531`: un marco de 60 × 60 con el símbolo dentro. Medido sobre el
   render del documento, el dibujo ocupa 50,25 × 44,5 y está centrado. Se
   comprueba el marco, el ancho del dibujo y que esté centrado en la página,
   porque la sección entera va centrada y no a la columna de 48. */
console.log('\n── El símbolo de Estudio a 1440 (Figma → medido) ──\n');
{
  const p3 = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p3.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  const m = await p3.evaluate(() => {
    const caja = document.querySelector('.estudio__icono');
    const img = caja?.querySelector('img');
    if (!caja || !img) return null;
    const c = caja.getBoundingClientRect(), i = img.getBoundingClientRect();
    return {
      'Marco · ancho': [60, c.width],
      'Marco · alto': [60, c.height],
      'Símbolo · ancho': [50, i.width],
      /* El alto no se escribe a mano: sale de la proporción del archivo. */
      'Símbolo · alto': [50 / (338.4 / 299.43), i.height],
      'Símbolo · centrado en el marco': [0, (i.left + i.width / 2) - (c.left + c.width / 2)],
      'Marco · centrado en la página': [0, (c.left + c.width / 2) - 720],
    };
  });
  await p3.close();
  if (!m) { fallos++; console.error('  ✗ no encuentro el icono de Estudio'); }
  else { esperadas += Object.keys(m).length;
  for (const [nombre, [esperado, real]] of Object.entries(m)) {
    medidos++;
    const bien = Math.abs(real - esperado) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(32)} ${esperado.toFixed(1).padStart(5)} → ${real.toFixed(1).padStart(6)}`);
  } }
}

/* ---- La columna: todo arranca en el margen de 24 -------------------------- */
console.log('\n── La columna a 1440 (margen 24) ──\n');
{
  const EN_COLUMNA = [
    ['.header__logo', 'Logo'],
    ['.hero__frase--base', 'Hero · frase'],
    ['.hero__escenario', 'Hero · escenario'],
    ['.proyecto__titulo', 'Proyecto · título'],
    ['.productos__intro', 'Productos · titular'],
    ['.productos__lista', 'Productos · fila'],
    ['.contacto__titulo', 'Contacto · titular'],
  ];
  esperadas += EN_COLUMNA.length;
  const p3 = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p3.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  for (const [sel, nombre] of EN_COLUMNA) {
    const x = await p3.evaluate((s) => {
      const e = document.querySelector(s);
      return e ? e.getBoundingClientRect().left : null;
    }, sel);
    medidos++;
    if (x === null) { fallos++; console.error(`  ✗ ${nombre.padEnd(22)} no existe (${sel})`); continue; }
    const bien = Math.abs(x - 24) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(22)} izq 24 → ${x.toFixed(1)}`);
  }
  await p3.close();
}

/* ---- Texto a 24 del borde (Johnny, 09/10) ---------------------------------
   En la cabecera, la banda del hero y el pie, lo que queda a 24 del borde es
   el TEXTO, no la caja del control de 44. Para un control se mide el centro de
   su caja menos media línea: es donde empieza y acaba la línea de texto. */
console.log('\n── Texto a 24 del borde, a 1440 ──\n');
{
  const p5 = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p5.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await p5.evaluate(() => document.fonts.ready);
  const m = await p5.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect();
    const lh = (s) => parseFloat(getComputedStyle(document.querySelector(s)).lineHeight);
    const head = r('.header'), link = r('.header__link'), logo = r('.header__logo');
    const banda = r('.hero__banda'), frase = r('.hero__frase--base'), cta = r('.hero__banda a');
    const pie = r('.pie'), enl = r('.pie__enlace');
    if (!head || !link || !logo || !banda || !frase || !cta || !pie || !enl) return null;
    const arribaTexto = (b, l) => b.top + (b.height - l) / 2;
    const abajoTexto = (b, l) => b.top + (b.height + l) / 2;
    return {
      'Cabecera · logotipo a 24 de arriba': [24, arribaTexto(logo, lh('.header__logo')) - head.top],
      'Cabecera · menú a 24 de arriba': [24, arribaTexto(link, lh('.header__link')) - head.top],
      'Banda · frase a 24 de abajo': [24, banda.bottom - frase.bottom],
      'Banda · enlace a 24 de abajo': [24, banda.bottom - abajoTexto(cta, lh('.hero__banda a'))],
      'Pie · texto a 24 de abajo': [24, pie.bottom - abajoTexto(enl, lh('.pie__enlace'))],
    };
  });
  await p5.close();
  if (!m) { fallos++; console.error('  ✗ no encuentro cabecera, banda o pie'); }
  else { esperadas += Object.keys(m).length;
  for (const [nombre, [esperado, real]] of Object.entries(m)) {
    medidos++;
    const bien = Math.abs(real - esperado) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(36)} ${String(esperado).padStart(3)} → ${real.toFixed(1).padStart(6)}`);
  } }
}

/* El alto del escenario en los tres anchos. */
console.log('\n── Alto del Carousel Stage en los tres anchos ──\n');
esperadas += Object.keys(ALTO_ESCENARIO).length;
for (const [ancho, esperado] of Object.entries(ALTO_ESCENARIO)) {
  const p = await nav.newPage({ viewport: { width: Number(ancho), height: 900 } });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  const h = await p.evaluate(() => document.querySelector('.hero__escenario')?.getBoundingClientRect().height ?? null);
  await p.close();
  if (h === null) { fallos++; console.error(`  ✗ ${ancho} px · no encuentro .hero__pila`); continue; }
  medidos++;
  const bien = Math.abs(h - esperado) <= TOLERANCIA;
  if (!bien) fallos++;
  console.log(`  ${bien ? '✓' : '✗'} a ${String(ancho).padStart(4)} px de ancho   ${String(esperado).padStart(4)} → ${h.toFixed(1).padStart(6)}`);
}

/* ---- La zona sensible del hero calca el dibujo, las ocho y a los tres anchos
   Johnny, 08/10/2026: «el area de "stop" "reproducir" debe ser sobre la imagen,
   para que sea intuitivo el juego de mover el cursor sobre las imágenes».

   Antes el control ocupaba el escenario entero —1344 × 558— y el carrusel se
   paraba al entrar el cursor en una franja invisible que llegaba a los
   márgenes. Ahora mide lo que el dibujo. Lo que se compara es la caja del
   botón contra la caja PINTADA de la ilustración, que no es la del <img>: con
   `object-fit: contain`, cuando `max-width` recorta, el dibujo queda
   apaisado dentro de una caja más alta —la trompeta a 390 px pinta 342 × 178
   dentro de un <img> de 342 × 225— y el botón tiene que seguir al dibujo, no
   al hueco. Se recorren las ocho a mano porque el ancho lo manda cada una. */
console.log('\n── El control calca el dibujo · ocho ilustraciones × tres anchos ──\n');
for (const ancho of [390, 768, 1440]) {
  const p = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  /* Enfocar el control lo para: si no, se mide el fundido a medias y el ancho
     del botón va por detrás del de la lámina. */
  await p.focus('.hero__control');
  await p.waitForTimeout(700);
  const filas = await p.evaluate(async (fade) => {
    const laminas = [...document.querySelectorAll('.hero__lamina')];
    const raiz = document.querySelector('[data-carrusel]');
    const out = [];
    for (const l of laminas) {
      laminas.forEach((x) => x.removeAttribute('data-activa'));
      l.setAttribute('data-activa', '');
      raiz.style.setProperty('--ratio-activa', l.dataset.ratio);
      await new Promise((r) => setTimeout(r, fade));
      const c = document.querySelector('.hero__control').getBoundingClientRect();
      const caja = l.querySelector('img').getBoundingClientRect();
      const ratio = Number(l.dataset.ratio);
      /* La caja pintada: el dibujo encajado por `contain` dentro del <img>. */
      const esc = Math.min(caja.width / ratio, caja.height);
      out.push({
        nombre: l.querySelector('img').src.split('/').pop().split('.')[0],
        cw: c.width, ch: c.height, dw: esc * ratio, dh: esc,
      });
    }
    return out;
  }, 750);
  await p.close();
  esperadas += filas.length;
  for (const f of filas) {
    medidos++;
    const bien = Math.abs(f.cw - f.dw) <= TOLERANCIA && Math.abs(f.ch - f.dh) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${String(ancho).padStart(4)} px · ${f.nombre.padEnd(15)}` +
      ` control ${f.cw.toFixed(0).padStart(4)}×${f.ch.toFixed(0).padStart(3)}` +
      `   dibujo ${f.dw.toFixed(0).padStart(4)}×${f.dh.toFixed(0).padStart(3)}`);
  }
}

/* ---- Móvil 390 · Home / Móvil 390 del Figma (2203:456) -----------------
   Medido el 09/10. Los estilos de texto son los de escritorio; lo que se
   comprueba aquí es el espacio, el orden y qué texto se enseña. */
console.log('\n── Móvil 390 (Figma → medido) ──\n');
{
  /* Con movimiento reducido: la aparición al hacer scroll sube los bloques
     16 px y se mediría a medio camino. Reducido solo funde, no desplaza. */
  const p = await nav.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect() ?? null;
    const w = (s) => r(s)?.width ?? -1;
    const debajo = (a, b) => { const x = r(a), y = r(b); return x && y && y.top >= x.bottom ? 1 : 0; };
    const visible = (s) => { const e = document.querySelector(s); return e ? e.innerText.trim() : ''; };
    const sec = (s) => r(`.proyecto--${s}`);
    return {
      'ECI · campo de color': [342, w('.proyecto--eci .slider')],
      'Foc i Cor · campo de color': [342, w('.proyecto--foc .slider')],
      'Izaskun · campo de color': [342, w('.proyecto--izaskun .slider')],
      'ECI · captura': [294, w('.proyecto--eci .slider__pila')],
      'Foc i Cor · captura': [294, w('.proyecto--foc .slider__pila')],
      'Izaskun · captura': [294, w('.proyecto--izaskun .slider__pila')],
      'ECI · título a 40 de la sección': [40, document.querySelector('.proyecto--eci .proyecto__titulo').getBoundingClientRect().top - sec('eci').top],
      'Foc i Cor · título a 88 (48 + 40)': [88, document.querySelector('.proyecto--foc .proyecto__titulo').getBoundingClientRect().top - sec('foc').top],
      'ECI · enlace ANTES de las capturas': [1, debajo('.proyecto--eci .proyecto__cta', '.proyecto--eci .slider')],
      'Foc i Cor · enlace DESPUÉS': [1, debajo('.proyecto--foc .slider', '.proyecto--foc .proyecto__cta')],
      'Izaskun · enlace DESPUÉS': [1, debajo('.proyecto--izaskun .slider', '.proyecto--izaskun .proyecto__cta')],
      'Productos · columna': [342, w('.producto--itza')],
      'Estudio · caja de la frase': [274, w('.estudio__texto')],
      'Productos · texto de móvil': [1, visible('.productos__intro').startsWith('Aplicaciones') ? 1 : 0],
      'Estudio · texto de móvil': [1, visible('.estudio__texto').startsWith('Somos') ? 1 : 0],
      'Pie · lema, legales, ©': [1, debajo('.pie__lema', '.pie__nav') && debajo('.pie__nav', '.pie__copy') ? 1 : 0],
      'Hero · ocupa la pantalla': [844, r('.hero').bottom],
    };
  });
  await p.close();
  for (const [nombre, [esperado, real]] of Object.entries(m)) {
    esperadas++; medidos++;
    const bien = Math.abs(real - esperado) <= TOLERANCIA;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(36)} ${String(esperado).padStart(3)} → ${Number(real).toFixed(1).padStart(6)}`);
  }
}
{
  /* Y en escritorio siguen los textos de siempre. */
  const p = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  const t = await p.evaluate(() => [
    document.querySelector('.productos__intro').innerText.trim().startsWith('Desarrollamos') ? 1 : 0,
    document.querySelector('.estudio__texto').innerText.trim().startsWith('Accesibilidad Primero es') ? 1 : 0,
  ]);
  await p.close();
  for (const [i, nombre] of ['1440 · Productos · texto de escritorio', '1440 · Estudio · texto de escritorio'].entries()) {
    esperadas++; medidos++;
    if (t[i] !== 1) fallos++;
    console.log(`  ${t[i] === 1 ? '✓' : '✗'} ${nombre}`);
  }
}

await nav.close();
servidor.close();

if (fallos) {
  console.error(`\n${fallos} ancho(s) no coinciden con el Figma.`);
  console.error('Si la regla parece correcta en home.css, mira si el componente');
  console.error('declara esa misma clase: su estilo con scope gana por especificidad.');
  process.exit(1);
}
if (medidos !== esperadas) {
  console.error(`\nSolo se midieron ${medidos} de ${esperadas}. Pasada incompleta.`);
  process.exit(1);
}
console.log(`\n${medidos} medidas de geometría. Todo cuadra.`);
