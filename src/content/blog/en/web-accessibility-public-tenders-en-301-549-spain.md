---
titulo: "Web accessibility in public tenders in Spain: how to meet UNE-EN 301549"
tituloSeo: "UNE-EN 301549 in Spanish public tenders: what it requires and how to meet it"
descripcion: "What Spanish law asks of a website commissioned through a public tender, what the UNE-EN 301549 standard is and how you show that a website meets it."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/requisitos-accesibilidad-web-licitaciones-publicas-une-en-301549.png
imagenAlt: "Two tiny people on top of a yellow house of cards lift two more cards, on a mint green background."
clave: licitaciones-une-en-301549
autor: johnny
cta:
  titulo: "A website for a public tender"
  texto: "We design and build accessible websites from the code up, with the review and the accessibility statement included."
  enlace: "Ask for a quote"
  destino: contacto
preguntas:
  - pregunta: "What the UNE-EN 301549 standard is"
    respuesta: "It’s the Spanish version of the European standard EN 301 549, which sets the accessibility requirements for ICT products and services. For websites and documents it refers to WCAG. The current version, UNE-EN 301549:2022, matches WCAG 2.1 level AA."
  - pregunta: "Whether Royal Decree 1112/2018 applies to private companies"
    respuesta: "Not in general: it applies to the public sector (article 2). It affects a private company when that company builds the website or app of a public body, because what it delivers belongs to that body. Other laws do reach private companies, such as Law 11/2023 for e-commerce, banking or transport."
  - pregunta: "Which version of WCAG you need to meet in 2026"
    respuesta: "The current standard refers to WCAG 2.1 level AA. EN 301 549 V4.1.1, published in September 2026, moves to WCAG 2.2 and will have legal effect once it’s cited in the Official Journal of the European Union. For a new website, the sensible choice is to design with WCAG 2.2 now."
---

In Spain, if a public body commissions a website, that website has to be accessible. The public contracts law requires it, and so does the regulation for public sector websites. The way to measure it is the UNE-EN 301549 standard, which for the web refers to the WCAG guidelines at level AA, version 2.1.

## What Spanish law asks of a website commissioned through a public tender

There are two laws: one for the contract and one for the website.

Article 126.3 of [Spain’s Public Sector Contracts Act (Law 9/2017)](https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902) says the technical specifications must take universal accessibility and design for all into account, in everything people will use. If they don’t, this has to be justified. And when the European Union has set mandatory accessibility requirements, the tender specifications must refer to them.

[Royal Decree 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699) regulates the accessibility of public sector websites and apps. That covers the central government, the regional governments, local government, the institutional public sector and the justice administration (article 2). A website you deliver to one of these bodies is their website, so it has to comply.

What the decree doesn’t say is how much accessibility counts in a tender. Each set of tender specifications decides that. It can appear as a technical specification, as an award criterion or as a condition of performance. So the first step is to read the whole set of specifications and look for three phrases: “<span lang="es">accesibilidad</span>” (accessibility), “UNE-EN 301549” and “<span lang="es">declaración de accesibilidad</span>” (accessibility statement).

<figure class="esquema esquema--pasos">
<ol>
<li><p>Tender specifications</p><p>Look for accessibility, UNE-EN 301549 and the accessibility statement.</p></li>
<li><p>Bid</p><p>Explain the method: how you design, how you test and who reviews it.</p></li>
<li><p>Development</p><p>Review at the design stage and before publishing, as article 17 of Royal Decree 1112/2018 requires.</p></li>
<li><p>Handover</p><p>Review report, accessibility statement and a plan to maintain it.</p></li>
</ol>
<figcaption>Where accessibility comes into the contract for a public website, from the tender specifications to the handover.</figcaption>
</figure>

## What UNE-EN 301549 is and how it relates to WCAG

UNE-EN 301549 is the Spanish version of the European standard EN 301 549, which sets the accessibility requirements for ICT products and services. For the web and for documents, it refers to WCAG.

Article 6 of Royal Decree 1112/2018 presumes that a website complies when it follows the harmonised standards published in the Official Journal of the European Union. The one cited today is EN 301 549 V3.2.1. In Spain it’s published as UNE-EN 301549:2022, and it matches WCAG 2.1 level AA.

A change is coming. EN 301 549 V4.1.1 was published on 2 September 2026, and it moves to WCAG 2.2. It will have legal effect once it’s cited in the Official Journal, which is expected at the end of 2026. A website started today should already be designed with WCAG 2.2. It adds six criteria at levels A and AA, such as the minimum size of touch targets or help that’s always in the same place.

## How to build a website that meets the standard

Meeting the standard isn’t a finishing touch. It’s decided in the design and written in the code.

- Meaningful HTML. `<nav>`, `<main>`, `<article>`, a single `<h1>` and heading levels in order. This is what lets a screen reader jump around the page.
- Everything works with a keyboard. Every link, button and field can be reached with the Tab key, the focus is always visible and no part of the page traps the keyboard.
- ARIA only when HTML falls short. A native button already says it’s a button. ARIA is for what HTML doesn’t have, such as an area that announces a change. Used badly, it makes things worse.
- Contrast and size from the design. Normal text needs 4.5:1 against its background, and WCAG 2.2 asks for touch targets of at least 24 by 24 pixels.
- Testing with assistive technologies. NVDA, JAWS, VoiceOver and TalkBack don’t read the same way. Automated tools find some of the problems. The rest are found by hand.

## What you have to deliver

Article 17 of Royal Decree 1112/2018 asks for accessibility reviews at the design stage, before publishing and then at regular intervals. Article 15 asks for an accessibility statement, updated at least once a year or whenever the website is reviewed.

In a tender, that means three deliverables: the review report, the accessibility statement written for the public body, and a plan to maintain it, because every new page can break it.

## Why a template can cost you the tender

Many websites are built on themes and visual builders that come with their own errors: buttons with no name, menus that don’t open with a keyboard, pop-up windows that don’t return the focus. No report hides them when someone reviews the website with a screen reader. And fixing them later costs more than not having them.

If the tender specifications score accessibility, what counts is being able to show how you’ll achieve it: the method, the testing and who does it. If you’re wondering about public grants, we cover that in [<span lang="es">Me pueden rechazar una subvención si mi web no es accesible</span>](/blog/me-pueden-rechazar-una-subvencion-si-mi-web-no-es-accesible/) (in Spanish), on whether a grant can be refused because a website isn’t accessible.
