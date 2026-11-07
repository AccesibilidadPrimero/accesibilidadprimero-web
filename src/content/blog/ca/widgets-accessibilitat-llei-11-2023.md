---
titulo: "Per què un widget d’accessibilitat no t’eximeix de la Llei 11/2023"
tituloSeo: "Widgets i plugins d’accessibilitat: per què no compleixen la llei"
descripcion: "Un widget o overlay d’accessibilitat no corregeix el codi del teu web. Què demana la Llei 11/2023, què no pot fer un script i què va passar amb accessiBe."
fecha: 2026-11-07
categorias: [accesibilidad-digital]
imagen: ../../../assets/blog/plugins-widgets-accesibilidad-ley-11-2023.png
imagenAlt: "Una persona diminuta parla i de la boca li surt un embull de línies que es converteix en una ona ordenada fins a arribar a una altra persona, sobre fons verd clar."
clave: widgets-ley-11-2023
autor: johnny
cta:
  titulo: "Un web accessible des del codi"
  texto: "Dissenyem i desenvolupem webs sense plugins d’accessibilitat: el que cal és al codi des de la primera línia."
  enlace: "Veure disseny i desenvolupament"
  destino: servicios
  ancla: "#diseno"
preguntas:
  - pregunta: "Em poden sancionar encara que tingui un widget d’accessibilitat"
    respuesta: "Si el teu servei és dins l’àmbit de la Llei 11/2023 i no en compleix els requisits, sí. El widget no canvia el codi del servei. El que compta és si una persona pot buscar, comprar, pagar o contactar amb teclat, lector de pantalla o ampliador."
  - pregunta: "Què exigeix la Llei 11/2023"
    respuesta: "Que els productes i serveis del seu article 2, com el comerç electrònic o la banca per a consumidors, compleixin els requisits d’accessibilitat del seu annex I des del 28 de juny de 2025, amb alguns períodes de transició. Les microempreses que presten serveis n’estan exemptes."
  - pregunta: "He de treure el widget del meu web"
    respuesta: "No necessàriament. Si a algú li serveix, pot quedar-s’hi. El que importa és que el web funcioni sense el widget i que ningú no el presenti com allò que fa accessible el web."
---

No. Un widget d’accessibilitat, aquest botó flotant que canvia colors o mida de lletra, no fa accessible un web. No corregeix el codi, així que no canvia el que la [Llei 11/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022) demana als serveis que cobreix. Aquesta llei transposa la directiva europea d’accessibilitat i s’aplica des del 28 de juny de 2025.

Ja vam explicar què aporta de debò un plugin a [<span lang="es">No, un plugin de accesibilidad no hace que tu web sea accesible</span>](/blog/no-un-plugin-de-accesibilidad/) (en castellà). Aquí anem a la part legal i a la tècnica.

## Què fa un widget i què no pot fer

Un widget és un script que es carrega damunt de la pàgina i canvia el que es veu quan ja està pintada. El web de sota continua sent el mateix.

Hi ha coses que un script no pot fer:

- Saber què explica una imatge. Pot endevinar un text alternatiu, però no sap per què hi ha aquesta imatge en aquesta pàgina.
- Convertir un&nbsp;`<div>` en un botó de veritat. Pot afegir atributs, però el comportament amb teclat l’escriu qui fa el web.
- Ordenar una pàgina que no té estructura. Si els títols són paràgrafs amb lletra grossa, l’script no sap quin mana.
- Substituir les eines de cada persona. Qui fa servir un lector de pantalla o un ampliador ja té les seves configurades, i un segon sistema al damunt hi pot xocar.

<figure class="esquema esquema--comparar">
<ul>
<li><p>El que canvia un widget</p><ul><li>Colors i mida de lletra</li><li>Espaiat i cursor</li><li>Lectura en veu alta dins del seu propi panell</li></ul></li>
<li class="esquema__bien"><p>El que demana la norma</p><ul><li>Estructura i encapçalaments al codi</li><li>Botons, enllaços i camps amb nom</li><li>Tot es pot fer servir amb teclat</li><li>Cada imatge amb la seva alternativa escrita</li></ul></li>
</ul>
<figcaption>Un widget actua sobre la presentació. La norma demana que el servei funcioni amb qualsevol tecnologia de suport.</figcaption>
</figure>

## Què demana la Llei 11/2023

La Llei 11/2023 fixa requisits d’accessibilitat per a productes i serveis concrets (article 2). Entre els serveis hi ha el comerç electrònic, la banca per a consumidors, les comunicacions electròniques, parts del transport de viatgers, els llibres electrònics, els webs dels subministraments de llum, aigua i gas, les agències de viatges i les xarxes socials. Les microempreses que presten serveis n’estan exemptes.

Els requisits són a l’annex I. Demanen que el servei es pugui percebre, fer servir i entendre, i que funcioni amb les tecnologies de suport. Són requisits sobre el servei, no sobre un afegit. Si el procés de compra no es pot completar amb teclat, el servei no compleix, tingui o no un widget.

Les sancions segueixen el règim de cada sector. On no n’hi ha, s’aplica el de la Llei general de drets de les persones amb discapacitat, que va de 301 euros a 1.000.000 d’euros (article 30). Ho expliquem amb detall a l’article sobre [terminis, obligats i multes de la Llei 11/2023](/ca/blog/llei-11-2023-accessibilitat-terminis-obligats-multes/).

## Un cas real: la multa a accessiBe

El gener de 2025, la Comissió Federal de Comerç dels Estats Units va anunciar una multa d’un milió de dòlars a accessiBe, una de les empreses de widgets més conegudes. Va concloure que l’empresa no tenia base per dir que la seva eina podia fer conforme a les WCAG qualsevol web. L’[ordre definitiva](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million) es va aprovar l’abril de 2025.

És un cas dels Estats Units i de publicitat enganyosa, no de la llei europea. Però diu el mateix que diuen les persones que fan servir tecnologies de suport: el widget no arregla el web.

## Què funciona

L’accessibilitat es decideix en el disseny i s’escriu en el codi. Contrast i mida al Figma, HTML amb significat, focus visible i noms clars a cada control. Després, proves amb teclat i amb lector de pantalla abans de publicar, i cada vegada que alguna cosa canvia.

Costa menys del que sembla si es fa des del principi. I és l’única cosa que la norma reconeix.
