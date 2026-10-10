/* ---------------------------------------------------------------------------
   `npm run mesa` · trae lo que hay sobre la mesa y lo deja listo para el build.

   POR QUÉ ESTO Y NO UNA LLAMADA EN VIVO DESDE EL WORKER

   Lo propuse en el Worker, para que un post encendiera la sección en minutos.
   Al ir a escribirlo cambié de opinión por una razón que pesa más en este
   repositorio: una sección inyectada por el Worker NO está en `dist/`, y todo
   lo que hace fiable esta web —geometria, a11y, teclado, tipografia,
   contraste— mide `dist/`. Sería la única sección de la página que nadie
   comprueba, y además la única que cambia sola.

   Así que el contenido se congela aquí, en un snapshot que se confirma con el
   resto del código, y la web se construye a partir de él. Mismo patrón que
   `npm run arte`: originales fuera, generado dentro, build determinista. Un
   build no debería fallar porque Mastodon esté caído.

   Lo que se pierde: la frescura al minuto. Lo que se gana: que la sección se
   mida como todo lo demás y que el despliegue sea reproducible. Si algún día
   hace falta el minuto, este archivo exporta `recolectar()` y el Worker puede
   llamarlo sin reescribir nada.

   LAS IMÁGENES SE DESCARGAN, no se enlazan a mastodon.social. Si se enlazaran,
   el navegador de cada visitante llamaría a un tercero solo por abrir la
   portada. En una web que ha renunciado a banner de cookies y a analítica de
   terceros, eso sería incoherente.

   Uso:
     npm run mesa              trae, informa y escribe
     npm run mesa -- --seco    trae e informa, sin escribir nada
   --------------------------------------------------------------------------- */
import { writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

/* ----- Lo que se puede tocar sin leer el resto --------------------------- */
export const CONFIG = {
  instancia: 'https://mastodon.social',
  cuenta: '117416885379346326',        // @accesibilidadprimero
  etiqueta: 'WIP',
  /* La puerta de frescura. Si el post más reciente que vale es más viejo que
     esto, la sección NO se dibuja: ni hueco ni «no hay novedades». Así
     «ahora» es verdad por construcción. 60 y no 30 (Johnny, 10/10): con 30 la
     sección parpadearía con un ritmo normal de estudio, y la fecha de cada
     tarjeta ya deja que cada cual juzgue si algo es reciente. La puerta solo
     tiene que atrapar el abandono. */
  dias: 60,
  maxTitular: 160,
  maxNotas: 6,
};

const SALIDA_JSON = path.join(RAIZ, 'src/data/mesa.json');
const SALIDA_IMG = path.join(RAIZ, 'src/assets/mesa');

/* ----- Texto -------------------------------------------------------------- */

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", '#x27': "'" };
const desescapar = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  const k = e.toLowerCase();
  if (ENTIDADES[k]) return ENTIDADES[k];
  if (k.startsWith('#x')) return String.fromCodePoint(parseInt(k.slice(2), 16));
  if (k.startsWith('#')) return String.fromCodePoint(Number(k.slice(1)));
  return m;
});

/* El HTML de Mastodon a texto con sus saltos. Los hashtags se van enteros: un
   lector de pantalla lee «#WIP» como «almohadilla u i pe» y no aporta nada a
   quien lee la portada. Las menciones también. */
