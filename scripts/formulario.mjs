/* ---------------------------------------------------------------------------
   El formulario de contacto, comprobado de punta a punta SIN enviar nada.

   Brevo y Cloudflare no se tocan: `fetch` se sustituye por uno que hace de
   los dos y apunta lo que le piden. Así se comprueba lo que importa sin
   mandar correos ni gastar fichas reales:

   1. EL WORKER (worker/index.ts), caso por caso: qué rechaza, con qué código,
      y qué correo le pediría a Brevo cuando todo está bien.
   2. EL FORMULARIO en Chromium: sin JS no se pinta; con JS, los errores, el
      foco, que Turnstile no se carga hasta tocar el formulario, la
      confirmación, el fallo de envío y que dos clics no mandan dos correos.

   Lo que esto NO comprueba: que la clave de Brevo y la secreta de Turnstile
   funcionen. Eso solo se ve enviando un mensaje de verdad desde la web
   publicada (ver el final de este archivo).

   Necesita Node 22.6 o posterior: importa el Worker en TypeScript con
   `--experimental-strip-types` (está en el script de package.json).
   --------------------------------------------------------------------------- */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { servir } from './serve.mjs';
import { contacto, itzaContacto } from '../worker/index.ts';
import { TURNSTILE_SITEKEY, TURNSTILE_SITEKEY_PRUEBA } from '../src/data/contacto.ts';

let fallos = 0, pruebas = 0;
const ok = (cond, nombre, detalle = '') => {
  pruebas++;
  if (cond) console.log(`  ✓ ${nombre}`);
  else { fallos++; console.error(`  ✗ ${nombre}${detalle ? ` · ${detalle}` : ''}`); }
};

/* ---- Las dos piezas de fuera, simuladas -------------------------------- */
const usadas = new Set();
let brevo = { llamadas: [], falla: false };
let siteverify = { exito: true, accion: 'contacto', host: 'localhost' };
let anthropic = { llamadas: [], falla: false, texto: '' };
const fetchReal = globalThis.fetch;
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.startsWith('https://challenges.cloudflare.com/turnstile/v0/siteverify')) {
    const p = new URLSearchParams(String(init.body));
    const ficha = p.get('response');
    // Como el de verdad: una ficha solo vale una vez.
    const repetida = usadas.has(ficha);
    usadas.add(ficha);
    const success = siteverify.exito && !repetida && ficha.startsWith('ficha-buena') && p.get('secret') === 'secreta';
    return Response.json({ success, action: siteverify.accion, hostname: siteverify.host });
  }
  if (u === 'https://api.brevo.com/v3/smtp/email') {
    brevo.llamadas.push({ headers: init.headers, cuerpo: JSON.parse(String(init.body)) });
    return brevo.falla ? new Response('mal', { status: 500 }) : Response.json({ messageId: 'x' }, { status: 201 });
  }
  if (u === 'https://api.anthropic.com/v1/messages') {
    anthropic.llamadas.push(JSON.parse(String(init.body)));
    if (anthropic.falla) return new Response('mal', { status: 500 });
    return Response.json({ content: [{ type: 'text', text: anthropic.texto }] });
  }
  return fetchReal(url, init);
};

const ENV = {
  BREVO_API_KEY: 'clave-brevo',
  TURNSTILE_SECRET: 'secreta',
  CORREO_DESTINO: 'proyectos@accesibilidadprimero.com',
  CORREO_REMITENTE: 'proyectos@accesibilidadprimero.com',
  TURNSTILE_HOSTNAMES: 'localhost',
};
let n = 0;
const peticion = (campos = {}, { origen = 'http://localhost:4321', ficha } = {}) => {
  const d = new FormData();
  const todo = {
    nombre: 'Ana Pérez', correo: 'ana@ejemplo.com', organizacion: '', mensaje: 'Hola.\nTres líneas.',
    consentimiento: 'on', 'cf-turnstile-response': ficha ?? `ficha-buena-${++n}`, ...campos,
  };
  for (const [k, v] of Object.entries(todo)) if (v !== undefined) d.set(k, v);
  return new Request('http://localhost:4321/api/contacto', { method: 'POST', body: d, headers: origen ? { origin: origen } : {} });
};
const responde = async (req, env = ENV) => {
  const r = await contacto(req, env);
  return { status: r.status, cuerpo: await r.json() };
};

