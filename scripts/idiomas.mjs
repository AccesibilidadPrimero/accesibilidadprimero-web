/* La misma página en catalán y en inglés (05/11/2026). Las comprobaciones
   que recorren una lista de URL la pasan por aquí para medir los tres
   idiomas. Los segmentos son los de src/i18n/config.ts; el blog solo existe
   en castellano. */
const SEG = {
  ca: { proyectos: 'projectes', servicios: 'serveis', estudio: 'estudi', contacto: 'contacte', privacidad: 'privacitat', cookies: 'galetes', 'declaracion-de-accesibilidad': 'declaracio-accessibilitat' },
  en: { proyectos: 'projects', servicios: 'services', estudio: 'studio', contacto: 'contact', privacidad: 'privacy', cookies: 'cookies', 'declaracion-de-accesibilidad': 'accessibility-statement' },
};

export function enIdioma(url, lang) {
  if (lang === 'es') return url;
  if (url.startsWith('/blog')) return null;
  const [, primero = '', ...resto] = url.split('/');
  return `/${lang}/${[SEG[lang][primero] ?? primero, ...resto].filter((x, i) => x || i === resto.length).join('/')}`.replace(/\/+$/, '/').replace(/\/\/+/g, '/');
}

/** Lista de URL → la misma lista en los tres idiomas. */
export const tresIdiomas = (urls) => urls.flatMap((u) => ['es', 'ca', 'en'].map((l) => enIdioma(u, l)).filter(Boolean));

/** Lista de páginas `{ nombre, url, … }` → la misma en los tres idiomas. */
export const paginasTresIdiomas = (paginas) => paginas.flatMap((p) => ['es', 'ca', 'en']
  .map((l) => ({ l, url: enIdioma(p.url, l) })).filter((x) => x.url)
  .map(({ l, url }) => ({ ...p, url, nombre: l === 'es' ? p.nombre : `${p.nombre} · ${l}` })));
