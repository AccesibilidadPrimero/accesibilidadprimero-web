---
titulo: "Accessibilitat web en licitacions públiques: com complir la UNE-EN 301549"
tituloSeo: "UNE-EN 301549 en licitacions públiques: què exigeix i com complir-la"
descripcion: "Què demana la llei a un web que es contracta en un concurs públic, què és la norma UNE-EN 301549 i com es demostra que un web la compleix."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/requisitos-accesibilidad-web-licitaciones-publicas-une-en-301549.png
imagenAlt: "Dues persones diminutes dalt d’un castell de cartes groc aixequen dues cartes més, sobre fons verd menta."
clave: licitaciones-une-en-301549
autor: johnny
cta:
  titulo: "Un web per a una licitació pública"
  texto: "Dissenyem i desenvolupem webs accessibles des del codi, amb la revisió i la declaració d’accessibilitat incloses."
  enlace: "Demana pressupost"
  destino: contacto
preguntas:
  - pregunta: "Què és la norma UNE-EN 301549"
    respuesta: "És la versió espanyola de la norma europea EN 301 549, que fixa els requisits d’accessibilitat dels productes i serveis TIC. Per a webs i documents remet a les WCAG. La versió vigent, la UNE-EN 301549:2022, correspon a les WCAG 2.1 nivell AA."
  - pregunta: "El Reial decret 1112/2018 obliga les empreses privades"
    respuesta: "No de manera general: s’aplica al sector públic (article 2). Afecta una empresa privada quan fa el web o l’app d’una entitat pública, perquè el que lliura és d’aquesta entitat. Altres normes sí que arriben a empreses privades, com la Llei 11/2023 en el comerç electrònic, la banca o el transport."
  - pregunta: "Quina versió de les WCAG cal complir el 2026"
    respuesta: "La norma vigent remet a les WCAG 2.1 nivell AA. La EN 301 549 V4.1.1, publicada el setembre de 2026, passa a les WCAG 2.2 i tindrà efecte legal quan se citi al Diari Oficial de la Unió Europea. Per a un web nou, el més assenyat és dissenyar ja amb les WCAG 2.2."
---

Si una administració contracta un web, aquest web ha de ser accessible. Ho demana la llei de contractes i ho demana la norma que regula els webs del sector públic. La manera de mesurar-ho és la norma UNE-EN 301549, que per al web remet a les pautes WCAG 2.1 en el nivell AA.

## Què exigeix la llei a un web que es contracta en un concurs públic

Són dues normes: una per al contracte i una altra per al web.

La [Llei 9/2017 de contractes del sector públic](https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902) demana a l’article 126.3 que les prescripcions tècniques tinguin en compte l’accessibilitat universal i el disseny per a totes les persones en tot allò que hagin de fer servir persones. Si no es fa, cal justificar-ho. I quan la Unió Europea ha fixat requisits d’accessibilitat obligatoris, el plec hi ha de remetre.

El [Reial decret 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699) regula l’accessibilitat dels webs i les apps del sector públic: l’Administració General de l’Estat, les comunitats autònomes, l’administració local, el sector públic institucional i l’Administració de Justícia (article 2). Un web que es lliura a una d’aquestes entitats és el seu web, així que l’ha de complir.

El que el decret no diu és quant compta l’accessibilitat en un concurs. Això ho decideix cada plec. Pot aparèixer com a prescripció tècnica, com a criteri d’adjudicació o com a condició d’execució. Per això el primer és llegir el plec sencer i buscar tres expressions: “accessibilitat”, “UNE-EN 301549” i “declaració&nbsp;d’accessibilitat”.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Plec</p><p>Busca “accessibilitat”, “UNE-EN 301549” i “declaració&nbsp;d’accessibilitat”.</p></li>
<li><p>Oferta</p><p>Explica el mètode: com dissenyes, com proves i qui ho revisa.</p></li>
<li><p>Desenvolupament</p><p>Revisió en el disseny i abans de publicar, com demana l’article 17 del Reial decret 1112/2018.</p></li>
<li><p>Lliurament</p><p>Informe de revisió, declaració d’accessibilitat i pla per mantenir-la.</p></li>
</ol>
<figcaption>On entra l’accessibilitat en el contracte d’un web públic, del plec al lliurament.</figcaption>
</figure>

