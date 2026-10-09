/* ---------------------------------------------------------------------------
   Aparición al hacer scroll y despliegue de «Leer más», comprobados de verdad.

   Lo que tiene que ser cierto (microanimaciones-encargo.md y AGENTS.md §2.3):
   · Sin JS no se marca nada y todo se ve.
   · Con JS, lo que ya está en pantalla al cargar no se marca.
   · En movimiento normal, lo marcado sigue opaco: nunca está oculto.
   · Al recorrer la página, todo termina en su sitio, opaco y sin desplazar.
   · Con reducir movimiento hay un fundido REAL (300 ms), no 0,01 ms.
   · «Leer más» abre con «despliega» o, reducido, con «funde».
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';
import { recorrer } from './recorrer.mjs';

const PUERTO = 4398;
const URL_ = `http://localhost:${PUERTO}/`;
const servidor = await servir(PUERTO);
const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(existsSync(ejecutable) ? { executablePath: ejecutable } : {});
const comprobaciones = [];
const anota = (ok, texto) => { comprobaciones.push({ ok, texto }); console.log(`${ok ? '✓' : '✗'} ${texto}`); };

const estado = (page) => page.evaluate(() => {
  const marcados = [...document.querySelectorAll('[data-aparece]')];
  const cs = (e) => getComputedStyle(e);
  return {
    marcados: marcados.length,
    espera: marcados.filter((e) => e.dataset.aparece === 'espera').length,
    enPantallaMarcados: marcados.filter((e) => e.dataset.aparece === 'espera' && e.getBoundingClientRect().top < innerHeight).length,
    transparentes: marcados.filter((e) => Number(cs(e).opacity) < 1).length,
    desplazados: marcados.filter((e) => cs(e).transform !== 'none').length,
    duracion: marcados[0] ? cs(marcados[0]).transitionDuration : null,
  };
});

/* 1 · Sin JS. */
{
  const ctx = await navegador.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL_, { waitUntil: 'load' });
  const e = await estado(p);
  anota(e.marcados === 0, `sin JS · nada marcado (${e.marcados})`);
  await ctx.close();
}

for (const ancho of [1440, 390]) {
  /* 2 · Movimiento normal. */
  const p = await navegador.newPage({ viewport: { width: ancho, height: ancho === 390 ? 844 : 900 } });
  await p.goto(URL_, { waitUntil: 'load' });
  let e = await estado(p);
  // Un suelo: si no se marca nada, esta comprobación no está mirando.
  anota(e.marcados >= 8, `${ancho} · se marcan los bloques bajo el pliegue (${e.marcados})`);
  anota(e.enPantallaMarcados === 0, `${ancho} · lo que se ve al cargar no se marca`);
  anota(e.transparentes === 0, `${ancho} · lo marcado sigue opaco: nunca oculto`);
  // Frases de entrada: partidas en renglones, pero el lector las oye enteras.
  const frases = await p.evaluate(() => [...document.querySelectorAll('[data-renglones]')].map((f) => ({
    renglones: f.querySelectorAll('.frase__renglon').length,
    copiaOculta: f.querySelector('[aria-hidden="true"] .frase__renglon') !== null,
    original: f.querySelector(':scope > .sr-only')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
  })));
  anota(frases.length === 3 && frases.every((f) => f.renglones >= 1 && f.copiaOculta),
    `${ancho} · las tres frases, partidas en renglones (${frases.map((f) => f.renglones).join(' · ')})`);
  const nombre = await p.getByRole('heading', { name: /Desarrollamos aplicaciones que simplifican procesos complejos, hacen que lo digital sea accesible para más personas\./ }).count();
  anota(nombre === 1, `${ancho} · en espera, el lector oye la frase entera y una sola vez`);
  await recorrer(p);
  e = await estado(p);
  anota(e.espera === 0 && e.desplazados === 0, `${ancho} · al recorrer, todo en su sitio (${e.espera} en espera, ${e.desplazados} desplazados)`);
  const restos = await p.evaluate(() => document.querySelectorAll('.frase__renglon, [data-renglones]').length);
  anota(restos === 0, `${ancho} · al terminar, las frases vuelven a su marcado original`);
  await p.close();

  /* 3 · Reducir movimiento. */
  const r = await navegador.newPage({ viewport: { width: ancho, height: ancho === 390 ? 844 : 900 } });
  await r.emulateMedia({ reducedMotion: 'reduce' });
  await r.goto(URL_, { waitUntil: 'load' });
  e = await estado(r);
  anota(e.duracion === '0.3s', `${ancho} · reducido: fundido real de 300 ms (${e.duracion})`);
  anota(e.desplazados === 0, `${ancho} · reducido: sin desplazamiento`);
  await recorrer(r, 600);
  e = await estado(r);
  anota(e.espera === 0 && e.transparentes === 0, `${ancho} · reducido: al recorrer, todo visible (${e.transparentes} transparentes)`);
  await r.close();
}

/* 4 · «Leer más». */
for (const reducido of [false, true]) {
  const p = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
  if (reducido) await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto(URL_, { waitUntil: 'load' });
  await p.locator('[data-disclosure-trigger]').first().click();
  const a = await p.evaluate(() => {
    const panel = document.querySelector('[data-disclosure-panel]');
    const cs = getComputedStyle(panel);
    return { nombre: cs.animationName, duracion: cs.animationDuration, oculto: panel.hidden };
  });
  const esperado = reducido ? ['funde', '0.3s'] : ['despliega', '0.6s'];
  anota(!a.oculto && a.nombre.includes(esperado[0]) && a.duracion === esperado[1],
    `«Leer más»${reducido ? ' reducido' : ''} · ${a.nombre} ${a.duracion}`);
  await p.close();
}

await navegador.close();
servidor.close();
const fallos = comprobaciones.filter((c) => !c.ok);
if (fallos.length) { console.error(`\n${fallos.length} comprobación(es) de aparición fallan.`); process.exit(1); }
console.log('\nAparición correcta.');
