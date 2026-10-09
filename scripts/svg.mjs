/* ---------------------------------------------------------------------------
   Compila `arte/` en `src/assets/`.

   Una sola carpeta donde dejar las cosas y un solo comando. Los SVG se
   limpian; los PNG y JPG se copian tal cual, porque de esos ya se encarga
   Astro en el build (AVIF + WebP + original de respaldo).

   Dos carpetas a propósito:
     · `arte/`        → lo que sale de Illustrator. Johnny manda aquí. No se
                        toca nunca: si hay que reeditar una ilustración, el
                        original está intacto.
     · `src/assets/`  → lo que usa la web. Lo genera este script.

   Por qué no se hace en el build: Astro convierte un .svg en componente
   durante su propia fase de carga, antes de que pueda entrar un plugin de Vite
   aunque lleve `enforce: 'pre'`. Se comprobó: al plugin le llega JavaScript, no
   el SVG. Un paso en disco que se puede abrir y leer es mejor que un gancho
   frágil en las tripas del bundler.

   `floatPrecision: 1` es una décima de unidad del lienzo, que a 693 px de
   ancho es un sexto de píxel. Se comprobó rasterizando las dos versiones a
   1386 px y comparándolas píxel a píxel: la diferencia media va de 0,26 a 0,72
   sobre 255, menos del 0,3 %. A precisión 0 sí se nota, así que no se baja.
   --------------------------------------------------------------------------- */
import { optimize } from 'svgo';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const ORIGEN = join(RAIZ, 'arte');
const DESTINO = join(RAIZ, 'src/assets');
/* El vídeo no pasa por el pipeline de imagen de Astro —no lo procesa—, así que
   va a public/, que es lo que se sirve tal cual con una URL fija. */
const DESTINO_VIDEO = join(RAIZ, 'public/video');
const ES_VIDEO = /\.(mp4|webm)$/i;

if (!existsSync(ORIGEN)) {
  console.error(`No existe ${relative(RAIZ, ORIGEN)}/. Ahí van los SVG tal cual salen de Illustrator.`);
  process.exit(1);
}

const IMAGENES = /\.(svg|png|jpg|jpeg|webp|mp4|webm)$/i;

function* archivos(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* archivos(p);
    else if (IMAGENES.test(e.name)) yield p;
  }
}

/* Lo que espera cada hueco del diseño, en píxeles de pantalla. Se exporta al
   doble, porque Astro reduce pero no amplía. Un archivo que no esté en esta
   tabla no se comprueba, solo se copia. */
const ESPERADO = {
  'proyectos/eci-1.png': [904, 568], 'proyectos/eci-2.png': [904, 568], 'proyectos/eci-3.png': [904, 568],
  'proyectos/foc-1.png': [400, 564], 'proyectos/foc-2.png': [400, 564], 'proyectos/foc-3.png': [400, 564],
  'proyectos/izaskun-1.png': [656, 412], 'proyectos/izaskun-2.png': [656, 412], 'proyectos/izaskun-3.png': [656, 412],
  /* Las verticales de móvil: el mismo hueco en los tres proyectos (Figma,
     Móvil 390). Se piden a 588 × 1280. */
  ...Object.fromEntries(['eci', 'foc', 'izaskun'].flatMap((p) =>
    [1, 2, 3].map((n) => [`proyectos/${p}-${n}-movil.png`, [294, 640]]))),
  /* Productos: el hueco es 392 × 403, pero el móvil entra encajado por el
     alto, así que lo que hay que medir es el dibujo: 403 de alto y el ancho
     que le da su proporción (0,486), 196. */
  'productos/itza-fotograma.png': [196, 403],
  'productos/itza-inicio.png': [196, 403],
  'productos/a11y-primero.png': [196, 403],
  'productos/accessible-abstracts.png': [196, 403],
};

