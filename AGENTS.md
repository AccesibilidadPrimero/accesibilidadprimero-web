# AGENTS.md — accesibilidadprimero.com v2.0

Reglas duras del repositorio. Las lee cualquier agente: Claude Code, Codex,
Gemini. **Si una instrucción de este archivo choca con una petición, gana este
archivo** y hay que decirlo en voz alta en vez de cumplir la petición en
silencio.

Este es el sitio de un estudio que vende accesibilidad. El listón no es «pasa
los tests»: es **que Johnny pueda leer el código entero y defenderlo delante de
un cliente**. Código que funciona pero que no se puede explicar no sirve.

---

## 1. Lo que no se hace nunca

- **No se añade ARIA sin justificarlo en un comentario.** La primera regla de
  ARIA es no usar ARIA. Un `<button>` no necesita `role="button"`. Una lista no
  necesita `role="list"` salvo que el CSS le haya quitado el rol —y si se lo ha
  quitado, el problema es el CSS. ARIA de más es el modo de fallo número uno de
  los modelos de lenguaje en accesibilidad y el más dañino, porque rompe lo que
  el HTML ya hacía bien.
- **No se instala ninguna dependencia nueva sin preguntar.** Ni una. Cada
  paquete es superficie que hay que auditar y mantener.
- **No se añade ningún elemento que no esté en el diseño de Figma.** Si falta
  algo, se dice y se espera; no se inventa.
- **No se usa `display: none` ni `visibility: hidden` para texto que debe leer
  un lector de pantalla.** Para eso está `.sr-only`.
- **No se desactiva el `outline` de foco.** Nunca, ni «temporalmente».
- **No se fija `user-scalable=no` ni `maximum-scale`.**
- **No se pone texto dentro de imágenes.**
- **No se usa `tabindex` positivo.**
- **No se audita la propia accesibilidad del resultado y se da por buena.** Los
  tests automáticos cogen alrededor de un tercio de los problemas WCAG. El CI es
  un guardarraíl contra regresiones tontas, **no una auditoría**. La pasada de
  teclado y de lector de pantalla la hace Johnny.

## 2. Modos de fallo conocidos, a vigilar en cada revisión

Están aquí porque ya han pasado, no en abstracto:

1. **ARIA de más.** El más frecuente.
2. **Gestión del foco del menú móvil.** Trampa de foco mal cerrada, foco que no
   vuelve al botón, fondo que sigue siendo tabulable.
3. **`prefers-reduced-motion` implementado apagando la animación en vez de
   sustituirla.** Reducir no es eliminar: el cambio de estado tiene que seguir
   siendo perceptible.
4. **Skip link con destino no focusable.** El destino necesita `tabindex="-1"`
   o ser un elemento que reciba foco de por sí.
5. **Alternativas textuales genéricas.** «Imagen», «logo», «foto de». Un `alt`
   que no añade nada es peor que `alt=""`.
6. **`_to_delete/` compilando.** El shell que Claude alcanza en el Mac no puede
   borrar dentro de las carpetas conectadas, así que lo que sobra se MUEVE a
   `_to_delete/` y lo vacía Johnny. Git la ignora; `astro check` no miraba
   .gitignore sino `include`, así que compilaba los descartes. Una copia vieja
   de `HeroCarousel.astro` ahí dentro dejó `npm run check` en 4 errores y con
   él `verificar` y `publicar`: la publicación se quedó bloqueada por un
   archivo que ya nadie usaba. Está excluida en `tsconfig.json` desde el
   09/10/2026. **Regla: nada que se mueva a `_to_delete/` puede seguir
   participando en el build**, y conviene vaciarla de vez en cuando — llegó a
   tener 160 MB de tarballs.
7. **El puente de archivos inyecta credenciales de contenido (C2PA).** Todo
   lo que Claude escribe en el Mac a través del puente y admita metadatos sale
   con un manifiesto `c2pa` dentro: **SVG** (bloque `<metadata>` + el
   `xmlns:c2pa` del elemento raíz), **PNG** (un trozo auxiliar) y **MP4** (una
   caja `uuid` detrás del `ftyp`) y **JPEG** (un segmento APP11; pasó con el retrato de Estudio el
   11/10, y se quita copiando el archivo sin los segmentos `FFEB`). El 10/10 fueron 50 KB repartidos en ocho
   archivos. No rompe nada —el vídeo decodifica fotograma a fotograma igual,
   comprobado con `framemd5`— pero son metadatos de procedencia ajenos pegados
   a obra de Johnny, y eso no se publica. **Regla: después de pasar material
   binario por el puente, comparar md5 con la copia de origen y limpiar si no
   cuadra.** El webm se libra: VP9/Matroska no lleva donde meterlo.
8. **Una tira con scroll horizontal tiene DOS trampas, y las dos salen solo
   con contenido de verdad.** Pasó el 10/10 con «Sobre la mesa»: con una nota
   todo bien, con tres, 176 px de scroll horizontal a 320 (1.4.10).
   (a) El contenedor con `overflow-x: auto` necesita **`min-width: 0`** si es
   hijo de un flex: con `min-width: auto` se niega a encoger por debajo de su
   contenido y empuja la página en vez de desplazarse por dentro.
   (b) Cualquier `.sr-only` dentro de las tarjetas necesita que la tarjeta sea
   **`position: relative`**: `.sr-only` es `position: absolute`, y sin
   ancestro posicionado se coloca respecto a la PÁGINA, así que no lo recorta
   el contenedor con scroll y su posición estática —dentro del carril
   desplazado— ensancha el documento.
   Moraleja: una sección que depende del número de elementos hay que probarla
   con uno, con tres y con cinco. Con uno siempre cabe.