/* ---- 1. El Worker ------------------------------------------------------ */
console.log('\n── Worker ──\n');
{
  let r = await responde(peticion(), { ...ENV, BREVO_API_KEY: undefined });
  ok(r.status === 503 && brevo.llamadas.length === 0, 'sin secretos: 503 y no envía nada', JSON.stringify(r));

  r = await responde(peticion({}, { origen: 'https://otra-web.com' }));
  ok(r.status === 403 && r.cuerpo.motivo === 'origen', 'desde otra web: 403');

  r = await responde(peticion({}, { origen: null }));
  ok(r.status === 403, 'sin cabecera Origin: 403');

  for (const [nombre, campos] of [
    ['sin nombre', { nombre: '   ' }],
    ['sin correo', { correo: '' }],
    ['correo sin dominio', { correo: 'ana@ejemplo' }],
    ['sin mensaje', { mensaje: '' }],
    ['sin aceptar la privacidad', { consentimiento: undefined }],
    ['mensaje de más de 5000', { mensaje: 'a'.repeat(5001) }],
  ]) {
    r = await responde(peticion(campos));
    ok(r.status === 400 && r.cuerpo.motivo === 'campos', `${nombre}: 400`);
  }

  r = await responde(peticion({}, { ficha: '' }));
  ok(r.status === 403 && r.cuerpo.motivo === 'verificacion', 'sin ficha de Turnstile: 403');

  siteverify = { exito: false, accion: 'contacto', host: 'localhost' };
  r = await responde(peticion());
  ok(r.status === 403, 'Turnstile dice que no: 403');

  siteverify = { exito: true, accion: 'otra', host: 'localhost' };
  r = await responde(peticion());
  ok(r.status === 403, 'ficha de otra acción: 403');

  siteverify = { exito: true, accion: 'contacto', host: 'otra-web.com' };
  r = await responde(peticion());
  ok(r.status === 403, 'ficha conseguida en otro dominio: 403');
  siteverify = { exito: true, accion: 'contacto', host: 'localhost' };

  ok(brevo.llamadas.length === 0, 'ninguno de los rechazos ha llegado a Brevo');

  r = await responde(peticion({ ficha: undefined }, { ficha: 'ficha-buena-repe' }));
  const r2 = await responde(peticion({}, { ficha: 'ficha-buena-repe' }));
  ok(r.status === 200 && r2.status === 403, 'una ficha repetida no vale dos veces');

  brevo = { llamadas: [], falla: false };
  r = await responde(peticion({ nombre: 'Ana\nBcc: alguien@x.com', organizacion: 'Fundación Ejemplo' }));
  const c = brevo.llamadas[0]?.cuerpo;
  ok(r.status === 200 && r.cuerpo.ok === true, 'todo bien: 200');
  ok(c?.to?.[0]?.email === 'proyectos@accesibilidadprimero.com', 'el correo va a proyectos@');
  ok(c?.replyTo?.email === 'ana@ejemplo.com', '«Responder a» es quien escribe');
  ok(c && !/[\r\n]/.test(c.subject) && !/[\r\n]/.test(c.replyTo.name), 'sin saltos de línea en asunto ni nombre', c?.subject);
  ok(c && !('htmlContent' in c) && c.textContent.includes('Tres líneas.') && c.textContent.includes('Fundación Ejemplo'), 'solo texto, con el mensaje y la organización');
  ok(brevo.llamadas[0]?.headers?.['api-key'] === 'clave-brevo', 'la clave de Brevo va en la cabecera');

  brevo.falla = true;
  r = await responde(peticion());
  ok(r.status === 502 && r.cuerpo.motivo === 'envio', 'si Brevo falla: 502');
  brevo.falla = false;

  /* Itza en Contacto (08/11/2026): /api/itza-contacto. */
  const itza = async (cuerpo, { env = { ...ENV, ANTHROPIC_API_KEY: 'clave-itza' }, origen = 'http://localhost:4321', metodo = 'POST' } = {}) => {
    const r = await itzaContacto(new Request('http://localhost:4321/api/itza-contacto', {
      method: metodo, headers: { 'content-type': 'application/json', ...(origen ? { origin: origen } : {}) },
      body: metodo === 'POST' ? JSON.stringify(cuerpo) : undefined,
    }), env);
    return { status: r.status, cuerpo: await r.json().catch(() => ({})) };
  };
  const pregunta = { messages: [{ role: 'user', content: 'Somos una fundación cultural.' }], lang: 'es' };
  let ri = await itza(null, { metodo: 'GET', env: ENV });
  ok(ri.status === 200 && ri.cuerpo.disponible === false, 'Itza: sin clave, la página no la enseña');
  ri = await itza(null, { metodo: 'GET' });
  ok(ri.cuerpo.disponible === true, 'Itza: con clave, disponible');
  ri = await itza(pregunta, { env: ENV });
  ok(ri.status === 503 && anthropic.llamadas.length === 0, 'Itza: sin clave, 503 y no llama a nadie');
  ri = await itza(pregunta, { origen: 'https://otra-web.com' });
  ok(ri.status === 403, 'Itza: desde otra web, 403');
  for (const [nombre, cuerpo] of [
    ['empieza Itza', { messages: [{ role: 'assistant', content: 'Hola' }] }],
    ['dos seguidas de la persona', { messages: [{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }] }],
    ['pregunta demasiado larga', { messages: [{ role: 'user', content: 'a'.repeat(1201) }] }],
    ['más de 8 preguntas', { messages: Array.from({ length: 17 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x' })) }],
  ]) {
    ri = await itza(cuerpo);
    ok(ri.status === 400, `Itza: ${nombre}, 400`);
  }
  ok(anthropic.llamadas.length === 0, 'Itza: ninguno de los rechazos gasta una llamada');
  anthropic.texto = '{"respuesta": "¿Qué necesitáis?", "listo": false}';
  ri = await itza(pregunta);
  ok(ri.status === 200 && ri.cuerpo.reply === '¿Qué necesitáis?' && ri.cuerpo.listo === false && !('resumen' in ri.cuerpo), 'Itza: una pregunta, sin resumen');
  ok(anthropic.llamadas[0]?.system.includes('No pidas nombre, correo'), 'Itza: el prompt le prohíbe pedir datos personales');
  anthropic.texto = 'Vale. {"respuesta": "Listo, revísalo.", "listo": true, "resumen": "Somos una fundación y queremos rehacer la web.", "organizacion": "Fundación Ejemplo"}';
  ri = await itza(pregunta);
  ok(ri.cuerpo.listo === true && ri.cuerpo.resumen.startsWith('Somos una fundación') && ri.cuerpo.organizacion === 'Fundación Ejemplo', 'Itza: al terminar, resumen y organización');
  anthropic.texto = 'Esto no es JSON';
  ri = await itza(pregunta);
  ok(ri.status === 200 && ri.cuerpo.reply === 'Esto no es JSON' && ri.cuerpo.listo === false, 'Itza: si no responde en JSON, el texto vale como pregunta');
  anthropic.falla = true;
  ri = await itza(pregunta);
  ok(ri.status === 502, 'Itza: si la API falla, 502');
  anthropic.falla = false;

  /* Por Itza no hay casilla de consentimiento (via=itza); por el formulario,
     sigue siendo obligatoria. */
  brevo.llamadas = [];
  let rv = await responde(peticion({ consentimiento: undefined, via: 'itza' }));
  ok(rv.status === 200 && brevo.llamadas.at(-1)?.cuerpo.textContent.includes('Enviado con Itza'), 'por Itza: sin casilla, se envía y el correo lo dice', JSON.stringify(rv));
  rv = await responde(peticion({ consentimiento: undefined }));
  ok(rv.status === 400, 'por el formulario: sin casilla, 400');

  const worker = (await import('../worker/index.ts')).default;
  const get = await worker.fetch(new Request('http://localhost/api/contacto'), ENV);
  ok(get.status === 405, 'GET a /api/contacto: 405');
  /* La web de pruebas no se indexa (public/_headers y worker/index.ts); el
     dominio final, sí. */
  const enPruebas = await worker.fetch(new Request('https://accesibilidadprimero.proyectos-44e.workers.dev/api/contacto', { method: 'POST', body: new FormData() }), ENV);
  const enFinal = await worker.fetch(new Request('https://accesibilidadprimero.com/api/contacto', { method: 'POST', body: new FormData() }), ENV);
  const enEu = await worker.fetch(new Request('https://accesibilidadprimero.eu/api/contacto', { method: 'POST', body: new FormData() }), ENV);
  ok(enPruebas.headers.get('x-robots-tag') === 'noindex' && enEu.headers.get('x-robots-tag') === 'noindex' && enFinal.headers.get('x-robots-tag') === null, 'noindex en la web de pruebas y en el .eu provisional, no en el .com');
}

/* ---- 2. El formulario en el navegador ---------------------------------- */
console.log('\n── Formulario en Chromium ──\n');
const PUERTO = 4414;
const servidor = await servir(PUERTO);
const ejec = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const nav = await chromium.launch(existsSync(ejec) ? { executablePath: ejec } : {});
const URL_ = `http://localhost:${PUERTO}/contacto/`;

/* Turnstile de mentira: entrega una ficha buena al pintarse y otra al
   reiniciarse, como el invisible de verdad. Y /api/contacto lo atiende el
   Worker real, en este mismo proceso. */
const FALSO_TURNSTILE = `window.turnstile = {
  render(el, o) { this.o = o; setTimeout(() => o.callback('ficha-buena-' + Math.random()), 50); return 'w1'; },
  reset() { setTimeout(() => this.o.callback('ficha-buena-' + Math.random()), 50); },
};`;
async function pagina(opciones = {}) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, ...opciones });
  const p = await ctx.newPage();
  const turnstile = { pedidas: 0 };
  await p.route('https://challenges.cloudflare.com/**', (route) => {
    turnstile.pedidas++;
    route.fulfill({ contentType: 'text/javascript', body: FALSO_TURNSTILE });
  });
  await p.route('**/api/contacto', async (route) => {
    const req = route.request();
    const r = await contacto(new Request(req.url(), {
      method: req.method(), headers: await req.allHeaders(), body: req.postDataBuffer(),
    }), ENV);
    route.fulfill({ status: r.status, headers: Object.fromEntries(r.headers), body: await r.text() });
  });
  await p.goto(URL_, { waitUntil: 'load' });
  /* Aquí /api/itza-contacto no existe: la página vuelve al formulario. */
  if (opciones.javaScriptEnabled !== false) {
    await p.waitForFunction(() => document.documentElement.classList.contains('sin-itza'), null, { timeout: 5000 }).catch(() => {});
  }
  return { p, ctx, turnstile };
}
const rellenar = async (p) => {
  await p.fill('#nombre', 'Ana Pérez');
  await p.fill('#correo', 'ana@ejemplo.com');
  await p.fill('#mensaje', 'Hola. Tres líneas.');
  await p.check('#consentimiento');
};
const foco = (p) => p.evaluate(() => {
  const a = document.activeElement;
  return a ? a.tagName.toLowerCase() + (a.className ? '.' + String(a.className).split(' ')[0] : '') : '';
});

{
  const { p, ctx } = await pagina({ javaScriptEnabled: false });
  ok(!(await p.isVisible('form[data-formulario]')), 'sin JS: el formulario no se pinta');
  ok(await p.locator('noscript p').isVisible() && (await p.textContent('noscript p')).includes('proyectos@'), 'sin JS: el aviso con el correo se ve');
  await ctx.close();
}
{
  const { p, ctx, turnstile } = await pagina();
  ok(await p.isVisible('form[data-formulario]'), 'con JS: el formulario se pinta');
  ok(turnstile.pedidas === 0, 'Turnstile no se carga al abrir la página');

  await p.click('form[data-formulario] .boton');
  ok(await p.isVisible('[data-resumen]'), 'enviar vacío: aparece el resumen');
  ok((await foco(p)).startsWith('h3.resumen__titulo'), 'enviar vacío: el foco va al titular del resumen', await foco(p));
  ok(await p.locator('[data-resumen] li').count() === 4, 'enviar vacío: cuatro errores en el resumen');
  ok(await p.getAttribute('#nombre', 'aria-invalid') === 'true', 'el campo vacío lleva aria-invalid');

  const antes = brevo.llamadas.length;
  await rellenar(p);
  ok(turnstile.pedidas === 1, 'Turnstile se carga al tocar el formulario, una vez');
  ok(await p.getAttribute('#nombre', 'aria-invalid') === null, 'al corregir y salir del campo, el error se va');
  // Dos clics seguidos: un solo correo.
  await p.click('form[data-formulario] .boton');
  await p.click('form[data-formulario] .boton', { force: true }).catch(() => {});
  await p.waitForSelector('[data-confirmacion]:not([hidden])', { timeout: 5000 }).catch(() => {});
  ok(await p.isVisible('[data-confirmacion]'), 'enviado: se ve la confirmación');
  ok(!(await p.isVisible('form[data-formulario]')), 'enviado: el formulario desaparece');
  ok((await foco(p)).startsWith('p.confirmacion'), 'enviado: el foco va a la confirmación', await foco(p));
  ok((await p.textContent('[data-confirmacion]')).includes('ana@ejemplo.com'), 'la confirmación repite el correo');
  ok(brevo.llamadas.length - antes === 1, 'dos clics, un solo correo', `${brevo.llamadas.length - antes} correos`);
  await ctx.close();
}
{
  brevo.falla = true;
  const { p, ctx } = await pagina();
  await rellenar(p);
  await p.click('form[data-formulario] .boton');
  await p.waitForSelector('[data-error-envio]:not([hidden])', { timeout: 5000 }).catch(() => {});
  ok(await p.isVisible('[data-error-envio]'), 'si el envío falla: aviso con el correo');
  ok((await foco(p)).startsWith('p.resumen__titulo'), 'si el envío falla: el foco va al aviso', await foco(p));
  ok(await p.isVisible('form[data-formulario]') && await p.inputValue('#mensaje') === 'Hola. Tres líneas.', 'si el envío falla: no se pierde lo escrito');
  brevo.falla = false;
  await p.click('form[data-formulario] .boton');
  await p.waitForSelector('[data-confirmacion]:not([hidden])', { timeout: 5000 }).catch(() => {});
  ok(await p.isVisible('[data-confirmacion]'), 'el segundo intento, con ficha nueva, sale');
  await ctx.close();
}

/* Itza en Contacto, en el navegador. Sin el Worker configurado, la página
   de siempre. Con él: la página en menta y la pastilla; Itza pregunta, pide
   nombre y correo, enseña el mensaje y lo envía por el Worker real. */
{
  const { p, ctx } = await pagina();
  ok(!(await p.isVisible('[data-itza-contacto]')) && await p.isVisible('form[data-formulario]'), 'Itza: sin el Worker configurado, el formulario de siempre');
  await ctx.close();
}
async function conItza(respuestas, ancho = 390) {
  const ctx = await nav.newContext({ viewport: { width: ancho, height: 844 } });
  const p = await ctx.newPage();
  const enviadas = [];
  await p.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({ contentType: 'text/javascript', body: FALSO_TURNSTILE }));
  await p.route('**/api/itza-contacto', (route) => {
    const req = route.request();
    if (req.method() === 'GET') return route.fulfill({ json: { disponible: true } });
    enviadas.push(req.postDataJSON());
    const r = respuestas.shift();
    return r ? route.fulfill({ json: r }) : route.fulfill({ status: 502, json: { error: 'api' } });
  });
  await p.route('**/api/contacto', async (route) => {
    const req = route.request();
    const r = await contacto(new Request(req.url(), { method: req.method(), headers: await req.allHeaders(), body: req.postDataBuffer() }), ENV);
    route.fulfill({ status: r.status, headers: Object.fromEntries(r.headers), body: await r.text() });
  });
  await p.goto(URL_, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  return { p, ctx, enviadas };
}
{
  const { p, ctx, enviadas } = await conItza([
    { reply: '¿Qué necesitáis?', listo: false },
    { reply: 'Gracias, ya lo tengo.', listo: true, resumen: 'Somos una fundación cultural y queremos una web accesible antes de marzo.', organizacion: 'Fundación Ejemplo' },
  ]);
  ok(await p.isVisible('#itza-pildora') && !(await p.isVisible('form[data-formulario]')), 'Itza: con el Worker, la barra y sin el formulario');
  const fondo = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(fondo === 'rgb(199, 234, 228)', 'Itza: la página en menta', fondo);
  ok((await p.locator('h1').evaluateAll((hs) => hs.filter((h) => h.offsetParent).map((h) => h.textContent.trim()))).length === 1, 'Itza: un solo h1 a la vista');
  ok(await p.getAttribute('#itza-pildora', 'aria-expanded') === 'false' && !(await p.isVisible('#itza-panel')), 'Itza: la pastilla empieza plegada');
  await p.focus('#itza-pildora');
  await p.keyboard.press('Enter');
  ok(await p.getAttribute('#itza-pildora', 'aria-expanded') === 'true', 'Itza: al pulsarla, se despliega');
  ok((await p.locator('[data-itza-log] p').count()) === 1, 'Itza: empieza con su saludo');
  ok(await p.evaluate(() => document.activeElement.id) === 'itza-mensaje', 'Itza: el foco va a la respuesta');
  const conVoz = await p.evaluate(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  ok((await p.isVisible('[data-itza-voz]')) === conVoz, 'Itza: el micrófono sale solo si el navegador reconoce la voz', String(conVoz));
  await p.keyboard.type('Somos una fundación cultural.');
  await p.keyboard.press('Enter');
  /* Los tres puntos de «escribiendo» también son un <p>: hay que esperar a
     que se vayan, no solo a contar burbujas. */
  await p.waitForFunction(() => document.querySelectorAll('[data-itza-log] p:not(.escribiendo)').length === 3 && !document.querySelector('[data-itza-log] .escribiendo'));
  ok(await p.evaluate(() => document.activeElement.id) === 'itza-mensaje', 'Itza: tras responder, el foco sigue en el campo');
  await p.keyboard.type('Una web nueva, antes de marzo.');
  await p.keyboard.press('Enter');
  await p.waitForSelector('#itza-nombre:visible', { timeout: 5000 }).catch(() => {});
  ok(await p.evaluate(() => document.activeElement.id) === 'itza-nombre', 'Itza: al tenerlo, pide nombre y correo, y el foco va al nombre');
  ok(!(await p.isVisible('#itza-mensaje')), 'Itza: la charla se retira');
  await p.click('[data-paso="datos"] .itza-chat__boton');
  ok(await p.isVisible('#itza-nombre-error') && await p.isVisible('#itza-correo-error') && await p.evaluate(() => document.activeElement.id) === 'itza-nombre', 'Itza: vacíos, los dos errores y el foco al primero');
  await p.fill('#itza-nombre', 'Ana Pérez');
  await p.fill('#itza-correo', 'ana@ejemplo');
  await p.click('[data-paso="datos"] .itza-chat__boton');
  ok(!(await p.isVisible('#itza-nombre-error')) && await p.isVisible('#itza-correo-error') && await p.evaluate(() => document.activeElement.id) === 'itza-correo', 'Itza: correo sin dominio, su error y el foco ahí');
  await p.fill('#itza-correo', 'ana@ejemplo.com');
  await p.keyboard.press('Enter');
  ok(await p.evaluate(() => document.activeElement.tagName) === 'H3', 'Itza: la revisión, con el foco en su encabezado');
  ok(await p.textContent('[data-r="mensaje"]') === 'Somos una fundación cultural y queremos una web accesible antes de marzo.' && await p.textContent('[data-r="organizacion"]') === 'Fundación Ejemplo', 'Itza: el resumen y la organización, a la vista');
  ok(!JSON.stringify(enviadas).includes('Ana Pérez') && !JSON.stringify(enviadas).includes('ana@ejemplo.com'), 'Itza: el nombre y el correo no van a la IA');
  await p.click('.itza-chat__cambiar');
  ok(await p.isVisible('#itza-e-mensaje') && await p.getAttribute('.itza-chat__cambiar', 'aria-expanded') === 'true', 'Itza: «Cambiar algo» abre los campos');
  await p.fill('#itza-e-organizacion', 'Fundación Otra');
  ok(await p.textContent('[data-r="organizacion"]') === 'Fundación Otra', 'Itza: lo cambiado se ve en el resumen');
  await p.keyboard.press('Escape');
  ok(await p.getAttribute('#itza-pildora', 'aria-expanded') === 'false' && await p.evaluate(() => document.activeElement.id) === 'itza-pildora', 'Itza: Escape pliega y el foco vuelve a la barra');
  await p.keyboard.press('Enter');
  ok(await p.evaluate(() => document.activeElement.tagName) === 'H3' && await p.textContent('[data-r="organizacion"]') === 'Fundación Otra', 'Itza: al reabrir, sigue donde estaba');
  const axe = (await import('node:fs')).readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
  await p.addScriptTag({ content: axe });
  const v = await p.evaluate(async () => (await axe.run(document)).violations.map((x) => x.id));
  ok(v.length === 0, 'Itza: axe sin fallos', v.join(', '));
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  ok(ancho <= 390, 'Itza: sin scroll horizontal a 390', String(ancho));
  brevo.llamadas = [];
  await p.click('[data-paso="revision"] .itza-chat__boton');
  await p.waitForSelector('[data-itza-hecho]:visible', { timeout: 8000 }).catch(() => {});
  ok(await p.isVisible('[data-itza-hecho]') && await p.evaluate(() => document.activeElement.hasAttribute('data-itza-hecho')), 'Itza: enviado, y el foco en la confirmación');
  const correo = brevo.llamadas.at(-1)?.cuerpo;
  ok(correo?.textContent.includes('Fundación Otra') && correo?.textContent.includes('Enviado con Itza') && correo?.replyTo.email === 'ana@ejemplo.com', 'Itza: el correo llega con lo revisado', JSON.stringify(correo ?? {}).slice(0, 200));
  await ctx.close();
}
{
  /* Si la IA falla, vuelve el formulario con lo que ya se había escrito. */
  const { p, ctx } = await conItza([], 1440);
  await p.click('#itza-pildora');
  await p.fill('#itza-mensaje', 'Somos una fundación cultural.');
  await p.keyboard.press('Enter');
  await p.waitForSelector('form[data-formulario]:visible', { timeout: 6000 }).catch(() => {});
  ok(await p.isVisible('form[data-formulario]') && !(await p.isVisible('[data-itza-contacto]')), 'Itza: si la IA falla, vuelve el formulario');
  ok(await p.inputValue('#mensaje') === 'Somos una fundación cultural.' && await p.evaluate(() => document.activeElement.id) === 'nombre', 'Itza: con lo escrito, y el foco en el nombre');
  await ctx.close();
}

await nav.close();
servidor.close();

console.log('');
if (TURNSTILE_SITEKEY === TURNSTILE_SITEKEY_PRUEBA) {
  console.warn('⚠ La clave de sitio de Turnstile es la de PRUEBA (src/data/contacto.ts).');
  console.warn('  En la web publicada el formulario no enviará hasta poner la del widget de verdad.\n');
}
if (fallos) {
  console.error(`${fallos} de ${pruebas} pruebas fallan.`);
  process.exit(1);
}
console.log(`${pruebas} pruebas. El formulario y el Worker hacen lo que dicen.`);
console.log('Falta lo que solo se ve de verdad: un mensaje enviado desde la web publicada.');
