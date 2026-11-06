/* ---------------------------------------------------------------------------
   Cadenas de interfaz · accesibilidadprimero.com v2.0

   Solo texto de carcasa: lo que no vive en el contenido. El contenido de las
   páginas va en Markdown, no aquí.

   Regla: ninguna cadena de aquí puede quedar sin traducir. Si falta una clave
   en un idioma, TypeScript falla al compilar, que es exactamente lo que se
   quiere.
   --------------------------------------------------------------------------- */

import type { Lang, RouteKey } from './config';

type Dict = {
  skipLink: string;
  menuOpen: string;
  menuClose: string;
  menuLabel: string;
  navLabel: string;
  langGroupLabel: string;
  langSwitchLabel: string;
  currentPage: string;
  footerTagline: string;
  footerCopyright: string;
  footerNavLabel: string;
  ctaHeading: string;
  ctaAction: string;
  /** El botón del bloque de cierre (ContactCTA). El del hero sigue siendo `ctaAction`. */
  ctaCierre: string;
  nav: Record<RouteKey, string>;
  /** Lo que el lector de pantalla oye detrás de un nombre de menú demasiado
      corto: «AP» se queda en «AP, el estudio». Empieza por el texto visible
      para que el control por voz siga funcionando (2.5.3). */
  navComplemento: Partial<Record<RouteKey, string>>;
  readMore: string;
  readLess: string;
  carouselPause: string;
  carouselPlay: string;
  carouselRegion: string;
  /* «Sobre la mesa» · el bloque vivo. El rótulo se traduce de forma
     IDIOMÁTICA, no literal: en inglés «On the table» significa «pendiente de
     decidir», que no es lo que quiere decir. (Johnny, 10/10.) */
  mesaTitulo: string;
  mesaCta: string;
  mesaRegion: string;
  publishedOn: string;
  updatedOn: string;
  backToBlog: string;
  backToProjects: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundAction: string;
  langMissingNotice: string;
  /* Compartidas por los componentes (05/11/2026). */
  /** El nombre accesible del logotipo. */
  logoLabel: string;
  /** Detrás de un enlace que sale a otra pestaña (con el espacio delante). */
  nuevaVentana: string;
  /** «Leer más» + « sobre …»: el contexto del botón para el lector de pantalla. */
  sobre: string;
  testimonio: string;
  /** La nota bajo un testimonio traducido (vacía en castellano). */
  testimonioTraducido: string;
  siguienteProyecto: string;
  /** «Ver Itza»: el siguiente caso del recorrido. */
  ver: string;
  verTodosCasos: string;
  /** «Declaración de accesibilidad» (y «de {cliente}» con `de()`). */
  declaracion: string;
  mesaMas: string;
  /** El título de la página de Casos de estudio y su prefijo en los filtros. */
  casosTitulo: string;
  filtrosLabel: string;
  todos: string;
  casosDescripcion: string;
  /** El locale de Intl para las fechas. */
  locale: string;
};