9. **Un comentario no es un dato.** El `<video>` de Itza decía en prosa que
   duraba 4,94 s y que por eso no necesitaba botón de pausa; el archivo que
   sirve la web dura 9,28 s, así que la Home incumplía 2.2.2 sin que nadie lo
   viera. Donde una justificación de accesibilidad se apoye en un número, ese
   número se mide en el build, no se escribe al lado.

## 3. HTML

- Un `<h1>` por página. Sin saltos de nivel. **El nivel semántico y el tamaño
  visual son independientes**: en este sitio hay `h2` tipografiados con la rampa
  `Display/H3`, y está bien.
- Landmarks: `<header>`, `<nav aria-label>`, `<main id="contenido">`,
  `<footer>`. Si hay dos `<nav>` en la misma página, los dos llevan
  `aria-label` y los dos distintos.
- Listas de cosas, `<ul>`/`<li>`. Las rejillas de tarjetas también.
- Una tarjeta enlazada es **un solo enlace** envolviendo el contenido, y su
  nombre accesible es el nombre del proyecto, **no «Ver proyecto»**.
- El idioma de la página en `<html lang>`, y `lang` en cualquier fragmento que
  cambie de idioma. Los enlaces del selector llevan `hreflang` y un nombre
  accesible con el idioma escrito («Català»), no solo el código.
- Los botones que abren algo llevan `aria-expanded` y `aria-controls`.
- La página actual lleva `aria-current="page"`. **Además** del indicador
  visual, nunca en su lugar.

## 4. CSS

- Los tokens viven en `src/styles/tokens.css` y salen del Figma. **No se
  inventa un valor nuevo aquí**: se crea primero en Figma y después se trae.
  **Excepción: el movimiento** (duraciones, curvas, recorridos) vive solo en
  `tokens.css`, no en el Figma (Johnny, 09/10).
- **Aparición al hacer scroll:** lo que se mueve está listado en
  `src/scripts/aparicion.ts` y lo marca el JS al arrancar; sin JS no se marca
  nada. En movimiento normal el bloque no se oculta nunca, solo sube 16 px.
  Desde el 04/11/2026 late igual en TODAS las páginas (antes solo la Home y
  Foc i Cor), el escalonado se reparte entre lo que entra a la vez en
  cualquier ancho y nunca se marca un elemento dentro de otro marcado. Los
  desplegables, al abrirse, suben 8 px y funden; con reducir movimiento,
  fundido de 300 ms.
  Con reducir movimiento, fundido de 300 ms. Un elemento que trae su propia
  versión reducida lleva `data-mov-propio` para que la regla global de
  `base.css` no la deje en 0,01 ms. `npm run aparicion` lo comprueba.
- **Tarjetas de los listados (Proyectos y Blog)** (Johnny, 14/10/2026: «que
  aparezcan de una forma orgánica y amable»). Todo en `src/styles/listados.css`
  y `src/scripts/tarjetas.ts`. Entran escalonadas: suben 32 px y aparecen, y
  su texto llega 120 ms después que su imagen; las de abajo esperan a asomar.
  Al cambiar de filtro, transición de vista entre documentos: las tarjetas que
  siguen se deslizan a su sitio y el resto se funde. Al pasar el puntero, la
  captura de Proyectos se eleva 6 px. Es la única excepción a «lo que ya se ve
  al cargar no se mueve»: en un listado sin hero las tarjetas son la página.
  Sin JS, quieto. Con reducir movimiento, solo fundido y sin transición.
  `npm run movimiento` lo comprueba.
- **Margen de página: 24 en todos los tamaños, igual que el hueco entre
  columnas** (Johnny, 09/10). Columna de 1392 a 1440 y tope de 1392 centrado
  por encima. Web y Figma alineados el mismo día.
- **La escala tipográfica va por tramos y tiene que pasar por los valores del
  Figma en 390, 768 y 1440.** Una sola interpolación entre el valor de móvil y
  el de escritorio NO vale: las pendientes de los dos tramos son distintas y el
  valor intermedio sale mal. Ya pasó: el cuerpo se quedaba en 27 px a 1440 en
  vez de 30. `npm run tipografia` lo comprueba midiendo el render.
- **Un solo peso en toda la web: 400.** Sin negritas (Johnny, 23/08) y sin
  Medium (Johnny, 08/10). El `Display/H3` del Figma viene en Medium y aquí se
  pinta en Regular a propósito. `npm run tipografia` recorre la página
  nodo a nodo en los tres anchos y **falla si encuentra cualquier peso distinto
  de 400** —incluido el que se cuele por un `<strong>` en un markdown.
- **Todo el texto en Ink, sin excepciones** (Johnny, 09/10: los textos en gris
  «no aportan valor»; la nota de accesibilidad también pasó a negro). Hasta ese
  día el gris separaba el título de su explicación; ahora los separa el sitio
  y el espacio. La jerarquía la lleva el marcado (`<h2>`, `<p>`), no el color.
  `npm run tipografia` falla si aparece un texto que no sea negro.