## Què és la UNE-EN 301549 i què té a veure amb les WCAG

La UNE-EN 301549 és la versió espanyola de la norma europea EN 301 549, que fixa els requisits d’accessibilitat dels productes i serveis TIC. Per al web i els documents, remet a les WCAG.

L’article 6 del Reial decret 1112/2018 presumeix que un web compleix quan segueix les normes harmonitzades publicades al Diari Oficial de la Unió Europea. La que hi ha citada avui és la EN 301 549 V3.2.1, que a Espanya es publica com a UNE-EN 301549:2022 i correspon a les WCAG 2.1 nivell AA.

Hi ha un canvi a la vista. El 2 de setembre de 2026 es va publicar la EN 301 549 V4.1.1, que passa a les WCAG 2.2. Tindrà efecte legal quan se citi al Diari Oficial, cosa prevista per a finals del 2026. Un web que comença avui s’hauria de dissenyar ja amb les WCAG 2.2. Aquestes pautes afegeixen sis criteris de nivell A i AA, com la mida mínima dels objectius tàctils o l’ajuda sempre al mateix lloc.

## Com es construeix un web que compleix la norma

Complir la norma no és un acabat. Es decideix en el disseny i s’escriu en el codi.

- HTML amb significat. `<nav>`, `<main>`, `<article>`, un sol `<h1>` i els nivells d’encapçalament en ordre. És el que permet a un lector de pantalla saltar per la pàgina.
- Tot funciona amb teclat. Cada enllaç, botó i camp s’abasta amb la tecla Tab, el focus es veu sempre i cap part de la pàgina no atrapa el teclat.
- ARIA només quan l’HTML no hi arriba. Un botó natiu ja diu que és un botó. ARIA serveix per al que l’HTML no té, com una zona que avisa d’un canvi, i mal posat empitjora les coses.
- Contrast i mida des del disseny. El text normal necessita 4,5:1 contra el fons, i les WCAG 2.2 demanen objectius tàctils d’almenys 24 per 24 píxels.
- Proves amb tecnologies de suport. NVDA, JAWS, VoiceOver i TalkBack no llegeixen igual. Les eines automàtiques troben una part dels problemes; la resta es troba a mà.

## El que has de lliurar

L’article 17 del Reial decret 1112/2018 demana revisar l’accessibilitat en la fase de disseny, abans de publicar i, després, de manera periòdica. L’article 15 demana una declaració d’accessibilitat, que s’actualitza almenys un cop l’any o cada vegada que es revisa el web.

En una licitació això es tradueix en tres lliurables: l’informe de la revisió, la declaració d’accessibilitat redactada per a l’entitat i un pla per mantenir-la, perquè cada pàgina nova la pot trencar.

## Per què una plantilla et pot costar el concurs

Molts webs es munten sobre temes i constructors visuals que porten els seus propis errors: botons sense nom, menús que no s’obren amb teclat, finestres que no tornen el focus. Cap informe no els amaga quan algú revisa el web amb un lector de pantalla, i arreglar-los després costa més que no tenir-los.

Si el plec valora l’accessibilitat, el que suma és poder ensenyar com l’aconseguiràs: el mètode, les proves i qui les fa. Si et preguntes què passa amb les ajudes públiques, ho expliquem a [<span lang="es">Me pueden rechazar una subvención si mi web no es accesible</span>](/blog/me-pueden-rechazar-una-subvencion-si-mi-web-no-es-accesible/) (en castellà).
