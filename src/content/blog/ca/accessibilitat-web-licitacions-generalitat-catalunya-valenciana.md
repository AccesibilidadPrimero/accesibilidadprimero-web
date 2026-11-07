---
titulo: "Accessibilitat web en les licitacions de la Generalitat de Catalunya i la Generalitat Valenciana"
tituloSeo: "Accessibilitat web en licitacions de Catalunya i la Comunitat Valenciana"
descripcion: "Quines normes d’accessibilitat s’apliquen a un web que contracta la Generalitat de Catalunya o la Generalitat Valenciana, i què cal revisar al plec abans de presentar una oferta."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/accesibilidad-web-licitaciones-generalitat-catalunya-valenciana.png
imagenAlt: "Dues persones diminutes conversen sota una torre de bafarades en rosa, groc i blanc, sobre fons clar."
clave: licitaciones-catalunya-valenciana
autor: johnny
cta:
  titulo: "Desenvolupament en marca blanca per a licitacions"
  texto: "Si ets una agència o una consultora, fem el web accessible amb la teva marca, amb la revisió i la declaració d’accessibilitat incloses."
  enlace: "Demana pressupost"
  destino: contacto
preguntas:
  - pregunta: "Quina norma d’accessibilitat web s’aplica a Catalunya"
    respuesta: "Als webs del sector públic, el Reial decret 1112/2018, com a tot Espanya. A més, la Llei 13/2014 d’accessibilitat de Catalunya i el Codi d’accessibilitat de Catalunya (Decret 209/2023), que demanen la UNE-EN 301549 i el nivell AA de les WCAG 2.1. La Generalitat i el seu sector públic tenen també un decret propi per a webs i apps, el 216/2023."
  - pregunta: "Un informe de Lighthouse serveix com a prova d’accessibilitat"
    respuesta: "Serveix com a punt de partida, no com a prova. Les eines automàtiques no poden comprovar moltes pautes, com ara si un text alternatiu descriu bé una imatge o si l’ordre del focus té sentit. La declaració d’accessibilitat s’ha de basar en una revisió completa, també manual."
  - pregunta: "Quin codi d’idioma porta un web en valencià"
    respuesta: "El mateix que un web en català: ca. Existeix la variant ca-ES-valencia, però els lectors de pantalla trien la veu per la primera part del codi, ca."
---

Un web que contracta la Generalitat de Catalunya o la Generalitat Valenciana ha de complir el [Reial decret 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699), perquè les administracions autonòmiques són al seu article 2. També ha de complir la llei de contractes, que demana tenir en compte l’accessibilitat en les prescripcions tècniques (article 126.3). A Catalunya s’hi sumen la Llei 13/2014 i el Codi d’accessibilitat. La mesura comuna és la norma UNE-EN 301549, que per al web remet a les WCAG 2.1 nivell AA.

## Les normes que s’apliquen a cada comunitat

A les dues comunitats s’aplica el marc estatal i europeu. Catalunya té, a més, una llei d’accessibilitat pròpia, que arriba també a empreses privades per sector.

<figure class="esquema esquema--comparar">
<ul>
<li><p>Catalunya</p><ul><li>Reial decret 1112/2018 i Llei 9/2017 de contractes</li><li>Llei 13/2014 d’accessibilitat de Catalunya, article 33.4</li><li>Codi d’accessibilitat, Decret 209/2023: UNE-EN 301549 i WCAG 2.1 AA</li><li>Decret 216/2023, per als webs i les apps de la Generalitat</li></ul></li>
<li><p>Comunitat Valenciana</p><ul><li>Reial decret 1112/2018 i Llei 9/2017 de contractes</li><li>UNE-EN 301549 i WCAG 2.1 AA com a mesura</li><li>El que afegeixi cada plec</li></ul></li>
</ul>
<figcaption>Les normes que trobaràs en licitar un web a cada comunitat.</figcaption>
</figure>

La [Llei 13/2014](https://www.boe.es/buscar/act.php?id=BOE-A-2014-11992) obliga les administracions catalanes i qui presta serveis públics a tenir webs accessibles i a indicar-hi el nivell d’accessibilitat i la data de l’última revisió. El Codi d’accessibilitat (Decret 209/2023, en vigor des de l’1 de març de 2024) concreta com fer-ho. Ho resumim a les preguntes freqüents de la nostra [guia sobre què fa un web accessible](/ca/que-fa-un-web-accessible/).

A la Comunitat Valenciana, revisa si el plec cita, a més, alguna norma autonòmica. Si la cita, aquesta és la que mana en aquell contracte.

## La Plataforma de Serveis de Contractació Pública i els plecs

La Plataforma de Serveis de Contractació Pública és on la Generalitat de Catalunya i bona part del sector públic català publiquen les seves licitacions. És l’aparador, no la norma: els requisits d’accessibilitat són a cada plec. A la Comunitat Valenciana passa el mateix amb el perfil del contractant de cada òrgan.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Prescripcions tècniques</p><p>Quina norma i quin nivell demanen: UNE-EN 301549, WCAG 2.1 o 2.2.</p></li>
<li><p>Criteris d’adjudicació</p><p>Si l’accessibilitat puntua i com es demostra.</p></li>
<li><p>Idiomes</p><p>Si el web va en català o valencià, castellà o altres.</p></li>
<li><p>Documents</p><p>Quins PDF i formularis es publiquen i qui els prepara.</p></li>
</ol>
<figcaption>Les quatre parts del plec que mirem abans de presentar una oferta.</figcaption>
</figure>

## Tres errors que veiem a les ofertes

El primer és presentar només un informe automàtic. Eines com Lighthouse o WAVE troben una part dels problemes, no tots. El Reial decret 1112/2018 demana revisions en el disseny i abans de publicar, i una declaració d’accessibilitat que digui què compleix el web. Això necessita una revisió manual.

El segon és no marcar l’idioma. Un web en català i castellà ha de dir en quin idioma és cada pàgina, amb&nbsp;`<html lang="ca">` o&nbsp;`<html lang="es">`, i marcar cada fragment que sigui en un altre idioma (WCAG 3.1.1 i 3.1.2). Si no, el lector de pantalla llegeix el català amb la veu castellana. El valencià fa servir el mateix codi, `ca`.

El tercer és oblidar els documents. Els PDF que es publiquen al web també han de ser accessibles. El Reial decret 1112/2018 només exclou els publicats abans del 20 de setembre de 2018 que no calen per a un tràmit. La norma PDF/UA (ISO 14289) ajuda a fer-los bé.

## Quan qui licita és una agència

Moltes vegades qui es presenta al concurs és una agència o una consultora que no desenvolupa el web. Per a aquests casos treballem en marca blanca: dissenyem i programem el web amb la teva marca, fem la revisió d’accessibilitat i redactem la declaració. Tu continues parlant amb el teu client.

Treballem en castellà, català i anglès, i coneixem les dues normatives.
