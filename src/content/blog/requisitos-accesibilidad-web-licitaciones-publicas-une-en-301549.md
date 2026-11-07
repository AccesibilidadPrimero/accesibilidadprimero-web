---
titulo: "Accesibilidad web en licitaciones públicas: cómo cumplir la UNE-EN 301549"
tituloSeo: "UNE-EN 301549 en licitaciones públicas: qué exige y cómo cumplirla"
descripcion: "Qué pide la ley a una web que se contrata en un concurso público, qué es la norma UNE-EN 301549 y cómo se demuestra que una web la cumple."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../assets/blog/requisitos-accesibilidad-web-licitaciones-publicas-une-en-301549.png
imagenAlt: "Dos personas diminutas en lo alto de un castillo de naipes amarillo levantan dos cartas más, sobre fondo verde menta."
clave: licitaciones-une-en-301549
autor: johnny
cta:
  titulo: "Una web para una licitación pública"
  texto: "Diseñamos y desarrollamos webs accesibles desde el código, con la revisión y la declaración de accesibilidad incluidas."
  enlace: "Pide presupuesto"
  destino: contacto
preguntas:
  - pregunta: "Qué es la norma UNE-EN 301549"
    respuesta: "Es la versión española de la norma europea EN 301 549, que fija los requisitos de accesibilidad de los productos y servicios TIC. Para webs y documentos remite a las WCAG. La versión vigente, la UNE-EN 301549:2022, corresponde a las WCAG 2.1 nivel AA."
  - pregunta: "El Real Decreto 1112/2018 obliga a las empresas privadas"
    respuesta: "No de forma general: se aplica al sector público (artículo 2). A una empresa privada le afecta cuando hace la web o la app de una entidad pública, porque lo que entrega es de esa entidad. Otras normas sí alcanzan a empresas privadas, como la Ley 11/2023 en el comercio electrónico, la banca o el transporte."
  - pregunta: "Qué versión de las WCAG hay que cumplir en 2026"
    respuesta: "La norma vigente remite a las WCAG 2.1 nivel AA. La EN 301 549 V4.1.1, publicada en septiembre de 2026, pasa a las WCAG 2.2 y tendrá efecto legal cuando se cite en el Diario Oficial de la Unión Europea. Para una web nueva, lo sensato es diseñar ya con las WCAG 2.2."
---

Si una administración contrata una web, esa web tiene que ser accesible. Lo pide la ley de contratos y lo pide la norma que regula las webs del sector público. La forma de medirlo es la norma UNE-EN 301549, que para la web remite a las pautas WCAG 2.1 en su nivel AA.

## Qué exige la ley a una web que se contrata en un concurso público

Son dos normas: una para el contrato y otra para la web.

La [Ley 9/2017 de Contratos del Sector Público](https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902) pide en su artículo 126.3 que las prescripciones técnicas tengan en cuenta la accesibilidad universal y el diseño para todas las personas en todo lo que vayan a usar personas. Si no se hace, hay que justificarlo. Y cuando la Unión Europea ha fijado requisitos de accesibilidad obligatorios, el pliego tiene que remitir a ellos.

El [Real Decreto 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699) regula la accesibilidad de las webs y las apps del sector público: la Administración General del Estado, las comunidades autónomas, la administración local, el sector público institucional y la Administración de Justicia (artículo 2). Una web que se entrega a una de estas entidades es su web, así que tiene que cumplirlo.

