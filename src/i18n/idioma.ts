/* ---------------------------------------------------------------------------
   El idioma de una página, sacado de su URL (05/11/2026).

   El castellano va sin prefijo; el catalán, en /ca/; el inglés, en /en/. Así
   ningún componente necesita que le pasen el idioma: lo lee de Astro.url, y
   una página traducida es solo un archivo de ruta que pinta el mismo
   componente bajo otro prefijo.
   --------------------------------------------------------------------------- */
import type { Lang } from './config';

export function idiomaDe(url: URL): Lang {
  if (url.pathname === '/ca' || url.pathname.startsWith('/ca/')) return 'ca';
  if (url.pathname === '/en' || url.pathname.startsWith('/en/')) return 'en';
  return 'es';
}

/** Elige el texto del idioma: `tr(lang, { es, ca, en })`. */
export function tr<T>(lang: Lang, textos: Record<Lang, T>): T {
  return textos[lang];
}

/* El contenido en Markdown lleva sus traducciones en el propio archivo, en
   `traducciones: { ca: {...}, en: {...} }`, con la misma forma que el
   original y solo los campos de texto. `localizar` las mezcla sobre el
   original: los objetos campo a campo y las listas posición a posición, así
   que una imagen conserva su archivo y solo cambia su `alt`. */
type Datos = Record<string, unknown>;
function mezclar(base: unknown, encima: unknown): unknown {
  if (encima === undefined || encima === null) return base;
  if (Array.isArray(base) && Array.isArray(encima)) {
    return base.map((b, i) => mezclar(b, encima[i]));
  }
  if (base && typeof base === 'object' && !(base instanceof Date) && typeof encima === 'object' && !Array.isArray(encima)) {
    const salida: Datos = { ...(base as Datos) };
    for (const [k, v] of Object.entries(encima as Datos)) salida[k] = mezclar((base as Datos)[k], v);
    return salida;
  }
  return encima;
}
export function localizar<T extends object>(datos: T, lang: Lang): T {
  const tr = (datos as { traducciones?: Partial<Record<Lang, unknown>> }).traducciones;
  if (lang === 'es' || !tr?.[lang]) return datos;
  return mezclar(datos, tr[lang]) as T;
}
