---
titulo: "Why an accessibility widget doesn’t get you off the hook under Law 11/2023"
tituloSeo: "Accessibility widgets and plugins: why they don’t meet Spanish Law 11/2023"
descripcion: "An accessibility widget or overlay doesn’t fix your website’s code. What Spain’s Law 11/2023 asks for, what a script can’t do and what happened to accessiBe."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/plugins-widgets-accesibilidad-ley-11-2023.png
imagenAlt: "A tiny person speaks and a tangle of lines comes out of their mouth, turning into a tidy wave that reaches another person, on a light green background."
clave: widgets-ley-11-2023
autor: johnny
cta:
  titulo: "A website that’s accessible from the code up"
  texto: "We design and build websites without accessibility plugins: what’s needed is in the code from the first line."
  enlace: "See design and development"
  destino: servicios
  ancla: "#diseno"
preguntas:
  - pregunta: "Whether you can be fined even with an accessibility widget"
    respuesta: "Yes, if your service falls within the scope of Law 11/2023 and doesn’t meet its requirements. The widget doesn’t change the service’s code. What counts is whether a person can search, buy, pay or get in touch using a keyboard, a screen reader or a screen magnifier."
  - pregunta: "What Law 11/2023 requires"
    respuesta: "That the products and services in its article 2, such as e-commerce or consumer banking, meet the accessibility requirements in its annex I from 28 June 2025, with some transition periods. Microenterprises that provide services are exempt."
  - pregunta: "Whether you have to remove the widget from your website"
    respuesta: "Not necessarily. If it helps someone, it can stay. What matters is that the website works without it and that nobody presents it as the thing that makes the website accessible."
---

No. An accessibility widget, that floating button that changes colours or text size, doesn’t make a website accessible. It doesn’t fix the code, so it doesn’t change what [Law 11/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022) asks of the services it covers. That Spanish law transposes the European Accessibility Act and has applied since 28 June 2025.

We’ve already covered what a plugin does offer in [<span lang="es">No, un plugin de accesibilidad no hace que tu web sea accesible</span>](/blog/no-un-plugin-de-accesibilidad/) (in Spanish). Here we look at the legal side and the technical side.

## What a widget does and what it can’t do

A widget is a script that loads on top of the page and changes what you see once the page has been drawn. The website underneath stays the same.

There are things a script can’t do:

- Know what an image is telling you. It can guess an alternative text, but it doesn’t know why that image is on that page.
- Turn a&nbsp;`<div>` into a real button. It can add attributes, but the keyboard behaviour is written by whoever builds the website.
- Put order into a page that has no structure. If the headings are paragraphs in large type, the script can’t tell which one leads.
- Replace each person’s own tools. People who use a screen reader or a screen magnifier already have theirs set up, and a second system on top can clash with them.

<figure class="esquema esquema--comparar">
<ul>
<li><p>What a widget changes</p><ul><li>Colours and text size</li><li>Spacing and cursor</li><li>Reading aloud inside its own panel</li></ul></li>
<li class="esquema__bien"><p>What the standard asks for</p><ul><li>Structure and headings in the code</li><li>Buttons, links and fields with a name</li><li>Everything can be used with a keyboard</li><li>Every image with its written alternative</li></ul></li>
</ul>
<figcaption>A widget acts on the presentation. The standard asks for the service to work with any assistive technology.</figcaption>
</figure>

## What Law 11/2023 asks for

Law 11/2023 sets accessibility requirements for specific products and services (article 2). The services include e-commerce, consumer banking, electronic communications, parts of passenger transport, e-books, the websites of electricity, water and gas suppliers, travel agencies and social networks. Microenterprises that provide services are exempt.

The requirements are in its annex I. They ask for the service to be perceivable, operable and understandable, and to work with assistive technologies. They’re requirements on the service, not on an add-on. If the checkout can’t be completed with a keyboard, the service doesn’t comply, with or without a widget.

Fines follow the rules of each sector. Where there are none, they follow the General Law on the rights of persons with disabilities, which ranges from €301 to €1,000,000 (article 30). We go into detail in the article on [Law 11/2023 deadlines, who it applies to and fines](/en/blog/spain-law-11-2023-accessibility-deadlines-fines/).

## A real case: the fine against accessiBe

In January 2025, the United States Federal Trade Commission announced a one million dollar fine against accessiBe, one of the best-known widget companies. It found that the company had no basis for claiming its tool could make any website conform to WCAG. The [final order](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million) was approved in April 2025.

It’s a United States case about misleading advertising, not about European law. But it says the same thing that people who use assistive technologies say: the widget doesn’t fix the website.

## What works

Accessibility is decided in the design and written in the code. Contrast and size in Figma, meaningful HTML, visible focus and clear names on every control. Then testing with a keyboard and a screen reader before publishing, and every time something changes.

It costs less than it seems if you do it from the start. And it’s the only thing the standard recognises.