- **Título y texto al mismo cuerpo: los separa el espacio** (Johnny,
  14/10/2026). Cuando un título va al mismo tamaño que su texto, el hueco
  entre los dos tiene que notarse frente al interlineado (**16 como mínimo**) y
  el hueco hasta el bloque siguiente tiene que ser **al menos el triple**. Lo que
  manda es la proporción, no una cifra: si el hueco interior se acerca al
  exterior, el título se queda suelto y no se sabe a qué texto pertenece.
  No es el interlineado, que no se toca.
  - Servicios de Estudio y de Qué hacemos, lista de párrafos en una columna:
    **24 / 72** (Johnny, 04/11/2026: un punto intermedio con el 48 de los
    casos). Antes 16 / 48; se probó 32 / 64 y sobraba blanco.
  - Casos (ECI, Foc i Cor, Izaskun, Elogio): **48** entre un titular y su
    texto, 24 entre párrafos y 72 antes de un titular que corta el texto
    (Johnny, 04/11/2026: «la distancia define la jerarquía»).
  - Productos de la Home: **32**. Cada producto es una columna suelta, con la
    imagen encima y nada debajo con lo que competir.
  - No se aplica a titulares en display (ya los separa el tamaño), a nombre +
    cargo (un solo dato en dos líneas) ni a las tarjetas que son un único
    enlace (nombre y línea forman su texto).
  `npm run geometria` mide los dos huecos de los servicios.
- **Reparto de las líneas** (Johnny, 14/10/2026). Tres reglas, y las tres se
  aplican solas, sin que nadie tenga que acordarse:
  - **Ninguna línea acaba en partícula** («y», «de», «la», «a», «en»…). Lo pone
    `src/lib/particulas.ts` desde `src/middleware.ts` en todo el HTML en
    castellano, Markdown incluido: un espacio que no se parte detrás de la
    partícula. En el `<h1>` la cadena unida no pasa de 18 caracteres, porque a
    320 px el titular en display mide 272 de ancho; si no cabe, la partícula
    se queda al final: el reflow (1.4.10) manda. Las tablas no se tocan.
  - **Ningún párrafo acaba con una palabra sola** (viuda): `text-wrap: pretty`
    en el texto corrido (base.css) y, además, las dos últimas palabras de cada
    párrafo unidas si juntas no pasan de 28 caracteres.
  - **Encabezados equilibrados**: `text-wrap: balance` en h1–h4.
  - Escape, solo para columnas muy estrechas donde unir palabras desborda:
    `data-renglones="libre"` en el elemento (hoy, el nombre y el cargo junto a
    la foto de Estudio). Nunca para callar un fallo de `npm run renglones`.
  - Un texto con cortes fijos (`|-` en el Markdown, `.linea`) tampoco puede
    cortar detrás de una partícula: se reescribe el corte, no se tapa.
  `npm run renglones` recorre todas las páginas del build a 390, 768 y 1440,
  línea a línea, y falla con cualquiera de las dos cosas.
- **El gris es `Ink / Secondary` del Figma, `#686864`**: 5,60:1 sobre el papel
  blanco. Sobre menta da 4,35:1 y no cumple, así que en el hero no entra.
- Sin framework de utilidades. Si una regla sirve para un solo componente, vive
  en el `<style>` de ese componente.
- **El color nunca va solo** (1.4.1). El estado se lleva en el grosor del
  subrayado, en una regla, en el peso. El color acompaña.
- Contraste mínimo 4,5:1 para texto y 3:1 para elementos de interfaz y
  bordes de foco (1.4.3, 1.4.11). Medido, no estimado.
- Objetivos táctiles de **44 px** como mínimo. WCAG 2.5.8 AA pide 24; AP pide
  44 y esa es la regla del repo.
  **Única excepción: un enlace en mitad de una frase de un artículo del Blog**
  (11/10/2026). Mide lo que mide la línea; es la excepción «en línea» de
  2.5.8. `npm run a11y` la aplica solo dentro de `.prosa`, solo a enlaces con
  `display: inline` dentro de un párrafo, lista, cita o tabla. Fuera de los
  artículos, los enlaces siguen en su propia línea.
  **Una casilla cuenta con su `<label for>`** cuando la etiqueta está en la
  misma fila: pulsarla la marca igual. La casilla de Contacto mide 24, como en
  el Figma, y su fila con la etiqueta 44 o más; `npm run a11y` mide así las
  casillas y los botones de opción, y solo así (10/10/2026).
- **Un enlace sin espacios no se parte** (`CtaLink` junta la última palabra
  con la flecha). Una dirección de correo desborda a 320: se escribe con un
  `<wbr>` donde puede cortarse (`proyectos@<wbr>accesibilidadprimero.com`).
- Todo tiene que funcionar con `forced-colors: active`.
- La página tiene que ser usable al 200 % de zoom y con 400 % de aumento de
  texto sin scroll horizontal (1.4.4, 1.4.10).
- **La zona que responde tiene que coincidir con lo que se ve.** Un control
  transparente estirado a `inset: 0` sobre un contenedor ancho reacciona en
  sitios donde no hay nada dibujado, y quien lo usa no entiende por qué pasan
  cosas. En el hero el botón mide exactamente el dibujo, no el escenario
  (Johnny, 08/10/2026). La caja pintada de un `<img>` con alto fijo, `width:
  auto` y `max-width: 100%` se reproduce en CSS sin medir nada:
  `width: min(calc(var(--alto) * var(--ratio)), 100%)` más
  `aspect-ratio: var(--ratio)`. Ojo: cuando `max-width` recorta, `object-fit:
  contain` deja el dibujo apaisado dentro de una caja más alta, así que la
  referencia es el dibujo encajado, no el rectángulo del `<img>`.
  `npm run geometria` lo comprueba con las ocho ilustraciones a los tres
  anchos, y `npm run teclado` mueve el ratón al dibujo y al hueco de al lado.

## 5. JavaScript

- Mejora progresiva: la página tiene que servir sin JS. **Si un control no
  funciona sin JS, no se pinta sin JS.** Un botón muerto en pantalla es peor que
  no tener botón.