export function aTexto(html) {
  return desescapar(
    html
      .replace(/<a[^>]*class="[^"]*\bmention\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
      .replace(/<a[^>]*class="[^"]*\bhashtag\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
      .replace(/<\/?p[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')
    .trim();
}

/* Abreviaturas que llevan punto y NO terminan frase. Sin esto, «Sr. García»
   partiría en dos. */
const ABREV = /\b(?:sr|sra|srta|dr|dra|av|avda|c|pág|págs|núm|núms|ed|vol|ss|etc|ej|aprox|máx|mín|p)\.$/i;

/* El titular: el primer renglón o la primera frase, LO QUE TERMINE ANTES.
   Por defecto sale la frase, que es como escribe Johnny; y si quiere mandar
   él, pone un Enter donde quiera cortar y gana el renglón. Se invirtió el
   10/10 al ver el primer post real: su primer párrafo medía 244 caracteres,
   o sea que la regla del renglón no disparaba nunca. */
export function titular(texto, max = CONFIG.maxTitular) {
  const renglon = texto.split('\n')[0].trim();

  let frase = renglon;
  const corte = /([.!?])(\s+)(?=[«"¿¡A-ZÁÉÍÓÚÜÑ])/g;
  let m;
  while ((m = corte.exec(renglon)) !== null) {
    const hasta = renglon.slice(0, m.index + 1);
    if (ABREV.test(hasta)) continue;      // «Sr.» no acaba frase
    frase = hasta;
    break;
  }

  let t = frase.length <= renglon.length ? frase : renglon;
  let recorte = t === renglon && frase === renglon ? 'renglón' : 'frase';

  if (t.length > max) {                    // red de seguridad
    const trozo = t.slice(0, max);
    const esp = trozo.lastIndexOf(' ');
    t = (esp > max * 0.6 ? trozo.slice(0, esp) : trozo).replace(/[.,;:\s]+$/, '') + '…';
    recorte = `recortado en ${max}`;
  }
  return { texto: t, regla: recorte };
}

/* ----- Red ---------------------------------------------------------------- */

const pedir = async (url) => {
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} al pedir ${url}`);
  return r.json();
};

export async function recolectar(cfg = CONFIG) {
  const base = `${cfg.instancia}/api/v1/accounts/${cfg.cuenta}/statuses`;
  const comun = 'exclude_replies=true&exclude_reblogs=true';
  const [etiquetados, fijados] = await Promise.all([
    pedir(`${base}?${comun}&tagged=${encodeURIComponent(cfg.etiqueta)}&limit=40`),
    pedir(`${base}?pinned=true&limit=40`),
  ]);
  /* Un post fijado se queda aunque pase la puerta de los 60 días: una noticia
     —un cliente nuevo— no caduca igual que «probando VoiceOver». La chincheta
     se pone en Mastodon y la web obedece. */
  const fijadosConEtiqueta = fijados.filter((s) => (s.tags ?? []).some((t) => t.name.toLowerCase() === cfg.etiqueta.toLowerCase()));
  const porId = new Map();
  for (const s of [...fijadosConEtiqueta, ...etiquetados]) {
    if (!porId.has(s.id)) porId.set(s.id, { ...s, fijado: fijadosConEtiqueta.some((f) => f.id === s.id) });
  }
  return [...porId.values()];
}

/* ----- Criba -------------------------------------------------------------- */

export function cribar(crudos, cfg = CONFIG, ahora = new Date()) {
  const limite = new Date(ahora.getTime() - cfg.dias * 864e5);
  const aceptadas = [];
  const descartadas = [];

  for (const s of crudos) {
    const fecha = new Date(s.created_at);
    const imagenes = (s.media_attachments ?? []).filter((m) => m.type === 'image');
    const motivo = (m) => descartadas.push({ id: s.id, fecha: s.created_at, motivo: m });

    /* SIN ALTERNATIVA NO SE PUBLICA. `description` es nullable: null cuando no
       se escribió texto alternativo. Sin esta criba, el modo de fallo por
       defecto de esta sección es que la portada de un estudio de
       accesibilidad publique sola una imagen sin alternativa.
       OJO: esto detecta AUSENCIA, no mediocridad. Lo segundo es tuyo. */
    const sinAlt = (s.media_attachments ?? []).filter((m) => !m.description || !m.description.trim());
    if (sinAlt.length) { motivo(`${sinAlt.length} adjunto(s) sin alternativa`); continue; }
    if (!imagenes.length) { motivo('sin imagen'); continue; }
    if (!s.fijado && fecha < limite) { motivo(`más de ${cfg.dias} días`); continue; }

    const texto = aTexto(s.content);
    if (!texto) { motivo('sin texto una vez quitados los hashtags'); continue; }
    const t = titular(texto, cfg.maxTitular);
    aceptadas.push({
      id: s.id, url: s.url, fijado: !!s.fijado,
      fecha: s.created_at, idioma: s.language || 'es',
      titular: t.texto, regla: t.regla, largoOriginal: texto.length,
      imagen: { remota: imagenes[0].url, alt: imagenes[0].description.trim(),
                ancho: imagenes[0].meta?.original?.width ?? null,
                alto: imagenes[0].meta?.original?.height ?? null },
    });
  }

  aceptadas.sort((a, b) => (Number(b.fijado) - Number(a.fijado)) || (new Date(b.fecha) - new Date(a.fecha)));
  const recientes = aceptadas.filter((n) => !n.fijado && new Date(n.fecha) >= limite);
  /* La puerta: si no hay NADA reciente, la sección no existe. Un fijado solo
     no basta para decir «sobre la mesa»: diría que lo último que pasó fue
     hace medio año. */
  const visible = recientes.length > 0;
  return { visible, notas: visible ? aceptadas.slice(0, cfg.maxNotas) : [], descartadas };
}

/* ----- Descarga ----------------------------------------------------------- */

async function bajarImagenes(notas, seco) {
  if (seco) return notas;
  await mkdir(SALIDA_IMG, { recursive: true });
  const usados = new Set();
  for (const n of notas) {
    const ext = (new URL(n.imagen.remota).pathname.match(/\.(\w+)$/)?.[1] ?? 'jpg').toLowerCase();
    const nombre = `${n.id}.${ext}`;
    usados.add(nombre);
    const destino = path.join(SALIDA_IMG, nombre);
    if (!existsSync(destino)) {
      const r = await fetch(n.imagen.remota);
      if (!r.ok) throw new Error(`No pude bajar la imagen de ${n.id}: ${r.status}`);
      await writeFile(destino, Buffer.from(await r.arrayBuffer()));
    }
    n.imagen.archivo = nombre;
  }
  /* Lo que ya no sale en la sección no se queda ocupando sitio en el repo. */
  for (const f of await readdir(SALIDA_IMG)) {
    if (!usados.has(f) && f !== '.gitkeep') await unlink(path.join(SALIDA_IMG, f));
  }
  return notas;
}

/* ----- Informe ------------------------------------------------------------ */

const fmt = (iso) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

async function principal() {
  const seco = process.argv.includes('--seco');
  const crudos = await recolectar();
  const { visible, notas, descartadas } = cribar(crudos);

  console.log(`\n── Sobre la mesa · ${crudos.length} post(s) con #${CONFIG.etiqueta} ──\n`);
  for (const n of notas) {
    console.log(`  ${fmt(n.fecha).padEnd(8)} ✓ ${n.fijado ? '[fijado] ' : ''}«${n.titular}»`);
    console.log(`           ${String(n.titular.length).padStart(3)} car · por ${n.regla}` +
      (n.largoOriginal > n.titular.length ? ` · el post entero medía ${n.largoOriginal}` : ''));
  }
  for (const d of descartadas) console.log(`  ${fmt(d.fecha).padEnd(8)} ✗ descartado: ${d.motivo}`);

  console.log(`\n  La sección ${visible ? 'SE DIBUJA' : 'NO se dibuja'}` +
    (visible ? ` con ${notas.length} nota(s).` : `: nada en los últimos ${CONFIG.dias} días.`));

  if (seco) { console.log('\n  (--seco: no he escrito nada)\n'); return; }

  await bajarImagenes(notas, seco);
  await mkdir(path.dirname(SALIDA_JSON), { recursive: true });
  await writeFile(SALIDA_JSON, JSON.stringify({
    generado: new Date().toISOString(), dias: CONFIG.dias, visible, notas,
  }, null, 2) + '\n');
  console.log(`  Escrito src/data/mesa.json y ${notas.length} imagen(es) en src/assets/mesa/\n`);
}

/* ----- Prueba de la criba, sin red ---------------------------------------
   Las dos reglas que sostienen esta sección —la puerta de los 60 días y el
   filtro de alternativas— no se pueden comprobar mirando la web: hay que
   provocar que fallen. Esto las prueba EN LOS DOS SENTIDOS con posts de
   mentira, así que entra en `npm run verificar` sin depender de que Mastodon
   esté en pie. */
function probar() {
  const hoy = new Date('2026-10-10T12:00:00Z');
  const post = (extra = {}) => ({
    id: String(Math.random()), url: 'https://ejemplo/1', created_at: '2026-10-09T10:00:00Z',
    language: 'es', content: '<p>Una frase corta. Y otra cosa más larga detrás.</p>',
    media_attachments: [{ type: 'image', url: 'https://ejemplo/i.webp', description: 'Una alternativa de verdad.', meta: { original: { width: 1920, height: 1080 } } }],
    ...extra,
  });
  const casos = [];
  const comp = (nombre, ok, detalle = '') => casos.push({ nombre, ok, detalle });

  // Puerta de frescura, en los dos sentidos.
  comp('Un post de ayer dibuja la sección', cribar([post()], CONFIG, hoy).visible);
  comp('Un post de hace 90 días NO la dibuja',
    !cribar([post({ created_at: '2026-07-10T10:00:00Z' })], CONFIG, hoy).visible);
  comp('Un fijado viejo SOLO tampoco la dibuja',
    !cribar([post({ created_at: '2026-01-10T10:00:00Z', fijado: true })], CONFIG, hoy).visible);
  {
    const r = cribar([post({ created_at: '2026-01-10T10:00:00Z', fijado: true }), post()], CONFIG, hoy);
    comp('Pero con algo reciente, el fijado se queda y va primero',
      r.visible && r.notas.length === 2 && r.notas[0].fijado, `${r.notas.length} notas`);
  }

  // Alternativas, en los dos sentidos.
  comp('Con alternativa, pasa', cribar([post()], CONFIG, hoy).notas.length === 1);
  {
    const r = cribar([post({ media_attachments: [{ type: 'image', url: 'x', description: null }] })], CONFIG, hoy);
    comp('Sin alternativa, se descarta y se dice por qué',
      r.notas.length === 0 && /sin alternativa/.test(r.descartadas[0]?.motivo ?? ''), r.descartadas[0]?.motivo);
  }
  comp('Alternativa en blanco cuenta como ausente',
    cribar([post({ media_attachments: [{ type: 'image', url: 'x', description: '   ' }] })], CONFIG, hoy).notas.length === 0);

  // El titular.
  const t = (x, max) => titular(x, max).texto;
  comp('Corta por la primera frase', t('Una frase corta. Y otra detrás.') === 'Una frase corta.');
  comp('Gana el renglón si acaba antes', t('Titular corto\nUna frase larga que vendría después.') === 'Titular corto');
  comp('No parte en una abreviatura', t('Lo vio el Sr. García en la UPV. Después se fue.') === 'Lo vio el Sr. García en la UPV.');
  comp('No parte en un número', t('Costó 1.000 euros. Y poco más.') === 'Costó 1.000 euros.');
  comp('Recorta por palabra entera y avisa', (() => {
    const r = titular('a'.repeat(30) + ' ' + 'b'.repeat(200), 60);
    return r.texto.endsWith('…') && r.texto.length <= 61 && /recortado/.test(r.regla);
  })());
  comp('Los hashtags no llegan al texto',
    aTexto('<p>Hola.</p><p><a class="hashtag" href="#">#<span>WIP</span></a></p>') === 'Hola.');

  console.log('\n── Criba de «Sobre la mesa» (sin red) ──\n');
  let mal = 0;
  for (const c of casos) {
    if (!c.ok) mal++;
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.nombre}${c.detalle ? ` — ${c.detalle}` : ''}`);
  }
  console.log(mal ? `\n${mal} comprobación(es) de la criba fallan.\n` : `\n${casos.length} comprobaciones de la criba. Todo cuadra.\n`);
  if (mal) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  if (process.argv.includes('--prueba')) probar();
  else principal().catch((e) => { console.error('\n' + e.message + '\n'); process.exit(1); });
}
