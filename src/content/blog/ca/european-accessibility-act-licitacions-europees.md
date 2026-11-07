---
titulo: "Acta Europea d’Accessibilitat i licitacions europees: el que es demana a un web"
tituloSeo: "Acta Europea d’Accessibilitat (EAA) en licitacions europees: requisits web"
descripcion: "Com es relacionen l’Acta Europea d’Accessibilitat, la directiva de contractació pública i la norma EN 301 549, i què necessita un web per a una licitació europea."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/european-accessibility-act-licitaciones-europeas.png
imagenAlt: "Dues persones diminutes sobre l’anell d’un planeta dibuixat amb tinta, una saludant i l’altra asseguda a la vora, sobre fons verd menta."
clave: eaa-licitaciones-europeas
autor: johnny
cta:
  titulo: "Un soci tècnic per a una licitació europea"
  texto: "Dissenyem i desenvolupem el web amb la EN 301 549 com a referència i et lliurem la revisió i la declaració d’accessibilitat."
  enlace: "Demana pressupost"
  destino: contacto
preguntas:
  - pregunta: "La EN 301 549 és el mateix que les WCAG"
    respuesta: "No. Per al web i els documents incorpora les WCAG en el nivell AA, però també té requisits per a programari, maquinari, comunicació per veu, documentació i serveis de suport."
  - pregunta: "Des de quan s’aplica l’Acta Europea d’Accessibilitat"
    respuesta: "Des del 28 de juny de 2025, amb períodes de transició fins al 28 de juny de 2030 per als productes que ja es feien servir i per a alguns contractes de serveis anteriors."
  - pregunta: "Quina versió de les WCAG demana una licitació europea"
    respuesta: "Avui, la EN 301 549 V3.2.1 remet a les WCAG 2.1 nivell AA. La V4.1.1, publicada el setembre de 2026, passa a les WCAG 2.2 i tindrà efecte quan se citi al Diari Oficial de la Unió Europea. Llegeix el plec: alguns ja demanen les WCAG 2.2."
---

En una licitació pública europea, l’accessibilitat d’un web la demanen dues directives. La [Directiva 2014/24/UE](https://eur-lex.europa.eu/eli/dir/2014/24/oj) de contractació pública obliga a tenir en compte l’accessibilitat en les especificacions tècniques (article 42). L’[Acta Europea d’Accessibilitat](https://eur-lex.europa.eu/eli/dir/2019/882/oj), la Directiva (UE) 2019/882, fa obligatoris els seus requisits quan el que es compra és dins el seu àmbit (article 24). La norma amb què es mesura un web és la EN 301 549.

## Què té a veure l’Acta Europea d’Accessibilitat amb la contractació pública

L’Acta Europea d’Accessibilitat, coneguda com a EAA per les sigles en anglès, regula productes i serveis que es venen a consumidors, com el comerç electrònic o la banca. No és una norma de contractació. Però el seu article 24 connecta les dues: quan una administració compra un producte o un servei dels que cobreix, els seus requisits d’accessibilitat passen a ser obligatoris al plec.

A Espanya, la llei de contractes ho recull a l’article 126.3: si la Unió Europea ha fixat requisits d’accessibilitat obligatoris, les especificacions tècniques hi han de remetre.

<figure class="esquema esquema--pasos">
<ol>
<li><p>Directiva 2014/24/UE</p><p>L’article 42 demana accessibilitat en les especificacions tècniques.</p></li>
<li><p>Acta Europea d’Accessibilitat</p><p>L’article 24 fa obligatoris els seus requisits en la compra pública.</p></li>
<li><p>EN 301 549</p><p>La norma que mesura si un web, un document o un programa compleix.</p></li>
<li><p>Plec</p><p>Diu quina versió de la norma demana i com es demostra.</p></li>
</ol>
<figcaption>Com arriba l’accessibilitat des de les directives europees fins al plec d’una licitació.</figcaption>
</figure>

## Quina versió de la EN 301 549 s’aplica

La EN 301 549 va néixer per a la compra pública de tecnologia, i avui és la norma harmonitzada de referència. Per al web remet a les WCAG.

<figure class="esquema esquema--linea">
<ol>
<li><p>2021</p><p>EN 301 549 V3.2.1, amb les WCAG 2.1 nivell AA. És la versió citada avui al Diari Oficial.</p></li>
<li><p>2 de setembre de 2026</p><p>Es publica la V4.1.1, que passa a les WCAG 2.2 i està pensada com a norma harmonitzada de l’Acta Europea d’Accessibilitat.</p></li>
<li><p>Finals de 2026, previst</p><p>Cita de la V4.1.1 al Diari Oficial. Des d’aleshores tindrà efecte legal.</p></li>
</ol>
<figcaption>Les versions de la EN 301 549 i quan tenen efecte legal.</figcaption>
</figure>

Per a un web que es dissenya avui, el més assenyat és treballar ja amb les WCAG 2.2. Complir-les cobreix també les 2.1.

## Per què es perden punts en una licitació europea

Aquests són els errors més habituals que veiem en ofertes i en webs lliurats:

- Confiar en un overlay. La EN 301 549 mesura el web que es lliura, no un afegit que es carrega al damunt. Un widget d’accessibilitat no canvia aquest web. Ho expliquem a [per què un widget d’accessibilitat no t’eximeix de la Llei 11/2023](/ca/blog/widgets-accessibilitat-llei-11-2023/).
- Idiomes sense marcar. Un web en diversos idiomes ha de dir en quin idioma és cada pàgina i cada fragment (WCAG 3.1.1 i 3.1.2). Si no, el lector de pantalla llegeix un avís en anglès amb la veu espanyola, i no s’entén.
- Panells que no es poden fer servir sense ratolí. Si el contracte inclou un panell de gestió o una aplicació web, hi entra sencer: cada funció s’ha de poder fer servir amb teclat (WCAG 2.1.1). La EN 301 549 té, a més, un capítol per al programari.
- Documentació i suport oblidats. La EN 301 549 demana que la documentació del producte i els serveis de suport també siguin accessibles (capítol 12).

## Com treballem

Som un estudi de disseny i desenvolupament a València. Construïm sobre una base tècnica pròpia, amb HTML semàntic, gestió del focus i comprovacions automàtiques de contrast, reflow i navegació abans de cada publicació. Després revisem amb teclat i amb lector de pantalla, i redactem la declaració d’accessibilitat.

Treballem en castellà, català i anglès, i podem fer-ho per a una empresa que licita o per a l’agència que l’acompanya.
