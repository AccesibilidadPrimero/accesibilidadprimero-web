/* Recorre la página de arriba abajo como lo haría alguien leyendo, para que
   la aparición al hacer scroll (src/scripts/aparicion.ts) termine en todos
   los bloques antes de medir o capturar.

   Sin esto, con reducir movimiento los bloques que no se han visto están en
   opacidad 0, y un medidor que salta lo invisible aprobaría sin mirar. */
export async function recorrer(page, espera = 1600) {
  await page.evaluate(async () => {
    const paso = Math.round(window.innerHeight * 0.6);
    const fotograma = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // 'instant': con movimiento normal el html lleva scroll-behavior: smooth.
    for (let y = 0; y <= document.documentElement.scrollHeight; y += paso) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await fotograma();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await fotograma();
  });
  await page.waitForTimeout(espera);
}