- Sin dependencias de cliente. Lo que no se pueda hacer con el DOM se discute
  antes de escribirlo.
- Para ocultar el fondo de un modal se usa `inert`, no `aria-hidden`:
  `aria-hidden` saca del árbol de accesibilidad pero **no del orden de
  tabulación**, y el teclado se escapa.
- El foco vuelve siempre al elemento que abrió, guardado en una variable, no a
  un selector fijo.

## 6. Contenido: reglas que rompen el build

No son convenciones. Son errores de compilación, para que no dependan de la
disciplina personal a las once de la noche.

- `decisiones`: **mínimo 3, máximo 5** (3 desde el 11/10/2026, Johnny). Una sexta no compila. («Un hueco no es
  un problema que resolver: es el resultado.»)
- `cifras`: **exactamente 3**, cada una con su `tipo`, y **no pueden ser las
  tres de accesibilidad**. Es la prueba del algodón del equilibrio
  diseño/accesibilidad, automatizada.
- `autoria` obligatoria en cada decisión de diseño: `propia`, `cliente` o
  `compartida`.
- `destacado: true` en un máximo de **3** casos.
- **Sin `imagenAlt` no compila.** Ninguna imagen entra sin alternativa escrita.
- **La geometría del Figma va en el componente que posee el elemento, no en
  `home.css`.** Astro da scope a los estilos de componente —`.clase[data-astro-cid-…]`—
  y eso gana por especificidad a la misma clase suelta en una hoja aparte, sin
  importar el orden de carga. Una regla de `home.css` para una clase que el
  componente también declara se sirve al navegador y no se aplica nunca. Ya
  pasó: la web salió a producción con la ilustración del hero a 640 px en vez
  de 693 y el titular de contacto a 479 en vez de 962. `npm run geometria` mide
  los anchos del render y lo caza.
- **En una fila flex, `max-width` no fija una medida.** El elemento se queda
  con lo que le deja el reparto. Si el Figma da un ancho, va como `width` (o
  como proporción del contenedor), no solo como tope.
- **Las imágenes que se ven en pantalla van en `src/assets/`, no en `public/`.**
  Astro solo optimiza lo que está dentro de `src/`; lo de `public/` lo copia sin
  tocar. Se usa `<Picture>` de `astro:assets` con `formats={['avif','webp']}`,
  que deja el original como respaldo. `public/` se reserva para lo que necesita
  URL fija: tipografías, imagen de compartir, vídeo. Ver `src/assets/LEEME.md`.
- **Todas las imágenes van en `arte/` y se compilan con `npm run arte`.**
  `arte/` es el original y no lo toca nadie; `src/assets/` es lo generado y no
  se edita a mano. Los SVG se limpian; los PNG y JPG se copian, porque de esos
  ya se encarga Astro en el build. El comando avisa si un raster viene por
  debajo de @2x o con otra proporción, y falla si un SVG trae texto sin
  trazar, un mapa de bits dentro o sin `viewBox`. Inventario en `arte/LEEME.md`. No se limpia en el build: Astro convierte un
  .svg en componente en su fase de carga, antes de que entre un plugin de Vite
  con `enforce: 'pre'` (comprobado: al plugin le llega JavaScript). Precisión 1
  y no 0 — está medido comparando el render píxel a píxel.
- **Los originales se exportan a @2x y en PNG o JPG, nunca en WebP.** Astro
  reduce pero no amplía, y recomprimir algo ya comprimido suma artefactos sin
  ahorrar bytes.
- Titulares **sin antetítulo y sin mayúsculas sostenidas**: regla de lint.
- **Comillas curvas “ ” y guiones cortos** (Johnny, 30/10/2026). Ni «», ni
  raya (—), ni semirraya (–) en nada que se vea o se lea: texto, `alt`,
  `aria-label`. Un inciso va entre comas o paréntesis; un intervalo, con “a”
  o con guion. `npm run renglones` lo mira en todo el build y falla; lo que
  llega de Mastodon lo normaliza `npm run mesa` al congelarlo. Los
  comentarios del código no cuentan.
- La paleta que declara cada proyecto se valida en build contra el fondo de la
  Home.

- **«Estimem les diferències» no se traduce: es una licencia creativa.** La
  frase del hero `01-diferencies` está en catalán *dentro* de la versión
  castellana a propósito —decisión de Johnny, 9 de octubre de 2026—: decir
  «amamos las diferencias» en otra lengua es el concepto ejecutándose, no un
  descuido de traducción. No «arreglarla». Su `lang="ca"` es lo que hace que la
  licencia también funcione para quien escucha: sin la marca, una voz
  castellana la pronuncia como un galimatías (3.1.2). `HeroCarousel.astro` ya
  pone el atributo solo cuando el idioma de la frase difiere del de la página,
  así que en la versión catalana el atributo desaparece él solo — y ahí la
  licencia se pierde. Decidido el 05/11/2026 (Johnny): en la versión catalana
  se queda igual y se lee como una frase normal.

