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
  intro:
    'Diseñamos y desarrollamos webs del concepto al código. La accesibilidad está en cada decisión desde la primera línea de código, no se añade al final.',
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
        'Revisión automática y manual',
        'Lectores de pantalla',
        'Análisis del lenguaje',
        'Reunión de 60 minutos',
        'De 5 a 7 días hábiles',
      ],
    },
    {
      titulo: 'Webs hasta 25 páginas a auditar',
      nombre: 'Completa',
      precio: '1.200 a 1.800 € + IVA',
      incluye: [
        'Los recorridos críticos',
        'NVDA y VoiceOver',
        'Arquitectura de la información',
        'Plan de acción en tres fases',
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
