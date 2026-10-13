/* ---------------------------------------------------------------------------
   Demostración «px frente a rem» del artículo de tipografía.

   Sin JavaScript el control no se pinta (`hidden`): un deslizador que no hace
   nada es peor que no tenerlo (AGENTS.md §5). La muestra en rem sigue ahí y
   responde de verdad al tamaño de letra del navegador de quien lee.

   El <output> anuncia el número nuevo por sí solo: su rol implícito es
   `status`. No hace falta ARIA.
   --------------------------------------------------------------------------- */
for (const demo of document.querySelectorAll<HTMLElement>('[data-demo="px-rem"]')) {
  const control = demo.querySelector<HTMLElement>('[data-solo-js]');
  const rango = demo.querySelector<HTMLInputElement>('input[type="range"]');
  const valor = demo.querySelector<HTMLOutputElement>('output');
  const rem = demo.querySelector<HTMLElement>('[data-rem]');
  const nota = demo.querySelector<HTMLElement>('[data-rem-nota]');
  if (!control || !rango || !valor || !rem || !nota) continue;

  control.hidden = false;
  const pintar = () => {
    const px = Number(rango.value);
    valor.value = String(px);
    rem.style.fontSize = `${px}px`;
    nota.textContent = `Ahora mide ${px} px.`;
  };
  rango.addEventListener('input', pintar);
  pintar();
}
