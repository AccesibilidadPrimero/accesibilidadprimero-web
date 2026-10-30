/* ---------------------------------------------------------------------------
   Servicios · el contenido de /servicios/ (Johnny, 30/10/2026).

   Tres servicios, en este orden: Diseño y desarrollo, Auditoría y Formación.
   La auditoría y la formación salen de accesibilidadprimero.com
   (/auditoria-de-accesibilidad-wcag/ y /formacion/), reescritas con la voz de
   la web nueva: frases cortas, una idea por frase, sin jerga.
   Diseño y desarrollo es texto nuevo, propuesto por Claude y pendiente de que
   Johnny lo revise.
   --------------------------------------------------------------------------- */

export interface Punto {
  nombre: string;
  texto: string;
}

export interface Tarifa {
  nombre: string;
  para: string;
  precio: string;
  incluye: string[];
}

export const DISENO = {
  intro:
    'Diseñamos y desarrollamos webs del concepto al código. La accesibilidad está en cada decisión desde la primera retícula, no se añade al final.',
  puntos: [
    {
      nombre: 'Diseño a medida.',
      texto: 'Cada web parte de quien está detrás: su identidad, su público y lo que quiere contar. Sin plantillas.',
    },
    {
      nombre: 'Un stack propio y accesible.',
      texto:
        'Desarrollamos sobre una base técnica propia con WCAG 2.2 AA de serie. Cada componente está probado con teclado y lector de pantalla, y cada cambio pasa comprobaciones automáticas de contraste, reflow y navegación antes de publicarse.',
    },
    {
      nombre: 'Un gestor de contenidos propio.',
      texto:
        'Tu equipo actualiza textos, imágenes y artículos sin tocar código y sin romper la accesibilidad. Lo estamos terminando: las primeras webs lo usarán a principios de 2027.',
    },
    {
      nombre: 'Rápidas y sin plugins que mantener.',
      texto:
        'Webs ligeras, servidas desde la red de Cloudflare. Sin WordPress ni plugins que actualizar cada semana: menos mantenimiento y menos puertas abiertas.',
    },
    {
      nombre: 'Declaración y formación al entregar.',
      texto:
        'Cada web sale con su declaración de accesibilidad publicada, y formamos a tu equipo para que siga siendo accesible.',
    },
  ] satisfies Punto[],
};

export const AUDITORIA = {
  intro:
    'Analizamos tu web con WCAG 2.2 y la normativa vigente, te explicamos cada barrera y te damos un plan para quitarlas. Al terminar, entregamos la declaración de accesibilidad publicada.',
  revisamos: [
    {
      nombre: 'Diseño e información.',
      texto: 'Jerarquía visual, navegación con teclado, color, contraste y tipografía.',
    },
    {
      nombre: 'Interacción y código.',
      texto: 'Formularios, elementos interactivos, marcado semántico y lectores de pantalla.',
    },
    {
      nombre: 'Lenguaje.',
      texto: 'Claridad del texto, barreras cognitivas y comunicación inclusiva. Es lo que casi ninguna auditoría mira.',
    },
  ] satisfies Punto[],
  entregamos:
    'Un resumen para dirección, las incidencias ordenadas por prioridad, un plan de acción y la declaración de accesibilidad publicada en tu web.',
  tarifas: [
    {
      nombre: 'Express',
      para: 'Webs pequeñas',
      precio: '590 a 790 €',
      incluye: [
        'Hasta 10 páginas',
        'Revisión automática y manual',
        'Lectores de pantalla',
        'Análisis del lenguaje',
        'Reunión de 60 minutos',
        'De 5 a 7 días hábiles',
      ],
    },
    {
      nombre: 'Completa',
      para: 'Webs medianas',
      precio: '1.200 a 1.800 €',
      incluye: [
        'Hasta 25 páginas y los recorridos críticos',
        'NVDA y VoiceOver',
        'Arquitectura de la información',
        'Plan de acción en tres fases',
        'Reunión de 90 minutos',
        'Dos semanas de soporte por correo',
        'De 10 a 15 días hábiles',
      ],
    },
    {
      nombre: 'Institucional',
      para: 'Sector público y grandes empresas',
      precio: 'Desde 2.500 €',
      incluye: [
        'Sin límite de páginas',
        'WCAG 2.2 y EN 301 549',
        'Varias tecnologías de apoyo',
        'Reunión de 120 minutos',
        'Un mes de soporte por correo',
        'Plazo a medida',
      ],
    },
  ] satisfies Tarifa[],
  nota: 'Si después nos encargas las mejoras, la auditoría no se cobra.',
};

export const FORMACION = {
  intro:
    'La accesibilidad no termina con la entrega. Formamos a los equipos que gestionan y actualizan la web para que la mantengan accesible sin depender de nadie.',
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
      texto:
        'Formaciones prácticas sobre un tema: PDF accesibles, HTML semántico, buenas prácticas WCAG y uso correcto del gestor de contenidos.',
    },
  ] satisfies Punto[],
};