- **La guía en vídeo (05/11/2026; landing propia desde el 06/11/2026).**
  “¿Qué hace que tu web sea o no accesible?” vive en `src/paginas/guia.astro`
  (ruta `guia`). Es la página de referencia del lanzamiento: información de
  valor, no una pieza de venta. Hero a pantalla entera en #E6E680 (el amarillo de la carita
  del vídeo) de arriba abajo, por debajo de la cabecera sin fondo; el titular
  solo para el lector de pantalla (el vídeo ya lo dice) y el carrusel
  centrado a diez de doce columnas, con contador (1 / 23); cada vídeo es un
  `VideoPausable`. El primero espera en pausa y, al pasar, el siguiente
  arranca solo (con «reducir movimiento», no). Los vídeos llevan `?v=` con
  `VERSION_VIDEOS`: se sube al sustituir los archivos. Debajo, la pauta del
  vídeo que se ve, en ficha: título a la izquierda, frase y referencia a la
  vista y qué falla, cómo se arregla y cómo comprobarlo en «Leer más», con
  filetes en Ink, sobre el mismo amarillo que el hero, pegada a él. Cambia
  con el vídeo. Preguntas frecuentes sobre gris claro, con el título encima
  y dos columnas debajo: solo la pregunta a la vista, sin «+» y sin signos
  de interrogación (titulares con las palabras que se buscan). Y
  tres columnas fijas con «Leer más»: qué es la WCAG, políticas europeas y
  glosario. Excepción declarada a los heros de pantalla entera: aquí abre el
  vídeo. El carrusel no avanza solo; cada punto tiene su dirección
  (`#punto-2-4-9`) para los Reels, y un aviso `aria-live` dice qué vídeo
  entra. Sin JS, todos los vídeos y pautas a la vista. Los 23 puntos están en
  `src/data/guia-puntos.ts` (título, frase y referencia literales del vídeo
  de cada idioma). Vídeos en `public/video/guia/{web,movil}/{es,ca,en}/` y
  pósters en `arte/guia/…`: 16:9 desde 768 y 4:5 por debajo
  (`VideoPausable movilPropio`), cada idioma con su vídeo. Un punto nuevo es
  una entrada con `id` fijo y su texto en los tres idiomas; probar con uno,
  con tres y con cinco (§2.8). Las fechas de la EN 301 549 v4.1.1 de «Políticas
  europeas» se revisan cuando el Diario Oficial la cite. Preguntas frecuentes
  (15, sobre la ley española, catalana y europea, pensadas para buscadores) en `src/data/preguntas.ts`:
  la primera frase contesta de entrada y el resto va al desplegar;
  fechadas y con aviso de que no son asesoramiento jurídico. Si cambia una
  norma, se cambia ahí. `GuiaCierre.astro` enlaza la guía antes del cierre
  de contacto en todas las páginas menos en la suya, sin fondo, con la
  carita del vídeo: hace el gesto de “Es accesible” dos veces, una cada
  2,5 s (5 s en total, sin botón: 2.2.2), al entrar en pantalla y una sola
  vez; sin JS y con «reducir movimiento», feliz y quieta. Es la única página
  con imagen para compartir (`imagen` de `Base`).

- **Tres idiomas (05/11/2026).** Castellano sin prefijo, catalán en `/ca/` e
  inglés británico en `/en/`, con los segmentos de `src/i18n/config.ts`.
  Traducción nativa, no literal, con el glosario de `src/i18n/GLOSARIO.md`.
  · Cada página vive en `src/paginas/` (misma profundidad que `src/pages/`,
    así los imports relativos no cambian) y `src/pages/`, `src/pages/ca/` y
    `src/pages/en/` solo tienen la ruta que la pinta. El idioma lo saca
    `idiomaDe(Astro.url)`: ningún componente necesita que se lo pasen.
  · Los textos de cada página, en un diccionario `{ es, ca, en }` en la
    propia página. Los de `src/data/*` y los Markdown de proyectos llevan
    `traducciones: { ca, en }` con la misma forma que el original, y se leen
    con `localizar(dato, lang)`, que mezcla campo a campo y las listas por
    posición. Una página nueva o un texto nuevo entra en los tres idiomas.
  · El blog NO se traduce: solo existe en castellano y no enseña el selector
    de idioma (`alternates()` devuelve lista vacía para `blog`).
  · Las legales traducidas avisan de que prevalece la versión castellana; el
    testimonio traducido dice que es una traducción.
  · Las partículas a final de línea tienen lista por idioma
    (`src/lib/particulas.ts`), y a11y, tipografía, contraste y renglones
    miden también `/ca/` y `/en/` (`scripts/idiomas.mjs`).

- **«Sobre la mesa» solo sale en la Home en castellano** (Johnny,
  06/11/2026): las notas de Mastodon no se traducen. En `/ca/` y `/en/` no
  se pinta.
- **«Sobre la mesa» no pide nada en el build.** El contenido lo congela
  `npm run mesa` en `src/data/mesa.json` y las imágenes las baja a
  `src/assets/mesa/`. Excepción consciente a la regla de que `src/assets/`
  solo lo escribe `npm run arte`: esa carpeta la gobierna `npm run mesa`, que
  además borra lo que ya no sale. Dos motivos: un build no debe caerse porque
  Mastodon esté caído, y la sección tiene que acabar en `dist/` para que la
  midan geometria, a11y y teclado como a todo lo demás. Una sección inyectada
  en vivo por el Worker sería la única de la página que nadie comprueba.
- **Las imágenes de Mastodon se descargan, no se enlazan.** Enlazarlas haría
  que el navegador de cada visitante llamase a `files.mastodon.social` solo
  por abrir la portada. En una web sin banner de cookies ni analítica de
  terceros, eso sería incoherente.
- **Un post con imagen sin `description` no se publica.** El campo es
  *nullable* en la API. El filtro detecta AUSENCIA, no mediocridad: que la
  alternativa sea buena sigue siendo trabajo humano, al publicar.

- **Blog (11/10/2026).** Los artículos son Markdown en `src/content/blog/`,
  migrados de WordPress con el mismo slug. Solo en castellano, también con
  la web en tres idiomas (Johnny, 05/11/2026). Sin
  negritas (un peso). `urlAntigua` obliga a una 301 en `public/_redirects`, y
  `npm run redirecciones` comprueba que existe y que cada destino es una
  página de verdad. Los filtros del listado son páginas
  (`/blog/categoria/<nombre>/`), no un script.
