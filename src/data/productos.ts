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
  /** Catalán e inglés (05/11/2026): solo los textos y el enlace. Los mezcla
      `localizar(producto, lang)` de src/i18n/idioma.ts. */
  traducciones?: Partial<Record<'ca' | 'en', {
    descripcion?: string; descripcionMovil?: string; cta?: string; href?: string; alt?: string;
    video?: { descripcion: string }; tarjeta?: { linea: string };
  }>>;
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
    traducciones: {
      ca: {
        descripcion: 'Un assistent accessible per orientar qui visita el teu web.',
        cta: 'Veure Itza',
        href: '/ca/projectes/itza/',
        video: {
          descripcion:
            'L’assistent Itza obert: la Marta prem la pregunta suggerida “¿Hacéis auditorías ' +
            'de accesibilidad?” i l’assistent li respon que auditem el web amb les WCAG 2.2 i ' +
            'la normativa vigent, expliquem cada barrera, donem un pla per eliminar-les i ' +
            'preparem la declaració d’accessibilitat. La conversa és en castellà.',
        },
        tarjeta: { linea: 'Un assistent accessible per orientar qui visita el teu web.' },
      },
      en: {
        descripcion: 'An accessible assistant that guides the people who visit your website.',
        cta: 'See Itza',
        href: '/en/projects/itza/',
        video: {
          descripcion:
            'The Itza assistant open: Marta taps the suggested question “¿Hacéis auditorías ' +
            'de accesibilidad?” (Do you do accessibility audits?) and the assistant replies that ' +
            'we audit the website against WCAG 2.2 and current regulations, explain each barrier, ' +
            'give a plan to remove them and prepare the accessibility statement. The conversation is in Spanish.',
        },
        tarjeta: { linea: 'An accessible assistant that guides the people who visit your website.' },
      },
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
    traducciones: {
      ca: {
        descripcion: 'Una extensió de Chrome per veure, entendre i corregir barreres d’accessibilitat.',
        cta: 'Veure A11y Primero',
        href: '/ca/projectes/a11y-primero/',
        alt:
          'El panell de l’extensió A11y Primero sobre un web d’exemple: 92, pocs errors ' +
          'automàtics, i les quatre barres per apartat: imatges 100 i formularis 94 en ' +
          'verd, estructura 86 i contrast 74 en taronja.',
        tarjeta: { linea: 'Una extensió de Chrome per veure, entendre i corregir barreres d’accessibilitat.' },
      },
      en: {
        descripcion: 'A Chrome extension to see, understand and fix accessibility barriers.',
        cta: 'See A11y Primero',
        href: '/en/projects/a11y-primero/',
        alt:
          'The A11y Primero extension panel over a sample website: 92, few automated ' +
          'failures, and the four bars by section: images 100 and forms 94 in green, ' +
          'structure 86 and contrast 74 in orange.',
        tarjeta: { linea: 'A Chrome extension to see, understand and fix accessibility barriers.' },
      },
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
    traducciones: {
      ca: {
        descripcion: 'Una plataforma accessible per enviar, revisar i gestionar abstracts.',
        descripcionMovil: 'Una plataforma accessible per enviar, revisar i gestionar abstracts.',
        cta: 'Veure Accesible Abstracts',
        href: '/ca/projectes/accesible-abstracts/',
        alt:
          'El formulari d’enviament d’Accesible Abstracts al mòbil, amb la marca d’ECI ' +
          'Conference Madrid 2027: “Call for Abstracts, Submit your abstract”, el termini ' +
          'd’enviament i el primer camp, el títol.',
        tarjeta: { linea: 'Una plataforma accessible per enviar, revisar i gestionar abstracts.' },
      },
      en: {
        descripcion: 'An accessible platform to submit, review and manage abstracts.',
        descripcionMovil: 'An accessible platform to submit, review and manage abstracts.',
        cta: 'See Accesible Abstracts',
        href: '/en/projects/accesible-abstracts/',
        alt:
          'The Accesible Abstracts submission form on a mobile phone, with the ECI ' +
          'Conference Madrid 2027 branding: “Call for Abstracts, Submit your abstract”, the ' +
          'submission deadline and the first field, the title.',
        tarjeta: { linea: 'An accessible platform to submit, review and manage abstracts.' },
      },
    },
  },
];
