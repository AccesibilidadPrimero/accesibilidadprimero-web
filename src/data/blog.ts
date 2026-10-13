/* Categorías del Blog: la clave es el trozo de URL (/blog/categoria/<clave>/)
   y el valor, lo que se lee. Las mismas tres que tenía WordPress con
   artículos; «Auditoría Express» no tenía ninguno y no entra (Figma, 30/09). */
export const CATEGORIAS = {
  'accesibilidad-digital': 'Accesibilidad digital',
  'auditoria-wcag': 'Auditoría WCAG',
  diseno: 'Diseño',
} as const;
export type Categoria = keyof typeof CATEGORIAS;

/** «7 de abril de 2026». En UTC: la fecha del archivo es un día, no un instante. */
export const fechaLarga = (d: Date) =>
  new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
