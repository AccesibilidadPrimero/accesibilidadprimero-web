---
titulo: "Tipografía accesible: tamaños, espaciado y contraste. Lo que dice la WCAG y lo que aplicamos nosotros"
tituloSeo: "Tipografía accesible: lo que recomienda la WCAG"
descripcion: "Este artículo va de lo que viene después de elegir la fuente: dimensionarla bien, darle el espacio que necesita y garantizar que el contraste sea accesible."
fecha: 2026-04-07
categorias: [accesibilidad-digital, diseno]
imagen: ../../assets/blog/tipografia-accesible-lo-que-dice-la-wcag.png
imagenAlt: "Rótulo sobre fondo rosa: «Tamaños tipográficos. Px vs Rem»."
urlAntigua: /tipografia-accesible-lo-que-dice-la-wcag/
---

Este artículo cuenta la tipografía de la versión anterior de esta web, con Atkinson Hyperlegible Next e Instrument Serif. La web actual usa Instrument Sans. Los criterios de la WCAG que explica siguen vigentes.

En el artículo anterior contamos cómo llegamos a elegir «Atkinson Hyperlegible Next» como tipografía funcional de nuestra web, y por qué añadimos «Instrument Serif» para las hero sections. Si no lo has leído, [es un buen punto de partida](/blog/tipografia-accesible-atkinson-hyperlegible/).

Este segundo artículo va de lo que viene después de elegir la fuente: dimensionarla bien, darle el espacio que necesita y garantizar que cumple con los criterios de accesibilidad en contraste. Porque una buena tipografía mal aplicada sigue siendo un problema.

## Tamaños

Antes de hablar de números concretos, hay una pregunta de fondo que conviene responder: ¿en qué unidad defines los tamaños?

Parece un detalle técnico. No lo es.

<figure class="demo" data-demo="px-rem">
<figcaption class="demo__intro">Mueve el control para simular lo que hace una persona con baja visión antes de abrir tu web: subir el tamaño de letra de su navegador.</figcaption>
<div class="demo__control" data-solo-js hidden>
<label for="demo-base">Tamaño de letra del navegador: <output id="demo-base-valor" for="demo-base">16</output> px</label>
<input type="range" id="demo-base" min="12" max="26" step="1" value="16">
</div>
<div class="demo__columnas">
<div class="demo__caja">
<p>Con px: ignora a quien lee</p>
<p class="demo__muestra demo__muestra--px" data-ejemplo>Este texto usa <code>font-size: 16px</code>. Quien lee ha pedido letras más grandes, y este texto no se entera.</p>
<p>Siempre 16 px, pase lo que pase.</p>
</div>
<div class="demo__caja">
<p>Con rem: respeta a quien lee</p>
<p class="demo__muestra demo__muestra--rem" data-ejemplo data-rem>Este texto usa <code>font-size: 1rem</code>. Crece con la preferencia de quien lee.</p>
<p data-rem-nota>Crece con la preferencia de tu navegador.</p>
</div>
</div>
<p>WCAG 1.4.4: el texto tiene que poder ampliarse hasta el 200 % sin perder contenido ni funciones. Usar rem es la forma más directa de cumplirlo.</p>
</figure>

Los píxeles (px) son unidades absolutas.  
Si escribes font-size: 16px, el texto siempre mide 16 píxeles, pase lo que pase. El problema: muchas personas ajustan el tamaño de fuente predeterminado de su navegador, a 18px, 20px o más — porque lo necesitan para leer cómodamente. Si usas píxeles, esa configuración no tiene ningún efecto en tu web. Estás ignorando activamente la preferencia del usuario.

Los rem son relativos al tamaño base del navegador (normalmente 16px por defecto).  
Si el usuario tiene configurado 20px, tu 1rem equivaldrá a 20px automáticamente. Respetas su elección sin hacer nada extra.

| Elemento | px equiv. | Lo que usábamos | Rango recomendado |
|---|---|---|---|
| Cuerpo de texto | 16px | 1rem | 1 – 1.25rem |
| Texto secundario | 14px | 0.875rem | 0.875 – 1rem |
| Encabezado H1 | 32px | 2rem | 2 – 3rem |
| Encabezado H2 | 24px | 1.5rem | 1.5 – 2.25rem |
| Encabezado H3 | 20px | 1.25rem | 1.25 – 1.5rem |
| Botones / etiquetas | 14 – 16px | 0.875 – 1rem | 0.875 – 1.125rem |

