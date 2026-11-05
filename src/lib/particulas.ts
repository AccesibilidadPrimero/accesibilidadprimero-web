/* ---------------------------------------------------------------------------
   Partículas a final de línea (Johnny, 14/10/2026: «nunca una línea de un
   párrafo debe terminar en "y"»).

   En tipografía española no se deja a final de línea un artículo, una
   preposición o una conjunción corta: «y», «de», «la»… Se resuelve con un
   espacio que no se parte (U+00A0) DETRÁS de la partícula, así la partícula
   baja de línea pegada a la palabra que la sigue.

   Se aplica a TODO el HTML que sale (src/middleware.ts), no a mano: así entra
   también en el Markdown del blog y en lo que se escriba mañana, sin que nadie
   tenga que acordarse. Solo toca texto: ni atributos (alt, aria-label), ni
   <head>, ni script, style, pre, code, textarea o svg.

   Y una segunda cosa, la VIUDA: un párrafo que acaba con una palabra sola en
   su última línea. `text-wrap: pretty` (base.css) lo evita casi siempre, pero
   no en todos los navegadores ni en todos los casos; por eso las dos últimas
   palabras de cada párrafo (p, li, dd, figcaption, blockquote) también van
   unidas. Solo si juntas miden 28 caracteres o menos: a 320 px caben unos 33,
   y más largas podrían no caber en una línea.

   Lista cerrada y corta a propósito: palabras de una a tres letras que no
   pueden cerrar una línea. Las cadenas («y a la casa») quedan unidas enteras;
   en castellano son cortas, y `npm run a11y` mide a 320 px que no desborden.
   Cada idioma con su lista (05/11/2026): el catalán y el inglés entran con
   la web traducida. En inglés la tradición no es tan estricta, pero la regla
   de Johnny es la misma: ninguna línea acaba en «and», «of» o «the».
   --------------------------------------------------------------------------- */
export const PARTICULAS_ES = [
  'y', 'e', 'o', 'u', 'ni', 'a', 'al', 'de', 'del', 'en', 'el', 'la', 'lo', 'los', 'las',
  'un', 'una', 'con', 'por', 'sin', 'que', 'se', 'su', 'sus', 'mi', 'tu', 'si', 'no',
];
export const PARTICULAS_CA = [
  'i', 'o', 'u', 'ni', 'a', 'al', 'als', 'de', 'del', 'dels', 'en', 'el', 'la', 'els', 'les',
  'un', 'una', 'amb', 'per', 'pel', 'que', 'es', 'seu', 'si', 'no', 'hi', 'ho', 'ens', 'és',
];
export const PARTICULAS_EN = [
  'a', 'an', 'the', 'and', 'or', 'nor', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'as',
  'if', 'no', 'our', 'its', 'we', 'is',
];
const LISTAS: Record<string, string[]> = { es: PARTICULAS_ES, ca: PARTICULAS_CA, en: PARTICULAS_EN };

const NBSP = ' ';
/* Las tablas tampoco: en una columna estrecha, cualquier palabra unida de
   más desborda la celda y la tabla entera (lo midió `npm run a11y` a 320). */
const SALTA = new Set(['script', 'style', 'pre', 'code', 'textarea', 'svg', 'head', 'kbd', 'samp', 'table']);
/* Escape para un caso concreto: un elemento con `data-renglones="libre"` se
   deja como está. Para textos en columnas muy estrechas donde unir palabras
   haría desbordar (Estudio, el cargo junto a la foto, a 320 px). */
const LIBRE = /\bdata-renglones="libre"/;
/* Etiquetas en línea: si el texto acaba en «de » y lo siguiente es un enlace,
   el espacio también se fija. Delante de un bloque no tiene sentido. */
const EN_LINEA = new Set(['a', 'span', 'strong', 'em', 'b', 'i', 'abbr', 'sup', 'sub', 'mark', 'small', 'time', 'q', 'cite', 'dfn', 'bdi']);

function patrones(particulas: string[]) {
  const lista = particulas.join('|');
/* Partícula entera (precedida de inicio, espacio, nbsp o un signo de
   apertura) seguida de un espacio normal y de algo que no es espacio. */
  const DENTRO = new RegExp(`(^|[\\s\\u00A0(«“"¿¡—])(${lista})[ \\t\\r\\n]+(?=\\S)`, 'giu');
/* En el <h1> (titulares en display, 34 px en móvil) la línea a 320 px mide
   272 px. Medido en el render: «a la accesibilidad» ocupa 247 y «de
   comunicación», 256. Ahí la cadena ENTERA de palabras unidas no pasa de 18
   caracteres; si no cabe, la partícula se queda al final de su línea: el
   reflow (1.4.10, AA) manda sobre la tipografía. */
  const ES_PARTICULA = new RegExp(`^[(«“"¿¡—]*(${lista})$`, 'iu');
  const AL_FINAL = new RegExp(`(^|[\\s\\u00A0(«“"¿¡—])(${lista})[ \\t\\r\\n]+$`, 'iu');
  return { DENTRO, ES_PARTICULA, AL_FINAL };
}
const PATRONES = Object.fromEntries(Object.entries(LISTAS).map(([k, v]) => [k, patrones(v)]));
const MAX_TITULAR = 18;
/* Las dos últimas palabras del texto, separadas por un espacio normal. */
const VIUDA = /(\S+)[ \t\r\n]+(\S+\s*)$/u;
const MAX_VIUDA = 28;
const PARRAFO = new Set(['p', 'li', 'dd', 'figcaption', 'blockquote']);

