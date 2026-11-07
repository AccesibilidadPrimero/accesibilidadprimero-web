---
titulo: "Autopsy of an inaccessible website: 5 code errors that fail an audit"
tituloSeo: "5 HTML and ARIA errors that fail an accessibility audit"
descripcion: "The five code errors we find most often when we audit websites against UNE-EN 301549 and WCAG, why they fail and how to write them properly."
fecha: 2026-11-07
categorias: [auditoria-wcag]
imagen: ../../../assets/blog/autopsia-web-no-accesible-5-errores-de-codigo.png
imagenAlt: "Two tiny people carry a huge pink pencil, on a yellow background."
clave: autopsia-errores-codigo
tipoSchema: TechArticle
autor: johnny
cta:
  titulo: "An audit with these five points and the rest"
  texto: "We review your website against WCAG 2.2, by hand and with screen readers, and give you a plan to fix each barrier."
  enlace: "See the audit"
  destino: servicios
  ancla: "#auditoria"
preguntas:
  - pregunta: "What the first rule of ARIA is"
    respuesta: "If there’s a native HTML element that already does what you need, use it instead of adding ARIA to another element. It’s set out in the W3C’s Using ARIA guide."
  - pregunta: "Whether a placeholder works as a field label"
    respuesta: "No. It disappears when you type, it often has low contrast and not all screen readers announce it as the field’s name. Every field needs a visible label linked with label."
  - pregunta: "What contrast text over an image needs"
    respuesta: "The same as any text: 4.5:1 for normal text and 3:1 for large text (WCAG 1.4.3). It’s measured on the least favourable part of the image. The safest option is to put the text on a solid background or a scrim."
---

A website doesn’t usually fail an accessibility audit because of how it looks, but because of how it’s written. The same things almost always fail: elements that look like controls but aren’t, misplaced ARIA, fields with no name and focus that gets lost. These are the five errors we find most often, and how to write them properly.

## Why a website fails technically

A screen reader doesn’t see the page. It reads what the browser tells it about the page: what each thing is, what it’s called and what state it’s in. That information comes from the HTML. If the code says “box” where it should say “button”, the person using it gets a box.

UNE-EN 301549 refers to WCAG 2.1 level AA for the web. The five errors in this article fail criteria at that level.

<figure class="esquema esquema--comparar">
<ul>
<li><p>What we find</p><ul><li>A <code>&lt;div&gt;</code> with a click event</li><li>A modal window that lets the focus escape</li><li><code>aria-hidden</code> on a link</li><li>A field with only a <code>placeholder</code></li><li>White text over a photo</li></ul></li>
<li class="esquema__bien"><p>What we write</p><ul><li><code>&lt;button type="button"&gt;</code></li><li><code>&lt;dialog&gt;</code> opened with <code>showModal()</code></li><li>The link, visible to everyone or to no one</li><li>A visible <code>&lt;label for&gt;</code></li><li>The text on a solid background</li></ul></li>
</ul>
<figcaption>The five errors on the left, and how we solve them on the right, in the same order.</figcaption>
</figure>

## The five errors

### 1. A div acting as a button

What we find: a&nbsp;`<div>` or a&nbsp;`<span>` with a click event. It works with a mouse. With a keyboard you can’t reach it, and the screen reader doesn’t say it’s a button.

It fails criteria 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value).

How to write it: `<button type="button">`. You can reach it with Tab and activate it with Enter and the space bar, and the screen reader announces it as a button. All of that comes built in, without one more line of JavaScript.

### 2. A modal window that lets the focus escape

What we find: a window opens and the focus stays on the page behind it. With Tab, the person keeps moving through links they can’t see. When the window closes, the focus doesn’t go back anywhere.

It fails criterion 2.4.3 (Focus Order). The opposite, a window you can’t leave with a keyboard, is a keyboard trap and fails 2.1.2.

How to write it: with&nbsp;`<dialog>` and&nbsp;`showModal()`. The browser moves the focus into the window, makes the rest of the page inert and closes it with Escape. Always check that, when it closes, the focus goes back to the button that opened it.

### 3. ARIA that’s unnecessary or gets in the way

What we find: `role="navigation"` on a&nbsp;`<nav>`, which repeats what the element already says. It doesn’t break anything, but it’s noise. The serious problem is something else: `aria-hidden="true"` on a link or a button. The keyboard reaches it and the screen reader doesn’t announce it.

It fails criterion 4.1.2 (Name, Role, Value).

How to write it: with the first rule of ARIA. If there’s an HTML element that already does what you need, use that element. And anything hidden from the screen reader is hidden from the keyboard too.

### 4. Fields with no label

What we find: a field with the help text inside it, in the&nbsp;`placeholder`, and no label. When you start typing, the text disappears. It often has low contrast and not all screen readers announce it as the name.

It fails criteria 1.3.1 (Info and Relationships) and 3.3.2 (Labels or Instructions).

How to write it: every field with its own visible `<label for="…">`, above the field, and the&nbsp;`placeholder` only for an example, if one is needed.

### 5. Text over an image with no contrast

What we find: a white headline over a photo. On one part of the photo you can read it and on another you can’t. On mobile, with a different crop, it’s harder to read.

It fails criterion 1.4.3 (Contrast (Minimum)): 4.5:1 for normal text and 3:1 for large text.

How to write it: the text on a solid background or a scrim that keeps the contrast at the worst point of the image, on every screen size. Or the text outside the image.

## How we avoid this on our websites

We talk about it in the design, before writing any code: what each control is, how you reach it with a keyboard and what contrast it has. Then every change goes through automated checks for contrast, reflow and navigation before it’s published. And what a machine can’t see, we review with a keyboard and a screen reader.

If your team builds the website and wants to know where it stands, the audit is the first step.
