/* ---------------------------------------------------------------------------
   Idiomas y rutas · accesibilidadprimero.com v2.0

   Un solo sitio donde vive el mapa del sitio. Los componentes no escriben
   URLs a mano: piden path(clave, idioma). Así, cuando una ruta cambie, cambia
   en un archivo y no en quince.

   LANGS son los tres idiomas que el diseño contempla. ACTIVE son los que
   tienen contenido de verdad. El selector de idioma solo se pinta cuando hay
   más de uno activo: tres códigos de los que dos llevan a un 404 son peores
   que no tener selector, y además incumplen 2.4.4 — el enlace promete algo
   que no cumple.

   Para activar el catalán: añadir 'ca' a ACTIVE y crear sus páginas. No hay
   que tocar ningún componente.
   --------------------------------------------------------------------------- */

export const LANGS = ['es', 'ca', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'es';

/** Idiomas con contenido publicado. */
export const ACTIVE: Lang[] = ['es', 'ca', 'en'];

export const hasMultipleLangs = (): boolean => ACTIVE.length > 1;

/** Código visible. CA es ISO 639-1; «CAT» es 639-2/3 y no vale para lang. */
export const LANG_CODE: Record<Lang, string> = { es: 'ES', ca: 'CA', en: 'EN' };

/** Nombre accesible. El código solo no cumple 2.4.4. */
export const LANG_NAME: Record<Lang, string> = {
  es: 'Español',
  ca: 'Català',
  en: 'English',
};

export type RouteKey =
  | 'home'
  | 'proyectos'
  | 'servicios'
  | 'guia'
  | 'estudio'
  | 'blog'
  | 'contacto'
  | 'privacidad'
  | 'cookies'
  | 'accesibilidad'
  /* La web en lectura fácil (Johnny, 07/11/2026): castellano y catalán. */
  | 'lecturaFacil';

/** Los destinos del menú principal, en orden. Productos salió el 14/10/2026:
    los productos propios viven dentro de Proyectos, con su filtro. Servicios
    entró el 30/10/2026, detrás de Proyectos: primero lo hecho, después lo que
    ofrecemos. Nuevo orden (Johnny, 03/11/2026): primero quiénes somos y qué
    hacemos, después lo hecho. Sin submenús (Johnny, 04/11/2026).
    Blog fuera del menú por ahora (04/11/2026): se replantea al terminar la
    web. Las páginas siguen publicadas; solo deja de anunciarse aquí. */
export const NAV: RouteKey[] = ['estudio', 'servicios', 'proyectos', 'contacto'];

/** Las tres del pie. */
export const NAV_LEGAL: RouteKey[] = ['privacidad', 'cookies', 'accesibilidad'];

/* Segmento de URL por idioma. El castellano manda y los otros dos se
   traducirán cuando entren; de momento heredan el segmento castellano para no
   inventar rutas que nadie ha revisado. */
const SEGMENT: Record<RouteKey, Record<Lang, string>> = {
  home:          { es: '',                          ca: '',                          en: '' },
  proyectos:     { es: 'proyectos',                 ca: 'projectes',                 en: 'projects' },
  servicios:     { es: 'servicios',                 ca: 'serveis',                   en: 'services' },
  /* La guía en vídeo (Johnny, 05/11/2026). */
  guia:          { es: 'que-hace-una-web-accesible', ca: 'que-fa-un-web-accessible',  en: 'what-makes-a-website-accessible' },
  estudio:       { es: 'estudio',                   ca: 'estudi',                    en: 'studio' },
  blog:          { es: 'blog',                      ca: 'blog',                      en: 'blog' },
  contacto:      { es: 'contacto',                  ca: 'contacte',                  en: 'contact' },
  privacidad:    { es: 'privacidad',                ca: 'privacitat',                en: 'privacy' },
  cookies:       { es: 'cookies',                   ca: 'galetes',                   en: 'cookies' },
  accesibilidad: { es: 'declaracion-de-accesibilidad', ca: 'declaracio-accessibilitat', en: 'accessibility-statement' },
  /* Sin versión inglesa: el segmento está por la forma del tipo, no se usa. */
  lecturaFacil:  { es: 'lectura-facil',             ca: 'lectura-facil',             en: 'easy-read' },
};

/** El tramo final de una dirección: el mismo en todos los idiomas (los
    casos) o uno por idioma (las páginas en lectura fácil). */
export type Slug = string | Partial<Record<Lang, string>>;
const slugEn = (slug: Slug | undefined, lang: Lang) => (typeof slug === 'object' ? slug[lang] : slug);

/** URL de una ruta. Siempre con barra final (astro.config: trailingSlash). */
export function path(key: RouteKey, lang: Lang = DEFAULT_LANG, slug?: Slug): string {
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  const segment = SEGMENT[key][lang];
  const parts = [prefix, segment, slugEn(slug, lang)].filter(Boolean);
  const joined = parts.join('/');
  return joined === '' ? '/' : `/${joined.replace(/^\/+/, '')}/`;
}

export interface Alternate {
  lang: Lang;
  href: string;
  hreflang: Lang;
  code: string;
  name: string;
}

/**
 * Los idiomas en los que existe esta misma página. Devuelve lista vacía si
 * solo hay un idioma activo, para que quien la pinte no tenga que saberlo.
 */
/** Rutas que solo existen en castellano (05/11/2026): el blog no se traduce. */
const SOLO_ES: RouteKey[] = ['blog'];
/** Rutas sin versión inglesa (07/11/2026): la lectura fácil, en castellano y
    catalán. Su selector enseña solo ES y CA. */
const SIN_EN: RouteKey[] = ['lecturaFacil'];

export function alternates(current: RouteKey, slug?: Slug): Alternate[] {
  if (!hasMultipleLangs() || SOLO_ES.includes(current)) return [];
  return ACTIVE.filter((lang) => !(lang === 'en' && SIN_EN.includes(current))).map((lang) => ({
    lang,
    href: path(current, lang, slug),
    hreflang: lang,
    code: LANG_CODE[lang],
    name: LANG_NAME[lang],
  }));
}
