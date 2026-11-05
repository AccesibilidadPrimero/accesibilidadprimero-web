/* ---------------------------------------------------------------------------
   Servicios · el contenido de /servicios/ (Johnny, 30/10/2026).

   Tres servicios, en este orden: Diseño y desarrollo, Auditoría y Formación.
   La auditoría y la formación salen de accesibilidadprimero.com
   (/auditoria-de-accesibilidad-wcag/ y /formacion/), reescritas con la voz de
   la web nueva: frases cortas, una idea por frase, sin jerga.
   Diseño y desarrollo es texto nuevo, propuesto por Claude. Revisión de voz
   del 03/11/2026 (Johnny): sin garantías sobre el resultado, sí sobre el
   método; ver «Web 2.0 AP · Propuesta de mejora de redacción y tono».
   --------------------------------------------------------------------------- */

import type { Tipo as Microanimacion } from '../components/Microanimacion.astro';

export interface Punto {
  nombre: string;
  texto: string;
  /** La microanimación que lo acompaña (Johnny, 03/11/2026). */
  mic?: Microanimacion;
}

export interface Tarifa {
  /** El título del desplegable: lo que se audita (Johnny, 03/11/2026). */
  titulo: string;
  nombre: string;
  para?: string;
  precio: string;
  incluye: string[];
}

export const DISENO = {
  /* Català i anglès (05/11/2026): mateixa forma, només els textos. */
  traducciones: {
    ca: {
      intro:
        'Dissenyem i desenvolupem webs des del concepte fins al codi. L’accessibilitat és a cada decisió des de la primera línia de codi, no s’hi afegeix al final. També fem accessibles documents i presentacions, PDF inclosos.',
      puntos: [
        { nombre: 'Disseny a mida.', texto: 'Cada web parteix de qui hi ha al darrere: la seva identitat, el seu públic i el que vol explicar. Sense plantilles.' },
        { nombre: 'Un stack propi i accessible.', texto: 'Desenvolupem sobre una base tècnica pròpia, pensada per complir WCAG 2.2 AA. Cada component està provat amb teclat i lector de pantalla, i cada canvi passa comprovacions automàtiques de contrast, reflow i navegació abans de publicar-se.' },
        { nombre: 'Un gestor de continguts propi.', texto: 'El teu equip actualitza textos, imatges i articles sense tocar codi.' },
        { nombre: 'Ràpides i sense plugins per mantenir.', texto: 'Webs lleugeres, servides des de la xarxa de Cloudflare i sense plugins per actualitzar cada setmana. Menys manteniment per al teu equip.' },
        { nombre: 'Declaració i formació en el lliurament.', texto: 'Cada web surt amb la seva declaració d’accessibilitat i formem el teu equip perquè en mantingui l’accessibilitat.' },
        { nombre: 'Provem cada web abans de publicar-la.', texto: 'La revisem amb teclat i lector de pantalla i documentem el que compleix. Si després algú hi troba una barrera, la corregim.' },
      ],
    },
    en: {
      intro:
        'We design and build websites from concept to code. Accessibility is part of every decision from the first line of code, not added at the end. We also make documents and presentations accessible, PDFs included.',
      puntos: [
        { nombre: 'Bespoke design.', texto: 'Every website starts from the people behind it: their identity, their audience and what they want to say. No templates.' },
        { nombre: 'Our own accessible stack.', texto: 'We build on our own technical foundation, designed to meet WCAG 2.2 AA. Every component is tested with a keyboard and a screen reader, and every change goes through automated checks for contrast, reflow and navigation before it goes live.' },
        { nombre: 'Our own content management system.', texto: 'Your team updates text, images and articles without touching any code.' },
        { nombre: 'Fast, with no plugins to maintain.', texto: 'Lightweight websites, served from Cloudflare’s network, with no plugins to update every week. Less maintenance for your team.' },
        { nombre: 'An accessibility statement and training at handover.', texto: 'Every website launches with its accessibility statement, and we train your team to keep it accessible.' },
        { nombre: 'We test every website before it goes live.', texto: 'We check it with a keyboard and a screen reader and document what it meets. If someone later finds a barrier, we fix it.' },
      ],
    },
  },
  intro:
    'Diseñamos y desarrollamos webs del concepto al código. La accesibilidad está en cada decisión desde la primera línea de código, no se añade al final. También hacemos accesibles documentos y presentaciones, incluidos los PDF.',
  puntos: [
    {
      nombre: 'Diseño a medida.',
      mic: 'medida',
      texto: 'Cada web parte de quien está detrás: su identidad, su público y lo que quiere contar. Sin plantillas.',
    },
    {
      nombre: 'Un stack propio y accesible.',
      mic: 'stack',
      texto:
        'Desarrollamos sobre una base técnica propia, pensada para cumplir WCAG 2.2 AA. Cada componente está probado con teclado y lector de pantalla, y cada cambio pasa comprobaciones automáticas de contraste, reflow y navegación antes de publicarse.',
    },
    {
      nombre: 'Un gestor de contenidos propio.',
      mic: 'gestor',
      texto:
        'Tu equipo actualiza textos, imágenes y artículos sin tocar código.',
    },
    {
      nombre: 'Rápidas y sin plugins que mantener.',
      mic: 'ligera',
      texto:
        'Webs ligeras, servidas desde la red de Cloudflare y sin plugins que actualizar cada semana. Menos mantenimiento para tu equipo.',
    },
    {
      nombre: 'Declaración y formación al entregar.',
      mic: 'declaracion',
      texto:
        'Cada web sale con su declaración de accesibilidad y formamos a tu equipo para mantener la accesibilidad.',
    },
    {
      nombre: 'Probamos cada web antes de publicarla.',
      mic: 'prueba',
      texto:
        'La revisamos con teclado y lector de pantalla y documentamos lo que cumple. Si después alguien encuentra una barrera, la corregimos.',
    },
  ] satisfies Punto[],
};

