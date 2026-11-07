---
titulo: "Autòpsia d’un web no accessible: 5 errors de codi que suspenen una auditoria"
tituloSeo: "5 errors d’HTML i ARIA que suspenen una auditoria d’accessibilitat"
descripcion: "Els cinc errors de codi que més trobem quan auditem webs amb la UNE-EN 301549 i les WCAG, per què fallen i com s’escriuen bé."
fecha: 2026-11-07
categorias: [auditoria-wcag]
imagen: ../../../assets/blog/autopsia-web-no-accesible-5-errores-de-codigo.png
imagenAlt: "Dues persones diminutes carreguen un llapis rosa enorme, sobre fons groc."
clave: autopsia-errores-codigo
tipoSchema: TechArticle
autor: johnny
cta:
  titulo: "Una auditoria amb aquests cinc punts i la resta"
  texto: "Revisem el teu web amb les WCAG 2.2, a mà i amb lectors de pantalla, i et donem un pla per corregir cada barrera."
  enlace: "Veure l’auditoria"
  destino: servicios
  ancla: "#auditoria"
preguntas:
  - pregunta: "Què és la primera regla d’ARIA"
    respuesta: "Si hi ha un element HTML natiu que ja fa el que necessites, fes-lo servir en lloc d’afegir ARIA a un altre element. Ho recull la guia Using ARIA del W3C."
  - pregunta: "Un placeholder serveix com a etiqueta d’un camp"
    respuesta: "No. Desapareix quan escrius, sol tenir poc contrast i no tots els lectors de pantalla l’anuncien com a nom del camp. Cada camp necessita una etiqueta visible associada amb label."
  - pregunta: "Quin contrast necessita el text sobre una imatge"
    respuesta: "El mateix que qualsevol text: 4,5:1 per a text normal i 3:1 per a text gran (WCAG 1.4.3). Es mesura a la zona més desfavorable de la imatge. El més segur és posar el text sobre un fons sòlid o un vel."
---

Un web no sol suspendre una auditoria d’accessibilitat per com es veu, sinó per com està escrit. Gairebé sempre fallen les mateixes coses: elements que semblen controls i no ho són, ARIA mal posat, camps sense nom i un focus que es perd. Aquests són els cinc errors que més trobem i com s’escriuen bé.

## Per què falla tècnicament un web

Un lector de pantalla no veu la pàgina. Llegeix el que el navegador li explica: què és cada cosa, com es diu i en quin estat està. Aquesta informació surt de l’HTML. Si el codi diu “caixa” on hauria de dir “botó”, la persona que el fa servir rep una caixa.

La UNE-EN 301549 remet a les WCAG 2.1 nivell AA per al web. Els cinc errors d’aquest article incompleixen criteris d’aquest nivell.

<figure class="esquema esquema--comparar">
<ul>
<li><p>El que trobem</p><ul><li>Un <code>&lt;div&gt;</code> amb un esdeveniment de clic</li><li>Una finestra modal que deixa escapar el focus</li><li><code>aria-hidden</code> en un enllaç</li><li>Un camp amb només <code>placeholder</code></li><li>Text blanc sobre una foto</li></ul></li>
<li class="esquema__bien"><p>El que escrivim</p><ul><li><code>&lt;button type="button"&gt;</code></li><li><code>&lt;dialog&gt;</code> obert amb <code>showModal()</code></li><li>L’enllaç, visible per a tothom o per a ningú</li><li><code>&lt;label for&gt;</code> visible</li><li>El text sobre un fons sòlid</li></ul></li>
</ul>
<figcaption>Els cinc errors, a l’esquerra, i com els resolem, a la dreta, en el mateix ordre.</figcaption>
</figure>

## Els cinc errors

### 1. Un div que fa de botó

El que trobem: un&nbsp;`<div>` o un&nbsp;`<span>` amb un esdeveniment de clic. Amb ratolí funciona. Amb teclat no s’hi pot arribar, i el lector de pantalla no diu que sigui un botó.

Incompleix els criteris 2.1.1 (Teclat) i 4.1.2 (Nom, funció, valor).

Com s’escriu: `<button type="button">`. S’hi arriba amb Tab, s’activa amb Retorn i amb la barra d’espai, i el lector anuncia que és un botó. Tot això ve de sèrie, sense cap línia més de JavaScript.

### 2. Una finestra modal que deixa escapar el focus

El que trobem: s’obre una finestra i el focus es queda a la pàgina del darrere. Amb Tab, la persona continua recorrent enllaços que no veu. Quan es tanca la finestra, el focus no torna enlloc.

Incompleix el criteri 2.4.3 (Ordre del focus). El contrari, una finestra de la qual no es pot sortir amb teclat, és una trampa de teclat i incompleix el 2.1.2.

Com s’escriu: amb&nbsp;`<dialog>` i&nbsp;`showModal()`. El navegador porta el focus a la finestra, deixa inert la resta de la pàgina i la tanca amb Escapada. Comprova sempre que, quan la tanques, el focus torni al botó que l’ha oberta.

### 3. ARIA que sobra o que fa nosa

El que trobem: `role="navigation"` en un&nbsp;`<nav>`, que repeteix el que l’element ja diu. No trenca res, però és soroll. El greu és una altra cosa: `aria-hidden="true"` en un enllaç o un botó. El teclat hi arriba i el lector de pantalla no l’anuncia.

Incompleix el criteri 4.1.2 (Nom, funció, valor).

Com s’escriu: amb la primera regla d’ARIA. Si hi ha un element HTML que ja fa el que necessites, es fa servir aquest element. I el que s’amaga al lector de pantalla s’amaga també al teclat.

### 4. Camps sense etiqueta

El que trobem: un camp amb el text d’ajuda a dins, al&nbsp;`placeholder`, i sense etiqueta. Quan comences a escriure, el text desapareix. Sol tenir poc contrast i no tots els lectors de pantalla l’anuncien com a nom.

Incompleix els criteris 1.3.1 (Informació i relacions) i 3.3.2 (Etiquetes o instruccions).

Com s’escriu: cada camp amb el seu&nbsp;`<label for="…">` visible, damunt del camp, i el&nbsp;`placeholder` només per a un exemple, si cal.

### 5. Text sobre una imatge sense contrast

El que trobem: un titular blanc sobre una foto. En una part de la foto es llegeix i en una altra no. Al mòbil, amb un altre retall, es llegeix pitjor.

Incompleix el criteri 1.4.3 (Contrast mínim): 4,5:1 per a text normal i 3:1 per a text gran.

Com s’escriu: el text sobre un fons sòlid o un vel que asseguri el contrast al pitjor punt de la imatge, a totes les mides de pantalla. O el text fora de la imatge.

## Com ho evitem als nostres webs

Ho parlem en el disseny, abans d’escriure codi: què és cada control, com s’hi arriba amb teclat i quin contrast té. Després, cada canvi passa comprovacions automàtiques de contrast, reflow i navegació abans de publicar-se. I el que una màquina no veu ho revisem amb teclat i amb lector de pantalla.

Si el teu equip desenvolupa el web i vol saber on és, l’auditoria és el primer pas.
