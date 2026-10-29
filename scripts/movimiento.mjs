/* ---------------------------------------------------------------------------
   Movimiento que empieza solo · 2.2.2 (Pausar, detener, ocultar), medido.

   Regla de la casa: lo que se mueve solo y dura más de 5 s junto a otro
   contenido lleva un control para pararlo, o termina antes de 5 s.

   UNA EXCEPCIÓN DECLARADA: el emblema de Estudio chispea en bucle y sin botón
   (licencia de Johnny, 13/10/2026). Está nombrada como incumplimiento en la
   Declaración de accesibilidad. Esto comprueba que sigue siendo la ÚNICA:
   · el emblema: 241 cuadrados en bucle, con y sin JS, y quieto con «reducir
     movimiento»;
   · la Declaración lo sigue nombrando (si se quita el bucle, se quita de
     allí; si se quita de allí, falla);
   · y el titular de Estudio: entero en el h1, quieto sin JS, y todo en su
     sitio antes de 2 s.
   Lo mide en el navegador, con las animaciones reales (AGENTS.md §2.9).
   No recorre el resto de la web: el carrusel de la Home tiene su propia
   comprobación (teclado), y cualquier bucle nuevo se añade aquí. Desde el
   14/10/2026 mide también la entrada de las tarjetas de los listados, y
   desde el 29/10/2026 la portada en vídeo de los casos.
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';

const PUERTO = 4399;
const PAGINA = `http://localhost:${PUERTO}/estudio/`;
const LIMITE_MS = 5000;
const CUADRADOS = 241;
const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
let fallos = 0;
const anota = (ok, texto) => { if (!ok) fallos++; console.log(`${ok ? '✓' : '✗'} ${texto}`); };

const medir = (page) => page.evaluate(() => {
  const svg = document.querySelector('[data-simbolo-animado]');
  const anims = svg ? svg.getAnimations({ subtree: true }) : [];
  const fin = anims.map((a) => a.effect.getComputedTiming().endTime);
  const boton = document.querySelector('.simbolo button');
  const r = boton?.getBoundingClientRect();
  return {
    cuadrados: svg ? svg.querySelectorAll('rect').length : 0,
    animaciones: anims.length,
    infinitas: fin.filter((t) => !Number.isFinite(t)).length,
    finMax: fin.filter(Number.isFinite).reduce((a, b) => Math.max(a, b), 0),
    enMarcha: anims.filter((a) => a.playState === 'running').length,
    pausadas: anims.filter((a) => a.playState === 'paused').length,
    boton: Boolean(r && r.width > 0 && r.height > 0),
    medida: r ? [Math.round(r.width), Math.round(r.height)] : [0, 0],
    nombre: boton ? boton.textContent.trim().replace(/\s+/g, ' ') : '',
  };
});

for (const js of [false, true]) {
  const ctx = await navegador.newContext({ javaScriptEnabled: js, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const n = js ? 'con JS' : 'sin JS';
  await p.goto(PAGINA, { waitUntil: 'load' });
  const m = await medir(p);
  anota(m.cuadrados === CUADRADOS, `${n} · el emblema está en el hero (${m.cuadrados} cuadrados)`);
  anota(m.infinitas === CUADRADOS, `${n} · en bucle, la excepción declarada (${m.infinitas} de ${CUADRADOS})`);
  anota(!m.boton, `${n} · sin botón de pausa, como se decidió`);
  await ctx.close();
}
{
  const p = await navegador.newPage();
  await p.goto(`http://localhost:${PUERTO}/declaracion-de-accesibilidad/`, { waitUntil: 'load' });
  const dice = await p.evaluate(() => document.body.innerText.includes('2.2.2') && /emblema\sde\sla\spágina\sEstudio/.test(document.body.innerText) /* \s: también el espacio que no se parte */);
  anota(dice, 'la Declaración de accesibilidad nombra el bucle del emblema como incumplimiento (2.2.2)');
  await p.close();
}

/* 3 · Reducir movimiento. */
{
  const ctx = await navegador.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(PAGINA, { waitUntil: 'load' });
  const m = await medir(p);
  anota(m.animaciones === 0 && !m.boton, `reducido · quieto y sin botón (${m.animaciones} animaciones)`);
  await ctx.close();
}

