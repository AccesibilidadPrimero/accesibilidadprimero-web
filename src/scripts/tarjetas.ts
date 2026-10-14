/* ---------------------------------------------------------------------------
   Entrada de las tarjetas de los listados (src/styles/listados.css).

   La animación es CSS y arranca sola. Esto solo hace una cosa: las tarjetas
   que al cargar quedan por debajo de la ventana se PAUSAN (esperan en su
   primer fotograma) y se reanudan cuando asoman, escalonadas entre las que
   asoman juntas. Sin esto, la segunda fila habría hecho su entrada fuera de la
   vista y al bajar ya estaría quieta.

   Si este script no llega a ejecutarse, no pasa nada: las tarjetas entran
   todas al cargar, como animación CSS que son.
   --------------------------------------------------------------------------- */
const MAX_ESCALON = 5;   // a partir de la sexta, todas con el mismo retraso

function arrancarTarjetas() {
  const items = [...document.querySelectorAll<HTMLElement>('.tarjetas > li')];
  if (!items.length) return;
  if (document.documentElement.dataset.llegada === 'transicion') return;

  const alto = window.innerHeight;
  const abajo = items.filter((li) => li.getBoundingClientRect().top >= alto * 0.92);
  if (!abajo.length || !('IntersectionObserver' in window)) return;

  for (const li of abajo) li.style.animationPlayState = 'paused';

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, i) => {
          const li = e.target as HTMLElement;
          li.style.setProperty('--i', String(Math.min(i, MAX_ESCALON)));
          li.style.animationPlayState = 'running';
          observador.unobserve(li);
        });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  abajo.forEach((li) => observador.observe(li));

  /* Al imprimir no hay scroll que las revele. */
  window.addEventListener('beforeprint', () => abajo.forEach((li) => (li.style.animationPlayState = 'running')));
}

arrancarTarjetas();

export {};
