---
titulo: "Autopsia de una web no accesible: 5 errores de código que suspenden una auditoría"
tituloSeo: "5 errores de HTML y ARIA que suspenden una auditoría de accesibilidad"
descripcion: "Los cinco errores de código que más encontramos al auditar webs con la UNE-EN 301549 y las WCAG, por qué fallan y cómo se escriben bien."
fecha: 2026-11-07
categorias: [auditoria-wcag]
imagen: ../../assets/blog/autopsia-web-no-accesible-5-errores-de-codigo.png
imagenAlt: "Dos personas diminutas cargan con un lápiz rosa enorme, sobre fondo amarillo."
clave: autopsia-errores-codigo
tipoSchema: TechArticle
autor: johnny
cta:
  titulo: "Una auditoría con estos cinco puntos y el resto"
  texto: "Revisamos tu web con las WCAG 2.2, a mano y con lectores de pantalla, y te damos un plan para corregir cada barrera."
  enlace: "Ver la auditoría"
  destino: servicios
  ancla: "#auditoria"
preguntas:
  - pregunta: "Qué es la primera regla de ARIA"
    respuesta: "Si existe un elemento HTML nativo que ya hace lo que necesitas, úsalo en lugar de añadir ARIA a otro elemento. Lo recoge la guía Using ARIA del W3C."
  - pregunta: "Un placeholder sirve como etiqueta de un campo"
    respuesta: "No. Desaparece al escribir, suele tener poco contraste y no todos los lectores de pantalla lo anuncian como nombre del campo. Cada campo necesita una etiqueta visible asociada con label."
  - pregunta: "Qué contraste necesita el texto sobre una imagen"
    respuesta: "El mismo que cualquier texto: 4,5:1 para texto normal y 3:1 para texto grande (WCAG 1.4.3). Se mide en la zona más desfavorable de la imagen. Lo más seguro es poner el texto sobre un fondo sólido o un velo."
---

Una web no suele suspender una auditoría de accesibilidad por cómo se ve, sino por cómo está escrita. Casi siempre fallan las mismas cosas: elementos que parecen controles y no lo son, ARIA mal puesto, campos sin nombre y un foco que se pierde. Estos son los cinco errores que más encontramos y cómo se escriben bien.

## Por qué falla técnicamente una web

Un lector de pantalla no ve la página. Lee lo que el navegador le cuenta de ella: qué es cada cosa, cómo se llama y en qué estado está. Esa información sale del HTML. Si el código dice “caja” donde debería decir “botón”, la persona que lo usa recibe una caja.

La UNE-EN 301549 remite a las WCAG 2.1 nivel AA para la web. Los cinco errores de este artículo incumplen criterios de ese nivel.

<figure class="esquema esquema--comparar">
<ul>
<li><p>Lo que encontramos</p><ul><li>Un <code>&lt;div&gt;</code> con un evento de clic</li><li>Una ventana modal que deja escapar el foco</li><li><code>aria-hidden</code> en un enlace</li><li>Un campo con solo <code>placeholder</code></li><li>Texto blanco sobre una foto</li></ul></li>
<li class="esquema__bien"><p>Lo que escribimos</p><ul><li><code>&lt;button type="button"&gt;</code></li><li><code>&lt;dialog&gt;</code> abierto con <code>showModal()</code></li><li>El enlace, visible para todos o para nadie</li><li><code>&lt;label for&gt;</code> visible</li><li>El texto sobre un fondo sólido</li></ul></li>
</ul>
<figcaption>Los cinco errores, a la izquierda, y cómo los resolvemos, a la derecha, en el mismo orden.</figcaption>
</figure>

## Los cinco errores

### 1. Un div que hace de botón

Lo que encontramos: un&nbsp;`<div>` o un&nbsp;`<span>` con un evento de clic. Con ratón funciona. Con teclado no se puede alcanzar, y el lector de pantalla no dice que sea un botón.

Incumple los criterios 2.1.1 (Teclado) y 4.1.2 (Nombre, función, valor).

Cómo se escribe: `<button type="button">`. Se alcanza con Tab, se activa con Intro y con la barra espaciadora, y el lector anuncia que es un botón. Todo eso viene de serie, sin una línea de JavaScript más.

### 2. Una ventana modal que deja escapar el foco

Lo que encontramos: se abre una ventana y el foco se queda en la página de detrás. Con Tab, la persona sigue recorriendo enlaces que no ve. Al cerrar la ventana, el foco no vuelve a ningún sitio.

Incumple el criterio 2.4.3 (Orden del foco). Lo contrario, una ventana de la que no se puede salir con teclado, es una trampa de teclado e incumple el 2.1.2.

Cómo se escribe: con&nbsp;`<dialog>` y&nbsp;`showModal()`. El navegador lleva el foco a la ventana, deja inerte el resto de la página y la cierra con Escape. Comprueba siempre que, al cerrarla, el foco vuelva al botón que la abrió.

### 3. ARIA que sobra o que estorba

Lo que encontramos: `role="navigation"` en un&nbsp;`<nav>`, que repite lo que el elemento ya dice. No rompe nada, pero es ruido. Lo grave es otra cosa: `aria-hidden="true"` en un enlace o un botón. El teclado llega a él y el lector de pantalla no lo anuncia.

Incumple el criterio 4.1.2 (Nombre, función, valor).

Cómo se escribe: con la primera regla de ARIA. Si existe un elemento HTML que ya hace lo que necesitas, se usa ese elemento. Y lo que se oculta al lector de pantalla se oculta también al teclado.

### 4. Campos sin etiqueta

Lo que encontramos: un campo con el texto de ayuda dentro, en el&nbsp;`placeholder`, y sin etiqueta. Al empezar a escribir, el texto desaparece. Suele tener poco contraste y no todos los lectores de pantalla lo anuncian como nombre.

Incumple los criterios 1.3.1 (Información y relaciones) y 3.3.2 (Etiquetas o instrucciones).

Cómo se escribe: cada campo con su `<label for="…">` visible, encima del campo, y el&nbsp;`placeholder` solo para un ejemplo, si hace falta.

### 5. Texto sobre una imagen sin contraste

Lo que encontramos: un titular blanco sobre una foto. En una parte de la foto se lee y en otra no. En móvil, con otro recorte, se lee peor.

Incumple el criterio 1.4.3 (Contraste mínimo): 4,5:1 para texto normal y 3:1 para texto grande.

Cómo se escribe: el texto sobre un fondo sólido o un velo que asegure el contraste en el peor punto de la imagen, en todos los tamaños de pantalla. O el texto fuera de la imagen.

## Cómo lo evitamos en nuestras webs

Lo hablamos en el diseño, antes de escribir código: qué es cada control, cómo se llega a él con teclado y qué contraste tiene. Después, cada cambio pasa comprobaciones automáticas de contraste, reflow y navegación antes de publicarse. Y lo que una máquina no ve lo revisamos con teclado y con lector de pantalla.

Si tu equipo desarrolla la web y quiere saber dónde está, la auditoría es el primer paso.
