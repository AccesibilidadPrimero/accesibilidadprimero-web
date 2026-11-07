/* La misma página en catalán y en inglés (05/11/2026). Las comprobaciones
   que recorren una lista de URL la pasan por aquí para medir los tres
   idiomas. Los segmentos son los de src/i18n/config.ts. Del blog, solo lo
   que existe en los tres idiomas (07/11/2026): el listado, una categoría y
   los seis artículos con `clave`, cada uno con su tramo final. */
const SEG = {
  ca: { proyectos: 'projectes', servicios: 'serveis', estudio: 'estudi', contacto: 'contacte', privacidad: 'privacitat', cookies: 'galetes', 'declaracion-de-accesibilidad': 'declaracio-accessibilitat', 'que-hace-una-web-accesible': 'que-fa-un-web-accessible' },
  en: { proyectos: 'projects', servicios: 'services', estudio: 'studio', contacto: 'contact', privacidad: 'privacy', cookies: 'cookies', 'declaracion-de-accesibilidad': 'accessibility-statement', 'que-hace-una-web-accesible': 'what-makes-a-website-accessible' },
};

/* La lectura fácil (07/11/2026): en los tres idiomas, cada página con su
   propio tramo final (src/data/lectura-facil.ts). */
const LF_CA = { 'quienes-somos': 'qui-som', 'que-hacemos': 'que-fem', contacto: 'contacte', accesibilidad: 'accessibilitat' };
const LF_EN = { 'quienes-somos': 'about-us', 'que-hacemos': 'what-we-do', contacto: 'contact', accesibilidad: 'accessibility' };

/* Castellano → [catalán, inglés]. */
const BLOG = {
  '/blog/': ['/ca/blog/', '/en/blog/'],
  '/blog/categoria/accesibilidad-digital/': ['/ca/blog/categoria/accesibilidad-digital/', '/en/blog/category/accesibilidad-digital/'],
  '/blog/requisitos-accesibilidad-web-licitaciones-publicas-une-en-301549/': ['/ca/blog/requisits-accessibilitat-web-licitacions-publiques-une-en-301549/', '/en/blog/web-accessibility-public-tenders-en-301-549-spain/'],
  '/blog/plugins-widgets-accesibilidad-ley-11-2023/': ['/ca/blog/widgets-accessibilitat-llei-11-2023/', '/en/blog/accessibility-widgets-overlays-spanish-law-11-2023/'],
  '/blog/accesibilidad-web-licitaciones-generalitat-catalunya-valenciana/': ['/ca/blog/accessibilitat-web-licitacions-generalitat-catalunya-valenciana/', '/en/blog/web-accessibility-tenders-catalonia-valencia/'],
  '/blog/autopsia-web-no-accesible-5-errores-de-codigo/': ['/ca/blog/autopsia-web-no-accessible-5-errors-de-codi/', '/en/blog/inaccessible-website-autopsy-5-code-errors/'],
  '/blog/ley-11-2023-accesibilidad-plazos-obligados-multas/': ['/ca/blog/llei-11-2023-accessibilitat-terminis-obligats-multes/', '/en/blog/spain-law-11-2023-accessibility-deadlines-fines/'],
  '/blog/european-accessibility-act-licitaciones-europeas/': ['/ca/blog/european-accessibility-act-licitacions-europees/', '/en/blog/european-accessibility-act-eu-tenders-web-requirements/'],
};

export function enIdioma(url, lang) {
  if (lang === 'es') return url;
  if (url.startsWith('/blog')) return BLOG[url]?.[lang === 'ca' ? 0 : 1] ?? null;
  if (url.startsWith('/lectura-facil/')) {
    const sub = url.split('/')[2];
    if (lang === 'en') return `/en/easy-read/${sub ? `${LF_EN[sub]}/` : ''}`;
    return `/ca/lectura-facil/${sub ? `${LF_CA[sub]}/` : ''}`;
  }
  const [, primero = '', ...resto] = url.split('/');
  return `/${lang}/${[SEG[lang][primero] ?? primero, ...resto].filter((x, i) => x || i === resto.length).join('/')}`.replace(/\/+$/, '/').replace(/\/\/+/g, '/');
}

/** Lista de URL → la misma lista en los tres idiomas. */
export const tresIdiomas = (urls) => urls.flatMap((u) => ['es', 'ca', 'en'].map((l) => enIdioma(u, l)).filter(Boolean));

/** Lista de páginas `{ nombre, url, … }` → la misma en los tres idiomas. */
export const paginasTresIdiomas = (paginas) => paginas.flatMap((p) => ['es', 'ca', 'en']
  .map((l) => ({ l, url: enIdioma(p.url, l) })).filter((x) => x.url)
  .map(({ l, url }) => ({ ...p, url, nombre: l === 'es' ? p.nombre : `${p.nombre} · ${l}` })));