Lo que el decreto no dice es cuánto cuenta la accesibilidad en un concurso. Eso lo decide cada pliego. Puede aparecer como prescripción técnica, como criterio de adjudicación o como condición de ejecución. Por eso lo primero es leer el pliego entero y buscar tres expresiones: “accesibilidad”, “UNE-EN 301549” y “declaración de accesibilidad”.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Pliego</p><p>Busca “accesibilidad”, “UNE-EN 301549” y “declaración de accesibilidad”.</p></li>
<li><p>Oferta</p><p>Explica el método: cómo diseñas, cómo pruebas y quién lo revisa.</p></li>
<li><p>Desarrollo</p><p>Revisión en el diseño y antes de publicar, como pide el artículo 17 del Real Decreto 1112/2018.</p></li>
<li><p>Entrega</p><p>Informe de revisión, declaración de accesibilidad y plan para mantenerla.</p></li>
</ol>
<figcaption>Dónde entra la accesibilidad en el contrato de una web pública, del pliego a la entrega.</figcaption>
</figure>

## Qué es la UNE-EN 301549 y qué tiene que ver con las WCAG

La UNE-EN 301549 es la versión española de la norma europea EN 301 549, que fija los requisitos de accesibilidad de los productos y servicios TIC. Para la web y los documentos, remite a las WCAG.

El artículo 6 del Real Decreto 1112/2018 presume que una web cumple cuando sigue las normas armonizadas publicadas en el Diario Oficial de la Unión Europea. La que está citada hoy es la EN 301 549 V3.2.1, que en España se publica como UNE-EN 301549:2022 y corresponde a las WCAG 2.1 nivel AA.

Hay un cambio a la vista. El 2 de septiembre de 2026 se publicó la EN 301 549 V4.1.1, que pasa a las WCAG 2.2. Tendrá efecto legal cuando se cite en el Diario Oficial, algo previsto para finales de 2026. Una web que empieza hoy debería diseñarse ya con las WCAG 2.2, que añaden seis criterios de nivel A y AA, como el tamaño mínimo de los objetivos táctiles o la ayuda siempre en el mismo sitio.

## Cómo se construye una web que cumple la norma

Cumplir la norma no es un acabado. Se decide en el diseño y se escribe en el código.

- HTML con significado. `<nav>`, `<main>`, `<article>`, un solo `<h1>` y los niveles de encabezado en orden. Es lo que permite a un lector de pantalla saltar por la página.
- Todo funciona con teclado. Cada enlace, botón y campo se alcanza con la tecla Tab, el foco se ve siempre y ninguna parte de la página atrapa el teclado.
- ARIA solo cuando el HTML no llega. Un botón nativo ya dice que es un botón. ARIA sirve para lo que el HTML no tiene, como una zona que avisa de un cambio, y mal puesto empeora las cosas.
- Contraste y tamaño desde el diseño. El texto normal necesita 4,5:1 contra su fondo, y las WCAG 2.2 piden objetivos táctiles de al menos 24 por 24 píxeles.
- Pruebas con tecnologías de apoyo. NVDA, JAWS, VoiceOver y TalkBack no leen igual. Las herramientas automáticas encuentran una parte de los problemas; el resto se encuentra a mano.

## Lo que tienes que entregar

El artículo 17 del Real Decreto 1112/2018 pide revisar la accesibilidad en la fase de diseño, antes de publicar y, después, de forma periódica. El artículo 15 pide una declaración de accesibilidad, que se actualiza al menos una vez al año o cada vez que se revisa la web.

En una licitación eso se traduce en tres entregables: el informe de la revisión, la declaración de accesibilidad redactada para la entidad y un plan para mantenerla, porque cada página nueva puede romperla.

## Por qué una plantilla puede costarte el concurso

Muchas webs se montan sobre temas y constructores visuales que traen sus propios errores: botones sin nombre, menús que no se abren con teclado, ventanas que no devuelven el foco. Ningún informe los esconde cuando alguien revisa la web con un lector de pantalla, y arreglarlos después cuesta más que no tenerlos.

Si el pliego valora la accesibilidad, lo que suma es poder enseñar cómo la vas a conseguir: el método, las pruebas y quién las hace. Si te preguntas qué pasa con las ayudas públicas, lo contamos en [Me pueden rechazar una subvención si mi web no es accesible](/blog/me-pueden-rechazar-una-subvencion-si-mi-web-no-es-accesible/).
