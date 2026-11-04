# Las imágenes de la web · dónde van y cómo se llaman

**Todo se deja en `arte/`. Después, un comando:**

```
npm run arte
```

Lee `arte/` entero, limpia los SVG, copia el resto y escribe el resultado en
`src/assets/`, que es de donde tira la web. `arte/` es tuyo y no lo toca nadie:
si hay que reeditar algo dentro de un año, el original está ahí intacto.
`src/assets/` lo genera el comando; no lo edites a mano.

El comando además **avisa** si una imagen viene pequeña o con la proporción
cambiada, y **falla** si un SVG trae texto sin convertir a trazados, un mapa de
bits incrustado o le falta el `viewBox`. Son los tres fallos que no se ven
hasta tener la web publicada.

---

## Son 20 imágenes

| | Cuántas | Formato |
|---|---|---|
| Carrusel del hero | 7 | SVG |
| Pantallas de los proyectos | 9 | PNG |
| Campos de los productos | 3 | PNG |
| Icono de Estudio | 1 | SVG |
| **Total** | **20** | |

---

## 1 · Carrusel del hero · `arte/hero/` · 7 SVG

El orden es el del carrusel. El nombre del archivo importa: el código los busca
por nombre, y si falta uno el build se para y te dice cuál.

| # | Archivo | Frase que le toca |
|---|---|---|
| 1 | `globos-vibrante.svg` | Estimen les diferències. |
| 2 | `telescopio-comunicacion.svg` | La forma en la que comunicamos construye realidades. |
| 3 | `construccion-narrativa-amarillo.svg` | Construimos narrativas que ayuden a romper estereotipos. |
| 4 | `regadera-diversidad.svg` | La comunicación debe representar, respetar y dar espacio a la diversidad. |
| 5 | `arbol-semantica.svg` | Hacia el diseño universal y la tecnología semántica. |
| 6 | `regadera-proposito.svg` (hoy `06-proposito.svg`) | Proyectos con propósito. Es la regadera, no el lápiz: el lápiz es la ilustración de Contacto (ver §4). |
| 7 | `accesibilidad-primero-siempre.svg` | Accesibilidad primero. Siempre. |

**Estado a 07/10/2026:** están las 7 menos `regadera-diversidad.svg`, que me
llegó pegada como texto y no como archivo. Y la 7 llegó incompleta: solo trae
una banda curva y la marca CC, seis trazados en total. Las dos hay que
rehacerlas.

Lienzo: **693 × 400**, el mismo para las siete. Texto convertido a trazados.
Sin mapas de bits dentro. Cuidado con desenfoques y modos de fusión: salen como
filtros SVG y cada navegador los pinta distinto.

## 2 · Pantallas de los proyectos · `arte/proyectos/` · 9 PNG

Tres pantallas por proyecto. **Exportar al doble**, que es la columna de la
derecha: Astro reduce pero nunca amplía, así que un export a 1x se ve blando en
cualquier portátil de los últimos diez años.

| Archivos | En pantalla | Exportar a |
|---|---|---|
| `eci-1.png` · `eci-2.png` · `eci-3.png` | 904 × 568 | **1808 × 1136** |
| `foc-1.png` · `foc-2.png` · `foc-3.png` | 400 × 564 | **800 × 1128** |
| `izaskun-1.png` · `izaskun-2.png` · `izaskun-3.png` | 656 × 412 | **1312 × 824** |
| `<proyecto>-<n>-movil.png` (las nueve, opcionales) | 294 × 640 | **588 × 1280** |

**Verticales de móvil.** Por debajo de 768 la web sirve `eci-1-movil.png` en
lugar de `eci-1.png`, y así con las nueve, con el mismo `alt`. Van las tres de
un proyecto o ninguna: si falta una, ese proyecto sigue con las de escritorio.

**Cada una necesita una frase de alternativa textual.** Son capturas de la web
de un cliente y cuentan algo: no son decorativas. Una frase por imagen, que
diga qué se ve en esa pantalla concreta —«Portada de ECI con el programa
filtrado por día», no «captura de la web»—. Son nueve frases. Si prefieres, las
escribo yo y te las paso para que las apruebes antes de montarlas.

## 3 · Campos de los productos · `arte/productos/` · 3 PNG

