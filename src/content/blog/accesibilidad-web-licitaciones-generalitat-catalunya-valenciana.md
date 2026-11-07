---
titulo: "Accesibilidad web en las licitaciones de la Generalitat de Catalunya y la Generalitat Valenciana"
tituloSeo: "Accesibilidad web en licitaciones de Catalunya y la Comunitat Valenciana"
descripcion: "Qué normas de accesibilidad se aplican a una web que contrata la Generalitat de Catalunya o la Generalitat Valenciana, y qué revisar en el pliego antes de presentar una oferta."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../assets/blog/accesibilidad-web-licitaciones-generalitat-catalunya-valenciana.png
imagenAlt: "Dos personas diminutas conversan bajo una torre de bocadillos de diálogo en rosa, amarillo y blanco, sobre fondo claro."
clave: licitaciones-catalunya-valenciana
autor: johnny
cta:
  titulo: "Desarrollo en marca blanca para licitaciones"
  texto: "Si eres una agencia o una consultora, hacemos la web accesible con tu marca, con la revisión y la declaración de accesibilidad incluidas."
  enlace: "Pide presupuesto"
  destino: contacto
preguntas:
  - pregunta: "Qué norma de accesibilidad web se aplica en Cataluña"
    respuesta: "A las webs del sector público, el Real Decreto 1112/2018, como en toda España. Además, la Ley 13/2014 de accesibilidad de Cataluña y el Código de accesibilidad de Cataluña (Decreto 209/2023), que piden la UNE-EN 301549 y el nivel AA de las WCAG 2.1. La Generalitat y su sector público tienen también su propio decreto para webs y apps, el 216/2023."
  - pregunta: "Sirve un informe de Lighthouse como prueba de accesibilidad"
    respuesta: "Sirve como punto de partida, no como prueba. Las herramientas automáticas no pueden comprobar muchas pautas, como si un texto alternativo describe bien una imagen o si el orden del foco tiene sentido. La declaración de accesibilidad tiene que apoyarse en una revisión completa, también manual."
  - pregunta: "Qué código de idioma lleva una web en valenciano"
    respuesta: "El mismo que una web en catalán: ca. Existe la variante ca-ES-valencia, pero los lectores de pantalla eligen la voz por la primera parte del código, ca."
---

Una web que contrata la Generalitat de Catalunya o la Generalitat Valenciana tiene que cumplir el [Real Decreto 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699), porque las administraciones autonómicas están en su artículo 2, y la ley de contratos, que pide tener en cuenta la accesibilidad en las prescripciones técnicas (artículo 126.3). En Cataluña se suman la Ley 13/2014 y el Código de accesibilidad. La medida común es la norma UNE-EN 301549, que para la web remite a las WCAG 2.1 nivel AA.

## Las normas que se aplican en cada comunidad

En las dos comunidades se aplica el marco estatal y europeo. Cataluña tiene, además, su propia ley de accesibilidad, que alcanza también a empresas privadas por sector.

<figure class="esquema esquema--comparar">
<ul>
<li><p>Cataluña</p><ul><li>Real Decreto 1112/2018 y Ley 9/2017 de Contratos</li><li>Ley 13/2014 de accesibilidad de Cataluña, artículo 33.4</li><li>Código de accesibilidad, Decreto 209/2023: UNE-EN 301549 y WCAG 2.1 AA</li><li>Decreto 216/2023, para las webs y apps de la Generalitat</li></ul></li>
<li><p>Comunitat Valenciana</p><ul><li>Real Decreto 1112/2018 y Ley 9/2017 de Contratos</li><li>UNE-EN 301549 y WCAG 2.1 AA como medida</li><li>Lo que añada cada pliego</li></ul></li>
</ul>
<figcaption>Las normas que vas a encontrar al licitar una web en cada comunidad.</figcaption>
</figure>

La [Ley 13/2014](https://www.boe.es/buscar/act.php?id=BOE-A-2014-11992) obliga a las administraciones catalanas y a quien presta servicios públicos a tener webs accesibles y a indicar en ellas el nivel de accesibilidad y la fecha de la última revisión. El Código de accesibilidad (Decreto 209/2023, en vigor desde el 1 de marzo de 2024) concreta cómo hacerlo. Lo resumimos en las preguntas frecuentes de nuestra [guía sobre qué hace una web accesible](/que-hace-una-web-accesible/).

En la Comunitat Valenciana, revisa si el pliego cita, además, alguna norma autonómica. Si la cita, esa es la que manda en ese contrato.

## La <span lang="ca">Plataforma de Serveis de Contractació Pública</span> y los pliegos

La <span lang="ca">Plataforma de Serveis de Contractació Pública</span> es donde la Generalitat de Catalunya y buena parte del sector público catalán publican sus licitaciones. Es el escaparate, no la norma: los requisitos de accesibilidad están en cada pliego. En la Comunitat Valenciana pasa lo mismo con el perfil del contratante de cada órgano.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Prescripciones técnicas</p><p>Qué norma y qué nivel piden: UNE-EN 301549, WCAG 2.1 o 2.2.</p></li>
<li><p>Criterios de adjudicación</p><p>Si la accesibilidad puntúa y cómo se demuestra.</p></li>
<li><p>Idiomas</p><p>Si la web va en catalán o valenciano, castellano u otros.</p></li>
<li><p>Documentos</p><p>Qué PDF y formularios se publican y quién los prepara.</p></li>
</ol>
<figcaption>Las cuatro partes del pliego que miramos antes de presentar una oferta.</figcaption>
</figure>

## Tres errores que vemos en las ofertas

El primero es presentar solo un informe automático. Herramientas como Lighthouse o WAVE encuentran una parte de los problemas, no todos. El Real Decreto 1112/2018 pide revisiones en el diseño y antes de publicar, y una declaración de accesibilidad que diga qué cumple la web. Eso necesita una revisión manual.

El segundo es no marcar el idioma. Una web en catalán y castellano tiene que decir en qué idioma está cada página, con&nbsp;`<html lang="ca">` o&nbsp;`<html lang="es">`, y marcar cada fragmento que esté en otro idioma (WCAG 3.1.1 y 3.1.2). Si no, el lector de pantalla lee el catalán con la voz castellana. El valenciano usa el mismo código, `ca`.

El tercero es olvidar los documentos. Los PDF que se publican en la web también tienen que ser accesibles: el Real Decreto 1112/2018 solo excluye los publicados antes del 20 de septiembre de 2018 que no hacen falta para un trámite. La norma PDF/UA (ISO 14289) ayuda a hacerlos bien.

## Cuando quien licita es una agencia

Muchas veces quien se presenta al concurso es una agencia o una consultora que no desarrolla la web. Para esos casos trabajamos en marca blanca: diseñamos y programamos la web con tu marca, hacemos la revisión de accesibilidad y redactamos la declaración. Tú sigues hablando con tu cliente.

Trabajamos en castellano, catalán e inglés, y conocemos las dos normativas.
