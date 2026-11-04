/* ---------------------------------------------------------------------------
   Los productos propios del estudio. Los usan la Home (su bloque de
   productos) y el listado de Proyectos (una tarjeta cada uno, 14/10/2026).
   Un solo sitio: si cambia un nombre o un enlace, cambia en los dos.

   Los medios (`imagen`, `tarjeta.captura`) son nombres de archivo de
   src/assets/productos/ sin extensión; cada página los busca con su glob.
   --------------------------------------------------------------------------- */
import type { Tipo } from './proyectos';

export interface Producto {
  nombre: string;
  marca: boolean;
  tipo: Tipo;
  descripcion: string;
  descripcionMovil?: string;
  cta: string;
  href: string;
  clase: string;
  imagen?: string;
  alt?: string;
  video?: { mp4: string; webm: string; descripcion: string };
  /** El slug de su caso de estudio en /proyectos/<caso>/, si ya lo tiene
      (A11y Primero, 04/11/2026). Entra en el recorrido «Ver …» del final de
      los casos, detrás de los de clientes. */
  caso?: string;
  /** La tarjeta del listado de Proyectos. */
  tarjeta: { captura: string; color: string; linea: string };
}

/* TEXTOS DE MÓVIL (Johnny, 09/10): ver `descripcionMovil` y las clases
   `solo-amplio` / `solo-movil` de base.css. */
/* En el orden de la Home (Figma `Productos`, 2181:331). */
export const PRODUCTOS: Producto[] = [
  {
    nombre: 'Itza',
    marca: true,
    tipo: 'aplicaciones',
    descripcion: 'Un asistente accesible para orientar a quienes visitan tu web.',
    cta: 'Ver Itza',
    /* Desde el 04/11/2026, a su caso de estudio. La landing sigue enlazada
       desde la ficha del caso. */
    href: '/proyectos/itza/',
    caso: 'itza',
    clase: 'producto--itza',
    video: {
      mp4: '/video/itza.mp4',
      webm: '/video/itza.webm',
      descripcion:
        'El asistente Itza en el móvil, dentro de la web de Off Escuela: Ana pregunta ' +
        'qué cursos hay para adultos y el asistente le responde con los de interpretación ' +
        'para mayores de 18 años y le pregunta qué día de la semana le viene mejor.',
    },
    /* El último fotograma del vídeo: la conversación entera. El fondo del
       clip es el menta TAL COMO lo decodifica el vídeo, de ahí el token. */
    tarjeta: {
      captura: 'itza-fotograma',
      color: 'var(--mint-video)',
      linea: 'Un asistente accesible para orientar a quienes visitan tu web.',
    },
  },
  {
    nombre: 'A11y Primero',
    marca: true,
    tipo: 'extensiones',
    descripcion:
      'Una extensión de Chrome para ver, entender y corregir barreras de accesibilidad.',
    cta: 'Ver A11y Primero',
    /* Enlace INTERNO (14/10). Antes apuntaba a www.accesibilidadprimero.com/
       a11yprimero/, que es esta misma web: con la v2 esa dirección redirige a
       /blog/a11yprimero/ (public/_redirects). Marcarlo como externo prometía
       otra web y otra pestaña para acabar en el blog de casa. */
    /* Desde el 04/11/2026, a su caso de estudio. */
    href: '/proyectos/a11y-primero/',
    caso: 'a11y-primero',
    clase: 'producto--a11y',
    imagen: 'a11y-primero',
    alt:
      'El panel de la extensión A11y Primero: la nota 72 marcada como “mejorable” sobre ' +
      'accesibilidadprimero.com, cuatro barras por apartado (imágenes 85, estructura 60, ' +
      'formularios 50 y contraste 45), el recuento de encabezados y un resumen para el ' +
      'cliente con los cuatro problemas principales en lenguaje claro.',
    tarjeta: {
      captura: 'a11y-primero',
      color: 'var(--yellow-ap)',
      linea: 'Una extensión de Chrome para ver, entender y corregir barreras de accesibilidad.',
    },
  },
  {
    nombre: 'Accessible Abstracts',
    marca: true,
    tipo: 'aplicaciones',
    descripcion: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    /* Por debajo de 768, el texto del Figma de Móvil. */
    descripcionMovil: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    /* El nombre entero y no «AA»: en una web de accesibilidad «AA» se lee
       como el nivel de conformidad de WCAG, y muchos lectores de pantalla lo
       pronuncian «a a» (Johnny, 09/10). */
    cta: 'Ver Accessible Abstracts',
    href: 'https://aa.accesibilidadprimero.com/',
    clase: 'producto--aa',
    imagen: 'accessible-abstracts',
    alt:
      'La plataforma Accessible Abstracts en un móvil: el titular “Abstract management ' +
      'that everyone can actually use”, los botones de demostración y un panel con ' +
      'cuatro abstracts enviados y su estado de revisión.',
    tarjeta: {
      captura: 'accessible-abstracts',
      color: 'var(--rose-ap)',
      linea: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    },
  },
];
