/* ---------------------------------------------------------------------------
   El recorrido de teclado del menú, comprobado de verdad.

   Es el modo de fallo n.º 2 de la lista de AGENTS.md y el que ningún linter
   detecta: la trampa de foco mal cerrada, el foco que no vuelve al botón, el
   fondo que sigue siendo tabulable. Se comprueba pulsando teclas, no leyendo
   el HTML.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

const PUERTO = 4398;
const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
const page = await navegador.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });

const comprobaciones = [];
const check = (nombre, ok, detalle = '') => {
  comprobaciones.push({ nombre, ok, detalle });
  console.log(`${ok ? '✓' : '✗'} ${nombre}${detalle ? ` — ${detalle}` : ''}`);
};

const activo = () => page.evaluate(() => {
  const el = document.activeElement;
  if (!el) return null;
  return { tag: el.tagName.toLowerCase(), texto: (el.textContent ?? '').trim().slice(0, 40), id: el.id };
});

// 1. El skip link es el primer elemento enfocable (2.4.1).
await page.keyboard.press('Tab');
let a = await activo();
check('El primer Tab llega al skip link', a?.texto.includes('Saltar al contenido'), a?.texto);

// 2. Y lleva de verdad al contenido: el destino tiene que recibir el foco.
await page.keyboard.press('Enter');
/* El navegador mueve el foco al destino del salto en el tick siguiente a la
   navegación, no en el mismo. Sin esta espera la comprobación lee el estado
   anterior y falla de forma intermitente: es un fallo del test, no del salto. */
await page.waitForFunction(() => location.hash === '#contenido');
await page.waitForTimeout(100);
a = await activo();
check('El skip link aterriza en <main>', a?.id === 'contenido', `foco en <${a?.tag} id="${a?.id}">`);

// 3. Abrir el menú con teclado.
await page.evaluate(() => document.querySelector('[data-menu-trigger]')?.focus());
await page.keyboard.press('Enter');
const abierto = await page.getAttribute('[data-menu-trigger]', 'aria-expanded');
check('El botón abre y marca aria-expanded="true"', abierto === 'true', `aria-expanded="${abierto}"`);

// 4. El foco ha entrado en el panel.
a = await activo();
const dentro = await page.evaluate(() => !!document.querySelector('[data-menu-panel]')?.contains(document.activeElement));
check('El foco entra en el panel al abrir', dentro, a?.texto);

// 5. El fondo está inerte: tabulando muchas veces no se sale del menú.
let escapes = 0;
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Tab');
  const fuera = await page.evaluate(() => {
    const panel = document.querySelector('[data-menu-panel]');
    const boton = document.querySelector('[data-menu-trigger]');
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    return !panel?.contains(el) && el !== boton;
  });
  if (fuera) escapes++;
}
check('El foco no se escapa al fondo en 20 tabulaciones', escapes === 0, `${escapes} escape(s)`);

// 6. Esc cierra y devuelve el foco al botón (2.4.3).
await page.keyboard.press('Escape');
const cerrado = await page.getAttribute('[data-menu-trigger]', 'aria-expanded');
const vuelve = await page.evaluate(() => document.activeElement === document.querySelector('[data-menu-trigger]'));
check('Esc cierra el panel', cerrado === 'false', `aria-expanded="${cerrado}"`);
check('Al cerrar, el foco vuelve al botón', vuelve);

// 7. El carrusel: pausar detiene de verdad, y la etiqueta pasa a Reproducir.
const titularInicial = (await page.textContent('h1'))?.trim();
await page.evaluate(() => document.querySelector('[data-carrusel-control]')?.scrollIntoView());
await page.waitForTimeout(400);
await page.click('[data-carrusel-control]');
const etiqueta = (await page.textContent('[data-carrusel-control-label]'))?.trim();
check('Al pausar, el control dice «Reproducir»', etiqueta === 'Reproducir', etiqueta);

const antes = await page.getAttribute('.hero__lamina[data-activa]', 'data-indice');
await page.waitForTimeout(3200);   // más de dos ciclos de 1,5 s
const despues = await page.getAttribute('.hero__lamina[data-activa]', 'data-indice');
check('Pausar detiene el temporizador, no solo la animación', antes === despues, `${antes} → ${despues}`);

// 8. Al pausar aparece la frase, y lleva el idioma de ESA ilustración.
//    Se compara contra la lámina activa y no contra un idioma fijo: cuál está
//    delante al pausar depende de los milisegundos, y un test que depende de
//    eso falla solo de vez en cuando, que es la peor clase de test.
const frase = (await page.textContent('[data-carrusel-frase]'))?.trim();
const esperadoLang = await page.getAttribute('.hero__lamina[data-activa]', 'data-frase-lang');
const idioma = await page.getAttribute('[data-carrusel-frase]', 'lang');
const marcado = esperadoLang === 'es' ? idioma === null : idioma === esperadoLang;
const visible = await page.evaluate(() => {
  const e = document.querySelector('[data-carrusel-frase]');
  const b = document.querySelector('.hero__frase--base');
  return e && b
    ? { principio: parseFloat(getComputedStyle(e).opacity), base: parseFloat(getComputedStyle(b).opacity) }
    : null;
});
check('Al pausar aparece la frase de la ilustración', !!frase, frase?.slice(0, 40));
// Que el texto esté en el DOM no significa que se vea.
check('…y se VE: la frase del principio sustituye a la frase base',
  !!visible && visible.principio === 1 && visible.base === 0,
  `principio=${visible?.principio} base=${visible?.base}`);
