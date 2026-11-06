/* ---------------------------------------------------------------------------
   Preguntas frecuentes de la guía (Johnny, 06/11/2026). Dudas sobre la ley,
   escritas para resolverlas y para que se encuentren en un buscador: la
   pregunta como se busca, y la primera frase (`corta`) contesta sí, no o
   depende. El detalle va en «Leer más».

   REGLAS
   · Lo que dice la ley, aunque la respuesta sea «depende». Nada de asustar
     ni de prometer: una página de referencia que exagera deja de serlo.
   · Ley española y europea, comprobada el 06/11/2026 (fuentes en el PR y en
     claude/guia-preguntas-frecuentes-2026-11-06.md del proyecto). Cuando
     cambie una norma, se cambia aquí y la fecha de `ACTUALIZADO`.
   · Los enlaces, en su propia línea (44 px): `enlace` al final de cada
     respuesta, nunca dentro de un párrafo.
   --------------------------------------------------------------------------- */
import type { Lang, RouteKey } from '../i18n/config';

export interface Pregunta {
  id: string;
  pregunta: string;
  /** La respuesta en una frase: lo que se ve sin abrir. */
  corta: string;
  detalle: string[];
  enlace?: { ruta?: RouteKey; ancla?: string; slug?: string; url?: string; texto: string };
}

export const ACTUALIZADO: Record<Lang, string> = {
  es: 'Respuestas sobre la ley española y europea, actualizadas el 6 de noviembre de 2026. No son asesoramiento jurídico: si necesitas saber exactamente qué obliga a tu organización, confírmalo con asesoría jurídica.',
  ca: 'Respostes sobre la llei espanyola i europea, actualitzades el 6 de novembre de 2026. No són assessorament jurídic: si necessites saber exactament què obliga la teva organització, confirma-ho amb assessoria jurídica.',
  en: 'Answers about Spanish and EU law, updated on 6 November 2026. They are not legal advice: if you need to know exactly what applies to your organisation, check with a legal adviser.',
};

