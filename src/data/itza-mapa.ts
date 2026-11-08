/* ---------------------------------------------------------------------------
   El mapa de la web para Itza en Contacto (08/11/2026).

   Johnny: «si hace alguna pregunta o tiene alguna duda sobre el contenido de
   AP, que en la respuesta ponga el enlace del apartado donde puede
   encontrar la respuesta».

   Lo leen los dos lados, así que no pueden desacordarse:
   · el Worker (worker/index.ts) se lo da a Itza en el prompt: qué hay en
     cada apartado y su dirección en el idioma de la página;
   · la página (src/paginas/contacto.astro) lo pasa al script, que solo
     convierte en enlace una dirección que esté AQUÍ. Lo que invente el
     modelo no se pinta como enlace.

   Si un apartado cambia de contenido, se cambia su línea.
   --------------------------------------------------------------------------- */
import { path, type Lang, type RouteKey } from '../i18n/config.ts';
import { t } from '../i18n/ui.ts';

const SECCIONES: { clave: RouteKey; contenido: string }[] = [
  { clave: 'estudio', contenido: 'quiénes somos, quién es Johnny Vale Vigas, cómo trabajamos y por qué la accesibilidad es el punto de partida' },
  { clave: 'servicios', contenido: 'los servicios: diseño y desarrollo de webs accesibles, auditorías de accesibilidad con sus tarifas, y formación' },
  { clave: 'proyectos', contenido: 'los casos de estudio: proyectos para clientes y los productos del estudio (Itza, A11y Primero, Accesible Abstracts)' },
  { clave: 'guia', contenido: 'la guía en vídeo de los 23 puntos que hacen accesible una web, preguntas frecuentes sobre la ley española, catalana y europea, qué es la WCAG y un glosario' },
  { clave: 'blog', contenido: 'artículos sobre accesibilidad digital, normativa, diseño y comunicación inclusiva' },
  { clave: 'lecturaFacil', contenido: 'la web en lectura fácil' },
  { clave: 'accesibilidad', contenido: 'la declaración de accesibilidad de esta web' },
  { clave: 'privacidad', contenido: 'la política de privacidad: qué datos se recogen y para qué' },
];

export interface Apartado { ruta: string; nombre: string; contenido: string }

export function mapaItza(lang: Lang): Apartado[] {
  const nav = t(lang).nav as Partial<Record<RouteKey, string>>;
  return SECCIONES.map(({ clave, contenido }) => ({ ruta: path(clave, lang), nombre: nav[clave] ?? clave, contenido }));
}

/* Para el prompt: una línea por apartado. */
export function mapaEnTexto(lang: Lang): string {
  return mapaItza(lang).map((a) => `${a.ruta} (${a.nombre}): ${a.contenido}.`).join('\n');
}
