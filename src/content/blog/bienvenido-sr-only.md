---
titulo: "Bienvenido, sr-only"
descripcion: "Botones descriptivos o una interfaz limpia: durante años creímos que había que elegir. Una clase de CSS resuelve el choque."
fecha: 2026-06-12
categorias: [accesibilidad-digital]
imagen: ../../assets/blog/bienvenido-sr-only.png
imagenAlt: "Fotografía antigua en blanco y negro: un paracaídas abierto tendido en el suelo detrás de un tractor con dos personas."
urlAntigua: /bienvenido-sr-only/
---

Hubo un tiempo cuando trabajaba en Avantio que teníamos un problema y no sabíamos que tenía solución.  
Eric, el responsable de marketing digital, insistía: los botones tienen que ser descriptivos. «Ver detalles» no posiciona. «Ver detalles del informe de accesibilidad 2024» sí.  
Tenía razón.  
Yo le respondía que eso rompía el diseño. Una interfaz limpia no puede tener botones con tres líneas de texto. La coherencia visual importa.

También tenía razón.  
Y ahí estábamos. Dos personas con razón, sin solución. Como un pueblo esperando algo que no llegaba.  
Lo que no sabíamos ninguno de los dos es que la solución ya existía. Solo había que conocerla.

Bienvenido, `sr-only`.

## El problema real

Imagina una tabla con varios perfiles. Cada fila tiene su nombre y un botón de acción.

![Una tabla con tres filas: Tim Moore, Sara López y Alex Kim, cada una con un botón «Ver detalles». A la derecha, lo que oye un lector de pantalla: «Ver detalles», «Ver detalles», «Ver detalles» y la pregunta «¿Cuál es cuál?». Debajo: visualmente hay contexto; para el lector de pantalla, no.](../../assets/blog/bienvenido-sr-only/botones.png)

Tres botones idénticos: el contexto visual no llega al lector de pantalla.

Visualmente, cada botón tiene contexto porque está al lado del nombre. Un lector de pantalla que navega solo por botones escucha tres veces lo mismo: «Ver detalles. Ver detalles. Ver detalles.»

No sabe cuál es cuál. No puede elegir con información.

Esto no es un fallo de usuario. Es un fallo de diseño.