/* Lee el tamaño de un PNG sin dependencias: va en la cabecera IHDR. */
function tamanoPng(ruta) {
  const b = readFileSync(ruta);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

const br = (b) => brotliCompressSync(b, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;

let antes = 0, despues = 0, comprimido = 0, n = 0, copiados = 0;
const problemas = [];
const avisos = [];

for (const ruta of archivos(ORIGEN)) {
  const rel = relative(ORIGEN, ruta);
  const salidaRaster = join(DESTINO, rel);

  /* Todo lo que no sea SVG se copia tal cual: Astro ya lo convierte a AVIF y
     WebP en el build. Aquí solo se comprueba que viene al tamaño que pide el
     diseño, que es el error que no se ve hasta tener la web delante. */
  if (ES_VIDEO.test(rel)) {
    const salidaVideo = join(DESTINO_VIDEO, rel.split(sep).pop());
    mkdirSync(dirname(salidaVideo), { recursive: true });
    writeFileSync(salidaVideo, readFileSync(ruta));
    copiados++;
    /* Una sola sustitución, no dos encadenadas: .mp4 → .webm → .mp4 devolvía
       el nombre original y el aviso no saltaba nunca. Una comprobación que no
       comprueba es peor que no tenerla. */
    const hermano = /\.mp4$/i.test(rel) ? rel.replace(/\.mp4$/i, '.webm') : rel.replace(/\.webm$/i, '.mp4');
    if (!existsSync(join(ORIGEN, hermano))) {
      avisos.push(`${rel}: falta ${hermano}. Un solo formato deja fuera a algún navegador.`);
    }
    /* El fotograma fijo se llama `<nombre>-fotograma.png`. Antes este aviso
       saltaba SIEMPRE, existiera o no, y un aviso que salta siempre enseña a
       no leerlo. */
    if (/\.mp4$/i.test(rel)) {
      const fotograma = rel.replace(/\.mp4$/i, '-fotograma.png');
      if (!existsSync(join(ORIGEN, fotograma))) {
        avisos.push(`${rel}: falta ${fotograma}, el fotograma fijo para quien tenga activado prefers-reduced-motion.`);
      }
    }
    console.log(`  ${rel.padEnd(40)} ${String(statSync(ruta).size).padStart(7)}    (a public/video/)`);
    continue;
  }

  if (!rel.endsWith('.svg')) {
    mkdirSync(dirname(salidaRaster), { recursive: true });
    writeFileSync(salidaRaster, readFileSync(ruta));
    copiados++;
    if (/\.webp$/i.test(rel)) {
      avisos.push(`${rel}: viene en WebP. Se vuelve a comprimir en el build, así que pierde un poco. Si tienes el original en PNG o JPG, mejor ese.`);
    }
    const pide = ESPERADO[rel.split(sep).join('/')];
    const mide = rel.toLowerCase().endsWith('.png') ? tamanoPng(ruta) : null;
    if (pide && mide) {
      const [pw, ph] = pide, [mw, mh] = mide;
      /* Un 1 % de margen: un export a 800×1125 en vez de 800×1128 no se ve
         blando, es el redondeo de la mesa de trabajo. Avisar de eso sería
         ruido, y un aviso que nadie se cree deja de servir para nada. */
      const corto = mw < pw * 2 * 0.99 || mh < ph * 2 * 0.99;
      const otraProporcion = Math.abs(mw / mh - pw / ph) > 0.02;
      if (otraProporcion && Math.abs(mh / mw - pw / ph) <= 0.02) {
        avisos.push(`${rel}: ${mw}×${mh} está girada. El hueco es ${pw}×${ph}; la has exportado tumbada.`);
      } else if (otraProporcion) {
        avisos.push(`${rel}: proporción ${(mw / mh).toFixed(2)} y el hueco pide ${(pw / ph).toFixed(2)}. Va a recortar o a dejar aire.`);
      } else if (corto) {
        avisos.push(`${rel}: ${mw}×${mh}. El hueco mide ${pw}×${ph}, así que se pide ${pw * 2}×${ph * 2} (@2x). Se verá blanda.`);
      }
    }
    console.log(`  ${rel.padEnd(40)} ${String(statSync(ruta).size).padStart(7)}    (copiado)`);
    continue;
  }

  const crudo = readFileSync(ruta, 'utf8');

  /* Un SVG con un mapa de bits dentro es lo peor de los dos mundos: pesa como
     el bitmap y encima no escala. Eso sí para la obra. */
  if (/<image[\s>]/.test(crudo)) problemas.push(`${rel}: lleva un mapa de bits incrustado. Eso no es vectorial: usa el archivo original (.png, .jpg) y deja que Astro lo optimice.`);
  if (!/viewBox=/.test(crudo)) problemas.push(`${rel}: no tiene viewBox, así que no puede escalar.`);

  /* El texto vivo se QUITA, no rompe el build. Illustrator se trae la etiqueta
     de la mesa de trabajo fuera del lienzo, invisible pero presente, y en una
     tipografía que nadie tiene instalada. Y la regla del repo es que no va
     texto dentro de una imagen (AGENTS.md §1): si ese texto dice algo, su
     sitio es el HTML, donde se puede leer, traducir y buscar. */
  let limpio = crudo;
  const textos = [...crudo.matchAll(/<text[\s>][\s\S]*?<\/text>/g)];
  if (textos.length) {
    limpio = crudo.replace(/<text[\s>][\s\S]*?<\/text>/g, '');
    const dice = textos
      .map((t) => t[0].replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
      .join(' · ')
      .slice(0, 60);
    avisos.push(`${rel}: le he quitado ${textos.length} texto(s) vivo(s)${dice ? ` («${dice}»)` : ''}. El original en arte/ no se toca.`);
  }

  const { data } = optimize(limpio, {
    multipass: true,
    floatPrecision: 1,
    // En SVGO 4 `removeViewBox` ya no entra en preset-default: el viewBox se
    // conserva solo, que es lo que permite que la ilustración escale.
    plugins: [{ name: 'preset-default' }],
  });

  mkdirSync(dirname(salidaRaster), { recursive: true });
  writeFileSync(salidaRaster, data);

  const a = statSync(ruta).size, d = Buffer.byteLength(data), c = br(Buffer.from(data));
  antes += a; despues += d; comprimido += c; n++;
  console.log(`  ${rel.padEnd(40)} ${String(a).padStart(7)} → ${String(d).padStart(7)}  (${String(c).padStart(6)} comprimido)`);
}

if (!n && !copiados) { console.error(`\nNo hay ninguna imagen en ${relative(RAIZ, ORIGEN)}/.`); process.exit(1); }

if (n) console.log(`\n${n} SVG · ${(antes / 1024).toFixed(0)} KB → ${(despues / 1024).toFixed(0)} KB en disco · ${(comprimido / 1024).toFixed(0)} KB servidos`);
if (copiados) console.log(`${copiados} imagen(es) copiada(s) sin tocar: las optimiza Astro en el build.`);

/* Un aviso no para la obra: la imagen está puesta y se ve, solo que no al
   nivel que debería. Un problema sí la para: rompe la ilustración. */
if (avisos.length) {
  console.warn('\nAvisos:');
  for (const a of avisos) console.warn(`  ! ${a}`);
}
if (problemas.length) {
  console.error('\nProblemas:');
  for (const p of problemas) console.error(`  ✗ ${p}`);
  process.exit(1);
}
