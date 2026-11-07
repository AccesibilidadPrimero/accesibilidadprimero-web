/* ---------------------------------------------------------------------------
   Datos estructurados (schema.org, JSON-LD) · SEO, 07/11/2026.

   No se ven en la página: le dicen a los buscadores QUÉ es cada cosa (el
   estudio, sus productos). Los pinta `Base.astro` con su prop `datos`.

   Regla: aquí solo va lo que la web ya dice en pantalla (nombre, ciudad,
   correo, redes, quién lo fundó, qué hace cada producto). Un dato que solo
   existiera en el JSON-LD sería información escondida, y Google lo trata
   como tal. Ni dirección postal ni teléfono: la web no los publica.

   La guía tiene su propio FAQPage, en src/paginas/guia.astro.
   --------------------------------------------------------------------------- */
import type { Lang } from '../i18n/config';
import { path } from '../i18n/config';
import { localizar } from '../i18n/idioma';
import { SITIO } from './sitio';
import { CORREO_ESTUDIO } from './contacto';
import { PRODUCTOS } from './productos';

const ID_ESTUDIO = `${SITIO}/#estudio`;
const absoluta = (ruta: string) => new URL(ruta, SITIO).href;

/** Las redes que enlaza el pie (Contacto). */
const REDES = [
  'https://www.linkedin.com/company/aprimero',
  'https://www.instagram.com/accesibilidadprimero/',
  'https://mastodon.social/@accesibilidadprimero',
];

/** El estudio. Va en la portada de cada idioma. */
export function estudio(lang: Lang, descripcion: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ID_ESTUDIO,
    name: 'Accesibilidad Primero',
    url: absoluta(path('home', lang)),
    description: descripcion,
    logo: absoluta('/apple-touch-icon.png'),
    image: absoluta('/apple-touch-icon.png'),
    email: CORREO_ESTUDIO,
    address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressCountry: 'ES' },
    areaServed: { '@type': 'Country', name: 'España' },
    knowsLanguage: ['es', 'ca', 'en'],
    founder: { '@type': 'Person', name: 'Johnny Vale Vigas' },
    sameAs: REDES,
    knowsAbout: ['Accesibilidad web', 'WCAG 2.2', 'Diseño inclusivo', 'EN 301 549'],
  };
}

/** Un producto propio, en la página de su caso. */
export function aplicacion(caso: string, lang: Lang) {
  const base = PRODUCTOS.find((p) => p.caso === caso);
  if (!base) throw new Error(`Sin producto con caso «${caso}» en src/data/productos.ts`);
  const p = localizar(base, lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.nombre,
    description: p.descripcion,
    url: absoluta(path('proyectos', lang, caso)),
    applicationCategory: p.tipo === 'extensiones' ? 'BrowserApplication' : 'WebApplication',
    operatingSystem: p.tipo === 'extensiones' ? 'Chrome' : 'Web',
    inLanguage: lang,
    creator: { '@id': ID_ESTUDIO, '@type': 'ProfessionalService', name: 'Accesibilidad Primero' },
  };
}

/** Johnny, autor de los artículos firmados. Su página es Sobre AP, donde la
    web lo presenta (Johnny, 07/11/2026: «enlace a Sobre AP», sin página de
    autor propia). */
export function autor(lang: Lang) {
  return {
    '@type': 'Person',
    name: 'Johnny Vale Vigas',
    url: absoluta(path('estudio', lang)),
    worksFor: { '@id': ID_ESTUDIO },
  };
}

/** Un artículo del blog. `tipo` es Article o TechArticle. */
export function articulo(a: {
  tipo: 'Article' | 'TechArticle';
  titulo: string;
  descripcion: string;
  url: string;
  imagen: string;
  fecha: Date;
  lang: Lang;
  firmado: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': a.tipo,
    headline: a.titulo,
    description: a.descripcion,
    url: absoluta(a.url),
    mainEntityOfPage: absoluta(a.url),
    image: absoluta(a.imagen),
    datePublished: a.fecha.toISOString().slice(0, 10),
    inLanguage: a.lang,
    ...(a.firmado ? { author: autor(a.lang) } : {}),
    publisher: { '@id': ID_ESTUDIO, '@type': 'ProfessionalService', name: 'Accesibilidad Primero', logo: absoluta('/apple-touch-icon.png') },
  };
}

/** Las preguntas frecuentes que se ven al final de un artículo. */
export function preguntasFrecuentes(lang: Lang, preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: preguntas.map((q) => ({
      '@type': 'Question',
      name: q.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: q.respuesta },
    })),
  };
}