| Archivo | En pantalla | Exportar a |
|---|---|---|
| `itza.png` | 432 × 444 | **864 × 888** |
| `a11y-primero.png` | 546 × 561 | **1092 × 1122** |
| `accessible-abstracts.png` | 318 × 327 | **636 × 654** |

El de Itza en el Figma es una animación de menos de 5 segundos. Si acaba siendo
vídeo: `.mp4` y `.webm`, sin sonido, y un fotograma fijo para quien tenga
activado `prefers-reduced-motion`.

## 4 · Icono de Estudio · `arte/estudio/` · 1 SVG

`icono.svg` — **entregado el 08/10/2026.** Es el símbolo de la marca: la curva
y la trama de píxeles que se disuelve, con el sello CC arriba a la derecha.

El archivo trae su lienzo entero, **338,4 × 299,43**, que no es cuadrado. El
marco del Figma (`2080:531`) sí mide 60 × 60, pero es caja: medido sobre el
documento, dentro de ese marco el dibujo ocupa **50,25 × 44,5** y está centrado
—4,75 de aire a la izquierda, 5 a la derecha, 7,75 arriba y abajo—. Así está
montado y así lo comprueba `npm run geometria`.

Decorativo: lo que dice la sección está escrito justo debajo, así que lleva
`alt=""` y nada más. Un `alt` que repitiera la frase se la haría oír dos veces
a quien usa lector de pantalla.

**Sin animación, por decisión de Johnny (08/10/2026).** Hubo una versión con la
trama chispeando y se descartó para este sitio: a 50 px cada cuadrado mide
poco más de un píxel y el parpadeo no se lee. Si el símbolo animado vuelve en
algún sitio grande, tres cosas que están medidas y hay que respetar:

1. **Incrustado en línea, nunca con `<img src>`.** Un SVG cargado como imagen
   **ignora `prefers-reduced-motion`**: la media query de dentro del archivo no
   se aplica. Comprobado con el navegador.
2. **Este pipeline se la carga.** SVGO convierte los `<rect>` en `<path>`, con
   lo que un selector `#pixel-field > rect` deja de encontrar nada, y además
   borra las declaraciones `animation`, el bloque de `prefers-reduced-motion` y
   los `id`. Sale una imagen fija y **se ve bien**, así que no se nota.
3. **Que no sea infinita.** Algo que parpadea, arranca solo y dura más de cinco
   segundos necesita un mecanismo de pausa (WCAG 2.2.2). Una pasada de tres o
   cuatro segundos al cargar, o al pasar el cursor, evita el problema entero.

---

## Qué formato usar

- Capturas de pantalla e ilustraciones planas → **PNG**
- Fotografía → **JPG**
- Dibujo vectorial, logotipos, iconos → **SVG**
- **Nunca WebP ni AVIF de origen.** Esos los genera Astro en el build. Mandar
  algo ya comprimido solo añade artefactos: se recomprime igual.

## 4 · Ilustraciones de página · `arte/contacto/` y `arte/estudio/`

Una por página, en el hero en menta, como la flor de la Home. Mismo formato
que las del carrusel: SVG con `viewBox`, texto trazado, sin mapas de bits ni
filtros.

| Archivo | Página | Lienzo |
|---|---|---|
| `contacto/lapiz.svg` | Contacto: dos personas empujan un lápiz enorme. | 475,66 × 400 |
| `estudio/casa.svg` | Estudio: una persona ante una casa enorme a medio dibujar. | 475,66 × 400 |
| `estudio/johnny-vigas.jpg` | Estudio, bloque Equipo. Retrato recortado a la proporción del hueco (178 × 206) desde el original cuadrado de 1024; 885 × 1024, sin metadatos. | 885 × 1024 |

Al pasar por el puente de Claude estos SVG reciben un bloque C2PA; se limpian
y se comprueba el md5 contra el original (AGENTS.md §2, punto 7).


---

## Caso A11y Primero · `arte/proyectos/a11y-primero/` · 4 imágenes (04/11/2026)

| Archivo | Qué es | Origen |
|---|---|---|
| `hero.jpg` | La extensión abierta sobre offvalencia.com, pestaña Resumen (1600 × 1000) | Capturada de la extensión v2.0.0 a @2x |
| `panel-wcag.png` | El panel solo, pestaña WCAG (600 × 1200, @2x de 300) | Ídem |
| `wcag.jpg` · `ver-como.jpg` | Fallos marcados en la página y simulación de baja visión (2560 × 1600) | Ídem |

