---
titulo: "Web accessibility in tenders from the Government of Catalonia and the Valencian Government"
tituloSeo: "Web accessibility in public tenders in Catalonia and the Valencian Community"
descripcion: "Which accessibility rules apply to a website commissioned by the Government of Catalonia or the Valencian Government in Spain, and what to check in the tender specifications before you bid."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/accesibilidad-web-licitaciones-generalitat-catalunya-valenciana.png
imagenAlt: "Two tiny people talk under a tower of speech bubbles in pink, yellow and white, on a light background."
clave: licitaciones-catalunya-valenciana
autor: johnny
cta:
  titulo: "White-label development for tenders"
  texto: "If you’re an agency or a consultancy, we build the accessible website under your brand, with the review and the accessibility statement included."
  enlace: "Ask for a quote"
  destino: contacto
preguntas:
  - pregunta: "Which web accessibility rules apply in Catalonia"
    respuesta: "For public sector websites, Royal Decree 1112/2018, as in the rest of Spain. On top of that, Catalonia’s Accessibility Act (Law 13/2014) and the Catalan Accessibility Code (Decree 209/2023), which ask for UNE-EN 301549 and WCAG 2.1 level AA. The Government of Catalonia and its public sector also have their own decree for websites and apps, Decree 216/2023."
  - pregunta: "Whether a Lighthouse report counts as proof of accessibility"
    respuesta: "It’s a starting point, not proof. Automated tools can’t check many guidelines, such as whether an alternative text describes an image well or whether the focus order makes sense. The accessibility statement has to rest on a full review, including a manual one."
  - pregunta: "Which language code a website in Valencian uses"
    respuesta: "The same as a website in Catalan: ca. There is a ca-ES-valencia variant, but screen readers choose the voice from the first part of the code, ca."
---

In Spain, a website commissioned by the Government of Catalonia or the Valencian Government has to comply with [Royal Decree 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699), because regional governments are listed in its article 2. It also has to comply with the public contracts law, which asks for accessibility to be taken into account in the technical specifications (article 126.3). In Catalonia, Law 13/2014 and the Accessibility Code are added to these. The common measure is the UNE-EN 301549 standard, which for the web refers to WCAG 2.1 level AA.

## The rules that apply in each region

Both regions apply the national and European framework. Catalonia also has its own accessibility act, which reaches private companies too, depending on their sector.

<figure class="esquema esquema--comparar">
<ul>
<li><p>Catalonia</p><ul><li>Royal Decree 1112/2018 and Spain’s Public Sector Contracts Act (Law 9/2017)</li><li>Catalonia’s Accessibility Act (Law 13/2014), article 33.4</li><li>Catalan Accessibility Code, Decree 209/2023: UNE-EN 301549 and WCAG 2.1 AA</li><li>Decree 216/2023, for the Government of Catalonia’s websites and apps</li></ul></li>
<li><p>Valencian Community</p><ul><li>Royal Decree 1112/2018 and Spain’s Public Sector Contracts Act (Law 9/2017)</li><li>UNE-EN 301549 and WCAG 2.1 AA as the measure</li><li>Whatever each set of tender specifications adds</li></ul></li>
</ul>
<figcaption>The rules you’ll find when you bid for a website in each region.</figcaption>
</figure>

[Catalonia’s Accessibility Act (Law 13/2014)](https://www.boe.es/buscar/act.php?id=BOE-A-2014-11992) requires Catalan public bodies, and anyone who provides public services, to have accessible websites. Those websites must state their level of accessibility and the date of the last review. The Catalan Accessibility Code (Decree 209/2023, in force since 1 March 2024) sets out how to do it. We summarise it in the frequently asked questions of our [guide to what makes a website accessible](/en/what-makes-a-website-accessible/).

In the Valencian Community, check whether the tender specifications also cite a regional rule. If they do, that’s the one that applies to that contract.

## The <span lang="ca">Plataforma de Serveis de Contractació Pública</span> and the tender specifications

The <span lang="ca">Plataforma de Serveis de Contractació Pública</span> (the Catalan public procurement platform) is where the Government of Catalonia and much of the Catalan public sector publish their tenders. It’s the shop window, not the rule: the accessibility requirements are in each set of tender specifications. In the Valencian Community it works the same way, through each contracting body’s buyer profile.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Technical specifications</p><p>Which standard and which level they ask for: UNE-EN 301549, WCAG 2.1 or 2.2.</p></li>
<li><p>Award criteria</p><p>Whether accessibility scores points and how you show it.</p></li>
<li><p>Languages</p><p>Whether the website is in Catalan or Valencian, Spanish or other languages.</p></li>
<li><p>Documents</p><p>Which PDFs and forms are published and who prepares them.</p></li>
</ol>
<figcaption>The four parts of the tender specifications we look at before we bid.</figcaption>
</figure>

## Three mistakes we see in bids

The first is submitting only an automated report. Tools such as Lighthouse or WAVE find some of the problems, not all of them. Royal Decree 1112/2018 asks for reviews at the design stage and before publishing, and for an accessibility statement that says what the website meets. That needs a manual review.

The second is not marking up the language. A website in Catalan and Spanish has to say which language each page is in, with&nbsp;`<html lang="ca">` or&nbsp;`<html lang="es">`, and mark up every passage in another language (WCAG 3.1.1 and 3.1.2). Otherwise the screen reader reads the Catalan with the Spanish voice. Valencian uses the same code, `ca`.

The third is forgetting the documents. The PDFs published on the website must be accessible too. Royal Decree 1112/2018 only excludes those published before 20 September 2018 that aren’t needed for an administrative process. The PDF/UA standard (ISO 14289) helps to make them properly.

## When the bidder is an agency

Often the bidder is an agency or a consultancy that doesn’t build the website itself. For those cases we work white label: we design and build the website under your brand, do the accessibility review and write the statement. You keep talking to your client.

We work in Spanish, Catalan and English, and we know both sets of regional rules.
