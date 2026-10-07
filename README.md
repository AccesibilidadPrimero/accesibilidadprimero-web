# accesibilidadprimero.com · v2.0

Astro + Cloudflare Workers. Sin CMS, sin framework de UI, sin dependencias de
cliente.

**Las reglas del repositorio están en [`AGENTS.md`](./AGENTS.md).** Se leen
antes de tocar nada, y las lee también cualquier agente que trabaje aquí.

## Por qué este stack

No es rendimiento ni moda: es que con un theme se hereda markup que no se
escribió y que no se puede arreglar del todo. **Un estudio que vende
accesibilidad no puede tener eso debajo de su propia web.** Todo lo demás se
deriva de ahí.

## Arrancar

```
npm install
npm run dev
```

## Verificar antes de abrir un PR

```
npm run verificar
```

Corre el build (que incluye las reglas de contenido), axe-core en tres
breakpoints, los objetivos de 44 px, el reflow a 320 px, el recorrido de
teclado del menú y del carrusel, y el contraste medido por píxel.

> Esto **no es una auditoría**. Los tests automáticos cogen alrededor de un
> tercio de los problemas WCAG. Es un guardarraíl contra regresiones tontas.
> La pasada de teclado y de lector de pantalla la hace Johnny.

## Mapa

```
src/
  content.config.ts        Esquemas. Las reglas de contenido rompen el build aquí.
  content/proyectos/       Un markdown por proyecto. La identidad visual la
                           declara el proyecto, no la Home.
  i18n/config.ts           Mapa de rutas e idiomas. Nadie escribe URLs a mano.
  i18n/ui.ts               Cadenas de interfaz en los tres idiomas.
  styles/tokens.css        Tokens traídos del Figma. Aquí no se inventa nada.
  components/              Carcasa y piezas.
  pages/                   Rutas.
worker/                    Lo único que necesita servidor: el formulario.
scripts/                   Verificación.
```

## Idiomas

El routing de los tres idiomas está montado, pero solo el castellano tiene
contenido: `ACTIVE` en `src/i18n/config.ts`. Mientras haya uno solo, el
selector de idioma **no se pinta** — tres códigos de los que dos llevan a un
404 son peores que no tener selector.

Para activar el catalán: añadirlo a `ACTIVE` y crear sus páginas. No hay que
tocar ningún componente.

## Lo que todavía no está

Ver el final de `AGENTS.md` y `claude/produccion-ap2-estado.md` en el proyecto
de Claude.
