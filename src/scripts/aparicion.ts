/* ---------------------------------------------------------------------------
   Aparición al hacer scroll · Home

   Encargo de Johnny: «sutil», con acceptandproceed.com como referencia de
   carácter. Las reglas, en orden de importancia:

   1. El contenido nunca depende de la animación para verse. El CSS lo deja
      todo en su sitio; es ESTE script el que, al arrancar, marca lo que va a
      moverse. Sin JS, o si algo falla aquí, no se marca nada y no se pierde
      nada. Y aun marcado, en movimiento normal no hay fundido: el bloque está
      siempre opaco, solo 16 px más abajo hasta que entra.
   2. Lo que ya se ve al cargar no se toca. El hero es el LCP y entra quieto,
      y un bloque que salta delante de los ojos al abrir la página no es sutil.
   3. Una sola vez por elemento. Al subir y volver a bajar no se repite.
   4. Ritmo: casi todo late igual (sube 16 px y se posa), y las tres frases
      que abren bloque son el acento: entran renglón a renglón.
   5. Con reducir movimiento no se apaga: se cambia por un fundido de 300 ms
      (base.css). Es la regla 2.3 de AGENTS.md.

   Qué se mueve y en qué orden vive AQUÍ, en una lista, y no repartido por los
   componentes: así se lee entero de un vistazo. El orden reproduce el de la
   referencia: primero lo que nombra, después lo que explica, al final la
   imagen. Los valores (16 px, 1,2 s, la curva, 0,12 s de desfase) están en
   tokens.css.
   --------------------------------------------------------------------------- */

type Orden = number | 'posicion';

const PIEZAS: Array<[selector: string, orden: Orden]> = [
  // Cada proyecto: título y nota · texto y enlace · capturas.
  ['.proyecto__intro', 0],
  ['.proyecto__cuerpo', 1],
  ['.proyecto .slider', 2],
  /* El enlace al caso va DEBAJO de las capturas en los tres proyectos desde
     el 04/11/2026: entra el último. */
  ['.proyecto__cta', 2],
  // Productos: la frase, y las tres columnas de izquierda a derecha.
  ['.producto', 'posicion'],
  // Estudio: símbolo · frase · enlace.
  ['.estudio__icono', 0],
  ['.estudio > .cta', 2],
  // Contacto: el enlace. El pie no se mueve.
  ['.contacto > .cta', 1],
  /* Caso de proyecto (/proyectos/<caso>/, 23/10/2026: «el gustito en la
     navegación»). El mismo latido que la Home, en el orden de lectura: lo que
     nombra, lo que explica y la imagen. Las piezas que van en fila (datos de
     la ficha, tensiones, decisiones, pares de imágenes) se escalonan por su
     sitio, de izquierda a derecha. */
  ['.caso .ficha__datos > div', 'posicion'],
  ['.caso .entradilla', 0],
  ['.caso .banda', 0],
  ['.caso .par > picture', 'posicion'],
  ['.caso .seccion > h2', 0],
  ['.caso .intro', 1],
  ['.caso .tension', 'posicion'],
  ['.caso .decision', 'posicion'],
  ['.caso .banda-equipo > picture', 0],
  ['.caso .testimonio', 1],
  /* Revisión del 04/11/2026 (Johnny: «a veces no son muy fluidas»). Hasta
     hoy solo se movían la Home y Foc i Cor; el resto de páginas se quedaban
     quietas y solo el cierre entraba, así que el mismo gesto de scroll se
     sentía distinto en cada página. Ahora late todo igual:

     Casos con maqueta propia (ECI, Izaskun, Elogio): la etiqueta, el texto,
     las piezas y bandas con vídeo, y lo que va en fila por su sitio. */
  ['.datos__lista > div', 'posicion'],
  ['.bloque__etiqueta', 0],
  ['.bloque__esquema', 1],
  ['.decisiones__enunciado', 0],
  ['.decisiones__lista > li', 'posicion'],
  ['.pieza', 0],
  ['.banda', 0],
  // El cierre de cada caso (CierreProyecto.astro): declaración y siguiente.
  ['.cierre__declaracion', 0],
  ['.siguiente', 1],
  // Páginas interiores con Bloque (Estudio, Qué hacemos, Contacto) y casos.
  ['.bloque__titulo:not(.sr-only)', 0],
  ['.bloque__contenido:not([hidden])', 1],
];

/* Las tres frases que abren bloque. Son el acento: entran renglón a renglón.
   Con reducir movimiento no se parten; funden como el resto. */
const FRASES = ['.productos__intro', '.estudio__texto', '.contacto__titulo'];

