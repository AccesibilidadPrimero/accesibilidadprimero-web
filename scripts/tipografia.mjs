/* ---------------------------------------------------------------------------
   La escala tipográfica de la web, comprobada sobre lo que PINTA EL NAVEGADOR.

   Desde el 08/10/2026 la escala es radical y cabe en una frase:
   **dos tamaños, un peso, dos colores.**

     · `--texto`   17 · 18 · 19   TODO: titulares de proyecto, resúmenes,
                                  navegación, la nota de accesibilidad.
     · `--display` 34 · 40 · 48   SOLO dos frases: el titular de Productos y
                                  el de Estudio.
     · `--meta`    15 · 15 · 16   SOLO los créditos del pie. La norma se rompe
                                  ahí a propósito: no se leen, se consultan.
     · peso 400 en todo.
     · negro `#171717` por defecto; gris `#686864` (Ink / Secondary) SOLO la nota de accesibilidad.

   OJO: esto YA NO COINCIDE CON EL FIGMA. El documento sigue trayendo siete
   estilos y el Medium en H3; la web va por delante a propósito. Hasta que el
   Figma se actualice, la referencia es este archivo.

   No se lee el CSS: se mide el valor calculado sobre elementos reales, y
   además se barre la página entera. Un listado de selectores comprueba los que
   alguien se acordó de poner; el barrido comprueba los que no.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';
import { tresIdiomas, paginasTresIdiomas } from './idiomas.mjs';

/* Las DOS únicas frases que se salen del tamaño único. Si alguien añade una
   tercera, el barrido de más abajo la caza igual, pero esto nombra las que
   están autorizadas. */
const EXCEPCIONES = [
  { quien: 'Productos · titular', sel: '.productos__intro' },
  { quien: 'Estudio · titular',   sel: '.estudio__texto' },
];
const DISPLAY = { 390: [34, 40], 768: [40, 48], 1440: [48, 56] };
const META    = { 390: [15, 20], 768: [15, 20], 1440: [16, 20] };
const TEXTO   = { 390: [17, 24], 768: [18, 22], 1440: [19, 26] };   // 1440: 22/28 hasta el 09/10

/* Un puñado de sitios que TIENEN que estar en el tamaño único, elegidos porque
   antes eran siete estilos distintos: si alguno se escapa, es que volvió una
   escala. */