function fijarTitular(texto: string, { ES_PARTICULA }: ReturnType<typeof patrones>): string {
  const t = texto.split(/([ \t\r\n]+)/);   // palabra, espacio, palabra…
  let cadena = (t[0] ?? '').length;
  for (let i = 1; i + 1 < t.length; i += 2) {
    const antes = t[i - 1], despues = t[i + 1];
    if (antes && despues && ES_PARTICULA.test(antes.split('\u00A0').pop()!) && cadena + 1 + despues.length <= MAX_TITULAR) {
      t[i] = NBSP;
      cadena += 1 + despues.length;
    } else cadena = despues.length;
  }
  return t.join('');
}

function fijar(texto: string, siguienteEnLinea: boolean, enTitular: boolean, pat: ReturnType<typeof patrones>): string {
  const { DENTRO, AL_FINAL } = pat;
  if (enTitular) return fijarTitular(texto, pat);
  /* Dos pasadas: con una sola, en «y a la casa» el espacio de la primera
     coincidencia se consume y «a» ya no encuentra su inicio. */
  let t = texto.replace(DENTRO, `$1$2${NBSP}`).replace(DENTRO, `$1$2${NBSP}`);
  if (siguienteEnLinea) t = t.replace(AL_FINAL, `$1$2${NBSP}`);
  return t;
}

/** HTML entero → mismo HTML con las partículas fijadas en el texto. */
export function sinParticulasAlFinal(html: string, idioma = 'es'): string {
  const pat = PATRONES[idioma] ?? PATRONES.es;
  const trozos = html.split(/(<[^>]*>)/);
  const pila: string[] = [];
  let ultimoTexto = -1;   // último trozo de texto dentro del bloque en curso
  /* Los <span> que son una línea o una versión del texto (`linea`,
     `solo-amplio`, `solo-movil`) acaban como un párrafo: también se unen sus
     dos últimas palabras. */
  const spans: boolean[] = [];
  let enTitular = false;
  const unirViuda = () => {
    if (ultimoTexto < 0) return;
    trozos[ultimoTexto] = trozos[ultimoTexto].replace(VIUDA, (todo, a: string, b: string) =>
      a.length + b.trim().length + 1 <= MAX_VIUDA ? `${a}${NBSP}${b}` : todo);
  };
  for (let i = 0; i < trozos.length; i++) {
    const t = trozos[i];
    if (t.startsWith('<')) {
      const m = /^<\s*(\/)?\s*([a-zA-Z][\w-]*)/.exec(t);
      if (!m) continue;
      const nombre = m[2].toLowerCase();
      if (nombre === 'h1') enTitular = !m[1];
      if (nombre === 'span') {
        if (!m[1]) { if (!t.endsWith('/>')) spans.push(/\bclass="[^"]*\b(linea|solo-amplio|solo-movil)\b/.test(t)); }
        else if (spans.pop()) { unirViuda(); ultimoTexto = -1; }
      }
      if (!EN_LINEA.has(nombre) && !SALTA.has(nombre) && nombre !== 'br') {
        /* Cierre de párrafo: unir sus dos últimas palabras. Cualquier otra
           etiqueta de bloque corta la cuenta. */
        if (m[1] && PARRAFO.has(nombre)) unirViuda();
        ultimoTexto = -1;
      }
      if (!SALTA.has(nombre) && !(LIBRE.test(t) || pila.at(-1) === `libre:${nombre}`)) continue;
      if (m[1]) { if (pila.at(-1) === nombre || pila.at(-1) === `libre:${nombre}`) pila.pop(); }
      else if (!t.endsWith('/>')) pila.push(SALTA.has(nombre) ? nombre : `libre:${nombre}`);
      continue;
    }
    if (pila.length || !t.trim()) continue;
    const sig = /^<\s*([a-zA-Z][\w-]*)/.exec(trozos[i + 1] ?? '');
    trozos[i] = fijar(t, Boolean(sig && EN_LINEA.has(sig[1].toLowerCase())), enTitular, pat);
    ultimoTexto = i;
  }
  return trozos.join('');
}
