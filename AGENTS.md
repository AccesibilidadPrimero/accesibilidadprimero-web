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
- Sin framework de utilidades. Si una regla sirve para un solo componente, vive
  en el `<style>` de ese componente.
- **El color nunca va solo** (1.4.1). El estado se lleva en el grosor del
  subrayado, en una regla, en el peso. El color acompaña.
- Contraste mínimo 4,5:1 para texto y 3:1 para elementos de interfaz y
  bordes de foco (1.4.3, 1.4.11). Medido, no estimado.
- Objetivos táctiles de **44 px** como mínimo. WCAG 2.5.8 AA pide 24; AP pide
  44 y esa es la regla del repo.
- Todo tiene que funcionar con `forced-colors: active`.
- La página tiene que ser usable al 200 % de zoom y con 400 % de aumento de
  texto sin scroll horizontal (1.4.4, 1.4.10).

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

- `decisiones`: **mínimo 4, máximo 5**. Una sexta no compila. («Un hueco no es
  un problema que resolver: es el resultado.»)
- `cifras`: **exactamente 3**, cada una con su `tipo`, y **no pueden ser las
  tres de accesibilidad**. Es la prueba del algodón del equilibrio
  diseño/accesibilidad, automatizada.
- `autoria` obligatoria en cada decisión de diseño: `propia`, `cliente` o
  `compartida`.
- `destacado: true` en un máximo de **3** casos.
- **Sin `imagenAlt` no compila.** Ninguna imagen entra sin alternativa escrita.
- Titulares **sin antetítulo y sin mayúsculas sostenidas**: regla de lint.
- La paleta que declara cada proyecto se valida en build contra el fondo de la
  Home.

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
npm run a11y         # axe-core + objetivos de 44 px + reflow a 320 px
npm run teclado      # el recorrido de teclado del menú y del carrusel, de verdad
npm run contraste    # contraste medido POR PÍXEL, no leído del CSS
npm run verificar    # los cuatro anteriores, que es lo que corre el CI
npm run capturas     # capturas de los tres breakpoints para revisar a ojo
```

`npm run contraste` existe porque un medidor que lee el `background-color` de
un ancestro «falla en las dos direcciones: marca fallos que no existen y se
traga los que sí». Renderiza, captura, vuelve a capturar con el texto en
transparente y muestrea el fondo real debajo de cada caja.

## 9. Lo que NO está decidido

No cerrarlo por iniciativa propia. Preguntar.

- Qué pasa cuando alguien en la versión inglesa llega a un artículo que solo
  existe en castellano.
- Si la web enseña todos los casos o una selección.
- Las fases de las landings de producto.
- Si el menú de escritorio crece más allá de cinco destinos.