/* ---- Partir una frase en renglones ---------------------------------------

   El lector de pantalla no debe oír la frase a trozos (VoiceOver en Safari lee
   cada bloque por separado). Así que el texto original NO se toca: se guarda
   tal cual dentro de un `.sr-only`, y lo que se anima es una copia marcada con
   `aria-hidden` (ARIA justificada: es un duplicado visual del texto que ya
   está en el árbol; sin ella se leería dos veces). El nombre del <h2>, que
   usa `aria-labelledby` de la sección, sale del original y queda intacto.

   Los renglones se MIDEN en el render, no se suponen: se envuelve cada
   palabra, se agrupan por su altura y se reconstruye un bloque por renglón.
   Al terminar la animación se devuelve el marcado original: el texto vuelve
   a fluir solo si cambia el ancho de la ventana. */
function partir(frase: HTMLElement) {
  /* En una fila o columna flex la caja toma el ancho de su contenido, y los
     renglones sueltos son más estrechos que el párrafo: se fija el ancho que
     tenía para que nada se mueva al partir (npm run geometria lo vigila). */
  frase.style.inlineSize = `${frase.getBoundingClientRect().width}px`;
  const lector = document.createElement('span');
  lector.className = 'sr-only';
  lector.append(...frase.childNodes);

  const copia = document.createElement('span');
  copia.setAttribute('aria-hidden', 'true');
  lector.childNodes.forEach((n) => copia.append(n.cloneNode(true)));
  // Cada palabra en su <span> para poder medir dónde cae.
  const textos: Text[] = [];
  /* El texto de un <sup> (la ® de la marca) no es una palabra: se queda
     pegado a la anterior. Sin esto, «Primero» y «®» salían como dos palabras
     y la ® se pintaba a tamaño de texto, con un espacio delante, durante toda
     la animación. */
  const andar = document.createTreeWalker(copia, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest('sup') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  while (andar.nextNode()) textos.push(andar.currentNode as Text);
  for (const t of textos) {
    const trozos = (t.textContent ?? '').split(/(\s+)/);
    t.replaceWith(...trozos.map((w) => {
      if (!w.trim()) return document.createTextNode(w);
      const s = document.createElement('span');
      s.textContent = w;
      s.dataset.palabra = '';
      return s;
    }));
  }
  copia.querySelectorAll('sup').forEach((sup) => {
    const antes = sup.previousSibling;
    if (antes instanceof HTMLElement && antes.dataset.palabra !== undefined) antes.append(sup);
  });
  frase.append(lector, copia);

  const renglones: string[][] = [];
  let arriba = Number.NaN;
  copia.querySelectorAll<HTMLElement>('[data-palabra]').forEach((p) => {
    /* Una palabra que no se pinta no es un renglón. Pasa con los textos que
       cambian con el ancho (.solo-movil / .solo-amplio): la versión oculta
       viaja en la copia y, sin esto, sus palabras darían una «línea» en y = 0
       que aparecería a la vista al reconstruir los renglones. */
    if (!p.getClientRects().length) return;
    const y = Math.round(p.getBoundingClientRect().top);
    if (y !== arriba) { renglones.push([]); arriba = y; }
    /* innerHTML y no textContent: así viaja el <sup> de la ® con su
       palabra. Es marcado de la propia página, no texto de fuera. */
    renglones[renglones.length - 1].push(p.innerHTML);
  });

  copia.replaceChildren(...renglones.map((palabras, i) => {
    const renglon = document.createElement('span');
    renglon.className = 'frase__renglon';
    const dentro = document.createElement('span');
    dentro.className = 'frase__dentro';
    dentro.style.setProperty('--i', String(i));
    dentro.innerHTML = palabras.join(' ');
    renglon.append(dentro);
    return renglon;
  }));
  return renglones.length;
}

/* Devuelve el marcado original y quita la marca. */
function recomponer(frase: HTMLElement) {
  const lector = frase.querySelector(':scope > .sr-only');
  if (!lector) return;
  frase.replaceChildren(...lector.childNodes);
  frase.style.removeProperty('inline-size');
  delete frase.dataset.aparece;
  delete frase.dataset.renglones;
}

/* Duración total de una frase de N renglones, leída de los tokens.

   OJO CON LAS UNIDADES (08/11/2026, Johnny: «no aparecen de forma
   fluida»). En tokens.css pone `900ms`, pero el CSS que sirve el build está
   minificado y el navegador devuelve `.9s`. Este cálculo leía el número sin
   la unidad, así que tomaba 0,9 por 0,9 ms: la frase se recomponía a los
   ~140 ms, con los renglones a medio subir, y el texto daba un salto hasta su
   sitio. Se convierte según la unidad que llegue. */
function aMs(valor: string) {
  const v = valor.trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return v.endsWith('ms') ? n : v.endsWith('s') ? n * 1000 : n;
}
function duracion(renglones: number) {
  const raiz = getComputedStyle(document.documentElement);
  const ms = (v: string) => aMs(raiz.getPropertyValue(v));
  return ms('--dur-renglon') + (renglones - 1) * ms('--desfase-renglon');
}

function arrancar() {
  if (!('IntersectionObserver' in window)) return;
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renglonesDe = new Map<HTMLElement, number>();

  /* -8 % abajo: el bloque empieza a moverse cuando ya ha asomado un poco, y
     como la curva hace casi todo el recorrido en el primer tercio, termina
     antes de llegar a la zona de lectura. */
  /* EL ESCALONADO, SOLO ENTRE LO QUE ENTRA A LA VEZ (Johnny, 10/10: «el
     ritmo de navegación, que sea como el escritorio»). Lo que entra en la
     misma tanda se escalona: primero lo de arriba y, a la misma altura, en el
     orden de PIEZAS (lo que nombra, lo que explica, la imagen) y de izquierda
     a derecha. Lo que entra solo, sale ya.

     Hasta el 04/11/2026 esto solo se hacía por debajo de 1024; en escritorio
     mandaba el orden fijo, y una pieza que asomaba sola esperaba igual sus
     120 o 240 ms sin nadie delante. Con el enlace de ECI debajo de un slider
     de 900 px, ese retraso se notaba como un tirón: el bloque llegaba tarde.
     Ahora el orden se reparte en el momento en todos los anchos. */
  const ordenFijo = new Map<HTMLElement, number>();
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas
        .filter((e) => e.isIntersecting && !(e.target as HTMLElement).dataset.renglones)
        .sort((a, b) =>
          // Misma fila (24 px de margen) → orden de lectura; si no, de arriba abajo.
          Math.abs(a.boundingClientRect.top - b.boundingClientRect.top) < 24
            ? (ordenFijo.get(a.target as HTMLElement) ?? 0) - (ordenFijo.get(b.target as HTMLElement) ?? 0) ||
              a.boundingClientRect.left - b.boundingClientRect.left
            : a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((e, i) => (e.target as HTMLElement).style.setProperty('--orden', String(Math.min(i, 2))));
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.dataset.aparece = 'visto';
        observador.unobserve(el);
        const n = renglonesDe.get(el);
        if (n) window.setTimeout(() => recomponer(el), duracion(n) + 50);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  const alto = window.innerHeight;
  for (const [selector, orden] of PIEZAS) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
      if (el.dataset.aparece) return; // ya lo marcó un selector anterior
      /* Nunca uno dentro de otro: los dos desplazamientos se sumarían (32 px)
         y el de dentro llegaría a destiempo. Manda el de fuera. */
      if (el.parentElement?.closest('[data-aparece]') || el.querySelector('[data-aparece]')) return;
      if (el.getBoundingClientRect().top < alto) return; // ya se ve: quieto
      ordenFijo.set(el, orden === 'posicion' ? i % 3 : orden);
      el.style.setProperty('--orden', String(orden === 'posicion' ? i % 3 : orden));
      el.dataset.aparece = 'espera';
      observador.observe(el);
    });
  }

  for (const selector of FRASES) {
    const frase = document.querySelector<HTMLElement>(selector);
    if (!frase || frase.getBoundingClientRect().top < alto) continue;
    if (frase.parentElement?.closest('[data-aparece]')) continue;
    frase.dataset.aparece = 'espera';
    if (!reducido) {
      frase.dataset.renglones = '';
      renglonesDe.set(frase, partir(frase));
    }
    observador.observe(frase);
  }

  /* Si cambia el ancho antes de que la frase entre, los renglones medidos ya
     no valen: se recompone y se vuelve a medir. */
  let espera = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(espera);
    espera = window.setTimeout(() => {
      for (const [frase] of renglonesDe) {
        if (frase.dataset.aparece !== 'espera') continue;
        const lector = frase.querySelector(':scope > .sr-only');
        if (!lector) continue;
        frase.replaceChildren(...lector.childNodes);
        frase.style.removeProperty('inline-size');
        renglonesDe.set(frase, partir(frase));
      }
    }, 150);
  });

  /* Al imprimir no hay scroll que lo revele: con reducir movimiento saldría
     en blanco lo que no se haya visto. */
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll<HTMLElement>('[data-aparece="espera"]').forEach((el) => {
      if (el.dataset.renglones !== undefined) recomponer(el);
      else el.dataset.aparece = 'visto';
    });
  });
}

arrancar();