const AL_TAMANO_UNICO = [
  ['.hero__frase--base',   'Hero · h1'],
  ['.proyecto__titulo',    'Proyecto · título'],
  ['.proyecto__resumen',   'Proyecto · resumen'],
  ['.contacto__titulo',    'Contacto · titular'],
  ['.producto__nombre',    'Producto · nombre'],
  ['.header__link',        'Navegación'],
  ['.meta',                'Nota de accesibilidad'],
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
let esperados_extra = 0;
let fallos = 0;
let medidos = 0;

for (const ancho of [390, 768, 1440]) {
  const page = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  console.log(`\n── ${ancho} px ───────────────────────────────`);

  const mide = async (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { px: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) };
  }, sel);

  const comparar = (nombre, m, [epx, elh], sel) => {
    if (!m) { fallos++; medidos++; esperados_extra++;
      console.error(`  ✗ ${nombre.padEnd(24)} NO MEDIDO — ${sel} no existe`); return; }
    medidos++; esperados_extra++;
    const bien = Math.abs(m.px - epx) <= 0.5 && Math.abs(m.lh - elh) <= 1;
    if (!bien) fallos++;
    console.log(`  ${bien ? '✓' : '✗'} ${nombre.padEnd(24)} ${m.px.toFixed(1)}/${m.lh.toFixed(0)}` +
      `  (toca ${epx}/${elh})`);
  };

  for (const [sel, nombre] of AL_TAMANO_UNICO) comparar(nombre, await mide(sel), TEXTO[ancho], sel);
  for (const e of EXCEPCIONES) comparar(e.quien, await mide(e.sel), DISPLAY[ancho], e.sel);
  comparar('Pie · créditos', await mide('.pie__copy'), META[ancho], '.pie__copy');

  /* El barrido. Dos salvedades: los `<sup>` del `®` van en `em` sobre su línea
     y no son una talla; y los créditos del pie usan `--meta`, que es la
     excepción autorizada —pero SOLO ahí: un 15 px fuera del `<footer>` falla. */
  const sueltos = await page.evaluate(({ texto, display, meta }) => {
    const fuera = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.tagName === 'SUP' || el.closest('sup')) continue;
      const propio = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!propio) continue;
      const caja = el.getBoundingClientRect();
      if (!caja.width || !caja.height) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      const permitidos = el.closest('footer') ? [texto, display, meta] : [texto, display];
      if (!permitidos.some((v) => Math.abs(px - v) <= 0.5))
        fuera.push({ px: px.toFixed(1), texto: propio.slice(0, 40),
          donde: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim()
            ? '.' + el.className.trim().split(/\s+/)[0] : '') });
    }
    return fuera;
  }, { texto: TEXTO[ancho][0], display: DISPLAY[ancho][0], meta: META[ancho][0] });
  medidos++; esperados_extra++;
  if (sueltos.length) {
    fallos++;
    console.error(`  ✗ ${'Barrido de la página'.padEnd(24)} ${sueltos.length} fuera de los dos tamaños:`);
    for (const x of sueltos.slice(0, 8)) console.error(`      ${x.px} px  ${x.donde.padEnd(22)} ${x.texto}`);
  } else {
    console.log(`  ✓ ${'Barrido de la página'.padEnd(24)} ni un tamaño fuera de los dos`);
  }

  await page.close();
}

/* ---- Un solo peso en toda la web -----------------------------------------
   Johnny, 08/10/2026: «Se va». El Medium desaparece y la distinción entre lo
   que nombra y lo que explica la lleva el color.

   Esto no se puede comprobar leyendo el CSS: el peso se hereda, llega desde
   `base.css`, desde un componente o desde la hoja del navegador, y basta un
   `<strong>` en un markdown para que reaparezca sin que nadie lo escriba. Se
   mira lo que PINTA la página, nodo a nodo, en los tres anchos. */
console.log('\n── Un solo peso: 400 en todo ──\n');
for (const ancho of [390, 768, 1440]) {
  const page = await nav.newPage({ viewport: { width: ancho, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const intrusos = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const propio = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!propio) continue;
      const caja = el.getBoundingClientRect();
      if (!caja.width || !caja.height) continue;   // oculto: no lo ve nadie
      const peso = getComputedStyle(el).fontWeight;
      if (peso !== '400') out.push({ peso, texto: propio.slice(0, 40),
        donde: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/)[0] : '') });
    }
    return out;
  });
  await page.close();
  medidos++; esperados_extra++;
  if (intrusos.length) {
    fallos++;
    console.error(`  ✗ ${String(ancho).padStart(4)} px · ${intrusos.length} con otro peso:`);
    for (const i of intrusos.slice(0, 8)) console.error(`      ${i.peso}  ${i.donde.padEnd(24)} ${i.texto}`);
  } else {
    console.log(`  ✓ ${String(ancho).padStart(4)} px · ni un solo nodo fuera del 400`);
  }
}

/* ---- Dos colores, y cada uno en su sitio ---------------------------------
   Johnny, 08/10, segunda pasada: «todo en negro, los créditos todos en negro».

   La regla quedó al revés de como empezó la mañana: **negro por defecto, y el
   gris reservado al cuerpo que EXPLICA** —el resumen de cada proyecto, el texto
   ampliado, la descripción de cada producto y el «Leer más» que los despliega—.

   «Leer más» en gris rompe el «negro lo que se pulsa» a propósito: un enlace te
   lleva a otro sitio, eso solo despliega más de lo que ya estás leyendo, así
   que pertenece al párrafo. Lo que lo distingue de texto corriente es el
   subrayado, no el color, así que 1.4.1 sigue en pie.

   Y una restricción que no es de gusto: en la menta del hero el gris da 4,35:1
   y no cumple. Ahí solo entra el negro. */