- **Proyectos (11/10/2026).** `/proyectos/` enseña solo los casos con
  `casoPublicado: true` (una tarjeta hacia una página que no existe no se
  pinta) y solo trabajo para clientes: los productos tienen su página. El
  caso vive en el bloque `caso` del Markdown del proyecto y se pinta con
  `src/pages/proyectos/[slug].astro`. La banda del hero lleva el color del
  proyecto, no el menta: la identidad la pone el proyecto. Las fotos del caso
  van en `arte/proyectos/<slug>/`.
- **Las demostraciones del blog se marcan, no se esconden.** Lo que un
  artículo pinta a propósito a otro tamaño o en otro gris lleva
  `data-ejemplo`: `tipografia` no lo mide. Lo que además incumple el
  contraste a propósito lleva `data-ejemplo="no-cumple"` y `aria-hidden`, con
  su texto repetido al lado en Ink: `contraste` y axe lo saltan, y solo eso.
- **Texto dentro de imágenes en el blog: deuda heredada.** Muchas imágenes de
  los artículos de WordPress son infografías con texto. Incumplen la regla de
  §1; su alternativa transcribe lo que dicen. Las capturas de tablas ya se
  pasaron a tablas de verdad; las infografías se irán rehaciendo en HTML.
  Ninguna imagen nueva entra con texto.

## 7. Flujo de trabajo

- **Claude Code construye, Codex revisa.** Dos modelos distintos, uno
  escribiendo y otro buscando fallos, porque los sesgos no coinciden: el que
  escribió el ARIA de más no lo ve, el otro sí. En este proyecto la revisión
  vale más que la escritura.
- **Johnny es el revisor final.** Siempre.
- Una rama por cambio, PR siempre, nunca commits directos a `main`.
- El CI (`axe-core` + Lighthouse CI) rompe el build ante regresiones. Cubre
  también los componentes de demo de los casos, no solo las páginas.
- Si algo de este archivo deja de ser cierto, se cambia **aquí** en el mismo PR
  que lo cambia en el código.

## 8. Comandos

```
npm run dev          # servidor local
npm run build        # build de producción. Las reglas del punto 6 viven en el
                     # esquema de contenido, así que rompen AQUÍ: no hace falta
                     # un lint aparte y no puede saltárselo nadie.
npm run check        # tipos y plantillas Astro
npm run tipografia   # mide el tamaño y el interlineado QUE PINTA EL NAVEGADOR
                     # contra los estilos del Figma en 390, 768 y 1440
npm run a11y         # axe-core + objetivos de 44 px + reflow a 320 px
npm run teclado      # el recorrido de teclado del menú y del carrusel, de verdad
npm run contraste    # contraste medido POR PÍXEL, no leído del CSS
npm run aparicion    # aparición al hacer scroll y «Leer más»: sin JS, normal y reducido
npm run movimiento   # 2.2.2: el bucle del emblema de Estudio (excepción declarada) se para con «reducir movimiento» y la Declaración lo nombra; el titular en golpes, entero y quieto en 2 s; la entrada de las tarjetas de los listados
npm run verificar    # los cuatro anteriores, que es lo que corre el CI
npm run arte         # compila arte/ en src/assets/: limpia los SVG, copia el
                     # resto y comprueba tamaños
npm run geometria    # mide los ANCHOS del render contra los del Figma
npm run capturas     # capturas de los tres breakpoints para revisar a ojo
npm run redirecciones # public/_redirects: destinos que existen y una 301 por artículo
```

`a11y`, `tipografia` y `contraste` recorren la Home, **Contacto** (en reposo
y con los errores abiertos), **Estudio**, las legales y el **Blog** (listado,
una categoría y los artículos con demostraciones, tablas e imágenes).
`contraste` mide con la ventana ya del alto de la página entera: si no, lo que
se mueve entre medir y capturar da falsos fallos (pasó en los artículos
largos). Cada página nueva se añade a las
tres.

**Páginas interiores (10/10/2026).** El hero en menta con ilustración vive en
`HeroPagina.astro` y la fila «nombre del bloque | contenido» en `Bloque.astro`.
Contacto y Estudio los usan, y las legales también; las páginas que vengan
(Proyectos…), igual, para que la geometría esté en un solo sitio (§6).
**Todos los heros, los mismos márgenes (Johnny, 13/10/2026):** pantalla
entera (100svh/100lvh, como la Home) y el texto abajo a 24 del borde; la
ilustración, si la hay, centrada en lo que sobra. Sin excepciones por página:
`npm run geometria` lo mide en todas las que usan `HeroPagina`. Un titular
puede entrar en golpes (`golpes`, Estudio): el `<h1>` va entero en el HTML,
sin JS no se anima y `npm run movimiento` comprueba las dos cosas.
**Excepción declarada a 2.2.2 (Johnny, 13/10/2026):** el emblema animado del
hero de Estudio chispea en bucle y sin botón de pausa, por decisión de diseño.
Es la ÚNICA: cualquier otro movimiento que dure más de 5 s lleva control. La
Declaración de accesibilidad lo nombra como incumplimiento conocido, y con
«reducir movimiento» se para. Quitar el bucle obliga a quitarlo de la
Declaración, y al revés; `npm run movimiento` vigila las dos cosas.

