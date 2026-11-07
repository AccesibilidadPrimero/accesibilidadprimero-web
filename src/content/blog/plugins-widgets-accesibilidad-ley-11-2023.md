---
titulo: "Por qué un widget de accesibilidad no te libra de la Ley 11/2023"
tituloSeo: "Widgets y plugins de accesibilidad: por qué no cumplen la ley"
descripcion: "Un widget u overlay de accesibilidad no corrige el código de tu web. Qué pide la Ley 11/2023, qué no puede hacer un script y qué pasó con accessiBe."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../assets/blog/plugins-widgets-accesibilidad-ley-11-2023.png
imagenAlt: "Una persona diminuta habla y de su boca sale una maraña de líneas que se convierte en una onda ordenada hasta llegar a otra persona, sobre fondo verde claro."
clave: widgets-ley-11-2023
autor: johnny
cta:
  titulo: "Una web accesible desde el código"
  texto: "Diseñamos y desarrollamos webs sin plugins de accesibilidad: lo que hace falta está en el código desde la primera línea."
  enlace: "Ver diseño y desarrollo"
  destino: servicios
  ancla: "#diseno"
preguntas:
  - pregunta: "Me pueden sancionar aunque tenga un widget de accesibilidad"
    respuesta: "Si tu servicio está en el ámbito de la Ley 11/2023 y no cumple sus requisitos, sí. El widget no cambia el código del servicio. Lo que cuenta es si una persona puede buscar, comprar, pagar o contactar con teclado, lector de pantalla o ampliador."
  - pregunta: "Qué exige la Ley 11/2023"
    respuesta: "Que los productos y servicios de su artículo 2, como el comercio electrónico o la banca para consumidores, cumplan los requisitos de accesibilidad de su anexo I desde el 28 de junio de 2025, con algunos periodos de transición. Las microempresas que prestan servicios están exentas."
  - pregunta: "Tengo que quitar el widget de mi web"
    respuesta: "No necesariamente. Si a alguien le sirve, puede quedarse. Lo importante es que la web funcione sin él y que nadie lo presente como lo que hace accesible la web."
---

No. Un widget de accesibilidad, ese botón flotante que cambia colores o tamaño de letra, no hace accesible una web. No corrige el código, así que no cambia lo que la [Ley 11/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022) pide a los servicios que cubre. Esa ley traspone la Directiva europea de accesibilidad y se aplica desde el 28 de junio de 2025.

Ya contamos lo que sí aporta un plugin en [No, un plugin de accesibilidad no hace que tu web sea accesible](/blog/no-un-plugin-de-accesibilidad/). Aquí vamos a la parte legal y a la técnica.

## Qué hace un widget y qué no puede hacer

Un widget es un script que se carga encima de la página y cambia lo que se ve cuando ya está pintada. La web de debajo sigue siendo la misma.

Hay cosas que un script no puede hacer:

- Saber qué cuenta una imagen. Puede adivinar un texto alternativo, pero no sabe por qué está esa imagen en esa página.
- Convertir un&nbsp;`<div>` en un botón de verdad. Puede añadir atributos, pero el comportamiento con teclado lo escribe quien hace la web.
- Ordenar una página que no tiene estructura. Si los títulos son párrafos con letra grande, el script no sabe cuál manda.
- Sustituir las herramientas de cada persona. Quien usa un lector de pantalla o un ampliador ya tiene las suyas configuradas, y un segundo sistema encima puede chocar con ellas.

<figure class="esquema esquema--comparar">
<ul>
<li><p>Lo que cambia un widget</p><ul><li>Colores y tamaño de letra</li><li>Espaciado y cursor</li><li>Lectura en voz alta dentro de su propio panel</li></ul></li>
<li class="esquema__bien"><p>Lo que pide la norma</p><ul><li>Estructura y encabezados en el código</li><li>Botones, enlaces y campos con nombre</li><li>Todo se puede usar con teclado</li><li>Cada imagen con su alternativa escrita</li></ul></li>
</ul>
<figcaption>Un widget actúa sobre la presentación. La norma pide que el servicio funcione con cualquier tecnología de apoyo.</figcaption>
</figure>

## Qué pide la Ley 11/2023

La Ley 11/2023 fija requisitos de accesibilidad para productos y servicios concretos (artículo 2). Entre los servicios están el comercio electrónico, la banca para consumidores, las comunicaciones electrónicas, partes del transporte de viajeros, los libros electrónicos, las webs de los suministros de luz, agua y gas, las agencias de viajes y las redes sociales. Las microempresas que prestan servicios están exentas.

Los requisitos están en su anexo I y piden que el servicio se pueda percibir, manejar y entender, y que funcione con las tecnologías de apoyo. Son requisitos sobre el servicio, no sobre un añadido. Si el proceso de compra no se puede completar con teclado, el servicio no cumple, tenga o no un widget.

Las sanciones siguen el régimen de cada sector y, donde no lo hay, el de la Ley General de derechos de las personas con discapacidad, que va de 301 euros a 1.000.000 de euros (artículo 30). Lo contamos con detalle en el artículo sobre [plazos, obligados y multas de la Ley 11/2023](/blog/ley-11-2023-accesibilidad-plazos-obligados-multas/).

## Un caso real: la multa a accessiBe

En enero de 2025, la Comisión Federal de Comercio de Estados Unidos anunció una multa de un millón de dólares a accessiBe, una de las empresas de widgets más conocidas. Concluyó que la empresa no tenía base para decir que su herramienta podía hacer conforme a las WCAG cualquier web. La [orden definitiva](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million) se aprobó en abril de 2025.

Es un caso de Estados Unidos y de publicidad engañosa, no de la ley europea. Pero dice lo mismo que dicen las personas que usan tecnologías de apoyo: el widget no arregla la web.

## Qué funciona

La accesibilidad se decide en el diseño y se escribe en el código. Contraste y tamaño en el Figma, HTML con significado, foco visible y nombres claros en cada control. Después, pruebas con teclado y con lector de pantalla antes de publicar, y cada vez que algo cambia.

Cuesta menos de lo que parece si se hace desde el principio. Y es lo único que la norma reconoce.
