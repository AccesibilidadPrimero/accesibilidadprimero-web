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
  nav: Record<RouteKey, string>;
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
    ctaHeading: 'Tu proyecto trabaja por la inclusión.\nTu web también.',
    ctaAction: 'Cuéntanos tu proyecto',
    nav: {
      home: 'Inicio',
      proyectos: 'Proyectos',
      productos: 'Productos',
      estudio: 'Estudio',
      blog: 'Blog',
      contacto: 'Contacto',
      privacidad: 'Privacidad',
      cookies: 'Cookies',
      accesibilidad: 'Accesibilidad',
    },
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
    footerTagline: 'Accessibilitat Primer. Sempre.',
    footerCopyright: '© 2026 Accesibilidad Primero',
    footerNavLabel: 'Legal',
    ctaHeading: 'El teu projecte treballa per la inclusió.\nEl teu web també.',
    ctaAction: 'Explica’ns el teu projecte',
    nav: {
      home: 'Inici',
      proyectos: 'Projectes',
      productos: 'Productes',
      estudio: 'Estudi',
      blog: 'Blog',
      contacto: 'Contacte',
      privacidad: 'Privacitat',
      cookies: 'Galetes',
      accesibilidad: 'Accessibilitat',
    },
    readMore: 'Llegeix-ne més',
    readLess: 'Llegeix-ne menys',
    carouselPause: 'Pausa',
    carouselPlay: 'Reprodueix',
    carouselRegion: 'Il·lustracions de l’estudi',
    mesaTitulo: 'Sobre la taula',
    mesaCta: 'Anar a Mastodon',
    mesaRegion: 'Sobre la taula: en què estem ara',
    publishedOn: 'Publicat el',
    updatedOn: 'Actualitzat el',
    backToBlog: 'Torna al blog',
    backToProjects: 'Torna a projectes',
    notFoundTitle: 'Aquesta pàgina no existeix',
    notFoundBody:
      'Potser l’hem moguda o l’enllaç està mal escrit. Des d’aquí s’arriba a tota la resta.',
    notFoundAction: 'Vés a la portada',
    langMissingNotice: 'Aquest article només està publicat en',
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
    footerTagline: 'Accessibility First. Always.',
    footerCopyright: '© 2026 Accesibilidad Primero',
    footerNavLabel: 'Legal',
    ctaHeading: 'Your project works for inclusion.\nYour website should too.',
    ctaAction: 'Tell us about your project',
    nav: {
      home: 'Home',
      proyectos: 'Projects',
      productos: 'Products',
      estudio: 'Studio',
      blog: 'Blog',
      contacto: 'Contact',
      privacidad: 'Privacy',
      cookies: 'Cookies',
      accesibilidad: 'Accessibility',
    },
    readMore: 'Read more',
    readLess: 'Read less',
    carouselPause: 'Pause',
    carouselPlay: 'Play',
    carouselRegion: 'Studio illustrations',
    mesaTitulo: 'Work in progress',
    mesaCta: 'Go to Mastodon',
    mesaRegion: 'Work in progress: what we are on right now',
    publishedOn: 'Published on',
    updatedOn: 'Updated on',
    backToBlog: 'Back to the blog',
    backToProjects: 'Back to projects',
    notFoundTitle: 'This page does not exist',
    notFoundBody:
      'We may have moved it, or the link may be misspelled. Everything else is reachable from here.',
    notFoundAction: 'Go to the home page',
    langMissingNotice: 'This article is only published in',
  },
};

export function t(lang: Lang): Dict {
  return UI[lang];
}
