/* ---------------------------------------------------------------------------
   Itza · los textos de la landing (itza.accesibilidadprimero.eu), en los tres
   idiomas (Johnny, 07/11/2026).

   Salen de la landing de itza.accesibilidadprimero.com, reescritos con la voz
   de la web nueva y comprobados contra el código del plugin (v2.2.0) y del
   proxy. Lo que cambió respecto a la .com, y por qué:
   · «Certificado WCAG 2.1 AA»: no existe una certificación oficial. Ahora:
     diseñado con las WCAG 2.2 AA y probado con teclado y lector de pantalla.
   · «No almacena conversaciones en servidores externos»: las preguntas pasan
     por el proxy de AP y la API de Anthropic para generar la respuesta. Se
     dice así. Lo que sí se guarda en el WordPress de la organización son los
     contactos (con su conversación) y las preguntas sin respuesta.
   · «Voz en español, catalán o inglés»: el plugin escucha y habla en es-ES.
     Responde por escrito en los tres idiomas; la voz, en castellano.
   · «Sin costes ocultos de API»: fuera. El precio ya dice lo que incluye.
   · Precios: los de la .com (36 €/mes + IVA, instalación 140 € o gratis con
     la anual, sin permanencia). El prompt del proxy viejo todavía traía tres
     planes de 49, 69 y 89 €: el de esta landing (itza-worker/index.ts) lleva
     los buenos.
   · Off Escuela fuera (Johnny, 07/11/2026: «Itza no está instalada en
     Off»). No se nombra ningún cliente hasta que Itza funcione en su web.
   --------------------------------------------------------------------------- */
import type { Lang } from '../../i18n/config';

export interface Bloque { titulo: string; texto: string }