export const PREGUNTAS: Record<Lang, Pregunta[]> = {
  es: [
    {
      id: 'obligatorio',
      pregunta: '¿Es obligatorio que mi web sea accesible?',
      corta: 'Depende de quién seas: es obligatorio para el sector público, para muchas empresas que venden productos y servicios a consumidores y para las grandes empresas de ciertos sectores.',
      detalle: [
        'Sector público: el Real Decreto 1112/2018 obliga a administraciones, universidades públicas y entidades públicas a que sus webs y aplicaciones sean accesibles y publiquen su declaración de accesibilidad.',
        'Empresas: la Ley 11/2023, que traspone el Acta Europea de Accesibilidad, obliga desde el 28 de junio de 2025 a los servicios de comercio electrónico, banca para consumidores, transporte de viajeros, comunicaciones electrónicas, libros electrónicos y acceso a servicios audiovisuales, entre otros.',
        'Grandes empresas: la LSSI ya obligaba a las de más de cien trabajadores en sectores como banca, seguros, suministros, telecomunicaciones, transporte, agencias de viajes o comercio minorista.',
        'Aunque no te obligue, una web accesible la puede usar más gente. Y si trabajas con el sector público o recibes ayudas, te lo pueden exigir igualmente.',
      ],
    },
    {
      id: 'multa',
      pregunta: '¿Me pueden multar si mi web no es accesible?',
      corta: 'Sí, si tu organización está obligada: las multas van de 301 euros a 1.000.000 de euros, según la gravedad.',
      detalle: [
        'La Ley 11/2023 remite a la sanción de cada sector y, si no hay, a la Ley General de derechos de las personas con discapacidad. En ella, las infracciones leves llegan hasta 30.000 euros, las graves hasta 90.000 y las muy graves hasta 1.000.000.',
        'Vigilan y sancionan las comunidades autónomas. Además de la multa, puede haber sanciones accesorias, como no poder pedir ayudas públicas durante un tiempo.',
        'Lo más habitual antes de una sanción es una queja: cualquier persona que encuentre una barrera puede reclamar. Tener la web auditada y una declaración de accesibilidad al día es la mejor respuesta.',
      ],
    },
    {
      id: 'subvencion',
      pregunta: '¿Puedo perder una subvención si mi web no es accesible?',
      corta: 'Sí, por dos caminos: porque la convocatoria lo exija como condición o como sanción por incumplir la ley de accesibilidad.',
      detalle: [
        'Por la convocatoria: algunas ayudas exigen que la web cumpla la accesibilidad, como pasaba con las webs financiadas por el Kit Digital. Si una condición de la ayuda no se cumple, la Ley General de Subvenciones permite reclamar que se devuelva.',
        'Por sanción: la Ley General de derechos de las personas con discapacidad prevé, junto a la multa, prohibir que pidas ayudas públicas en tu sector hasta un año si la infracción es grave y hasta dos si es muy grave. En las muy graves, también se pueden retirar las ayudas que ya tengas.',
        'Antes de justificar una ayuda, revisa en sus bases qué nivel de accesibilidad piden y guarda la prueba: una auditoría con fecha.',
      ],
    },
    {
      id: 'puntos',
      pregunta: '¿Tengo más puntos en una subvención o en una licitación si mi web es accesible?',
      corta: 'En una subvención depende de sus bases; en un contrato público, la accesibilidad es obligatoria en los requisitos técnicos y puede sumar puntos.',
      detalle: [
        'No hay una regla general para las subvenciones: cada convocatoria fija sus criterios. Busca en las bases palabras como “accesibilidad”, “diseño universal” o “inclusión”.',
        'En los contratos públicos, la Ley 9/2017 obliga a tener en cuenta la accesibilidad universal al definir lo que se contrata, y permite valorarla como criterio de calidad al adjudicar. Si tu propuesta incluye una web o un servicio digital, demostrar que es accesible es un argumento con peso.',
      ],
    },
    {
      id: 'certificacion',
      pregunta: '¿Mi web puede conseguir una certificación de accesibilidad?',
      corta: 'Puede conseguir una voluntaria, pero no existe ninguna certificación oficial ni obligatoria.',
      detalle: [
        'AENOR ofrece una certificación voluntaria, “Accesibilidad Web Verificada”, basada en la norma UNE-EN 301 549. Acredita el nivel de una web en una fecha concreta, sin seguimiento después.',
        'Una web cambia cada semana: un certificado dice cómo estaba el día que se revisó. Lo que pide la ley es cumplir, decir cómo se cumple y, en el sector público, publicar la declaración de accesibilidad.',
        'Por eso preferimos una auditoría con su informe y una declaración que se mantiene al día, y formar a quien publica para que no se pierda lo conseguido.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'Ver la auditoría de accesibilidad' },
    },
    {
      id: 'une-en-301-549',
      pregunta: '¿Qué implica la norma UNE-EN 301 549?',
      corta: 'Es la norma técnica europea de accesibilidad de productos y servicios digitales, y para la web remite a la WCAG en nivel AA.',
      detalle: [
        'La EN 301 549 la elaboran los organismos europeos de normalización y UNE la publica en España como UNE-EN 301 549. Es la referencia técnica de las dos directivas europeas: cumplirla da presunción de que se cumple la ley.',
        'Va más allá de la web: cubre documentos, aplicaciones, software, equipos y comunicaciones en tiempo real, como el chat o la videollamada.',
        'La versión que da hoy presunción de conformidad es la 3.2.1, basada en la WCAG 2.1. La 4.1.1, basada en la WCAG 2.2, se publicó en septiembre de 2026 y pasará a ser la referencia cuando la cite el Diario Oficial de la UE, previsto para finales de 2026. Si tu web cumple la WCAG 2.2 AA, ya estás preparado.',
      ],
    },
    {
      id: 'microempresa',
      pregunta: 'Soy una microempresa, ¿tengo que cumplir?',
      corta: 'Si prestas servicios, la Ley 11/2023 no te obliga; si fabricas o vendes productos de los que cubre la ley, sí.',
      detalle: [
        'Una microempresa tiene menos de diez personas en plantilla y no factura más de dos millones de euros al año. Las que prestan servicios, como una tienda en línea, quedan fuera del Acta Europea de Accesibilidad.',
        'Pero quedar fuera de la ley no te deja fuera de tu público: según la OMS, una de cada seis personas en el mundo vive con una discapacidad importante, y todas envejecemos. Y si trabajas para el sector público o pides ayudas, te lo pueden exigir.',
      ],
    },
    {
      id: 'declaracion',
      pregunta: '¿Qué es la declaración de accesibilidad y tengo que publicarla?',
      corta: 'Es la página que explica qué cumple tu web, qué no y cómo avisar de una barrera; el sector público está obligado a publicarla.',
      detalle: [
        'Sigue un modelo europeo: el nivel de cumplimiento, el contenido que no es accesible y por qué, cómo se preparó la declaración, un contacto para avisar de barreras y el procedimiento si no se responde.',
        'Para una empresa no es obligatoria con ese formato, pero la Ley 11/2023 sí le pide informar de cómo cumple sus servicios. Publicarla es la forma más clara de hacerlo y demuestra que la accesibilidad se toma en serio.',
        'La nuestra está publicada: puedes verla como ejemplo.',
      ],
      enlace: { ruta: 'accesibilidad', texto: 'Ver nuestra declaración de accesibilidad' },
    },
    {
      id: 'plugin',
      pregunta: '¿Un plugin o un widget de accesibilidad hace mi web accesible?',
      corta: 'No: un botón que añade opciones encima de la web no arregla el código que hay debajo.',
      detalle: [
        'Estos plugins dicen que cumples la ley con una línea de código. No pueden arreglar un formulario sin etiquetas, un menú que no funciona con teclado o una imagen sin descripción, y a veces estorban a los lectores de pantalla, que ya hacen su trabajo.',
        'Las personas que usan tecnologías de apoyo ya tienen sus ajustes en el navegador y en el sistema. Lo que necesitan es que la web esté bien hecha.',
      ],
      enlace: { ruta: 'blog', slug: 'no-un-plugin-de-accesibilidad', texto: 'Leer por qué no es un plugin' },
    },
    {
      id: 'google',
      pregunta: '¿La accesibilidad mejora mi posicionamiento en Google?',
      corta: 'No de forma directa: Google no la usa como factor, pero mucho de lo que hace accesible una web también ayuda a que Google la entienda.',
      detalle: [
        'Encabezados ordenados, imágenes con texto alternativo, enlaces que dicen adónde llevan, títulos de página claros, buena versión en móvil y páginas que cargan rápido: todo eso es accesibilidad y también lo valora un buscador.',
        'Y lo que más pesa: si más personas pueden usar tu web, se quedan más tiempo, encuentran lo que buscan y vuelven. Desconfía de quien te asegure que subirás puestos solo por instalar algo.',
      ],
    },
    {
      id: 'coste',
      pregunta: '¿Cuánto cuesta hacer accesible mi web?',
      corta: 'Depende del tamaño y del estado de la web: lo primero es una auditoría, que para una web de hasta diez páginas cuesta de 590 a 790 euros más IVA.',
      detalle: [
        'La auditoría dice qué falla, por qué importa y cómo se arregla, ordenado por prioridad. Con ella se puede calcular lo que cuesta corregir, que a veces lo hace el propio equipo de la web.',
        'Hacerla accesible desde el principio cuesta mucho menos que arreglarla después: por eso en nuestros proyectos de diseño y desarrollo la accesibilidad es el punto de partida.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'Ver las tarifas de auditoría' },
    },
    {
      id: 'revisar',
      pregunta: '¿Cada cuánto hay que revisar la accesibilidad de mi web?',
      corta: 'Cada vez que cambia algo importante, y con una revisión completa al menos una vez al año.',
      detalle: [
        'La accesibilidad no se consigue una vez: se pierde con cada imagen sin descripción o cada documento que se sube sin preparar.',
        'Lo que funciona es combinar tres cosas: una auditoría completa cuando hay cambios grandes, comprobaciones automáticas en cada publicación y un equipo que sabe publicar contenido accesible. Por eso al entregar cada proyecto formamos a quien lo va a gestionar.',
      ],
      enlace: { ruta: 'servicios', ancla: 'formacion', texto: 'Ver la formación' },
    },
    {
      id: 'lenguaje-inclusivo',
      pregunta: '¿Por qué es importante el lenguaje inclusivo en los contenidos digitales de mi organización?',
      corta: 'Porque la accesibilidad no es solo técnica: también es que cada persona se sienta nombrada y entienda lo que lee.',
      detalle: [
        'Lenguaje inclusivo es no dejar a nadie fuera al escribir: “las personas usuarias” o “quienes visitan” en lugar de un masculino que deja fuera a la mitad, y “personas con discapacidad” en lugar de etiquetas que reducen a alguien a su condición.',
        'Va de la mano del lenguaje claro: frases cortas, palabras comunes y una idea por párrafo. Hay normas para hacerlo bien, como la ISO 24495-1 de lenguaje claro y la UNE 153101 EX de lectura fácil.',
        'En el sector público, además, la Ley de Igualdad pide un lenguaje no sexista en la comunicación administrativa. Y para cualquier organización, el tono con el que escribe dice a quién tiene en cuenta.',
      ],
    },
    {
      id: 'contacto',
      pregunta: '¿Cómo puedo contactar con Accesibilidad Primero para encargar un proyecto o para colaborar?',
      corta: 'Escríbenos desde el formulario de contacto o a proyectos@accesibilidadprimero.com.',
      detalle: [
        'Para un proyecto, cuéntanos qué tienes y adónde quieres llegar: una web nueva, una auditoría de la que ya tienes o formación para tu equipo. Con eso preparamos una propuesta.',
        'Para colaborar, si eres un estudio, una agencia, una entidad o una persona que trabaja en accesibilidad, también nos interesa. Cuéntanos qué te gustaría hacer.',
      ],
      enlace: { ruta: 'contacto', texto: 'Ir al formulario de contacto' },
    },
  ],
  ca: [
    {
      id: 'obligatorio',
      pregunta: 'És obligatori que el meu web sigui accessible?',
      corta: 'Depèn de qui siguis: és obligatori per al sector públic, per a moltes empreses que venen productes i serveis a persones consumidores i per a les grans empreses de certs sectors.',
      detalle: [
        'Sector públic: el Reial decret 1112/2018 obliga administracions, universitats públiques i entitats públiques que els seus webs i aplicacions siguin accessibles i publiquin la seva declaració d’accessibilitat.',
        'Empreses: la Llei 11/2023, que transposa l’Acta Europea d’Accessibilitat, obliga des del 28 de juny de 2025 els serveis de comerç electrònic, banca per a persones consumidores, transport de viatgers, comunicacions electròniques, llibres electrònics i accés a serveis audiovisuals, entre d’altres.',
        'Grans empreses: la LSSI ja obligava les de més de cent treballadors en sectors com la banca, les assegurances, els subministraments, les telecomunicacions, el transport, les agències de viatges o el comerç al detall.',
        'Encara que no t’hi obligui, un web accessible el pot fer servir més gent. I si treballes amb el sector públic o reps ajudes, t’ho poden exigir igualment.',
      ],
    },
    {
      id: 'multa',
      pregunta: 'Em poden multar si el meu web no és accessible?',
      corta: 'Sí, si la teva organització hi està obligada: les multes van de 301 euros a 1.000.000 d’euros, segons la gravetat.',
      detalle: [
        'La Llei 11/2023 remet a la sanció de cada sector i, si no n’hi ha, a la Llei general de drets de les persones amb discapacitat. Segons aquesta llei, les infraccions lleus arriben fins a 30.000 euros, les greus fins a 90.000 i les molt greus fins a 1.000.000.',
        'Vigilen i sancionen les comunitats autònomes. A més de la multa, hi pot haver sancions accessòries, com no poder demanar ajudes públiques durant un temps.',
        'El més habitual abans d’una sanció és una queixa: qualsevol persona que trobi una barrera pot reclamar. Tenir el web auditat i una declaració d’accessibilitat al dia és la millor resposta.',
      ],
    },
    {
      id: 'subvencion',
      pregunta: 'Puc perdre una subvenció si el meu web no és accessible?',
      corta: 'Sí, per dos camins: perquè la convocatòria ho exigeixi com a condició o com a sanció per incomplir la llei d’accessibilitat.',
      detalle: [
        'Per la convocatòria: algunes ajudes exigeixen que el web compleixi l’accessibilitat, com passava amb els webs finançats pel Kit Digital. Si una condició de l’ajuda no es compleix, la Llei general de subvencions permet reclamar-ne el retorn.',
        'Per sanció: la Llei general de drets de les persones amb discapacitat preveu, juntament amb la multa, prohibir que demanis ajudes públiques en el teu sector fins a un any si la infracció és greu i fins a dos si és molt greu. En les molt greus, també es poden retirar les ajudes que ja tinguis.',
        'Abans de justificar una ajuda, revisa a les bases quin nivell d’accessibilitat demanen i guarda’n la prova: una auditoria amb data.',
      ],
    },
    {
      id: 'puntos',
      pregunta: 'Tinc més punts en una subvenció o en una licitació si el meu web és accessible?',
      corta: 'En una subvenció depèn de les bases; en un contracte públic, l’accessibilitat és obligatòria en els requisits tècnics i pot sumar punts.',
      detalle: [
        'No hi ha una regla general per a les subvencions: cada convocatòria fixa els seus criteris. Busca a les bases paraules com “accessibilitat”, “disseny universal” o “inclusió”.',
        'En els contractes públics, la Llei 9/2017 obliga a tenir en compte l’accessibilitat universal en definir el que es contracta, i permet valorar-la com a criteri de qualitat en adjudicar. Si la teva proposta inclou un web o un servei digital, demostrar que és accessible és un argument de pes.',
      ],
    },
    {
      id: 'certificacion',
      pregunta: 'El meu web pot aconseguir una certificació d’accessibilitat?',
      corta: 'En pot aconseguir una de voluntària, però no hi ha cap certificació oficial ni obligatòria.',
      detalle: [
        'AENOR ofereix una certificació voluntària, “Accesibilidad Web Verificada”, basada en la norma UNE-EN 301 549. Acredita el nivell d’un web en una data concreta, sense seguiment després.',
        'Un web canvia cada setmana: un certificat diu com estava el dia que es va revisar. El que demana la llei és complir, dir com es compleix i, en el sector públic, publicar la declaració d’accessibilitat.',
        'Per això preferim una auditoria amb el seu informe i una declaració que es manté al dia, i formar qui publica perquè no es perdi el que s’ha aconseguit.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'Veure l’auditoria d’accessibilitat' },
    },
    {
      id: 'une-en-301-549',
      pregunta: 'Què implica la norma UNE-EN 301 549?',
      corta: 'És la norma tècnica europea d’accessibilitat de productes i serveis digitals, i per al web remet a la WCAG en nivell AA.',
      detalle: [
        'L’EN 301 549 l’elaboren els organismes europeus de normalització i UNE la publica a Espanya com a UNE-EN 301 549. És la referència tècnica de les dues directives europees: complir-la dona presumpció que es compleix la llei.',
        'Va més enllà del web: cobreix documents, aplicacions, programari, equips i comunicacions en temps real, com el xat o la videotrucada.',
        'La versió que avui dona presumpció de conformitat és la 3.2.1, basada en la WCAG 2.1. La 4.1.1, basada en la WCAG 2.2, es va publicar el setembre de 2026 i passarà a ser la referència quan la citi el Diari Oficial de la UE, previst per a finals de 2026. Si el teu web compleix la WCAG 2.2 AA, ja estàs preparat.',
      ],
    },
    {
      id: 'microempresa',
      pregunta: 'Soc una microempresa, he de complir?',
      corta: 'Si prestes serveis, la Llei 11/2023 no t’hi obliga; si fabriques o vens productes dels que cobreix la llei, sí.',
      detalle: [
        'Una microempresa té menys de deu persones en plantilla i no factura més de dos milions d’euros l’any. Les que presten serveis, com una botiga en línia, queden fora de l’Acta Europea d’Accessibilitat.',
        'Però quedar fora de la llei no et deixa fora del teu públic: segons l’OMS, una de cada sis persones al món viu amb una discapacitat important, i totes ens fem grans. I si treballes per al sector públic o demanes ajudes, t’ho poden exigir.',
      ],
    },
    {
      id: 'declaracion',
      pregunta: 'Què és la declaració d’accessibilitat i l’he de publicar?',
      corta: 'És la pàgina que explica què compleix el teu web, què no i com avisar d’una barrera; el sector públic està obligat a publicar-la.',
      detalle: [
        'Segueix un model europeu: el nivell de compliment, el contingut que no és accessible i per què, com es va preparar la declaració, un contacte per avisar de barreres i el procediment si no es respon.',
        'Per a una empresa no és obligatòria amb aquest format, però la Llei 11/2023 sí que li demana informar de com compleixen els seus serveis. Publicar-la és la manera més clara de fer-ho i demostra que l’accessibilitat es pren seriosament.',
        'La nostra està publicada: la pots veure com a exemple.',
      ],
      enlace: { ruta: 'accesibilidad', texto: 'Veure la nostra declaració d’accessibilitat' },
    },
    {
      id: 'plugin',
      pregunta: 'Un connector o un giny d’accessibilitat fa el meu web accessible?',
      corta: 'No: un botó que afegeix opcions per sobre del web no arregla el codi que hi ha a sota.',
      detalle: [
        'Aquests connectors asseguren que es compleix la llei amb una línia de codi. No poden arreglar un formulari sense etiquetes, un menú que no funciona amb teclat o una imatge sense descripció, i de vegades destorben els lectors de pantalla, que ja fan la seva feina.',
        'Les persones que fan servir tecnologies de suport ja tenen els seus ajustos al navegador i al sistema. El que necessiten és que el web estigui ben fet.',
      ],
      enlace: { ruta: 'blog', slug: 'no-un-plugin-de-accesibilidad', texto: 'Llegir per què no és un connector (en castellà)' },
    },
    {
      id: 'google',
      pregunta: 'L’accessibilitat millora el meu posicionament a Google?',
      corta: 'No de manera directa: Google no la fa servir com a factor, però molt del que fa accessible un web també ajuda que Google l’entengui.',
      detalle: [
        'Encapçalaments ordenats, imatges amb text alternatiu, enllaços que diuen on porten, títols de pàgina clars, una bona versió per a mòbil i pàgines que carreguen ràpid: tot això és accessibilitat i també ho valora un cercador.',
        'I el que més pesa: si més persones poden fer servir el teu web, s’hi queden més temps, troben el que busquen i tornen. Desconfia de qui t’asseguri que pujaràs posicions només per instal·lar alguna cosa.',
      ],
    },
    {
      id: 'coste',
      pregunta: 'Quant costa fer accessible el meu web?',
      corta: 'Depèn de la mida i de l’estat del web: el primer és una auditoria, que per a un web de fins a deu pàgines costa de 590 a 790 euros més IVA.',
      detalle: [
        'L’auditoria diu què falla, per què importa i com s’arregla, ordenat per prioritat. Amb ella es pot calcular el que costa corregir-ho, que de vegades ho fa el mateix equip del web.',
        'Fer-lo accessible des del principi costa molt menys que arreglar-lo després: per això en els nostres projectes de disseny i desenvolupament l’accessibilitat és el punt de partida.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'Veure les tarifes d’auditoria' },
    },
    {
      id: 'revisar',
      pregunta: 'Cada quant s’ha de revisar l’accessibilitat del meu web?',
      corta: 'Cada vegada que canvia alguna cosa important, i amb una revisió completa almenys un cop l’any.',
      detalle: [
        'L’accessibilitat no s’aconsegueix una vegada: es perd amb cada imatge sense descripció o cada document que es puja sense preparar.',
        'El que funciona és combinar tres coses: una auditoria completa quan hi ha canvis grans, comprovacions automàtiques en cada publicació i un equip que sap publicar contingut accessible. Per això en lliurar cada projecte formem qui l’ha de gestionar.',
      ],
      enlace: { ruta: 'servicios', ancla: 'formacion', texto: 'Veure la formació' },
    },
    {
      id: 'lenguaje-inclusivo',
      pregunta: 'Per què és important el llenguatge inclusiu en els continguts digitals de la meva organització?',
      corta: 'Perquè l’accessibilitat no és només tècnica: també és que cada persona se senti anomenada i entengui el que llegeix.',
      detalle: [
        'Llenguatge inclusiu és no deixar ningú fora en escriure: “les persones usuàries” o “qui visita” en lloc d’un masculí que en deixa fora la meitat, i “persones amb discapacitat” en lloc d’etiquetes que redueixen algú a la seva condició.',
        'Va de bracet amb el llenguatge clar: frases curtes, paraules comunes i una idea per paràgraf. Hi ha normes per fer-ho bé, com la ISO 24495-1 de llenguatge clar i la UNE 153101 EX de lectura fàcil.',
        'En el sector públic, a més, la Llei d’igualtat demana un llenguatge no sexista en la comunicació administrativa. I per a qualsevol organització, el to amb què escriu diu qui té en compte.',
      ],
    },
    {
      id: 'contacto',
      pregunta: 'Com puc contactar amb Accesibilidad Primero per encarregar un projecte o per col·laborar?',
      corta: 'Escriu-nos des del formulari de contacte o a proyectos@accesibilidadprimero.com.',
      detalle: [
        'Per a un projecte, explica’ns què tens i on vols arribar: un web nou, una auditoria del que ja tens o formació per al teu equip. Amb això preparem una proposta.',
        'Per col·laborar, si ets un estudi, una agència, una entitat o una persona que treballa en accessibilitat, també ens interessa. Explica’ns què t’agradaria fer.',
      ],
      enlace: { ruta: 'contacto', texto: 'Anar al formulari de contacte' },
    },
  ],
  en: [
    {
      id: 'obligatorio',
      pregunta: 'Does my website have to be accessible?',
      corta: 'It depends on who you are: in Spain it is mandatory for the public sector, for many businesses that sell products and services to consumers, and for large companies in certain sectors.',
      detalle: [
        'Public sector: Royal Decree 1112/2018 requires public bodies, public universities and other public entities to make their websites and apps accessible and to publish an accessibility statement.',
        'Businesses: Act 11/2023, which transposes the European Accessibility Act, has applied since 28 June 2025 to e-commerce, consumer banking, passenger transport, electronic communications, e-books and access to audiovisual media services, among others.',
        'Large companies: Spain’s e-commerce act (LSSI) already required companies with more than a hundred employees in sectors such as banking, insurance, utilities, telecoms, transport, travel agencies and retail to have accessible websites.',
        'Even if the law does not apply to you, more people can use an accessible website. And if you work with the public sector or receive public funding, it may be required anyway.',
      ],
    },
    {
      id: 'multa',
      pregunta: 'Can I be fined if my website is not accessible?',
      corta: 'Yes, if your organisation is covered by the law: in Spain fines range from €301 to €1,000,000, depending on how serious the breach is.',
      detalle: [
        'Act 11/2023 refers to each sector’s own penalties and, where there are none, to Spain’s General Act on the Rights of Disabled People. Under that act, minor breaches carry fines of up to €30,000, serious ones up to €90,000 and very serious ones up to €1,000,000.',
        'The regional governments are in charge of enforcement. Alongside the fine there can be additional penalties, such as being barred from applying for public funding for a period.',
        'Before any penalty, the most common step is a complaint: anyone who comes up against a barrier can report it. An audited website and an up-to-date accessibility statement are the best answer.',
      ],
    },
    {
      id: 'subvencion',
      pregunta: 'Could I lose a grant if my website is not accessible?',
      corta: 'Yes, in two ways: because the grant makes accessibility a condition, or as a penalty for breaching accessibility law.',
      detalle: [
        'Through the grant itself: some funding programmes require the website to be accessible, as was the case with websites funded by Spain’s Kit Digital. If a condition of the grant is not met, Spain’s General Grants Act allows the money to be reclaimed.',
        'Through a penalty: alongside the fine, the General Act on the Rights of Disabled People allows a ban on applying for public funding in your sector for up to one year for serious breaches and up to two years for very serious ones. For very serious breaches, funding already awarded can also be withdrawn.',
        'Before you report back on a grant, check what level of accessibility its terms require and keep the evidence: a dated audit.',
      ],
    },
    {
      id: 'puntos',
      pregunta: 'Do I score more points in a grant or a public tender if my website is accessible?',
      corta: 'For a grant it depends on its terms; in a public contract, accessibility is mandatory in the technical requirements and can earn points.',
      detalle: [
        'There is no general rule for grants: each programme sets its own criteria. Look in the terms for words such as “accessibility”, “universal design” or “inclusion”.',
        'In public contracts, Spain’s Public Sector Contracts Act (9/2017) requires universal accessibility to be taken into account when defining what is being procured, and allows it to be scored as a quality criterion when awarding. If your bid includes a website or a digital service, showing that it is accessible carries weight.',
      ],
    },
    {
      id: 'certificacion',
      pregunta: 'Can my website get an accessibility certification?',
      corta: 'It can get a voluntary one, but there is no official or mandatory certification.',
      detalle: [
        'In Spain, AENOR offers a voluntary certification, “Accesibilidad Web Verificada” (verified web accessibility), based on the UNE-EN 301 549 standard. It confirms a website’s level on a given date, with no follow-up afterwards.',
        'A website changes every week: a certificate tells you how it was on the day it was checked. What the law asks for is compliance, explaining how you comply and, in the public sector, publishing an accessibility statement.',
        'That is why we prefer an audit with its report, a statement that is kept up to date, and training for the people who publish content so that what has been achieved is not lost.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'See the accessibility audit' },
    },
    {
      id: 'une-en-301-549',
      pregunta: 'What does the EN 301 549 standard involve?',
      corta: 'It is the European technical standard for the accessibility of digital products and services, and for the web it refers to WCAG at level AA.',
      detalle: [
        'EN 301 549 is drawn up by the European standards bodies; in Spain, UNE publishes it as UNE-EN 301 549. It is the technical reference for both European directives: meeting it gives a presumption that you meet the law.',
        'It goes beyond the web: it also covers documents, apps, software, hardware and real-time communication such as chat and video calls.',
        'The version that currently gives a presumption of conformity is 3.2.1, based on WCAG 2.1. Version 4.1.1, based on WCAG 2.2, was published in September 2026 and will become the reference once it is cited in the Official Journal of the EU, expected by the end of 2026. If your website meets WCAG 2.2 AA, you are already prepared.',
      ],
    },
    {
      id: 'microempresa',
      pregunta: 'I run a microenterprise. Do I have to comply?',
      corta: 'If you provide services, the European Accessibility Act does not apply to you; if you make or sell products it covers, it does.',
      detalle: [
        'A microenterprise has fewer than ten staff and a turnover of no more than €2 million a year. Those that provide services, such as an online shop, are exempt from the European Accessibility Act.',
        'But being outside the law does not put you outside your audience: according to the WHO, one in six people worldwide lives with a significant disability, and we all get older. And if you work for the public sector or apply for funding, it may be required.',
      ],
    },
    {
      id: 'declaracion',
      pregunta: 'What is an accessibility statement and do I have to publish one?',
      corta: 'It is the page that explains what your website meets, what it does not and how to report a barrier; the public sector must publish one.',
      detalle: [
        'It follows a European model: the compliance status, the content that is not accessible and why, how the statement was prepared, a contact for reporting barriers and the enforcement procedure if there is no reply.',
        'For a business it is not mandatory in that format, but Act 11/2023 does require it to explain how its services comply. Publishing a statement is the clearest way to do that, and it shows that accessibility is taken seriously.',
        'Ours is published: you can use it as an example.',
      ],
      enlace: { ruta: 'accesibilidad', texto: 'See our accessibility statement' },
    },
    {
      id: 'plugin',
      pregunta: 'Does an accessibility plugin or widget make my website accessible?',
      corta: 'No: a button that adds options on top of a website does not fix the code underneath.',
      detalle: [
        'These plugins claim to make you compliant with one line of code. They cannot fix a form without labels, a menu that does not work with a keyboard or an image without a description, and they sometimes get in the way of screen readers, which already do their job.',
        'People who use assistive technologies already have their own settings in their browser and operating system. What they need is a website that is built properly.',
      ],
      enlace: { ruta: 'blog', slug: 'no-un-plugin-de-accesibilidad', texto: 'Read why it is not a plugin (in Spanish)' },
    },
    {
      id: 'google',
      pregunta: 'Does accessibility improve my Google ranking?',
      corta: 'Not directly: Google does not use it as a ranking factor, but much of what makes a website accessible also helps Google understand it.',
      detalle: [
        'Well-ordered headings, images with alt text, links that say where they go, clear page titles, a good mobile version and pages that load quickly: all of that is accessibility, and search engines value it too.',
        'And what matters most: if more people can use your website, they stay longer, find what they are looking for and come back. Be wary of anyone who claims you will climb the rankings just by installing something.',
      ],
    },
    {
      id: 'coste',
      pregunta: 'How much does it cost to make my website accessible?',
      corta: 'It depends on the size and state of the website: the first step is an audit, which costs €590 to €790 + VAT for a website of up to ten pages.',
      detalle: [
        'The audit sets out what goes wrong, why it matters and how to fix it, in order of priority. With it you can work out what the fixes will cost; sometimes the website’s own team can make them.',
        'Building it accessible from the start costs far less than fixing it afterwards: that is why accessibility is the starting point in our design and development projects.',
      ],
      enlace: { ruta: 'servicios', ancla: 'auditoria', texto: 'See audit pricing' },
    },
    {
      id: 'revisar',
      pregunta: 'How often should I check my website’s accessibility?',
      corta: 'Whenever something important changes, and with a full review at least once a year.',
      detalle: [
        'Accessibility is not achieved once and for all: it is lost with every image without a description or every document uploaded without preparation.',
        'What works is combining three things: a full audit when there are big changes, automated checks every time you publish, and a team that knows how to publish accessible content. That is why we train the people who will manage each project when we hand it over.',
      ],
      enlace: { ruta: 'servicios', ancla: 'formacion', texto: 'See our training' },
    },
    {
      id: 'lenguaje-inclusivo',
      pregunta: 'Why does inclusive language matter in my organisation’s digital content?',
      corta: 'Because accessibility is not only technical: it is also about everyone feeling included and understanding what they read.',
      detalle: [
        'Inclusive language means leaving no one out when you write: “everyone” or “people who visit” rather than wording that assumes one gender, and person-centred or community-preferred terms rather than labels that reduce someone to a condition.',
        'It goes hand in hand with plain language: short sentences, everyday words and one idea per paragraph. There are standards for doing it well, such as ISO 24495-1 on plain language and, in Spain, UNE 153101 EX on easy-to-read content.',
        'In the Spanish public sector, the Equality Act also requires non-sexist language in official communication. And for any organisation, the way it writes shows who it has in mind.',
      ],
    },
    {
      id: 'contacto',
      pregunta: 'How can I contact Accesibilidad Primero to commission a project or to collaborate?',
      corta: 'Write to us through the contact form or at proyectos@accesibilidadprimero.com.',
      detalle: [
        'For a project, tell us what you have and where you want to get to: a new website, an audit of the one you already have or training for your team. With that, we put together a proposal.',
        'To collaborate, if you are a studio, an agency, an organisation or someone working in accessibility, we would like to hear from you too. Tell us what you have in mind.',
      ],
      enlace: { ruta: 'contacto', texto: 'Go to the contact form' },
    },
  ],
};
