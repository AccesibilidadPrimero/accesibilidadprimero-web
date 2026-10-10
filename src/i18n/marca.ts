/* ---------------------------------------------------------------------------
   La ® de «Accesibilidad Primero» (Johnny, 10/10: «cada vez que mencionamos
   Accesibilidad Primero, hay que colocarle la ®»).

   Va como en el logotipo y en los nombres de producto: un <sup> pequeño, y
   `aria-hidden` porque el lector de pantalla lo diría en voz alta («registrado»)
   cada vez que suena el nombre del estudio. Es una marca legal que se ve, no
   información que haya que oír.

   Fuera de esto, a propósito: el <title>, la descripción, los `alt` y los
   nombres accesibles, donde la ® solo se pronuncia; y la frase del carrusel
   «Accesibilidad primero. Siempre.», que es el lema escrito con minúscula y se
   teclea letra a letra.
   --------------------------------------------------------------------------- */
export const REGISTRADA = '<sup class="registrada" aria-hidden="true">®</sup>';

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Texto plano → HTML con la ® detrás de cada «Accesibilidad Primero». */
export function conMarca(texto: string): string {
  return escapar(texto).replace(/Accesibilidad Primero(?!®)/g, `Accesibilidad Primero${REGISTRADA}`);
}