export const ITZA: Record<Lang, {
  title: string; description: string; saltar: string; idioma: string; inicio: string;
  pedir: string;
  heroL1: string; heroL2: string; heroTexto: string; probar: string; verPrecio: string;
  datos: [string, string][];
  altHero: string; nombreHero: string;
  preguntasTitulo: string; preguntasIntro: string; preguntas: string[]; preguntasCierre: string;
  paraTitulo: string; paraTexto: string;
  demoTitulo: string; demoTexto: string; demoPrivacidad: string; demoSinJs: string; demoCaso: string;
  barra: string;
  queTitulo: string; que: Bloque[];
  accTitulo: string; accTexto: string; acc: string[];
  precioTitulo: string; precio: string; precioUnidad: string; precioIva: string;
  instalacion: string; permanencia: string; incluyeTitulo: string; incluye: string[]; precioNota: string;
  comoTitulo: string; como: Bloque[];
  faqTitulo: string; faq: { pregunta: string; respuesta: string }[];
  cierreTitulo: string; cierreTexto: string; escribenos: string; correo: string;
  pieProducto: string; pieAp: string; pieCaso: string; piePrivacidad: string; pieAccesibilidad: string;
  /* La ventana de la demo. */
  chat: {
    titulo: string; cerrar: string; bienvenida: string; etiqueta: string; enviar: string;
    escribiendo: string; error: string; sugerencias: string; sugeridas: string[];
    hablar: string; escuchando: string; leer: string; tu: string; itza: string; conversacion: string;
    limite: string;
  };
}> = {
  es: {
    title: 'Itza® · Asistente accesible para organizaciones con impacto social',
    description: 'Itza responde las preguntas de quienes visitan la web de tu organización, las 24 horas, con teclado, voz y lector de pantalla. 36 € al mes, sin permanencia.',
    saltar: 'Saltar al contenido', idioma: 'Idioma', inicio: 'Itza, inicio',
    pedir: 'Pedir una demo',
    heroL1: 'Las personas que visitan tu web tienen preguntas.',
    heroL2: 'Itza las responde.',
    heroTexto: 'Un asistente accesible para asociaciones, fundaciones, centros educativos y proyectos culturales. Atiende las 24 horas, responde con la información de tu organización y recoge el contacto de quien quiere que le escribáis.',
    probar: 'Probar Itza', verPrecio: 'Ver el precio',
    datos: [['Atiende', 'las 24 horas'], ['Se usa', 'con teclado, voz y lector de pantalla'], ['Cuesta', '36 € al mes + IVA'], ['Funciona', 'en unas 48 horas']],
    altHero: 'Una consulta en Itza: Marta pulsa la barra “Pregúntame lo que necesites”, se abre la ventana y el asistente le pregunta cómo llamarla. Escribe “Me llamo Marta”, elige una pregunta sugerida y el asistente le responde.',
    nombreHero: 'la consulta de Marta',
    preguntasTitulo: 'Las preguntas de siempre, respondidas a cualquier hora.',
    preguntasIntro: 'Cada organización responde a mano las mismas preguntas, una y otra vez:',
    preguntas: ['Cómo me apunto.', 'Qué servicios ofrecéis.', 'Qué horario tenéis.', 'Si quedan plazas este mes.', 'Cómo hablo con el equipo.', 'Si hay becas o ayudas.'],
    preguntasCierre: 'Itza las responde con la información de tu organización. Lo que no sabe, no se lo inventa: lo dice y ofrece el contacto del equipo.',
    paraTitulo: 'Pensado para organizaciones con impacto social.',
    paraTexto: 'Asociaciones, fundaciones, ONG, centros educativos, escuelas y proyectos culturales. Equipos pequeños que reciben muchas preguntas y tienen poco tiempo para contestarlas.',
    demoTitulo: 'Pruébalo aquí.',
    demoTexto: 'Esta es Itza en esta misma página, respondiendo sobre sí misma. Pregúntale lo que quieras saber antes de contratarla.',
    demoPrivacidad: 'Lo que escribas se envía a la API de Claude, de Anthropic, para generar la respuesta. No lo guardamos. No escribas datos personales en la demo.',
    demoSinJs: 'La demo necesita JavaScript. Si lo tienes desactivado, puedes ver cómo funciona Itza en su caso de estudio.',
    demoCaso: 'Ver el caso de estudio',
    barra: 'Pregúntame lo que necesites',
    queTitulo: 'Qué hace Itza.',
    que: [
      { titulo: 'Responde las 24 horas.', texto: 'Con la información de tu organización: servicios, horarios, inscripciones y contacto. Lee tu web para preparar la configuración, y nosotros la revisamos contigo.' },
      { titulo: 'En el idioma de quien pregunta.', texto: 'Contesta por escrito en castellano, catalán o inglés, según el idioma en que le escriban. Se le puede preguntar hablando y escuchar la respuesta en castellano.' },
      { titulo: 'Con tu nombre y tus colores.', texto: 'El nombre del asistente, los colores y el mensaje de bienvenida son los de tu organización.' },
      { titulo: 'Recoge contactos.', texto: 'Al terminar, propone dejar nombre y correo. Si la persona los deja, te llegan por correo con la conversación y se guardan en tu WordPress.' },
      { titulo: 'Te dice lo que no sabe.', texto: 'En el panel de WordPress ves el uso del mes, los contactos y las preguntas que no supo responder, para completar la información.' },
      { titulo: 'Lo instalamos nosotros.', texto: 'Es un plugin de WordPress. Lo configuramos y lo dejamos funcionando en tu web, sin equipo técnico.' },
    ],
    accTitulo: 'Accesible desde el diseño.',
    accTexto: 'Un chat es una ventana que se abre encima de la página. Si no se maneja con teclado, si el lector de pantalla no anuncia las respuestas o si atrapa el foco, deja fuera a quien más ayuda necesita. Itza está diseñado con las WCAG 2.2 AA y probado con teclado y lector de pantalla.',
    acc: [
      'Se abre, se usa y se cierra con teclado, y el foco vuelve a su sitio al cerrar.',
      'Cada respuesta se anuncia sola en el lector de pantalla.',
      'Se puede preguntar hablando y escuchar la respuesta.',
      'Una barra que dice qué es, “Pregúntame lo que necesites”, en lugar de un icono en una esquina.',
      'Respeta la preferencia de reducir el movimiento.',
      'Respuestas cortas y en lenguaje claro.',
    ],
    precioTitulo: 'Un precio, sin letra pequeña.',
    precio: '36 €', precioUnidad: 'al mes', precioIva: '+ IVA',
    instalacion: 'Instalación: 140 €, en un solo pago. Gratis con la suscripción anual.',
    permanencia: 'Sin permanencia.',
    incluyeTitulo: 'Incluye',
    incluye: [
      'El asistente con el nombre y los colores de tu organización.',
      'Respuestas en castellano, catalán e inglés.',
      'Los contactos, con su conversación.',
      'Un panel con el uso, los contactos y las preguntas sin respuesta.',
      'Preparar de nuevo la información cuando cambie tu web.',
      'Soporte por correo y por videollamada.',
    ],
    precioNota: 'Los precios no incluyen IVA. Para varias webs o casos especiales, escríbenos.',
    comoTitulo: 'Funcionando en unas 48 horas.',
    como: [
      { titulo: 'Nos dices la dirección de tu web.', texto: 'Itza la lee para preparar la configuración.' },
      { titulo: 'Lo configuramos contigo.', texto: 'Nombre, colores, mensaje de bienvenida y preguntas sugeridas.' },
      { titulo: 'Lo instalamos.', texto: 'En tu WordPress. Con la suscripción anual, la instalación es gratis.' },
      { titulo: 'Empieza a responder.', texto: 'Desde el primer día atiende visitas y recoge contactos.' },
    ],
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { pregunta: 'Hace falta configurarlo a mano', respuesta: 'No. Itza lee tu web pública para preparar la información, y nosotros la revisamos contigo.' },
      { pregunta: 'Si cambio mi web, Itza se entera', respuesta: 'No en tiempo real. Si cambias algo importante, nos lo dices y preparamos de nuevo la información. Está incluido en la suscripción.' },
      { pregunta: 'Necesito conocimientos técnicos', respuesta: 'No. Solo una web en WordPress. Lo instalamos nosotros y te lo explicamos por videollamada.' },
      { pregunta: 'Funciona fuera de WordPress', respuesta: 'De momento es un plugin de WordPress. Para otras plataformas, escríbenos y lo valoramos.' },
      { pregunta: 'Puedo cancelarlo cuando quiera', respuesta: 'Sí. No hay permanencia ni penalizaciones. El servicio termina al acabar el periodo pagado.' },
      { pregunta: 'Qué pasa con los datos', respuesta: 'Las preguntas se envían a la API de Claude, de Anthropic, a través de nuestro servidor, para generar la respuesta. Los contactos que deja la gente se guardan en el WordPress de tu organización y te llegan por correo.' },
      { pregunta: 'Puedo leer las conversaciones', respuesta: 'Ves las conversaciones de quienes dejan su contacto y las preguntas que Itza no supo responder. Las demás conversaciones no se guardan en tu WordPress.' },
    ],
    cierreTitulo: 'Itza en la web de tu organización.',
    cierreTexto: 'Escríbenos y te contamos cómo quedaría en tu web, sin compromiso.',
    escribenos: 'Escríbenos', correo: 'proyectos@accesibilidadprimero.com',
    pieProducto: 'Itza® es un producto de Accesibilidad Primero.',
    pieAp: 'Accesibilidad Primero', pieCaso: 'Caso de estudio', piePrivacidad: 'Privacidad', pieAccesibilidad: 'Accesibilidad',
    chat: {
      titulo: 'Itza', cerrar: 'Cerrar', bienvenida: 'Hola, soy Itza. ¿Cómo te llamo?',
      etiqueta: 'Tu mensaje', enviar: 'Enviar', escribiendo: 'Itza está escribiendo…',
      error: 'No he podido responder. Inténtalo de nuevo o escríbenos a proyectos@accesibilidadprimero.com.',
      sugerencias: 'Preguntas sugeridas',
      sugeridas: ['¿Qué es Itza y para quién es?', '¿Cuánto cuesta?', '¿Cómo se instala?', '¿Qué hace por la accesibilidad?', 'Quiero probarlo en mi organización'],
      hablar: 'Hablar', escuchando: 'Escuchando…', leer: 'Leer las respuestas en voz alta',
      tu: 'Tú:', itza: 'Itza:', conversacion: 'Conversación con Itza',
      limite: 'La demo termina aquí. Si quieres seguir, escríbenos a proyectos@accesibilidadprimero.com.',
    },
  },
  ca: {
    title: 'Itza® · Assistent accessible per a organitzacions amb impacte social',
    description: 'Itza respon les preguntes de qui visita el web de la teva organització, les 24 hores, amb teclat, veu i lector de pantalla. 36 € al mes, sense permanència.',
    saltar: 'Salta al contingut', idioma: 'Idioma', inicio: 'Itza, inici',
    pedir: 'Demana una demo',
    heroL1: 'Les persones que visiten el teu web tenen preguntes.',
    heroL2: 'Itza les respon.',
    heroTexto: 'Un assistent accessible per a associacions, fundacions, centres educatius i projectes culturals. Atén les 24 hores, respon amb la informació de la teva organització i recull el contacte de qui vol que li escriviu.',
    probar: 'Prova Itza', verPrecio: 'Mira el preu',
    datos: [['Atén', 'les 24 hores'], ['Es fa servir', 'amb teclat, veu i lector de pantalla'], ['Costa', '36 € al mes + IVA'], ['Funciona', 'en unes 48 hores']],
    altHero: 'Una consulta a Itza: la Marta prem la barra “Pregunta’m el que necessitis”, s’obre la finestra i l’assistent li pregunta com dir-li. Escriu “Em dic Marta”, tria una pregunta suggerida i l’assistent li respon.',
    nombreHero: 'la consulta de la Marta',
    preguntasTitulo: 'Les preguntes de sempre, respostes a qualsevol hora.',
    preguntasIntro: 'Cada organització respon a mà les mateixes preguntes, una vegada i una altra:',
    preguntas: ['Com m’hi apunto.', 'Quins serveis oferiu.', 'Quin horari teniu.', 'Si queden places aquest mes.', 'Com parlo amb l’equip.', 'Si hi ha beques o ajuts.'],
    preguntasCierre: 'Itza les respon amb la informació de la teva organització. El que no sap, no s’ho inventa: ho diu i ofereix el contacte de l’equip.',
    paraTitulo: 'Pensat per a organitzacions amb impacte social.',
    paraTexto: 'Associacions, fundacions, ONG, centres educatius, escoles i projectes culturals. Equips petits que reben moltes preguntes i tenen poc temps per contestar-les.',
    demoTitulo: 'Prova-ho aquí.',
    demoTexto: 'Aquesta és Itza en aquesta mateixa pàgina, responent sobre si mateixa. Pregunta-li el que vulguis saber abans de contractar-la.',
    demoPrivacidad: 'El que escriguis s’envia a l’API de Claude, d’Anthropic, per generar la resposta. No ho guardem. No escriguis dades personals a la demo.',
    demoSinJs: 'La demo necessita JavaScript. Si el tens desactivat, pots veure com funciona Itza al seu cas d’estudi.',
    demoCaso: 'Mira el cas d’estudi',
    barra: 'Pregunta’m el que necessitis',
    queTitulo: 'Què fa Itza.',
    que: [
      { titulo: 'Respon les 24 hores.', texto: 'Amb la informació de la teva organització: serveis, horaris, inscripcions i contacte. Llegeix el teu web per preparar la configuració, i nosaltres la revisem amb tu.' },
      { titulo: 'En l’idioma de qui pregunta.', texto: 'Contesta per escrit en castellà, català o anglès, segons l’idioma en què li escriguin. Se li pot preguntar parlant i escoltar la resposta en castellà.' },
      { titulo: 'Amb el teu nom i els teus colors.', texto: 'El nom de l’assistent, els colors i el missatge de benvinguda són els de la teva organització.' },
      { titulo: 'Recull contactes.', texto: 'En acabar, proposa deixar nom i correu. Si la persona els deixa, et arriben per correu amb la conversa i es guarden al teu WordPress.' },
      { titulo: 'Et diu el que no sap.', texto: 'Al tauler de WordPress veus l’ús del mes, els contactes i les preguntes que no ha sabut respondre, per completar la informació.' },
      { titulo: 'L’instal·lem nosaltres.', texto: 'És un plugin de WordPress. El configurem i el deixem funcionant al teu web, sense equip tècnic.' },
    ],
    accTitulo: 'Accessible des del disseny.',
    accTexto: 'Un xat és una finestra que s’obre a sobre de la pàgina. Si no es fa servir amb teclat, si el lector de pantalla no anuncia les respostes o si atrapa el focus, deixa fora qui més ajuda necessita. Itza està dissenyat amb les WCAG 2.2 AA i provat amb teclat i lector de pantalla.',
    acc: [
      'S’obre, es fa servir i es tanca amb teclat, i el focus torna al seu lloc en tancar.',
      'Cada resposta s’anuncia sola al lector de pantalla.',
      'Se li pot preguntar parlant i escoltar la resposta.',
      'Una barra que diu què és, “Pregunta’m el que necessitis”, en lloc d’una icona en un racó.',
      'Respecta la preferència de reduir el moviment.',
      'Respostes curtes i en llenguatge clar.',
    ],
    precioTitulo: 'Un preu, sense lletra petita.',
    precio: '36 €', precioUnidad: 'al mes', precioIva: '+ IVA',
    instalacion: 'Instal·lació: 140 €, en un sol pagament. Gratis amb la subscripció anual.',
    permanencia: 'Sense permanència.',
    incluyeTitulo: 'Inclou',
    incluye: [
      'L’assistent amb el nom i els colors de la teva organització.',
      'Respostes en castellà, català i anglès.',
      'Els contactes, amb la seva conversa.',
      'Un tauler amb l’ús, els contactes i les preguntes sense resposta.',
      'Tornar a preparar la informació quan canviï el teu web.',
      'Suport per correu i per videotrucada.',
    ],
    precioNota: 'Els preus no inclouen l’IVA. Per a diversos webs o casos especials, escriu-nos.',
    comoTitulo: 'Funcionant en unes 48 hores.',
    como: [
      { titulo: 'Ens dius l’adreça del teu web.', texto: 'Itza la llegeix per preparar la configuració.' },
      { titulo: 'El configurem amb tu.', texto: 'Nom, colors, missatge de benvinguda i preguntes suggerides.' },
      { titulo: 'L’instal·lem.', texto: 'Al teu WordPress. Amb la subscripció anual, la instal·lació és gratis.' },
      { titulo: 'Comença a respondre.', texto: 'Des del primer dia atén visites i recull contactes.' },
    ],
    faqTitulo: 'Preguntes freqüents',
    faq: [
      { pregunta: 'Cal configurar-lo a mà', respuesta: 'No. Itza llegeix el teu web públic per preparar la informació, i nosaltres la revisem amb tu.' },
      { pregunta: 'Si canvio el meu web, Itza se n’assabenta', respuesta: 'No en temps real. Si canvies alguna cosa important, ens ho dius i tornem a preparar la informació. Està inclòs a la subscripció.' },
      { pregunta: 'Necessito coneixements tècnics', respuesta: 'No. Només un web en WordPress. L’instal·lem nosaltres i t’ho expliquem per videotrucada.' },
      { pregunta: 'Funciona fora de WordPress', respuesta: 'De moment és un plugin de WordPress. Per a altres plataformes, escriu-nos i ho valorem.' },
      { pregunta: 'Puc cancel·lar-lo quan vulgui', respuesta: 'Sí. No hi ha permanència ni penalitzacions. El servei acaba quan s’acaba el període pagat.' },
      { pregunta: 'Què passa amb les dades', respuesta: 'Les preguntes s’envien a l’API de Claude, d’Anthropic, a través del nostre servidor, per generar la resposta. Els contactes que deixa la gent es guarden al WordPress de la teva organització i et arriben per correu.' },
      { pregunta: 'Puc llegir les converses', respuesta: 'Veus les converses de qui deixa el seu contacte i les preguntes que Itza no ha sabut respondre. Les altres converses no es guarden al teu WordPress.' },
    ],
    cierreTitulo: 'Itza al web de la teva organització.',
    cierreTexto: 'Escriu-nos i t’expliquem com quedaria al teu web, sense compromís.',
    escribenos: 'Escriu-nos', correo: 'proyectos@accesibilidadprimero.com',
    pieProducto: 'Itza® és un producte d’Accesibilidad Primero.',
    pieAp: 'Accesibilidad Primero', pieCaso: 'Cas d’estudi', piePrivacidad: 'Privacitat', pieAccesibilidad: 'Accessibilitat',
    chat: {
      titulo: 'Itza', cerrar: 'Tanca', bienvenida: 'Hola, soc Itza. Com et dic?',
      etiqueta: 'El teu missatge', enviar: 'Envia', escribiendo: 'Itza està escrivint…',
      error: 'No he pogut respondre. Torna-ho a provar o escriu-nos a proyectos@accesibilidadprimero.com.',
      sugerencias: 'Preguntes suggerides',
      sugeridas: ['Què és Itza i per a qui és?', 'Quant costa?', 'Com s’instal·la?', 'Què fa per l’accessibilitat?', 'Vull provar-lo a la meva organització'],
      hablar: 'Parla', escuchando: 'Escoltant…', leer: 'Llegeix les respostes en veu alta',
      tu: 'Tu:', itza: 'Itza:', conversacion: 'Conversa amb Itza',
      limite: 'La demo acaba aquí. Si vols continuar, escriu-nos a proyectos@accesibilidadprimero.com.',
    },
  },
  en: {
    title: 'Itza® · An accessible assistant for social impact organisations',
    description: 'Itza answers the questions of people who visit your organisation’s website, 24 hours a day, by keyboard, voice and screen reader. €36 a month, no commitment.',
    saltar: 'Skip to content', idioma: 'Language', inicio: 'Itza, home',
    pedir: 'Ask for a demo',
    heroL1: 'People who visit your website have questions.',
    heroL2: 'Itza answers them.',
    heroTexto: 'An accessible assistant for associations, foundations, schools and cultural projects. It works 24 hours a day, answers with your organisation’s information and collects the details of anyone who wants you to get in touch.',
    probar: 'Try Itza', verPrecio: 'See the price',
    datos: [['Available', '24 hours a day'], ['Works with', 'keyboard, voice and screen readers'], ['Costs', '€36 a month + VAT'], ['Ready', 'in about 48 hours']],
    altHero: 'A conversation in Itza: Marta presses the bar “Ask me anything you need”, the window opens and the assistant asks what to call her. She types “I’m Marta”, picks a suggested question and the assistant answers.',
    nombreHero: 'Marta’s conversation',
    preguntasTitulo: 'The usual questions, answered at any time.',
    preguntasIntro: 'Every organisation answers the same questions by hand, again and again:',
    preguntas: ['How do I sign up.', 'What services do you offer.', 'What are your opening hours.', 'Are there places left this month.', 'How do I talk to the team.', 'Are there grants or bursaries.'],
    preguntasCierre: 'Itza answers them with your organisation’s information. What it doesn’t know, it doesn’t make up: it says so and offers the team’s contact details.',
    paraTitulo: 'Made for social impact organisations.',
    paraTexto: 'Associations, foundations, NGOs, schools and cultural projects. Small teams who get lots of questions and have little time to answer them.',
    demoTitulo: 'Try it here.',
    demoTexto: 'This is Itza on this very page, answering questions about itself. Ask it anything you want to know before you sign up.',
    demoPrivacidad: 'What you type is sent to Anthropic’s Claude API to generate the answer. We don’t keep it. Don’t type personal details into the demo.',
    demoSinJs: 'The demo needs JavaScript. If it’s turned off, you can see how Itza works in its case study.',
    demoCaso: 'See the case study',
    barra: 'Ask me anything you need',
    queTitulo: 'What Itza does.',
    que: [
      { titulo: 'Answers 24 hours a day.', texto: 'With your organisation’s information: services, opening hours, sign-up and contact details. It reads your website to prepare the setup, and we check it with you.' },
      { titulo: 'In the visitor’s language.', texto: 'It replies in writing in Spanish, Catalan or English, depending on the language people write in. You can also ask out loud and hear the answer in Spanish.' },
      { titulo: 'With your name and your colours.', texto: 'The assistant’s name, its colours and its welcome message are your organisation’s.' },
      { titulo: 'Collects contacts.', texto: 'At the end, it offers to take a name and email. If the person leaves them, you get them by email with the conversation, and they’re saved in your WordPress.' },
      { titulo: 'Tells you what it doesn’t know.', texto: 'In the WordPress dashboard you see this month’s use, the contacts and the questions it couldn’t answer, so you can fill the gaps.' },
      { titulo: 'We install it for you.', texto: 'It’s a WordPress plugin. We set it up and leave it working on your website, with no developers needed.' },
    ],
    accTitulo: 'Accessible by design.',
    accTexto: 'A chat is a window that opens on top of the page. If it can’t be used with a keyboard, if the screen reader doesn’t announce the answers or if it traps the focus, it leaves out the people who most need help. Itza is designed to WCAG 2.2 AA and tested with a keyboard and a screen reader.',
    acc: [
      'It opens, works and closes with the keyboard, and the focus returns to where it was when it closes.',
      'Each answer is announced automatically by the screen reader.',
      'You can ask out loud and listen to the answer.',
      'A bar that says what it is, “Ask me anything you need”, instead of an icon in a corner.',
      'It respects the reduced motion setting.',
      'Short answers in plain language.',
    ],
    precioTitulo: 'One price, no small print.',
    precio: '€36', precioUnidad: 'a month', precioIva: '+ VAT',
    instalacion: 'Installation: €140, paid once. Free with an annual subscription.',
    permanencia: 'No minimum term.',
    incluyeTitulo: 'Includes',
    incluye: [
      'The assistant with your organisation’s name and colours.',
      'Answers in Spanish, Catalan and English.',
      'Contacts, with their conversation.',
      'A dashboard with use, contacts and unanswered questions.',
      'Preparing the information again when your website changes.',
      'Support by email and video call.',
    ],
    precioNota: 'Prices exclude VAT. For several websites or special cases, write to us.',
    comoTitulo: 'Up and running in about 48 hours.',
    como: [
      { titulo: 'You tell us your website address.', texto: 'Itza reads it to prepare the setup.' },
      { titulo: 'We set it up with you.', texto: 'Name, colours, welcome message and suggested questions.' },
      { titulo: 'We install it.', texto: 'On your WordPress site. With an annual subscription, installation is free.' },
      { titulo: 'It starts answering.', texto: 'From day one it helps visitors and collects contacts.' },
    ],
    faqTitulo: 'Frequently asked questions',
    faq: [
      { pregunta: 'Does it need setting up by hand', respuesta: 'No. Itza reads your public website to prepare the information, and we check it with you.' },
      { pregunta: 'If my website changes, Itza finds out', respuesta: 'Not in real time. If you change something important, tell us and we prepare the information again. It’s included in the subscription.' },
      { pregunta: 'Do I need technical knowledge', respuesta: 'No. Just a WordPress website. We install it and walk you through it on a video call.' },
      { pregunta: 'Does it work outside WordPress', respuesta: 'For now it’s a WordPress plugin. For other platforms, write to us and we’ll look into it.' },
      { pregunta: 'Can I cancel whenever I want', respuesta: 'Yes. There’s no minimum term and no penalty. The service ends at the end of the period you’ve paid for.' },
      { pregunta: 'What happens to the data', respuesta: 'Questions are sent to Anthropic’s Claude API, through our server, to generate the answer. The contacts people leave are saved in your organisation’s WordPress and sent to you by email.' },
      { pregunta: 'Can I read the conversations', respuesta: 'You see the conversations of people who leave their contact details and the questions Itza couldn’t answer. Other conversations aren’t saved in your WordPress.' },
    ],
    cierreTitulo: 'Itza on your organisation’s website.',
    cierreTexto: 'Write to us and we’ll tell you how it would look on your website, with no obligation.',
    escribenos: 'Write to us', correo: 'proyectos@accesibilidadprimero.com',
    pieProducto: 'Itza® is a product by Accesibilidad Primero.',
    pieAp: 'Accesibilidad Primero', pieCaso: 'Case study', piePrivacidad: 'Privacy', pieAccesibilidad: 'Accessibility',
    chat: {
      titulo: 'Itza', cerrar: 'Close', bienvenida: 'Hi, I’m Itza. What should I call you?',
      etiqueta: 'Your message', enviar: 'Send', escribiendo: 'Itza is typing…',
      error: 'I couldn’t answer. Try again or write to us at proyectos@accesibilidadprimero.com.',
      sugerencias: 'Suggested questions',
      sugeridas: ['What is Itza and who is it for?', 'How much does it cost?', 'How is it installed?', 'What does it do for accessibility?', 'I’d like to try it in my organisation'],
      hablar: 'Speak', escuchando: 'Listening…', leer: 'Read the answers aloud',
      tu: 'You:', itza: 'Itza:', conversacion: 'Conversation with Itza',
      limite: 'The demo ends here. If you’d like to keep going, write to us at proyectos@accesibilidadprimero.com.',
    },
  },
};
