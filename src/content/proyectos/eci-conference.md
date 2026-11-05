---
titulo: ECI Conference Mad 2027
cliente: ECI Conference
# La línea de la tarjeta en Casos de estudio (04/11/2026).
linea: Congreso internacional de intervención temprana.
nombreCorto: ECI Conference
# `|-`: los saltos son cortes fijos en escritorio (ProjectSection.astro).
# Ninguno puede caer detrás de una partícula (“reúne a”): 14/10/2026, AGENTS.md §4.
# “intervención temprana” va con espacio que no se parte (U+00A0): es un
# término y en móvil se partía en dos renglones (Johnny, 03/11/2026).
resumen: |-
  ECI (Early Childhood Intervention) reúne
  a profesionales de toda Europa para avanzar
  hacia una intervención temprana más inclusiva.
aporte: |-
  Diseñamos la información del congreso:
  qué contar, en qué orden y cómo llega
  cada persona a lo que busca.
web: https://www.eciconference2027.com/
orden: 1
tipo: webs
destacado: true
paleta:
  acento: '#005fcc'
  textoSobreAcento: '#f7f7f4'
  anilloFoco: '#f7f7f4'
  uso: fondo
# Nota: 93 (Johnny, 30/10/2026). La del 6 de octubre era 87, con diez imágenes
# sin alternativa. Ver claude/plan-notas-por-encima-de-90.md
nota:
  valor: 93
  medidaEl: 2026-10-30
  declaracion: https://eciconference2027.com/accessibility/
# Caso con maqueta propia: src/pages/proyectos/eci-conference.astro (29/10/2026).
casoPublicado: true
maquetaPropia: true
imagenes:
  - archivo: eci-1
    alt: >-
      La portada de eciconference2027.com: una foto nocturna de la Gran Vía de
      Madrid con el titular “Growing together: innovation, equity and
      community” en amarillo y blanco, la fecha y la sede del congreso y los
      botones de inscripción y de envío de abstracts.
  - archivo: eci-2
    alt: >-
      La página de ponentes: el título “Speakers” en amarillo sobre la foto de
      unas personas conversando en un congreso, con la frase que presenta las
      ponencias principales y los talleres.
  - archivo: eci-3
    alt: >-
      La página “Welcome to Madrid”: una plaza de Madrid con gente paseando
      bajo un árbol de otoño, el titular en amarillo, un texto de bienvenida a
      la ciudad y el botón “Discover Madrid”.
# Las versiones en catalán e inglés (05/11/2026): solo los textos, con la
# misma forma que arriba. Las mezcla `localizar` (src/i18n/idioma.ts).
traducciones:
  ca:
    linea: Congrés internacional d’atenció primerenca.
    resumen: |-
      ECI (Early Childhood Intervention) reuneix
      professionals de tot Europa per avançar
      cap a una atenció primerenca més inclusiva.
    aporte: |-
      Vam dissenyar la informació del congrés:
      què explicar, en quin ordre i com arriba
      cada persona al que busca.
    imagenes:
      - alt: >-
          La portada d’eciconference2027.com: una foto nocturna de la Gran Via de
          Madrid amb el titular “Growing together: innovation, equity and
          community” en groc i blanc, la data i la seu del congrés i els botons
          d’inscripció i d’enviament d’abstracts.
      - alt: >-
          La pàgina de ponents: el títol “Speakers” en groc sobre la foto d’unes
          persones conversant en un congrés, amb la frase que presenta les
          ponències principals i els tallers.
      - alt: >-
          La pàgina “Welcome to Madrid”: una plaça de Madrid amb gent passejant
          sota un arbre de tardor, el titular en groc, un text de benvinguda a la
          ciutat i el botó “Discover Madrid”.
    cuerpo:
      - Un congrés amb molt per compartir. Un web que ajuda cada persona a trobar el que necessita.
      - >-
        Un congrés europeu mou molta informació: programa, ponents, inscripció
        i enviament d’abstracts. Sovint acaba repartida en PDF i formularis
        difícils de fer servir.
      - A ECI, el programa es recorre i es filtra al mateix web, sense descarregar res.
      - >-
        I per a la gestió d’abstracts vam crear la nostra pròpia plataforma.
        Accesible Abstracts.
  en:
    linea: International conference on early childhood intervention.
    resumen: |-
      ECI (Early Childhood Intervention) brings
      professionals from across Europe together
      to work towards more inclusive early intervention.
    aporte: |-
      We designed the conference’s information:
      what to say, in what order, and how
      everyone gets to what they’re looking for.
    imagenes:
      - alt: >-
          The eciconference2027.com home page: a night-time photo of Gran Vía in
          Madrid with the headline “Growing together: innovation, equity and
          community” in yellow and white, the conference dates and venue, and
          the registration and abstract submission buttons.
      - alt: >-
          The speakers page: the title “Speakers” in yellow over a photo of
          people talking at a conference, with the line introducing the keynote
          talks and the workshops.
      - alt: >-
          The “Welcome to Madrid” page: a square in Madrid with people walking
          under an autumn tree, the headline in yellow, a welcome text about the
          city and the “Discover Madrid” button.
    cuerpo:
      - A conference with a lot to share. A website that helps everyone find what they need.
      - >-
        A European conference handles a lot of information: the programme,
        speakers, registration and abstract submission. All too often it ends
        up scattered across PDFs and hard-to-use forms.
      - At ECI, the programme can be browsed and filtered on the website itself, with nothing to download.
      - >-
        And for managing abstracts, we built our own platform. Accesible
        Abstracts.
---

Un congreso con mucho que compartir. Una web que ayuda a cada persona a
encontrar lo que necesita.

Un congreso europeo mueve mucha información: programa, ponentes, inscripción
y envío de abstracts. Muchas veces acaba repartida en PDF y formularios
difíciles de usar.

En ECI, el programa se recorre y se filtra en la propia web, sin
descargar nada.

Y para la gestión de abstracts creamos nuestra propia plataforma. Accesible
Abstracts.
