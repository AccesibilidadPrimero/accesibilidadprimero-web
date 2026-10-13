/* ---------------------------------------------------------------------------
   Formulario de contacto · lo que necesita el navegador.

   La clave de SITIO de Turnstile es pública: va en el HTML de la página y no
   da acceso a nada. La SECRETA no está aquí ni en ningún archivo del
   repositorio: vive en el panel de Cloudflare (ver worker/index.ts).

   Widget «Formulario de contacto», modo Invisible, creado el 10/10/2026.
   Dominios: accesibilidadprimero.com y .eu (con y sin www), la dirección de pruebas
   (…proyectos-44e.workers.dev) y localhost.

   La de PRUEBA de Cloudflare (siempre aprueba) se queda nombrada abajo para
   que `npm run formulario` avise si alguien la vuelve a poner.
   --------------------------------------------------------------------------- */
export const TURNSTILE_SITEKEY = '0x4AAAAAAFTRWahLJ0EjMF76';
export const TURNSTILE_SITEKEY_PRUEBA = '1x00000000000000000000BB';
export const TURNSTILE_ACCION = 'contacto';
export const CORREO_ESTUDIO = 'proyectos@accesibilidadprimero.com';
