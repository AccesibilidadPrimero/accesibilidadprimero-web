/* ---------------------------------------------------------------------------
   Desplegables de las páginas interiores (Servicios, 03/11/2026).

   El patrón de acordeón de la WAI: el título es un encabezado de verdad y
   dentro lleva un <button> con `aria-expanded` y `aria-controls`. El panel se
   oculta con `hidden`, no con altura 0: lo que está cerrado no se lee.

   Sin JS los paneles salen abiertos y los botones no se pintan (AGENTS.md
   §5): el CSS lo resuelve con `html:not(.js)`. Lo usan Bloque.astro
   (`desplegable`) y Plegable.astro, y Astro lo carga una sola vez.
   --------------------------------------------------------------------------- */
document.documentElement.classList.add('js');

document.querySelectorAll<HTMLButtonElement>('[data-plegable-boton]').forEach((boton) => {
  const panel = document.getElementById(boton.getAttribute('aria-controls') ?? '');
  if (!panel) return;
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    panel.hidden = abierto;
    // El foco se queda en el botón. Moverlo solo se justifica en diálogos.
  });
});

/* Llegar con un ancla (el submenú de Servicios, 03/11/2026): /servicios/#auditoria
   abre ese desplegable y deja el foco en su botón, para que quien va con
   teclado o lector de pantalla siga desde ahí y no desde el menú. */
function abrirDesdeAncla() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  // El ancla puede ser el botón o, desde el 05/11/2026, el título del bloque
  // (Bloque `desplegable`), cuyo + lleva `data-ancla`.
  const destino = document.getElementById(id);
  const boton = destino instanceof HTMLButtonElement ? destino : document.querySelector<HTMLButtonElement>(`[data-plegable-boton][data-ancla="${CSS.escape(id)}"]`);
  if (!(boton instanceof HTMLButtonElement) || !boton.hasAttribute('data-plegable-boton')) return;
  const panel = document.getElementById(boton.getAttribute('aria-controls') ?? '');
  if (!panel) return;
  boton.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  boton.focus({ preventScroll: true });
  (destino ?? boton).scrollIntoView({ block: 'start' });
}
abrirDesdeAncla();
window.addEventListener('hashchange', abrirDesdeAncla);
// Mismo apartado dos veces (lo cerraste y vuelves a pedirlo desde el menú):
// el ancla no cambia y `hashchange` no salta.
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
  if (a && a.pathname === location.pathname && a.hash && a.hash === location.hash) setTimeout(abrirDesdeAncla);
});