/* 4 · La entrada del titular de Estudio, en golpes. El <h1> tiene que estar
   entero en el HTML, sin JS no se anima nada, y con JS todo acaba antes de
   2 s: tres golpes y después el texto. */
{
  const TITULAR = 'Código, diseño y palabra.';
  const golpes = (page) => page.evaluate(() => {
    const h1 = document.querySelector('.apertura__titulo');
    const piezas = [...document.querySelectorAll('.apertura--golpes .golpe__dentro, .apertura--golpes .apertura__texto')];
    const anims = piezas.flatMap((e) => e.getAnimations());
    return {
      texto: h1.textContent.replace(/\s+/g, ' ').trim(),
      golpes: document.querySelectorAll('.golpe__dentro').length,
      animaciones: anims.length,
      fin: anims.reduce((m, a) => Math.max(m, a.effect.getComputedTiming().endTime), 0),
      quietos: piezas.every((e) => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(e).transform) && getComputedStyle(e).opacity === '1'),
    };
  });
  for (const [n, opciones] of [['sin JS', { javaScriptEnabled: false }], ['con JS', {}], ['reducido', { reducedMotion: 'reduce' }]]) {
    const ctx = await navegador.newContext({ ...opciones, viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(PAGINA, { waitUntil: 'load' });
    let g = await golpes(p);
    anota(g.texto === TITULAR && g.golpes === 3, `titular · ${n} · el h1 dice «${g.texto}» entero, en ${g.golpes} golpes`);
    if (n === 'sin JS') anota(g.animaciones === 0 && g.quietos, `titular · ${n} · no se anima: se ve quieto desde el principio`);
    else anota(g.animaciones === 4 && g.fin <= 2000, `titular · ${n} · tres golpes y el texto, todo acaba a los ${(g.fin / 1000).toFixed(2)} s`);
    await p.waitForTimeout(2100);
    g = await golpes(p);
    anota(g.quietos, `titular · ${n} · al terminar, todo en su sitio y opaco`);
    await ctx.close();
  }
}

/* ---- Listados de tarjetas: entrada y cambio de filtro (14/10/2026) ----
   src/styles/listados.css y src/scripts/tarjetas.ts. Se comprueba:
   · sin JS, ninguna animación y todas las tarjetas visibles;
   · con JS, las de arriba entran solas, todo acaba antes de 2 s y al final
     cada tarjeta está entera (opacidad 1, sin desplazamiento); las de abajo
     esperan pausadas y entran al asomar;
   · con reducir movimiento, solo fundido (ningún desplazamiento);
   · el CSS declara la transición entre documentos de los filtros. */
console.log('\n── Listados: entrada de las tarjetas ──\n');
const estado = (p) => p.evaluate(() => {
  const lis = [...document.querySelectorAll('.tarjetas > li')];
  const anims = lis.flatMap((li) => li.getAnimations({ subtree: true }));
  return {
    tarjetas: lis.length,
    animaciones: anims.length,
    nombres: [...new Set(anims.map((a) => a.animationName))].sort().join(' '),
    finMax: anims.map((a) => a.effect.getComputedTiming().endTime).reduce((a, b) => Math.max(a, b), 0),
    pausadas: lis.filter((li) => li.getAnimations().some((a) => a.playState === 'paused')).length,
    abajo: lis.filter((li) => li.getBoundingClientRect().top >= innerHeight * 0.92).length,
    enteras: lis.filter((li) => getComputedStyle(li).opacity === '1' && ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(li).transform)).length,
    transicion: [...document.styleSheets].some((h) => { try { return [...h.cssRules].some((r) => r.cssText.includes('@view-transition') || (r.cssRules && [...r.cssRules].some((q) => q.cssText.includes('@view-transition')))); } catch { return false; } }),
    nombresTransicion: lis.filter((li) => getComputedStyle(li).viewTransitionName.startsWith('t-')).length,
  };
});
for (const url of ['/proyectos/', '/blog/']) {
  for (const [n, opciones] of [['sin JS', { javaScriptEnabled: false }], ['con JS', {}], ['reducido', { reducedMotion: 'reduce' }]]) {
    /* 700 de alto: así en Proyectos también queda una fila por debajo. */
    const ctx = await navegador.newContext({ viewport: { width: 1440, height: 700 }, ...opciones });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PUERTO}${url}`, { waitUntil: 'load' });
    const a = await estado(p);
    if (n === 'sin JS') {
      anota(a.animaciones === 0 && a.enteras === a.tarjetas, `${url} · sin JS · quietas y enteras (${a.enteras} de ${a.tarjetas})`);
    } else if (n === 'con JS') {
      anota(a.animaciones > 0 && a.finMax < 2000, `${url} · con JS · entran solas y acaban antes de 2 s (${Math.round(a.finMax)} ms)`);
      anota(a.pausadas === a.abajo, `${url} · con JS · las que quedan por debajo esperan (${a.pausadas} pausadas de ${a.abajo})`);
      anota(a.transicion && a.nombresTransicion === a.tarjetas, `${url} · transición entre filtros declarada y ${a.nombresTransicion} de ${a.tarjetas} tarjetas con nombre`);
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await p.waitForTimeout(2600);
      const b = await estado(p);
      anota(b.pausadas === 0 && b.enteras === b.tarjetas, `${url} · con JS · al bajar entran todas y quedan enteras (${b.enteras} de ${b.tarjetas})`);
    } else {
      anota(a.animaciones > 0 && a.nombres === 'tarjeta-aparece', `${url} · reducido · solo fundido (${a.nombres || 'nada'})`);
    }
    await ctx.close();
  }
}

/* ---- Portada en vídeo de los casos (29/10/2026) ----
   [slug].astro: un vídeo por tamaño, en bucle, con botón de Pausar. Se mide
   sobre el archivo SERVIDO (AGENTS.md §2.9):
   · con JS, en cada tamaño carga SU archivo, arranca solo al verse, y si
     dura más de 5 s o va en bucle tiene control visible de 44 de alto;
   · el control lo para de verdad y cambia su texto;
   · con reducir movimiento no arranca ni descarga nada, y Reproducir lo
     arranca igual (reducir no es eliminar);
   · sin JS, la imagen fija con su alternativa y sin botón. */
console.log('\n── Casos: portada en vídeo ──\n');
const CASO = '/proyectos/foc-i-cor/';
const TAMANOS = [['escritorio', 1440, 900], ['tableta', 820, 1180], ['movil', 390, 844]];
const portadaVideo = (p) => p.evaluate(() => {
  const raiz = document.querySelector('[data-portada-video]');
  if (!raiz) return null;
  const v = raiz.querySelector('video');
  const b = raiz.querySelector('[data-portada-control]');
  const img = raiz.querySelector('img');
  const r = b.getBoundingClientRect();
  return {
    src: v.getAttribute('src'), paused: v.paused, t: v.currentTime, loop: v.loop, duracion: v.duration,
    listo: v.classList.contains('is-listo'), oculto: v.getAttribute('aria-hidden') === 'true',
    boton: getComputedStyle(b).display !== 'none' ? b.textContent.trim() : null, alto: r.height,
    alt: img?.alt ?? '', esperado: raiz.dataset[{ escritorio: 'videoEscritorio', tableta: 'videoTableta', movil: 'videoMovil' }[
      innerWidth >= 1024 ? 'escritorio' : innerWidth >= 768 ? 'tableta' : 'movil']],
  };
});
const alBloque = (p) => p.evaluate(() => document.querySelector('[data-portada-video]')?.scrollIntoView({ block: 'center' }));
for (const [n, w, h] of TAMANOS) {
  { // con JS
    const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PUERTO}${CASO}`, { waitUntil: 'load' });
    const antes = await portadaVideo(p);
    if (!antes) { anota(false, `${n} · hay portada en vídeo en ${CASO}`); await ctx.close(); continue; }
    anota(!antes.src, `${n} · fuera de pantalla no descarga el vídeo`);
    await alBloque(p);
    await p.waitForFunction(() => document.querySelector('[data-portada-video] video')?.classList.contains('is-listo'), null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(600);
    const a = await portadaVideo(p);
    anota(a.src === a.esperado, `${n} · carga su archivo (${a.src})`);
    anota(!a.paused && a.t > 0 && a.listo, `${n} · arranca solo al verse (${a.t.toFixed(2)} s)`);
    anota(a.oculto && a.alt.length >= 20, `${n} · el vídeo va oculto y la imagen lleva la alternativa`);
    const necesita = a.loop || !(a.duracion <= 5);
    anota(!necesita || (a.boton === 'Pausar' && a.alto >= 44),
      `${n} · ${a.duracion.toFixed(2)} s${a.loop ? ', en bucle' : ''}: control «${a.boton}» de ${Math.round(a.alto)} px (2.2.2)`);
    await p.click('[data-portada-control]');
    const t1 = (await portadaVideo(p)).t; await p.waitForTimeout(500);
    const b = await portadaVideo(p);
    anota(b.paused && b.t === t1 && b.boton === 'Reproducir', `${n} · Pausar lo para y el botón dice Reproducir`);
    await ctx.close();
  }
  { // reducir movimiento
    const ctx = await navegador.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PUERTO}${CASO}`, { waitUntil: 'load' });
    await alBloque(p); await p.waitForTimeout(1200);
    const a = await portadaVideo(p);
    anota(a && a.paused && !a.src && a.boton === 'Reproducir', `${n} · reducido · quieto, sin descargar y con «Reproducir»`);
    await p.click('[data-portada-control]');
    await p.waitForFunction(() => { const v = document.querySelector('[data-portada-video] video'); return v && !v.paused && v.currentTime > 0; }, null, { timeout: 15000 }).catch(() => {});
    const b = await portadaVideo(p);
    anota(!b.paused && b.boton === 'Pausar', `${n} · reducido · Reproducir lo arranca`);
    await ctx.close();
  }
  { // sin JS
    const ctx = await navegador.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PUERTO}${CASO}`, { waitUntil: 'load' });
    const a = await portadaVideo(p);
    anota(a && !a.src && a.boton === null && a.alt.length >= 20, `${n} · sin JS · imagen fija con alternativa y sin botón`);
    await ctx.close();
  }
}

await navegador.close();
servidor.close();
if (fallos) { console.error(`\n${fallos} comprobaciones fallan.`); process.exit(1); }
console.log('\nEl bucle del emblema de Estudio está declarado y se para con «reducir movimiento».');