export const AUDITORIA = {
  traducciones: {
    ca: {
      comun:
        'Les tres són la mateixa auditoria: revisió automàtica i manual, lectors de pantalla, anàlisi del llenguatge, recorreguts crítics, arquitectura de la informació i pla d’acció. El que canvia és el nombre de pàgines.',
      intro:
        'No és complir. És poder fer-la servir. Auditem la teva web amb WCAG 2.2 i la normativa vigent, t’expliquem cada barrera i et donem un pla per eliminar-les. En acabar, preparem la declaració d’accessibilitat de la teva web.',
      revisamos: [
        { nombre: 'Disseny i informació.', texto: 'Jerarquia visual, navegació amb teclat, color, contrast i tipografia.' },
        { nombre: 'Interacció i codi.', texto: 'Formularis, elements interactius, marcatge semàntic i lectors de pantalla.' },
        { nombre: 'Llenguatge.', texto: 'Claredat del text, barreres cognitives i comunicació inclusiva. Per a nosaltres, la paraula també és accessibilitat.' },
      ],
      entregamos:
        'Un resum per a la direcció, les incidències ordenades per prioritat, un pla d’acció i la declaració d’accessibilitat de la teva web.',
      tarifas: [
        { titulo: 'Webs de fins a 10 pàgines per auditar', precio: 'De 590 a 790 € + IVA', incluye: ['Reunió de 60 minuts', 'De 5 a 7 dies feiners'] },
        { titulo: 'Webs de fins a 25 pàgines per auditar', nombre: 'Completa', precio: 'De 1.200 a 1.800 € + IVA', incluye: ['Reunió de 90 minuts', 'Dues setmanes de suport per correu', 'De 10 a 15 dies feiners'] },
        { titulo: 'Webs institucionals', nombre: 'Institucional', para: 'Sector públic i grans empreses', precio: 'Des de 2.500 € + IVA', incluye: ['Mostra i recorreguts segons l’abast', 'WCAG 2.2 i EN 301 549', 'Diverses tecnologies de suport', 'Reunió de 120 minuts', 'Un mes de suport per correu', 'Termini a mida'] },
      ],
    },
    en: {
      comun:
        'All three are the same audit: automated and manual testing, screen readers, language review, critical user journeys, information architecture and an action plan. What changes is the number of pages.',
      intro:
        'It’s not about compliance. It’s about use. We audit your website against WCAG 2.2 and current legislation, explain every barrier and give you a plan to remove them. When we finish, we prepare your website’s accessibility statement.',
      revisamos: [
        { nombre: 'Design and information.', texto: 'Visual hierarchy, keyboard navigation, colour, contrast and typography.' },
        { nombre: 'Interaction and code.', texto: 'Forms, interactive elements, semantic markup and screen readers.' },
        { nombre: 'Language.', texto: 'Clarity of the text, cognitive barriers and inclusive communication. For us, words are accessibility too.' },
      ],
      entregamos:
        'A summary for management, issues ranked by priority, an action plan and your website’s accessibility statement.',
      tarifas: [
        { titulo: 'Websites with up to 10 pages to audit', precio: '€590 to €790 + VAT', incluye: ['A 60-minute meeting', '5 to 7 working days'] },
        { titulo: 'Websites with up to 25 pages to audit', nombre: 'Full', precio: '€1,200 to €1,800 + VAT', incluye: ['A 90-minute meeting', 'Two weeks of email support', '10 to 15 working days'] },
        { titulo: 'Institutional websites', nombre: 'Institutional', para: 'Public sector and large companies', precio: 'From €2,500 + VAT', incluye: ['Sample pages and journeys based on scope', 'WCAG 2.2 and EN 301 549', 'Several assistive technologies', 'A 120-minute meeting', 'One month of email support', 'Timescale to suit'] },
      ],
    },
  },
  /* Los tres alcances son la misma auditoría; cambia el número de páginas
     (Johnny, 04/11/2026). Lo común, una vez y fuera de las tarifas. */
  comun:
    'Las tres son la misma auditoría: revisión automática y manual, lectores de pantalla, análisis del lenguaje, recorridos críticos, arquitectura de la información y plan de acción. Lo que cambia es el número de páginas.',
  intro:
    'No es cumplir. Es poder usar. Auditamos tu web con WCAG 2.2 y la normativa vigente, te explicamos cada barrera y te damos un plan para quitarlas. Al terminar, preparamos la declaración de accesibilidad de tu web.',
  revisamos: [
    {
      nombre: 'Diseño e información.',
      mic: 'jerarquia',
      texto: 'Jerarquía visual, navegación con teclado, color, contraste y tipografía.',
    },
    {
      nombre: 'Interacción y código.',
      mic: 'interaccion',
      texto: 'Formularios, elementos interactivos, marcado semántico y lectores de pantalla.',
    },
    {
      nombre: 'Lenguaje.',
      mic: 'lenguaje',
      texto: 'Claridad del texto, barreras cognitivas y comunicación inclusiva. Para nosotros, la palabra también es accesibilidad.',
    },
  ] satisfies Punto[],
  entregamos:
    'Un resumen para dirección, las incidencias ordenadas por prioridad, un plan de acción y la declaración de accesibilidad de tu web.',
  tarifas: [
    {
      titulo: 'Webs hasta 10 páginas a auditar',
      nombre: 'Express',
      precio: '590 a 790 € + IVA',
      incluye: [
        'Reunión de 60 minutos',
        'De 5 a 7 días hábiles',
      ],
    },
    {
      titulo: 'Webs hasta 25 páginas a auditar',
      nombre: 'Completa',
      precio: '1.200 a 1.800 € + IVA',
      incluye: [
        'Reunión de 90 minutos',
        'Dos semanas de soporte por correo',
        'De 10 a 15 días hábiles',
      ],
    },
    {
      titulo: 'Webs institucionales',
      nombre: 'Institucional',
      para: 'Sector público y grandes empresas',
      precio: 'Desde 2.500 € + IVA',
      incluye: [
        'Muestra y recorridos según el alcance',
        'WCAG 2.2 y EN 301 549',
        'Varias tecnologías de apoyo',
        'Reunión de 120 minutos',
        'Un mes de soporte por correo',
        'Plazo a medida',
      ],
    },
  ] satisfies Tarifa[],
};