/* 09/10, tarde: el gris sale de todo el cuerpo de texto. Queda en UN sitio,
   la nota de accesibilidad de cada proyecto. */
/* 09/10, más tarde: la nota también pasa a negro. No queda gris en la web.
   La lista se queda (vacía) por si algún día vuelve. */
const EN_GRIS = [];
console.log('\n── Un color: todo en negro ──\n');
{
  const page = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const mal = await page.evaluate((enGris) => {
    const NEGRO = 'rgb(23, 23, 23)', GRIS = 'rgb(104, 104, 100)';
    const fuera = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
      const propio = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!propio) continue;
      const caja = el.getBoundingClientRect();
      if (!caja.width || !caja.height) continue;
      /* Dentro del campo de color de un proyecto manda el color que ESE
         proyecto declara en su ficha (`paleta.textoSobreAcento`), no el negro
         de la página: el campo es azul, carmesí o naranja, y el esquema ya
         valida en build que ese texto rinde 4,5:1 encima. Se compara contra el
         color calculado del propio campo en vez de contra una lista de hex, así
         que añadir un cuarto proyecto no obliga a tocar esta comprobación. */
      const campo = el.closest('.slider');
      /* Sobre la foto de un hero (casos, 23/10/2026) el negro no se lee: el
         texto va en Silk, y la cabecera mientras está encima. Única excepción. */
      const conFoto = document.querySelector('.apertura--foto');
      const sobreFoto = el.closest('.apertura--foto') || (conFoto && el.closest('.header') && !el.closest('.menu__panel'));
      const toca = sobreFoto ? 'rgb(247, 247, 244)' : campo ? getComputedStyle(campo).color
        : (enGris.length && el.closest(enGris.join(','))) ? GRIS : NEGRO;
      const color = getComputedStyle(el).color;
      if (color !== toca) fuera.push({ color, toca, texto: propio.slice(0, 36),
        donde: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/)[0] : '') });
    }
    return fuera;
  }, EN_GRIS);
  await page.close();
  medidos++; esperados_extra++;
  if (mal.length) {
    fallos++;
    console.error(`  ✗ ${mal.length} con el color que no toca:`);
    for (const x of mal.slice(0, 10)) console.error(`      ${x.donde.padEnd(24)} es ${x.color}, toca ${x.toca}  · ${x.texto}`);
  } else {
    console.log('  ✓ todo en negro');
  }
}

/* El gris no puede caer sobre menta: 4,35:1. Se comprueba aparte porque es una
   restricción de contraste, no de estilo. */
{
  const page = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  const enMenta = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('.hero *')) {
      const t = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).length;
      if (!t) continue;
      const c = el.getBoundingClientRect(); if (!c.width || !c.height) continue;
      if (getComputedStyle(el).color === 'rgb(104, 104, 100)') out.push(el.className || el.tagName);
    }
    return out;
  });
  await page.close();
  medidos++; esperados_extra++;
  if (enMenta.length) { fallos++; console.error(`  ✗ gris sobre menta en: ${enMenta.join(', ')}`); }
  else console.log('  ✓ ni un gris sobre la menta del hero');
}

/* ---- Páginas interiores: Contacto, Estudio y legales (10–11/10/2026) ------
   Las mismas tres reglas: dos tamaños (el display SOLO en el titular del
   hero), un peso, todo en negro. La única excepción de color es el texto del
   botón de Contacto, blanco sobre Ink. Contacto se mide también con los
   errores abiertos, porque los mensajes de error no existen hasta que
   alguien envía mal. */
