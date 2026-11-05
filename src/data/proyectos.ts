/* ---------------------------------------------------------------------------
   Tipos de proyecto · los filtros de /proyectos/ (Johnny, 14/10/2026).

   Productos deja de ser una página y un destino del menú: los productos
   propios entran en Proyectos junto a los trabajos para clientes, y lo que
   los separa es el tipo, no quién lo encarga.

   La clave es el trozo de URL (/proyectos/tipo/<clave>/) y el valor, lo que se
   lee. Tres plurales con la misma forma, que no se solapan: cada proyecto es
   de uno y solo uno. «Extensiones» y no «Herramientas»: una aplicación también
   es una herramienta, y un filtro que no se sabe dónde termina no filtra.
   --------------------------------------------------------------------------- */
export const TIPOS = {
  webs: 'Webs',
  aplicaciones: 'Aplicaciones',
  extensiones: 'Extensiones',
} as const;
export type Tipo = keyof typeof TIPOS;
export const CLAVES_TIPO = Object.keys(TIPOS) as [Tipo, ...Tipo[]];

/* Los mismos filtros en catalán e inglés (05/11/2026). La clave de la URL no
   cambia en ningún idioma: /ca/projectes/tipo/webs/. */
export const TIPOS_IDIOMA: Record<'es' | 'ca' | 'en', Record<Tipo, string>> = {
  es: TIPOS,
  ca: { webs: 'Webs', aplicaciones: 'Aplicacions', extensiones: 'Extensions' },
  en: { webs: 'Websites', aplicaciones: 'Apps', extensiones: 'Extensions' },
};