check('El fragmento en otro idioma va marcado con lang (3.1.2)', marcado, `lámina=${esperadoLang} · lang=${idioma}`);

// 9. El control es un <button> de verdad, no un div con role.
const etiquetaControl = await page.evaluate(() => {
  const c = document.querySelector('[data-carrusel-control]');
  return { tag: c?.tagName, rol: c?.getAttribute('role') };
});
check('El control del carrusel es un <button>, no un div con role',
  etiquetaControl.tag === 'BUTTON' && !etiquetaControl.rol,
  `<${etiquetaControl.tag?.toLowerCase()}> role=${etiquetaControl.rol}`);

// 10. El h1 NO cambia de texto al pausar.
const h1 = (await page.textContent('h1'))?.trim();
check('El h1 no se reescribe al pausar', h1 === titularInicial, h1?.slice(0, 40));

// 11. Toda ilustración del hero lleva alternativa textual escrita. No es el
//     mismo texto que la frase del principio: el alt describe lo que SE VE,
//     la frase dice lo que el estudio PIENSA. Un lector de pantalla necesita
//     las dos cosas, y repetir una en la otra no informa de nada.
const laminas = await page.$$eval('.hero__lamina', (n) => n.map((l) => ({
  alt: l.querySelector('img')?.getAttribute('alt') ?? '',
  frase: l.getAttribute('data-frase') ?? '',
})));
const utiles = laminas.filter((l) => l.alt.trim().length > 20);
const repetidos = laminas.filter((l) => l.frase && l.alt.trim() === l.frase.trim());
check('Todas las ilustraciones llevan alternativa textual con contenido',
  utiles.length === laminas.length,
  `${laminas.length} imágenes, ${utiles.length} con alt útil`);
check('El alt describe la imagen y no repite la frase',
  repetidos.length === 0,
  repetidos.length ? `${repetidos.length} repite(n) la frase` : 'ninguno repite');

/* 12. El puntero: lo que para el carrusel es el DIBUJO, no el escenario.
   Johnny, 08/10/2026: «el area de "stop" "reproducir" debe ser sobre la
   imagen, para que sea intuitivo el juego de mover el cursor sobre las
   imágenes». Antes el escucha estaba en el escenario, que llega hasta los
   márgenes de la página: el carrusel se paraba al pasar el cursor por zonas
   vacías, lejos de cualquier dibujo. Esto se comprueba moviendo el ratón de
   verdad a dos sitios: el centro del dibujo y el hueco que queda a su lado.
   A 1440 ese hueco es de 287 px como mínimo —la ilustración más ancha es la
   trompeta, 770 dentro de un escenario de 1344—, así que el punto de prueba
   está holgadamente fuera del control. */
{
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  const pts = await p.evaluate(() => {
    const c = document.querySelector('.hero__control').getBoundingClientRect();
    const e = document.querySelector('.hero__escenario').getBoundingClientRect();
    return { dx: c.left + c.width / 2, dy: c.top + c.height / 2,
             vx: e.left + 8, vy: c.top + c.height / 2, hueco: c.left - e.left };
  });
  const parado = () => p.evaluate(() => document.querySelector('.hero').hasAttribute('data-parado'));

  await p.mouse.move(pts.vx, pts.vy);
  await p.waitForTimeout(250);
  const alLado = await parado();
  await p.mouse.move(pts.dx, pts.dy);
  await p.waitForTimeout(250);
  const encima = await parado();

  check('El cursor sobre el dibujo para el carrusel', encima);
  check('El cursor en el hueco de al lado NO lo para', !alLado,
    `hueco de ${pts.hueco.toFixed(0)} px al borde del dibujo`);
  await p.close();
}

/* 13. El vídeo de Itza: si se mueve solo, se para solo antes de los 5 s.
   Sin bucle y sin botón de pausa, porque dura 4,94 s y se reproduce una
   vez (2.2.2). La comprobación lee la duración del ARCHIVO que sirve la web,
   no la que diga un comentario: si mañana entra un clip de 9 s o alguien
   vuelve a poner `loop`, esto falla y hay que devolver el botón de pausa. */
{
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  const v = await p.evaluate(async () => {
    const video = document.querySelector('[data-video-producto]');
    if (!video) return null;
    if (video.readyState < 1) {
      await new Promise((ok) => {
        video.addEventListener('loadedmetadata', ok, { once: true });
        video.load();
        setTimeout(ok, 5000);
      });
    }
    return { loop: video.loop, duracion: video.duration, control: !!document.querySelector('.producto [data-video-control]') };
  });
  if (v) {
    const corto = Number.isFinite(v.duracion) && v.duracion <= 5;
    check('El vídeo de producto no va en bucle', !v.loop);
    check('El vídeo de producto dura 5 s o menos', corto, `${v.duracion?.toFixed(2)} s`);
    if (!corto || v.loop) {
      check('Si dura más o va en bucle, tiene botón de pausa', v.control);
    }
  } else {
    check('Hay un vídeo de producto que comprobar', false, 'no se encontró [data-video-producto]');
  }
  await p.close();
}

await navegador.close();
servidor.close();

const fallos = comprobaciones.filter((c) => !c.ok);
if (fallos.length) {
  console.error(`\n${fallos.length} comprobación(es) de teclado fallan.`);
  process.exit(1);
}
console.log('\nRecorrido de teclado correcto.');