export const FORMACION = {
  traducciones: {
    ca: {
      intro:
        'L’accessibilitat no s’acaba amb el lliurament. Formem els equips que gestionen i actualitzen la web perquè puguin mantenir-ne l’accessibilitat en el dia a dia.',
      puntos: [
        { nombre: 'En lliurar el projecte.', texto: 'Després de cada desenvolupament o adaptació, l’equip responsable aprèn a actualitzar continguts i components sense perdre l’accessibilitat.' },
        { nombre: 'Sessions per perfil.', texto: 'Per a disseny, desenvolupament, comunicació o edició de continguts, amb el producte real al davant.' },
        { nombre: 'Píndoles monogràfiques.', texto: 'Formacions pràctiques sobre un tema: PDF accessibles, HTML semàntic, bones pràctiques WCAG i ús correcte del gestor de continguts.' },
      ],
    },
    en: {
      intro:
        'Accessibility doesn’t end at handover. We train the teams who manage and update the website so they can keep it accessible day to day.',
      puntos: [
        { nombre: 'At project handover.', texto: 'After every build or adaptation, the team in charge learns to update content and components without losing accessibility.' },
        { nombre: 'Sessions by role.', texto: 'For design, development, communications or content editing, with the real product in front of you.' },
        { nombre: 'Focused short sessions.', texto: 'Hands-on training on a single topic: accessible PDFs, semantic HTML, WCAG good practice and using the content management system properly.' },
      ],
    },
  },
  intro:
    'La accesibilidad no termina con la entrega. Formamos a los equipos que gestionan y actualizan la web para que puedan mantener la accesibilidad en el día a día.',
  puntos: [
    {
      nombre: 'Al entregar el proyecto.',
      texto:
        'Después de cada desarrollo o adaptación, el equipo responsable aprende a actualizar contenidos y componentes sin perder la accesibilidad.',
    },
    {
      nombre: 'Sesiones por perfil.',
      texto: 'Para diseño, desarrollo, comunicación o edición de contenidos, con el producto real delante.',
    },
    {
      nombre: 'Píldoras monográficas.',
      mic: 'pildora',
      texto:
        'Formaciones prácticas sobre un tema: PDF accesibles, HTML semántico, buenas prácticas WCAG y uso correcto del gestor de contenidos.',
    },
  ] satisfies Punto[],
};