export const UI: Record<Lang, Dict> = {
  es: {
    skipLink: 'Saltar al contenido principal',
    menuOpen: 'Menú',
    menuClose: 'Cerrar',
    menuLabel: 'Menú principal',
    navLabel: 'Principal',
    langGroupLabel: 'Idioma',
    langSwitchLabel: 'Cambiar de idioma',
    currentPage: 'Página actual',
    footerTagline: 'Accesibilidad Primero. Siempre.',
    footerCopyright: '© 2026 Accesibilidad Primero',
    footerNavLabel: 'Legal',
    /* Cierre de todas las páginas (Johnny, 04/11/2026). */
    ctaHeading: 'Si tu proyecto es inclusivo,\ntu web también.',
    ctaAction: 'Cuéntanos tu proyecto',
    ctaCierre: 'Escríbenos',
    nav: {
      home: 'Inicio',
      /* Nombres del menú (Johnny, 04/11/2026): «AP · Qué hacemos · Casos de
         estudio · Contacto». Las URL no cambian. «Sobre AP» en vez de «AP»
         desde el 06/11/2026 (Johnny). */
      proyectos: 'Casos de estudio',
      servicios: 'Qué hacemos',
      guia: 'Qué hace que una web sea accesible',
      estudio: 'Sobre AP',
      blog: 'Blog',
      contacto: 'Contacto',
      privacidad: 'Privacidad',
      cookies: 'Cookies',
      accesibilidad: 'Accesibilidad',
    },
    navComplemento: { estudio: ', el estudio' },
    readMore: 'Leer más',
    readLess: 'Leer menos',
    carouselPause: 'Pausar',
    carouselPlay: 'Reproducir',
    carouselRegion: 'Ilustraciones del estudio',
    mesaTitulo: 'Sobre la mesa',
    mesaCta: 'Ir a Mastodon',
    mesaRegion: 'Sobre la mesa: en qué estamos ahora',
    publishedOn: 'Publicado el',
    updatedOn: 'Actualizado el',
    backToBlog: 'Volver al blog',
    backToProjects: 'Volver a proyectos',
    notFoundTitle: 'Esta página no existe',
    notFoundBody:
      'Puede que la hayamos movido o que el enlace esté mal escrito. Desde aquí se llega a todo lo demás.',
    notFoundAction: 'Ir a la portada',
    langMissingNotice: 'Este artículo solo está publicado en',
    logoLabel: 'Accesibilidad Primero, ir a la portada',
    nuevaVentana: ' (se abre en una ventana nueva)',
    sobre: ' sobre ',
    testimonio: 'Testimonio',
    testimonioTraducido: '',
    siguienteProyecto: 'Siguiente proyecto',
    ver: 'Ver',
    verTodosCasos: 'Ver todos los casos de estudio',
    declaracion: 'Declaración de accesibilidad',
    mesaMas: 'Ver más en Mastodon',
    casosTitulo: 'Casos de estudio',
    filtrosLabel: 'Tipos de proyecto',
    todos: 'Todos',
    casosDescripcion: 'Webs, aplicaciones y extensiones accesibles para organizaciones y proyectos con impacto social.',
    locale: 'es-ES',
  },

  ca: {
    skipLink: 'Vés al contingut principal',
    menuOpen: 'Menú',
    menuClose: 'Tanca',
    menuLabel: 'Menú principal',
    navLabel: 'Principal',
    langGroupLabel: 'Idioma',
    langSwitchLabel: 'Canvia d’idioma',
    currentPage: 'Pàgina actual',
    footerTagline: 'Accesibilidad Primero. Sempre.',
    footerCopyright: '© 2026 Accesibilidad Primero',
    footerNavLabel: 'Legal',
    ctaHeading: 'Si el teu projecte és inclusiu,\nla teva web també.',
    ctaAction: 'Explica’ns el teu projecte',
    ctaCierre: 'Escriu-nos',
    nav: {
      home: 'Inici',
      proyectos: 'Casos d’estudi',
      servicios: 'Què fem',
      guia: 'Què fa que un web sigui accessible',
      estudio: 'Sobre AP',
      blog: 'Blog',
      contacto: 'Contacte',
      privacidad: 'Privacitat',
      cookies: 'Galetes',
      accesibilidad: 'Accessibilitat',
    },
    navComplemento: { estudio: ', l’estudi' },
    readMore: 'Llegir-ne més',
    readLess: 'Llegir-ne menys',
    carouselPause: 'Pausar',
    carouselPlay: 'Reproduir',
    carouselRegion: 'Il·lustracions de l’estudi',
    mesaTitulo: 'Sobre la taula',
    mesaCta: 'Anar a Mastodon',
    mesaRegion: 'Sobre la taula: en què estem ara',
    publishedOn: 'Publicat el',
    updatedOn: 'Actualitzat el',
    backToBlog: 'Torna al blog',
    backToProjects: 'Torna als casos d’estudi',
    notFoundTitle: 'Aquesta pàgina no existeix',
    notFoundBody:
      'Potser l’hem moguda o l’enllaç està mal escrit. Des d’aquí s’arriba a tota la resta.',
    notFoundAction: 'Vés a la portada',
    langMissingNotice: 'Aquest article només està publicat en',
    logoLabel: 'Accesibilidad Primero, vés a la portada',
    nuevaVentana: ' (s’obre en una finestra nova)',
    sobre: ' sobre ',
    testimonio: 'Testimoni',
    testimonioTraducido: 'Traducció del castellà.',
    siguienteProyecto: 'Projecte següent',
    ver: 'Veure',
    verTodosCasos: 'Veure tots els casos d’estudi',
    declaracion: 'Declaració d’accessibilitat',
    mesaMas: 'Veure’n més a Mastodon',
    casosTitulo: 'Casos d’estudi',
    filtrosLabel: 'Tipus de projecte',
    todos: 'Tots',
    casosDescripcion: 'Webs, aplicacions i extensions accessibles per a organitzacions i projectes amb impacte social.',
    locale: 'ca',
  },

  en: {
    skipLink: 'Skip to main content',
    menuOpen: 'Menu',
    menuClose: 'Close',
    menuLabel: 'Main menu',
    navLabel: 'Main',
    langGroupLabel: 'Language',
    langSwitchLabel: 'Change language',
    currentPage: 'Current page',
    footerTagline: 'Accesibilidad Primero. Always.',
    footerCopyright: '© 2026 Accesibilidad Primero',
    footerNavLabel: 'Legal',
    ctaHeading: 'If your project is inclusive,\nyour website should be too.',
    ctaAction: 'Tell us about your project',
    ctaCierre: 'Get in touch',
    nav: {
      home: 'Home',
      proyectos: 'Case studies',
      servicios: 'What we do',
      guia: 'What makes a website accessible',
      estudio: 'About AP',
      blog: 'Blog',
      contacto: 'Contact',
      privacidad: 'Privacy',
      cookies: 'Cookies',
      accesibilidad: 'Accessibility',
    },
    navComplemento: { estudio: ', the studio' },
    readMore: 'Read more',
    readLess: 'Read less',
    carouselPause: 'Pause',
    carouselPlay: 'Play',
    carouselRegion: 'Studio illustrations',
    mesaTitulo: 'Work in progress',
    mesaCta: 'Go to Mastodon',
    mesaRegion: 'Work in progress: what we’re working on now',
    publishedOn: 'Published on',
    updatedOn: 'Updated on',
    backToBlog: 'Back to the blog',
    backToProjects: 'Back to case studies',
    notFoundTitle: 'This page doesn’t exist',
    notFoundBody:
      'We may have moved it, or the link may be mistyped. You can reach everything else from here.',
    notFoundAction: 'Go to the home page',
    langMissingNotice: 'This article is only published in',
    logoLabel: 'Accesibilidad Primero, go to the home page',
    nuevaVentana: ' (opens in a new window)',
    sobre: ' about ',
    testimonio: 'Testimonial',
    testimonioTraducido: 'Translated from Spanish.',
    siguienteProyecto: 'Next project',
    ver: 'See',
    verTodosCasos: 'See all case studies',
    declaracion: 'Accessibility statement',
    mesaMas: 'More on Mastodon',
    casosTitulo: 'Case studies',
    filtrosLabel: 'Project types',
    todos: 'All',
    casosDescripcion: 'Accessible websites, apps and extensions for organisations and projects with social impact.',
    locale: 'en-GB',
  },
};

export function t(lang: Lang): Dict {
  return UI[lang];
}