Mínimo absoluto: 0.75rem (12px) en cualquier elemento visible. Si está en pantalla, alguien lo necesita leer.

## Tamaño de fuente

<figure class="demo" data-demo="escala">
<figcaption class="demo__intro">La misma información con jerarquía y sin ella. Los ejemplos se pintan a su tamaño real.</figcaption>
<div class="demo__columnas">
<div class="demo__caja">
<p>Con jerarquía</p>
<ul class="demo__lista">
<li><span class="demo__muestra demo__t32" data-ejemplo>Título H1</span> <span class="demo__nota">2rem · equivale a 32 px</span></li>
<li><span class="demo__muestra demo__t24" data-ejemplo>Título H2</span> <span class="demo__nota">1,5rem · equivale a 24 px</span></li>
<li><span class="demo__muestra demo__t20" data-ejemplo>Título H3</span> <span class="demo__nota">1,25rem · equivale a 20 px</span></li>
<li><span class="demo__muestra demo__t16" data-ejemplo>Cuerpo de texto. El ojo sabe dónde está y qué nivel de información está leyendo.</span> <span class="demo__nota">1rem · equivale a 16 px</span></li>
<li><span class="demo__muestra demo__t14" data-ejemplo>Texto secundario: fechas, metadatos, notas al pie.</span> <span class="demo__nota">0,875rem · equivale a 14 px</span></li>
</ul>
</div>
<div class="demo__caja">
<p>Sin jerarquía</p>
<ul class="demo__lista">
<li><span class="demo__muestra demo__t13" data-ejemplo>Título H1 a 13 px</span> <span class="demo__nota">Apenas se distingue del cuerpo.</span></li>
<li><span class="demo__muestra demo__t12" data-ejemplo>Título H2 a 12 px</span> <span class="demo__nota">Ya no hay diferencia visible.</span></li>
<li><span class="demo__muestra demo__t11" data-ejemplo>Título H3 a 11 px</span> <span class="demo__nota">Igual que el cuerpo.</span></li>
<li><span class="demo__muestra demo__t11" data-ejemplo>Cuerpo a 11 px. La jerarquía ha desaparecido. Para alguien con baja visión, este texto directamente no existe.</span> <span class="demo__nota">11 px: por debajo del mínimo.</span></li>
<li><span class="demo__muestra demo__t10" data-ejemplo>Secundario a 10 px.</span> <span class="demo__nota">10 px: nunca.</span></li>
</ul>
</div>
</div>
</figure>

## Interlineado:

### El error que casi nadie ve

Puedes tener la mejor fuente del mundo y el tamaño perfecto, y si el interlineado es insuficiente, el texto sigue siendo difícil de leer.

Lo comprobamos en nuestra propia web durante el proceso de construcción.

Las WCAG 1.4.12 «Espaciado del texto» son claras: el contenido no debe romperse si el usuario aplica estos valores mínimos:

| Propiedad CSS | Valor mínimo WCAG | En em (base 16px) |
|---|---|---|
| line-height | 24px | 1.5em (usamos 1.6) |
| margin-bottom entre párrafos | 32px | 2em |
| letter-spacing | ~2px | 0.12em |
| word-spacing | ~3px | 0.16em |

En nuestra web usamos line-height: 1.6 para el cuerpo de texto. El 1.5 es el mínimo que exige la WCAG; el 1.6 mejora la experiencia especialmente para personas con dislexia.

## Contraste:

### El criterio más incumplido que vemos en auditorías

El criterio WCAG 1.4.3 — «Contraste mínimo» es uno de los fallos más frecuentes en las webs que auditamos. Y casi siempre por la misma razón: alguien eligió un gris bonito sobre blanco sin comprobar el ratio.

Los valores que aplicamos:

– Texto normal (menos de 24px, o menos de ~19px en negrita): mínimo «4.5:1»  
– Texto grande (24px o más, o ~19px en negrita): mínimo «3:1»

