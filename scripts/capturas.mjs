/* Capturas de los tres breakpoints para revisar a ojo. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';
import { servir } from './serve.mjs';
import { recorrer } from './recorrer.mjs';

const PUERTO = 4396;
// fileURLToPath y no .pathname: ver el comentario en serve.mjs.
const salida = fileURLToPath(new URL('../capturas/', import.meta.url));
mkdirSync(salida, { recursive: true });

const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});

for (const [nombre, viewport] of [
  ['movil-390', { width: 390, height: 844 }],
  ['tablet-768', { width: 768, height: 1024 }],
  ['desktop-1440', { width: 1440, height: 900 }],
]) {
  const page = await navegador.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${salida}${nombre}-inicio.png` });
  await recorrer(page); // que la captura completa no salga con huecos
  await page.screenshot({ path: `${salida}${nombre}-completa.png`, fullPage: true });
  await page.close();
}

/* El menú abierto en móvil, que es lo que acabamos de diseñar. */
const menu = await navegador.newPage({ viewport: { width: 390, height: 844 } });
await menu.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
await menu.click('[data-menu-trigger]');
await menu.waitForTimeout(200);
await menu.screenshot({ path: `${salida}movil-390-menu-abierto.png` });
await menu.close();

/* El foco visible, que no se ve en una captura normal. */
const foco = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
await foco.goto(`http://localhost:${PUERTO}/`, { waitUntil: 'load' });
await foco.keyboard.press('Tab');
await foco.screenshot({ path: `${salida}desktop-1440-skip-link.png` });
await foco.close();

await navegador.close();
servidor.close();
console.log(`Capturas en ${salida}`);
