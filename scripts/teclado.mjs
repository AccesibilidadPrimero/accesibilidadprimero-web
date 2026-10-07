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
await page.evaluate(() => document.querySelector('[data-carrusel-control]')?.scrollIntoView());
await page.waitForTimeout(400);
await page.click('[data-carrusel-control]');
const etiqueta = (await page.textContent('[data-carrusel-control-label]'))?.trim();
check('Al pausar, el control dice «Reproducir»', etiqueta === 'Reproducir', etiqueta);

const antes = await page.getAttribute('.hero__lamina[data-activa]', 'data-indice');
await page.waitForTimeout(3200);   // más de dos ciclos de 1,5 s
const despues = await page.getAttribute('.hero__lamina[data-activa]', 'data-indice');
check('Pausar detiene el temporizador, no solo la animación', antes === despues, `${antes} → ${despues}`);

// 8. Al pausar aparece la frase, y lleva su idioma marcado.
const frase = (await page.textContent('[data-carrusel-frase]'))?.trim();
const idioma = await page.getAttribute('[data-carrusel-frase]', 'lang');
check('Al pausar aparece la frase de la ilustración', !!frase, frase?.slice(0, 40));
check('La frase en catalán va marcada con lang="ca" (3.1.2)', idioma === 'ca', `lang="${idioma}"`);

await navegador.close();
servidor.close();

const fallos = comprobaciones.filter((c) => !c.ok);
if (fallos.length) {
  console.error(`\n${fallos.length} comprobación(es) de teclado fallan.`);
  process.exit(1);
}
console.log('\nRecorrido de teclado correcto.');