const INTERIORES = [
  /* Sin hero desde el 04/11/2026: el <h1> se ve, pero a tamaño de texto. */
  { nombre: 'Contacto', url: '/contacto/', conErrores: true, sinTitular: true },
  { nombre: 'Estudio', url: '/estudio/', conErrores: false },
  { nombre: 'Servicios', url: '/servicios/', conErrores: false },
  { nombre: 'Privacidad', url: '/privacidad/', conErrores: false },
  { nombre: 'Cookies', url: '/cookies/', conErrores: false },
  { nombre: 'Accesibilidad', url: '/declaracion-de-accesibilidad/', conErrores: false },
  /* Sin hero desde el 14/10/2026: el <h1> va oculto (sr-only) y en la página
     no hay NINGÚN texto en display. Todo, filtros y tarjetas, a tamaño texto. */
  { nombre: 'Proyectos', url: '/proyectos/', conErrores: false, sinTitular: true },
  { nombre: 'Proyectos · Aplicaciones', url: '/proyectos/tipo/aplicaciones/', conErrores: false, sinTitular: true },
  { nombre: 'Caso Foc i Cor', url: '/proyectos/foc-i-cor/', conErrores: false },
  { nombre: 'Caso ECI Conference', url: '/proyectos/eci-conference/', conErrores: false },
  { nombre: 'Caso Izaskun Etxebarria', url: '/proyectos/izaskun-etxebarria/', conErrores: false },
  { nombre: 'Caso A11y Primero', url: '/proyectos/a11y-primero/', conErrores: false },
  { nombre: 'Caso Itza', url: '/proyectos/itza/', conErrores: false },
  { nombre: 'Caso Accesible Abstracts', url: '/proyectos/accesible-abstracts/', conErrores: false },
  { nombre: 'Caso Elogio de la línea', url: '/proyectos/elogio-de-la-linea/', conErrores: false },
  { nombre: 'Blog', url: '/blog/', conErrores: false },
  { nombre: 'Blog · artículo con demostraciones', url: '/blog/tipografia-accesible-lo-que-dice-la-wcag/', conErrores: false },
  { nombre: 'Blog · artículo con tablas', url: '/blog/pero-que-es-la-wcag/', conErrores: false },
  { nombre: 'Blog · pasos', url: '/blog/requisitos-accesibilidad-web-licitaciones-publicas-une-en-301549/', conErrores: false },
  { nombre: 'Blog · código', url: '/blog/autopsia-web-no-accesible-5-errores-de-codigo/', conErrores: false },
  { nombre: 'Blog · fechas y comparación', url: '/blog/ley-11-2023-accesibilidad-plazos-obligados-multas/', conErrores: false },
];
/* Y lo mismo en catalán e inglés (05/11/2026); del blog, lo que está en los tres (scripts/idiomas.mjs). */
for (const pagina of paginasTresIdiomas(INTERIORES)) {
console.log(`\n── ${pagina.nombre} ──\n`);
for (const ancho of [390, 768, 1440]) {
  for (const conErrores of pagina.conErrores ? [false, true] : [false]) {
    const page = await nav.newPage({ viewport: { width: ancho, height: 900 } });
    await page.goto(`http://localhost:${PUERTO}${pagina.url}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    if (conErrores) await page.click('.boton');
    const r = await page.evaluate(({ texto, display, meta }) => {
      const NEGRO = 'rgb(23, 23, 23)', BLANCO = 'rgb(255, 255, 255)';
      const mal = [];
      let titular = null;
      for (const el of document.querySelectorAll('body *')) {
        if (el.tagName === 'SUP' || el.closest('sup')) continue;
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
        /* Las muestras de las demostraciones del blog se pintan A PROPÓSITO a
           otro tamaño o en otro gris: son el ejemplo. Lo que las explica, al
           lado, sí se mide. */
        if (el.closest('[data-ejemplo]')) continue;
        const propio = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
          .map((n) => n.textContent.trim()).join(' ');
        if (!propio) continue;
        const caja = el.getBoundingClientRect();
        if (!caja.width || !caja.height) continue;
        const cs = getComputedStyle(el);
        const px = parseFloat(cs.fontSize);
        // El titular puede venir partido en golpes (Estudio): el texto vive en
        // sus <span>, pero sigue siendo el titular.
        const esTitular = el.matches('.apertura__titulo') || Boolean(el.closest('.apertura__titulo'));
        if (esTitular) titular = [px, parseFloat(cs.lineHeight)];
        const permitidos = esTitular ? [display] : el.closest('footer') ? [texto, meta] : [texto];
        const donde = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/)[0] : '');
        if (!permitidos.some((v) => Math.abs(px - v) <= 0.5)) mal.push(`${px} px · ${donde} · ${propio.slice(0, 30)}`);
        if (cs.fontWeight !== '400') mal.push(`peso ${cs.fontWeight} · ${donde}`);
        /* La excepción de Silk sobre la foto del hero: ver arriba (23/10). */
        const conFoto = document.querySelector('.apertura--foto');
        const sobreFoto = el.closest('.apertura--foto') || (conFoto && el.closest('.header') && !el.closest('.menu__panel'));
        /* Dentro de una banda del color del proyecto (`data-campo-color`,
           casos, 29/10/2026) manda el color que la banda declara, como en el
           slider de la Home: la ficha valida en build que ese texto rinde. */
        const campo = el.closest('[data-campo-color]');
        const toca = sobreFoto ? 'rgb(247, 247, 244)' : campo ? getComputedStyle(campo).color : el.closest('.boton') ? BLANCO : NEGRO;
        if (cs.color !== toca) mal.push(`color ${cs.color} · ${donde} · ${propio.slice(0, 30)}`);
      }
      return { mal, titular, errores: document.querySelectorAll('.campo__error:not([hidden])').length };
    }, { texto: TEXTO[ancho][0], display: DISPLAY[ancho][0], meta: META[ancho][0] }).catch((e) => ({ mal: [String(e)], titular: null, errores: 0 }));
    await page.close();
    medidos++; esperados_extra++;
    const etiqueta = `${String(ancho).padStart(4)} px${conErrores ? ' · con errores' : ''}`;
    const faltanErrores = conErrores && r.errores !== 4;
    const titularMal = pagina.sinTitular ? r.titular !== null : !r.titular || Math.abs(r.titular[0] - DISPLAY[ancho][0]) > 0.5 || Math.abs(r.titular[1] - DISPLAY[ancho][1]) > 1;
    if (r.mal.length || faltanErrores || titularMal) {
      fallos++;
      console.error(`  ✗ ${etiqueta}`);
      if (titularMal) console.error(pagina.sinTitular ? `      hay un titular visible y esta página no lleva` : `      titular ${r.titular ? r.titular.join('/') : 'NO MEDIDO'} (toca ${DISPLAY[ancho].join('/')})`);
      if (faltanErrores) console.error(`      ${r.errores} mensajes de error visibles (tocan 4)`);
      for (const x of r.mal.slice(0, 8)) console.error(`      ${x}`);
    } else {
      console.log(`  ✓ ${etiqueta} · ${r.titular ? `titular ${r.titular.map((v) => Math.round(v)).join("/")}` : 'sin titular visible'}, el resto a ${TEXTO[ancho][0]}, 400 y negro${conErrores ? `, ${r.errores} errores` : ''}`);
    }
  }
}
}

await nav.close();
servidor.close();
const esperados = esperados_extra;
if (fallos) {
  console.error(`\n${fallos} de ${esperados} comprobaciones fallan (medidas: ${medidos}).`);
  process.exit(1);
}
if (medidos !== esperados) {
  console.error(`\nSolo se midieron ${medidos} de ${esperados}. No doy por buena una pasada incompleta.`);
  process.exit(1);
}
console.log(`\n${medidos} medidas. Dos tamaños (más el pie), un peso, un color.`);
console.log('Recuerda: la referencia es este archivo, no el Figma. El documento');
console.log('todavía trae siete estilos y el Medium en H3.');
