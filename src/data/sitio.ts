/* ---------------------------------------------------------------------------
   Dónde vive la web · un solo interruptor.

   Del 23/10/2026 al 20/01/2027 la web nueva se publica en
   accesibilidadprimero.eu SIN indexar, mientras accesibilidadprimero.com
   sigue siendo el WordPress que justifica el Kit Digital (Johnny, 12/10/2026).

   El 20/01/2027 se cambia MODO a 'final' y nada más en el código:
     · la URL base pasa a www.accesibilidadprimero.com;
     · vuelve el <link rel="canonical"> y se quita el <meta robots>;
     · los textos legales nombran el .com.
   Lo que hay que hacer fuera del código ese día está en
   claude/publicacion-eu-2026-10-12.md (proyecto).

   El noindex de los hosts provisionales NO depende de MODO: va por nombre de
   host (public/_headers y worker/index.ts). Así, aunque alguien se olvide de
   algo, el .eu y la web de pruebas no se indexan nunca.
   --------------------------------------------------------------------------- */
export type Modo = 'provisional' | 'final';
export const MODO = 'provisional' as Modo;

export const DOMINIO_FINAL = 'accesibilidadprimero.com';
export const DOMINIO_PROVISIONAL = 'accesibilidadprimero.eu';

/** Dominio que se nombra en los textos (sin www). */
export const DOMINIO = MODO === 'final' ? DOMINIO_FINAL : DOMINIO_PROVISIONAL;
/** URL base del sitio: canonical, enlaces absolutos. */
export const SITIO = MODO === 'final' ? `https://www.${DOMINIO_FINAL}` : `https://${DOMINIO_PROVISIONAL}`;
/** Si Google puede indexar esta compilación. */
export const INDEXABLE = MODO === 'final';

/** Hosts que nunca se indexan, pase lo que pase con MODO. */
export function hostSinIndexar(host: string): boolean {
  return host.endsWith('.workers.dev') || host === DOMINIO_PROVISIONAL || host.endsWith(`.${DOMINIO_PROVISIONAL}`);
}
