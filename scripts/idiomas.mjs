/* La misma página en catalán y en inglés (05/11/2026). Las comprobaciones
   que recorren una lista de URL la pasan por aquí para medir los tres
   idiomas. Los segmentos son los de src/i18n/config.ts; el blog solo existe
   en castellano. */
const SEG = {
  ca: { proyectos: 'projectes', servicios: 'serveis', estudio: 'estudi', contacto: 'contacte', privacidad: 'privacitat', cookies: 'galetes', 'declaracion-de-accesibilidad': 'declaracio-accessibilitat', 'que-hace-una-web-accesible': 'que-fa-un-web-accessible' },
  en: { proyectos: 'projects', servicios: 'services', estudio: 'studio', contacto: 'contact', privacidad: 'privacy', cookies: 'cookies', 'declaracion-de-accesibilidad': 'accessibility-statement', 'que-hace-una-web-accesible': 'what-makes-a-website-accessible' },
};

/* La lectura fácil (07/11/2026): castellano y catalán, cada página con su
   propio tramo final (src/data/lectura-facil.ts). */
const LF_CA = { 'quienes-somos': 'qui-som', 'que-hacemos': 'que-fem', contacto: 'contacte', accesibilidad: 'accessibilitat' };

export function enIdioma(url, lang) {
  if (lang === 'es') return url;
  if (url.startsWith('/blog')) return null;
  if (url.startsWith('/lectura-facil/')) {
    if (lang === 'en') return null;
    const sub = url.split('/')[2];
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
