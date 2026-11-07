/* ---------------------------------------------------------------------------
   Blog · categorías, idiomas y textos de la interfaz.

   Desde el 07/11/2026 el blog existe en castellano, catalán e inglés
   (Johnny: «los 6 en los tres idiomas»). Cómo se organiza:

   · src/content/blog/<slug>.md       castellano
   · src/content/blog/ca/<slug>.md    catalán
   · src/content/blog/en/<slug>.md    inglés

   Las tres versiones de un artículo comparten `clave`, y cada una tiene su
   propio tramo final en su idioma. Un artículo con `clave` existe en los
   tres idiomas o el build se para (la regla del 30/09). Los ocho artículos
   que vienen de WordPress no llevan `clave`: siguen solo en castellano y no
   enseñan selector de idioma.
   --------------------------------------------------------------------------- */
import type { CollectionEntry } from 'astro:content';
import { path, type Lang, type Slug } from '../i18n/config';

/* Categorías del Blog: la clave es el trozo de URL (/blog/categoria/<clave>/)
   y el valor, lo que se lee. Las mismas tres que tenía WordPress con
   artículos; «Auditoría Express» no tenía ninguno y no entra (Figma, 30/09). */
export const CATEGORIAS = {
  'accesibilidad-digital': 'Accesibilidad digital',
  'auditoria-wcag': 'Auditoría WCAG',
  diseno: 'Diseño',
} as const;
export type Categoria = keyof typeof CATEGORIAS;

/** El nombre de cada categoría en cada idioma. La clave de la URL no cambia. */
export const NOMBRE_CATEGORIA: Record<Lang, Record<Categoria, string>> = {
  es: CATEGORIAS,
  ca: { 'accesibilidad-digital': 'Accessibilitat digital', 'auditoria-wcag': 'Auditoria WCAG', diseno: 'Disseny' },
  en: { 'accesibilidad-digital': 'Digital accessibility', 'auditoria-wcag': 'WCAG audit', diseno: 'Design' },
};

/** El tramo de la URL de las categorías: /blog/categoria/…, /en/blog/category/… */
export const SEG_CATEGORIA: Record<Lang, string> = { es: 'categoria', ca: 'categoria', en: 'category' };

const LOCALE: Record<Lang, string> = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };

/** «7 de abril de 2026». En UTC: la fecha del archivo es un día, no un instante. */
export const fechaLarga = (d: Date, lang: Lang = 'es') =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);

/** Los textos fijos del blog. */
export const UI_BLOG: Record<Lang, {
  titulo: string; description: string; entrada: string; altHero: string;
  todos: string; categorias: string; volver: string; sigue: string;
  preguntas: string; por: string;
}> = {
  es: {
    titulo: 'Blog',
    description: 'Lo que aprendemos diseñando webs accesibles: normativa, tipografía, herramientas y decisiones de diseño, contado sin tecnicismos de más.',
    entrada: 'Lo que aprendemos diseñando webs accesibles, contado sin tecnicismos de más.',
    altHero: 'Una garza rosa mira una jaula de pájaro con dos personas diminutas dentro.',
    todos: 'Todos', categorias: 'Categorías del blog', volver: 'Volver al Blog', sigue: 'Sigue leyendo',
    preguntas: 'Preguntas frecuentes', por: 'Por',
  },
  ca: {
    titulo: 'Blog',
    description: 'El que aprenem dissenyant webs accessibles: normativa, contractació pública i decisions de disseny i de codi, explicat sense tecnicismes de més.',
    entrada: 'El que aprenem dissenyant webs accessibles, explicat sense tecnicismes de més.',
    altHero: 'Un bernat rosa mira una gàbia d’ocell amb dues persones diminutes a dins.',
    todos: 'Tots', categorias: 'Categories del blog', volver: 'Torna al Blog', sigue: 'Continua llegint',
    preguntas: 'Preguntes freqüents', por: 'Per',
  },
  en: {
    titulo: 'Blog',
    description: 'What we learn designing accessible websites: legislation, public procurement, and design and code decisions, explained without unnecessary jargon.',
    entrada: 'What we learn designing accessible websites, explained without unnecessary jargon.',
    altHero: 'A pink heron looks at a birdcage with two tiny people inside.',
    todos: 'All', categorias: 'Blog categories', volver: 'Back to the Blog', sigue: 'Keep reading',
    preguntas: 'Frequently asked questions', por: 'By',
  },
};

export type Articulo = CollectionEntry<'blog'>;

/** El idioma sale de la carpeta: ca/… y en/…; lo demás es castellano. */
export const idiomaDeArticulo = (a: Articulo): Lang =>
  a.id.startsWith('ca/') ? 'ca' : a.id.startsWith('en/') ? 'en' : 'es';

/** El tramo final de la URL, sin la carpeta del idioma. */
export const slugDeArticulo = (a: Articulo) => a.id.replace(/^(ca|en)\//, '');

export const hrefArticulo = (a: Articulo) => path('blog', idiomaDeArticulo(a), slugDeArticulo(a));

export const hrefCategoria = (c: Categoria, lang: Lang) => path('blog', lang, `${SEG_CATEGORIA[lang]}/${c}`);

/** Los artículos de un idioma, del más reciente al más antiguo. */
export function articulosDe(todos: Articulo[], lang: Lang) {
  return todos.filter((a) => idiomaDeArticulo(a) === lang).sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

/**
 * Los tramos finales de las versiones de un artículo, para el selector de
 * idioma y los hreflang. Sin `clave`, solo el suyo: no hay otras versiones.
 * Con `clave`, las tres, o el build se para.
 */
export function versionesDe(a: Articulo, todos: Articulo[]): Slug {
  const lang = idiomaDeArticulo(a);
  if (!a.data.clave) {
    if (lang !== 'es') throw new Error(`Blog: ${a.id} está en ${lang} y no lleva \`clave\`. Sin ella no se sabe de qué artículo es traducción.`);
    return { es: slugDeArticulo(a) };
  }
  const hermanos = todos.filter((b) => b.data.clave === a.data.clave);
  const slugs: Partial<Record<Lang, string>> = {};
  for (const b of hermanos) {
    const l = idiomaDeArticulo(b);
    if (slugs[l]) throw new Error(`Blog: la clave «${a.data.clave}» tiene dos artículos en ${l}.`);
    slugs[l] = slugDeArticulo(b);
  }
  const faltan = (['es', 'ca', 'en'] as Lang[]).filter((l) => !slugs[l]);
  if (faltan.length) throw new Error(`Blog: «${a.data.clave}» no está en ${faltan.join(' ni ')}. Un artículo con clave va en los tres idiomas.`);
  return slugs;
}

/** «Sigue leyendo»: tres del mismo idioma, primero los que comparten categoría. */
export function relacionadosDe(a: Articulo, todos: Articulo[]) {
  const otros = articulosDe(todos, idiomaDeArticulo(a)).filter((b) => b.id !== a.id);
  const comparten = otros.filter((b) => b.data.categorias.some((c) => a.data.categorias.includes(c)));
  return [...comparten, ...otros.filter((b) => !comparten.includes(b))].slice(0, 3);
}