**Casos: testimonio y esquema (30/10/2026).** El testimonio va en
`Testimonio.astro`: banda en el color del proyecto y la cita en display, la
única excepción a «un solo texto grande». Un testimonio que no ha llegado se
marca `borrador` y solo se ve en `npm run dev`: un testimonio inventado no se
publica. El esquema del sistema modular de ECI va en bucle con su botón de
pausa (2.2.2) y en escritorio ocupa la columna central de tres;
`npm run movimiento` lo comprueba. Los vídeos sobre blanco llevan una sombra
leve. Las capturas de la Home tienen versión de móvil (`<archivo>-movil`,
588 × 1280) en ECI e Izaskun, pero desde el 03/11/2026 no se sirven: en
móvil van las mismas capturas y vídeos que en tableta, en toda la web
(Johnny). `ProjectSlider` y `VideoPausable` lo resuelven en un sitio.

**Caso Elogio de la línea (30/10/2026).** Maqueta propia, replanteada con
la estructura de ECI e Izaskun y los textos del Figma. Título «Elogio de la
línea», con la ele minúscula. Sin nota ni enlace a declaración: la de
elogiodelalinea.com no está publicada. El testimonio de Pau va de
`borrador`.
Revisión 2 (03/11/2026): un caso «muy blanco» (página y banda en blanco); el
hero es el fragmento de 5 s de la película en que la línea escribe el
nombre, una sola vez y sin botón (`npm run movimiento` mide el archivo);
ficha con «Estándar: WCAG 2.2 nivel AA» como los demás; apartado
«Accesibilidad» con los criterios; la serie de porcelana sustituye a la
silla. **El testimonio de Pau sigue en `borrador`: Johnny pidió uno
ficticio y no se publica** (un testimonio inventado se lee como real).

**Casos de productos (04/11/2026).** Mismo tono y misma maqueta que los
casos de clientes (Johnny). El primero, `/proyectos/a11y-primero/`: sin foto
de ambiente, el hero va en el color del producto con el panel dibujado; sin
«Web» ni declaración mientras la extensión esté en revisión. Un producto con
caso lleva `caso` en `src/data/productos.ts`, y `CierreProyecto` lo pone en
el recorrido «Ver …» detrás de los casos de clientes; después del último,
«Ver todos los casos de estudio». Sin «Avísame cuando esté disponible».
Las capturas de los productos se hacen sobre ESTA web («metaweb», Johnny,
04/11/2026), no sobre la de un cliente: A11y Primero evaluándola e Itza
instalado en ella, con respuestas de ejemplo y sin llamar al servicio real.
Cada caso lo dice en «El proyecto». Itza: `/proyectos/itza/`.
Accesible Abstracts (`/proyectos/accesible-abstracts/`): el formulario de
envío es el de ECI en producción (público y vacío); revisores y comité, la
aplicación en local con datos de prueba. Las pantallas de producción llevan
datos reales de autores y revisores y no se publican.

**Testimonios reales (03/11/2026).** Sin formato especial: en ECI, un bloque
más («Desde el otro lado», título a la izquierda y texto a la derecha) sobre
gris claro; en Izaskun, foto y texto en dos columnas sobre el carmesí, con
`data-campo-color` para que `tipografia` acepte el Silk de la paleta. Las
citas van literales: no se corrigen sin permiso de quien las firma.
`Testimonio.astro` queda solo para los borradores.

**Caso Izaskun (30/10/2026).** Maqueta propia, con la estructura de ECI y
los textos del Figma. La retícula editorial (`ReticulaEditorial.astro`) es
CSS en bucle con botón de pausa; la pausa va por la variable
`--reproduccion`, que leen todas sus reglas de animación (una regla de
pausa aparte perdía por especificidad). `npm run movimiento` lo comprueba.

**Hero de la Home en móvil (03/11/2026).** Por debajo de 768 no hay
carrusel ni slider: se ve una sola ilustración, elegida al azar en cada
carga entre las ocho, sin la frase del decálogo. Nada se mueve, así que no
hay botón de pausa. Sin JS, la flor. Las demás láminas siguen en el árbol de
accesibilidad. Sustituye al slider del 30/10/2026. `npm run geometria` la
mide a 390 y `npm run movimiento` comprueba que no cambia mientras se mira y
que sí cambia entre cargas.

**Bloque Estudio de la Home (03/11/2026).** Centrado: es la excepción a los
H2 y párrafos a la izquierda del 30/10/2026.

**Servicios (30/10/2026).** `/servicios/`, con HeroPagina y Bloque como
Estudio; el contenido vive en `src/data/servicios.ts`. La banda del hero
cambia de color cada 3 s (`fondos`): menta, rosa y amarillo. Dura más de 5 s,
así que lleva botón de pausa; con «reducir movimiento» y sin JS no cambia y
el botón no se pinta. `npm run movimiento` lo comprueba y `npm run contraste`
mide la página en los tres colores. No hay frame en el Figma todavía: la
página nace del código (Johnny, 30/10/2026).

**Servicios, revisión 2 (03/11/2026).** Decisiones de Johnny sin frame de
Figma (la página nace del código), con las microanimaciones del caso ECI como
referencia:
- La banda del hero da **una sola vuelta** a los tres colores en 5 s y
  vuelve al menta (`fondosUnaVez`). Sin botón de pausa: no se mueve más de
  5 s (2.2.2). El planeta va al ancho de la flor de la Home
  (`ilustracionComoHome`).
- Cada servicio es un **desplegable** (`Bloque desplegable`; Diseño y
  desarrollo carga `abierto`) y las tarifas van **dentro de la auditoría**,
  una por desplegable (`Plegable.astro`, `nivel={4}`), sin el nombre de la
  tarifa. Script en `src/scripts/plegable.ts`: encabezado con un
  `<button aria-expanded>` dentro y panel con `hidden`. Sin JS, abiertos.
  Filetes, los mínimos: solo entre servicios.
