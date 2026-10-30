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
   desde el 29/10/2026 los vídeos de los casos.
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

/* ---- Esquema del sistema modular · caso ECI (30/10/2026) ----
   EsquemaModular.astro no lleva control de pausa porque se mueve MENOS de
   5 s (2.2.2). Eso se mide aquí, no se escribe al lado (AGENTS.md §2.9):
   · con JS: arranca al llegar a la zona de lectura, termina antes de 5 s
     contados desde que el bloque llega, acaba en el último tiempo y no
     vuelve a moverse (una sola vez, sin bucle);
   · reducir movimiento: nada viaja; solo un fundido y el último tiempo;
   · sin JS: el último tiempo, completo y quieto. */
console.log('\n── Caso ECI: esquema del sistema modular ──\n');
for (const [tam, w, h, sel] of [['escritorio', 1440, 900, '.esquema--columna'], ['movil', 390, 844, '.esquema--linea']]) {
  for (const [modo, opciones] of [['con JS', {}], ['reducido', { reducedMotion: 'reduce' }], ['sin JS', { javaScriptEnabled: false }]]) {
    const ctx = await navegador.newContext({ viewport: { width: w, height: h }, ...opciones });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PUERTO}/proyectos/eci-conference/`, { waitUntil: 'load' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const r = await p.evaluate((sel) => new Promise((res) => {
      const e = document.querySelector(sel);
      if (!e) return res(null);
      e.closest('section').scrollIntoView({ block: 'center' });
      const t0 = performance.now(); let primero = null, ultimo = null; const nombres = new Set();
      const tick = () => {
        const a = e.getAnimations({ subtree: true }); const t = performance.now() - t0;
        a.forEach((x) => nombres.add(x.transitionProperty ?? x.animationName));
        if (a.length) { if (primero === null) primero = t; ultimo = t; }
        // Fin: 1,5 s seguidos sin nada moviéndose (y al menos 7 s de margen total).
        if ((primero !== null && t - ultimo > 1500) || t > 9000) {
          return res({ primero, ultimo, estado: e.dataset.estado, oculto: e.getAttribute('aria-hidden') === 'true', nombres: [...nombres], modulos: e.querySelectorAll('.modulo').length });
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), sel);
    await ctx.close();
    if (!r) { anota(false, `${tam} · ${modo} · hay esquema (${sel})`); continue; }
    const id = `${tam} · ${modo}`;
    if (modo === 'con JS') {
      anota(r.primero !== null && r.ultimo < LIMITE_MS && r.estado === '5' && r.oculto,
        `${id} · se mueve ${r.primero !== null ? Math.round(r.ultimo - r.primero) : 0} ms y termina a los ${Math.round(r.ultimo ?? 0)} ms de llegar (límite ${LIMITE_MS}), en el último tiempo, una vez`);
    } else if (modo === 'reducido') {
      const viaja = r.nombres.some((n) => ['left', 'top', 'width', 'height', 'transform'].includes(n));
      anota(!viaja && r.estado === '5', `${id} · nada viaja (${r.nombres.join(', ') || 'nada'}) y acaba en el último tiempo`);
    } else {
      anota(r.primero === null && r.estado === '5' && r.modulos > 0, `${id} · el último tiempo, completo y quieto (${r.modulos} módulos)`);
    }
  }
}

/* ---- Vídeos de los casos (VideoPausable, 29/10/2026) ----
   Cada vídeo de cada caso: un archivo por tamaño, en bucle, con el control
   del slider de la Home. Se mide sobre el archivo SERVIDO (AGENTS.md §2.9):
   · empieza en pausa (Johnny, 29/10/2026), sin descargar nada, con el
     control visible de 44 de alto y nombre propio («Reproducir · …»);
   · Reproducir carga el archivo de SU tamaño y lo arranca; Pausar lo para
     de verdad; nombre e icono cambian con el estado;
   · igual con reducir movimiento;
   · sin JS, la imagen fija con su alternativa y sin botón. */
console.log('\n── Casos: vídeos ──\n');
const CASOS = ['/proyectos/foc-i-cor/', '/proyectos/eci-conference/'];
const TAMANOS = [['escritorio', 1440, 900], ['tableta', 820, 1180], ['movil', 390, 844]];
const estadoVideo = (p, i) => p.evaluate((i) => {
  const raiz = document.querySelectorAll('[data-video-pausable]')[i];
  if (!raiz) return null;
  const v = raiz.querySelector('video');
  const b = raiz.querySelector('[data-vp-control]');
  const img = raiz.querySelector('img');
  const r = b.getBoundingClientRect();
  const clave = innerWidth >= 1024 ? 'videoEscritorio' : innerWidth >= 768 ? 'videoTableta' : 'videoMovil';
  return {
    src: v.getAttribute('src'), paused: v.paused, t: v.currentTime, loop: v.loop, duracion: v.duration,
    listo: v.classList.contains('is-listo'), oculto: v.getAttribute('aria-hidden') === 'true',
    visible: getComputedStyle(b).display !== 'none', nombre: b.textContent.replace(/\s+/g, ' ').trim(),
    alto: r.height, parado: raiz.hasAttribute('data-parado'),
    alt: img?.alt ?? '', esperado: raiz.dataset[clave],
  };
}, i);
const alVideo = (p, i) => p.evaluate((i) => document.querySelectorAll('[data-video-pausable]')[i]?.scrollIntoView({ block: 'center' }), i);
const cuantos = async (url) => { const p = await navegador.newPage(); await p.goto(`http://localhost:${PUERTO}${url}`, { waitUntil: 'load' }); const n = await p.evaluate(() => document.querySelectorAll('[data-video-pausable]').length); await p.close(); return n; };
for (const caso of CASOS) {
  const n = await cuantos(caso);
  anota(n > 0, `${caso} · ${n} vídeo(s)`);
  for (const [tam, w, h] of TAMANOS) {
    for (let i = 0; i < n; i++) {
      const id = `${caso} · ${tam} · vídeo ${i + 1}`;
      for (const [modo, opciones] of [['con JS', {}], ['reducido', { reducedMotion: 'reduce' }]]) {
        const ctx = await navegador.newContext({ viewport: { width: w, height: h }, ...opciones });
        const p = await ctx.newPage();
        await p.goto(`http://localhost:${PUERTO}${caso}`, { waitUntil: 'load' });
        await alVideo(p, i); await p.waitForTimeout(900);
        // Empieza en pausa (Johnny, 29/10/2026): quieto, sin descargar nada y con el icono de reproducir.
        const a = await estadoVideo(p, i);
        anota(a.paused && !a.src && a.parado && a.visible && a.alto >= 44 && a.nombre.startsWith('Reproducir · ') && a.oculto && a.alt.length >= 20,
          `${id} · ${modo} · empieza en pausa, sin descargar, con «${a.nombre}» de ${Math.round(a.alto)} px`);
        const boton = p.locator('[data-vp-control]').nth(i);
        await boton.click();
        await p.waitForFunction((i) => { const v = document.querySelectorAll('[data-video-pausable] video')[i]; return v && !v.paused && v.currentTime > 0 && v.classList.contains('is-listo'); }, i, { timeout: 20000 }).catch(() => {});
        const b = await estadoVideo(p, i);
        anota(b.src === b.esperado && !b.paused && !b.parado && b.nombre.startsWith('Pausar · '),
          `${id} · ${modo} · Reproducir carga su archivo (${b.src}) y lo arranca (${b.duracion.toFixed(1)} s, ${b.loop ? 'en bucle' : 'una vez'})`);
        await boton.click();
        const t1 = (await estadoVideo(p, i)).t; await p.waitForTimeout(400);
        const c = await estadoVideo(p, i);
        anota(c.paused && c.t === t1 && c.parado && c.nombre.startsWith('Reproducir · '), `${id} · ${modo} · Pausar lo para`);
        await ctx.close();
      }
    }
    { // sin JS: todos de una vez
      const ctx = await navegador.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false });
      const p = await ctx.newPage();
      await p.goto(`http://localhost:${PUERTO}${caso}`, { waitUntil: 'load' });
      const todos = await Promise.all([...Array(n).keys()].map((i) => estadoVideo(p, i)));
      anota(todos.every((a) => a && !a.src && !a.visible && a.alt.length >= 20), `${caso} · ${tam} · sin JS · imágenes fijas con alternativa y sin botón`);
      await ctx.close();
    }
  }
}

await navegador.close();
servidor.close();
if (fallos) { console.error(`\n${fallos} comprobaciones fallan.`); process.exit(1); }
console.log('\nEl bucle del emblema de Estudio está declarado y se para con «reducir movimiento».');
