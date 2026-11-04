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
    /* Vídeo otra vez (Johnny, 04/11/2026), grabado sobre nuestra web: Marta
       pulsa una pregunta sugerida y el asistente responde. 4,3 s, una vez,
       sin botón (2.2.2); lo vigila `npm run teclado`. */
    video: {
      mp4: '/video/itza.mp4',
      webm: '/video/itza.webm',
      descripcion:
        'El asistente Itza abierto: Marta pulsa la pregunta sugerida “¿Hacéis auditorías ' +
        'de accesibilidad?” y el asistente le responde que auditamos la web con WCAG 2.2 y ' +
        'la normativa vigente, explicamos cada barrera, damos un plan para quitarlas y ' +
        'preparamos la declaración de accesibilidad.',
    },
    /* En el listado de Proyectos, la imagen fija con transparencia. */
    tarjeta: {
      captura: 'itza',
      color: 'var(--mint)',
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
      'El panel de la extensión A11y Primero sobre una web de ejemplo: 92, pocos fallos ' +
      'automáticos, y las cuatro barras por apartado: imágenes 100 y formularios 94 en ' +
      'verde, estructura 86 y contraste 74 en naranja.',
    tarjeta: {
      captura: 'a11y-primero',
      color: 'var(--yellow-ap)',
      linea: 'Una extensión de Chrome para ver, entender y corregir barreras de accesibilidad.',
    },
  },
  {
    nombre: 'Accesible Abstracts',
    marca: true,
    tipo: 'aplicaciones',
    descripcion: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    /* Por debajo de 768, el texto del Figma de Móvil. */
    descripcionMovil: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    /* El nombre entero y no «AA»: en una web de accesibilidad «AA» se lee
       como el nivel de conformidad de WCAG, y muchos lectores de pantalla lo
       pronuncian «a a» (Johnny, 09/10). */
    cta: 'Ver Accesible Abstracts',
    /* Desde el 04/11/2026, a su caso de estudio; la landing, desde la ficha. */
    href: '/proyectos/accesible-abstracts/',
    caso: 'accesible-abstracts',
    clase: 'producto--aa',
    imagen: 'accesible-abstracts',
    alt:
      'El formulario de envío de Accesible Abstracts en el móvil, con la marca de ECI ' +
      'Conference Madrid 2027: “Call for Abstracts, Submit your abstract”, el plazo de ' +
      'envío y el primer campo, el título.',
    tarjeta: {
      captura: 'accesible-abstracts',
      color: 'var(--rose-ap)',
      linea: 'Una plataforma accesible para enviar, revisar y gestionar abstracts.',
    },
  },
];