- **Microanimaciones** (`Microanimacion.astro`): una por punto, líneas de
  1,5 px en Ink y un detalle en el color del servicio (diseño rosa,
  auditoría amarillo, formación verde claro). `aria-hidden`, una sola vez
  al verse y menos de 3 s, así que sin botón. Con «reducir movimiento» y
  sin JS, el último fotograma quieto. `npm run movimiento` lo comprueba y
  `npm run contraste` mide con todo abierto.

**Páginas legales (11/10/2026).** Privacidad, Cookies y Declaración de
accesibilidad salen de `src/data/legal.ts` con la plantilla
`PaginaLegal.astro`. Ese archivo es también la fuente del texto del Figma:
si cambia uno, cambia el otro. Los enlaces van en su propia línea, nunca
dentro de un párrafo (44 px). No son asesoramiento jurídico: los revisa
alguien con formación en protección de datos antes de publicar en la URL
final. La declaración dice «parcialmente conforme» hasta que Johnny haga la
revisión manual; al hacerla se actualizan fecha, conformidad, limitaciones,
método y compatibilidad.

**SEO sin tocar lo que se ve (07/11/2026).** Todo en el `<head>` o fuera
de la página:
- `hreflang` en el `<head>` de cada página con sus versiones en los tres
  idiomas y `x-default` en castellano. Salen de `alternates()`, lo mismo que
  el selector de idioma, así que una página con versiones necesita su `slug`
  en `Base` (los casos lo pasan; antes el selector de un caso llevaba al
  listado de Proyectos del otro idioma). El blog no lleva ninguno.
- Datos estructurados (`datos` de `Base`, `src/data/datos-estructurados.ts`):
  `ProfessionalService` en la portada y `SoftwareApplication` en los casos de
  Itza, A11y Primero y Accesible Abstracts. Solo datos que la web ya enseña.
  La guía lleva su `FAQPage`.
- «Idioma» es un `<p>`, no un `<h2>`: no es una sección del contenido.
- `npm run build` genera `sitemap.xml` (con las versiones de idioma) y
  `robots.txt` desde `dist/` (`scripts/sitemap.mjs`). La base sale de
  `src/data/sitio.ts`: el día del cambio a `final` nombran el .com solos.
  `robots.txt` no bloquea nada nunca: un bloqueo impediría ver el noindex.

**La web de pruebas no se indexa (11/10/2026).** `public/_headers` pone
`X-Robots-Tag: noindex` solo en los hosts `*.workers.dev`, y `worker/index.ts`
hace lo mismo con lo que responde el Worker. El dominio final no la recibe.
Se comprueba en `npm run formulario` (el Worker); la regla de `_headers` solo
la aplica Cloudflare, así que se verifica tras publicar con
`curl -sI https://accesibilidadprimero.proyectos-44e.workers.dev/ | grep -i robots`.

**Analítica (Johnny, 11/10/2026): Cloudflare Web Analytics y nada más.** Sin
cookies, sin almacenamiento local y sin huella, así que sin banner. Se
descartaron Google Analytics y los mapas de calor: los dos exigen
consentimiento previo y un banner de cookies. El token va en
`src/data/analitica.ts`; vacío, no se carga nada. Privacidad y Cookies ya lo
nombran: o se pone el token o se quitan esas frases antes de publicar en la
URL final. **Cualquier herramienta que guarde algo en el navegador o
identifique a quien visita obliga a reescribir Privacidad y Cookies y a
poner un banner. No se añade sin hablarlo.**

`npm run formulario` prueba el Worker (`worker/index.ts`) y el formulario de
Contacto con Brevo y Turnstile SIMULADOS: no envía correos. Necesita Node 22.6
o posterior (importa el Worker en TypeScript). Avisa mientras la clave de sitio
de Turnstile sea la de prueba.

## 10. Formulario de contacto (10/10/2026)

- Va a `/api/contacto`, en el Worker: comprueba los campos, canjea la ficha de
  **Turnstile invisible** (acción `contacto`, solo nuestros dominios) y manda
  el correo con **Brevo** a proyectos@, con «Responder a» en quien escribe.
  Falla cerrado: sin un secreto, 503 y no envía nada.
- **Los secretos no entran nunca en el repositorio.** `BREVO_API_KEY` y
  `TURNSTILE_SECRET` viven en el panel de Cloudflare. La clave de SITIO de
  Turnstile es pública y está en `src/data/contacto.ts`.
- Sin JS el formulario no se pinta (§5): Turnstile necesita JS. Queda el
  correo de «Directamente» y un aviso en `<noscript>`.
- El script de Turnstile se carga al tocar el formulario, no al abrir la
  página. Es la única llamada a un tercero de la web y hay que nombrarla en
  la política de privacidad.
- Un error se QUITA mientras se escribe y se PONE al salir del campo. Al
  revés, el renglón que desaparece desplaza lo de debajo justo cuando se está
  pulsando lo siguiente, y el clic cae en otro sitio (pasó con la casilla).

`npm run contraste` existe porque un medidor que lee el `background-color` de
un ancestro «falla en las dos direcciones: marca fallos que no existen y se
traga los que sí». Renderiza, captura, vuelve a capturar con el texto en
transparente y muestrea el fondo real debajo de cada caja.

## 9. Lo que NO está decidido

No cerrarlo por iniciativa propia. Preguntar.

- Si la web enseña todos los casos o una selección.
- Las fases de las landings de producto.
- Si el menú de escritorio crece más allá de cinco destinos.