<figure class="demo" data-demo="contraste">
<figcaption class="demo__intro">Cuatro grises sobre blanco. Los ratios están medidos, no estimados. Los dos de la derecha no cumplen: están a propósito, para que se vea la diferencia.</figcaption>
<div class="demo__columnas">
<div>
<p>Cumplen el 4,5:1</p>
<ul class="demo__lista">
<li class="demo__caja"><span class="demo__muestra demo__c1a1a1a" data-ejemplo aria-hidden="true">Texto de ejemplo</span> <span class="demo__nota">#1a1a1a sobre blanco: 17,4:1. Cumple AAA.</span></li>
<li class="demo__caja"><span class="demo__muestra demo__c595959" data-ejemplo aria-hidden="true">Texto de ejemplo</span> <span class="demo__nota">#595959 sobre blanco: 7,0:1. Cumple AAA.</span></li>
</ul>
</div>
<div>
<p>No cumplen</p>
<ul class="demo__lista">
<li class="demo__caja"><span class="demo__muestra demo__caaaaaa" data-ejemplo="no-cumple" aria-hidden="true">Texto de ejemplo</span> <span class="demo__nota">#aaaaaa sobre blanco: 2,3:1. No cumple. Es el gris «suave» más frecuente en los diseños minimalistas, y una barrera real para muchas personas.</span></li>
<li class="demo__caja"><span class="demo__muestra demo__cc0c0c0" data-ejemplo="no-cumple" aria-hidden="true">Texto de ejemplo</span> <span class="demo__nota">#c0c0c0 sobre blanco: 1,8:1. No cumple. Es el color típico del texto de ejemplo dentro de un campo de formulario.</span></li>
</ul>
</div>
</div>
<p>Lo mismo pasa con el texto sobre una foto sin una capa que garantice el contraste: en las zonas claras desaparece. Con una capa oscura al 60 % debajo del texto, el contraste deja de depender de la foto.</p>
<p>WCAG 1.4.3: el texto normal necesita 4,5:1; el texto grande (24 px o más), 3:1.</p>
</figure>

## Aprendizajes

### Los errores que corregimos en nuestra propia web

Durante la construcción de la web encontramos algunos de los fallos más habituales en nuestro propio trabajo.

#### Texto justificado en párrafos.

En algún punto del diseño teníamos bloques de texto con alineación justificada. Quedaba ordenado visualmente. Pero la justificación crea espacios irregulares entre palabras que dificultan la lectura, especialmente para personas con dislexia. Lo corregimos: todo el texto de cuerpo está alineado a la izquierda. Seguir tendencias mola, pero si las tendencias dificultan la lectura no funciona.

#### Cursiva en bloques largos.

Usábamos cursiva para destacar párrafos de introducción. Funciona para frases cortas; en bloques de más de dos líneas, la legibilidad cae. Redujimos el uso de cursiva a énfasis puntuales.

#### Longitud de línea sin controlar.

En pantallas grandes, el texto se extendía demasiado. Una línea de 100 caracteres es agotadora de leer. Añadimos max-width: 68ch al contenedor principal. El rango recomendado es entre 60 y 80 caracteres por línea.

## Conclusiones

### Lo aprendizajes que nos llevamos

La tipografía accesible no es una checklist que rellenas al final. Es una serie de decisiones interconectadas, tamaño, unidad de medida, espaciado, contraste, longitud de línea, que se afectan entre sí y que hay que pensar juntas desde el principio.

Y la forma más eficiente de aprenderlo es construir algo con esas restricciones.

Nuestra web fue ese proceso para nosotros. Este artículo es el resumen de lo que encontramos y de nuestros aprendizajes.

Hemos creado un Checklist de tipografía accesible. Si te interesa, aquí lo tienes para copiarlo:

### Checklist: tipografía accesible

- Cuerpo de texto a mínimo 16px / 1rem
- Tamaños implementados en rem, no en px absolutos
- Interlineado de mínimo 1.5× (recomendado 1.6× para cuerpo)
- Contraste texto/fondo: mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Texto alineado a la izquierda, no justificado
- Sin cursiva en bloques de más de 2 líneas
- Longitud de línea entre 60 y 80 caracteres (max-width: ~65ch)
- Texto sobre imágenes protegido con overlay de contraste verificable
- Sin tamaños inferiores a 12px / 0.75rem en ningún elemento visible

¿Quieres revisar si la tipografía de tu web cumple con estos criterios?  
[Cuéntanos tu proyecto](/contacto/)
