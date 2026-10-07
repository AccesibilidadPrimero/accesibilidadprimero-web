# Dónde va cada imagen

**Todo lo que se vea en pantalla va aquí, en `src/assets/`.** Astro solo
optimiza lo que está dentro de `src/`: lo que se deja en `public/` lo copia tal
cual, sin tocarlo. Por eso `public/` se queda únicamente para las tipografías y
la imagen de compartir, que necesitan una URL fija.

El build genera **AVIF, WebP y el original de respaldo**, con `srcset` y
`sizes`, y el navegador elige. El PNG de 185 KB del girasol sale en 27 KB de
AVIF. No hace falta que comprimas nada antes de enviarlo.

## Qué exportar desde Figma

- **PNG para capturas e ilustraciones planas. JPG para fotografía.** Nada de
  WebP de origen: volver a comprimir algo ya comprimido añade artefactos sin
  ahorrar nada, porque de todos modos se reconvierte en el build.
- **Al doble del tamaño del Figma (@2x).** El tamaño de la tabla es el que
  ocupa en pantalla; Astro reduce pero nunca amplía, así que un export a 1x se
  ve blando en cualquier portátil de los últimos diez años. Las del hero están
  a 1x ahora mismo y conviene volver a exportarlas.
- Nombres exactamente como están en la tabla: el código los busca por nombre.

## Sliders de los proyectos · `proyectos/`

Tres pantallas por proyecto.

| Archivo | En pantalla | Exportar a @2x | Proyecto |
|---|---|---|---|
| `eci-1.png` · `eci-2.png` · `eci-3.png` | 904 × 568 | 1808 × 1136 | ECI Conference |
| `foc-1.png` · `foc-2.png` · `foc-3.png` | 400 × 564 | 800 × 1128 | Foc i Cor |
| `izaskun-1.png` · `izaskun-2.png` · `izaskun-3.png` | 656 × 412 | 1312 × 824 | Izaskun Etxebarria |

**Cada una necesita una alternativa textual escrita.** No son decorativas: son
capturas de la web del cliente y cuentan algo. Una frase por imagen —qué se ve
en esa pantalla concreta—, o dime que las escriba yo y te las propongo antes de
montarlas.

## Campos de color de Productos · `productos/`

| Archivo | En pantalla | Exportar a @2x |
|---|---|---|
| `itza.png` | 432 × 444 | 864 × 888 |
| `a11y-primero.png` | 546 × 561 | 1092 × 1122 |
| `accessible-abstracts.png` | 318 × 327 | 636 × 654 |

El de Itza en el Figma es una animación de menos de 5 segundos. Si acaba
siendo vídeo, que sea `.mp4` y `.webm`, sin sonido, y con un fotograma fijo
para quien tenga activado `prefers-reduced-motion`. El vídeo sí va en
`public/`: Astro no procesa vídeo.

## Hero · `hero/`

`hero-01.png` … `hero-08.png`, 693 × 400 en pantalla (1386 × 800 a @2x).
Decorativas: `alt=""`.

## Icono de Estudio · `estudio/`

`icono.svg`, 60 × 60. Decorativo: lo que dice la sección está escrito debajo.
Los SVG no pasan por el pipeline de imagen —ya son vectores—, pero se quedan
aquí por orden. Mejor sin texto dentro.
