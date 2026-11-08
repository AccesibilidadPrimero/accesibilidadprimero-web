/* ---------------------------------------------------------------------------
   Textos de las tres páginas legales · Privacidad, Cookies y Declaración de
   accesibilidad (11/10/2026).

   Escritos por Claude sobre los apartados del Figma (`Producción · Legales`,
   2674:1082) y con los datos que confirmó Johnny ese día: responsable con
   nombre, NIF, domicilio y correo (LSSI, art. 10); sin cookies; Cloudflare
   Web Analytics y no Google Analytics; un año para los mensajes que no acaban
   en proyecto; y una declaración de accesibilidad «parcialmente conforme»
   hasta que Johnny haga la revisión manual.

   NO SON ASESORAMIENTO JURÍDICO. Antes de publicarlos en la URL final
   conviene que los lea alguien con formación en protección de datos.

   Cada bloque es una lista de piezas. Los enlaces van SIEMPRE en su propia
   línea (`enlace`), nunca dentro de un párrafo: un enlace en un renglón mide
   23 px de alto, y la regla del repo son 44 en todo lo que se pulsa.
   --------------------------------------------------------------------------- */
import { DOMINIO } from './sitio';
import type { Lang } from '../i18n/config';

export type Pieza =
  | { p: string }
  | { lista: string[] }
  | { datos: [string, string][] }
  | { enlace: { texto: string; href: string } };

export interface BloqueLegal {
  id: string;
  titulo: string;
  piezas: Pieza[];
}

export interface PaginaLegal {
  titulo: string;
  entrada: string[];
  fecha: string;
  descripcion: string;
  bloques: BloqueLegal[];
}

const CORREO = 'proyectos@accesibilidadprimero.com';
const enlaceCorreo = { enlace: { texto: CORREO, href: `mailto:${CORREO}` } };

export const PRIVACIDAD: PaginaLegal = {
  titulo: 'Política de privacidad',
  entrada: [
    'Qué datos recogemos, para qué los usamos y cómo puedes pedirnos que los borremos. Explicado para que se entienda a la primera.',
  ],
  fecha: 'Última actualización: 8 de noviembre de 2026.',
  descripcion: `Qué datos recogemos en ${DOMINIO}, para qué los usamos y cómo ejercer tus derechos.`,
  bloques: [
    {
      id: 'quien',
      titulo: 'Quién trata tus datos',
      piezas: [
        { p: 'Johnny Vale Vigas, que trabaja con el nombre comercial Accesibilidad Primero.' },
        {
          datos: [
            ['NIF', '23889384-C'],
            ['Domicilio', "Mare de Deu de l'Assumpció 4, bajo izquierdo, 46020 Valencia"],
            ['Correo', CORREO],
          ],
        },
      ],
    },
    {
      id: 'que',
      titulo: 'Qué datos recogemos',
      piezas: [
        { p: 'Solo los que nos das. Si usas el formulario: tu nombre, tu correo, tu organización si la indicas y lo que nos cuentes. Si nos escribes por correo, lo que haya en tu mensaje.' },
        { p: 'Si usas a Itza en la página de Contacto, lo que le escribes para preparar tu mensaje. Itza te pide que no le des datos personales: esos van en el formulario.' },
        { p: 'Para proteger el formulario de los envíos automáticos, Cloudflare Turnstile analiza datos técnicos de tu conexión, como la dirección IP y el navegador, sin pedirte nada. No los usamos para identificarte.' },
        { p: 'Para saber cuántas visitas recibe la web usamos Cloudflare Web Analytics, que cuenta páginas vistas sin cookies y sin seguir a nadie.' },
      ],
    },
    {
      id: 'para-que',
      titulo: 'Para qué los usamos',
      piezas: [
        { p: 'Para contestarte. Y, si de la conversación sale un proyecto, para gestionarlo: presupuesto, comunicación y facturación.' },
        { p: 'No los usamos para enviarte publicidad y no se los vendemos a nadie.' },
      ],
    },
    {
      id: 'base',
      titulo: 'Con qué base legal',
      piezas: [
        { p: 'Tu consentimiento, cuando nos escribes y marcas la casilla del formulario. Puedes retirarlo cuando quieras.' },
        { p: 'Si contratas un proyecto, el contrato y las obligaciones legales que vienen con él, como la facturación.' },
        { p: 'La protección del formulario y el recuento de visitas se apoyan en nuestro interés legítimo en que la web funcione y sea segura.' },
      ],
    },
    {
      id: 'tiempo',
      titulo: 'Cuánto tiempo los guardamos',
      piezas: [
        { p: 'Los mensajes que no acaban en proyecto, un año desde la última comunicación. Después se borran.' },
        { p: 'Si trabajamos juntos, mientras dure el proyecto y, después, el tiempo que obliga la ley: seis años la documentación contable y cuatro la fiscal.' },
      ],
    },
    {
      id: 'con-quien',
      titulo: 'Con quién los compartimos',
      piezas: [
        { p: 'Con nadie para su propio uso. Solo con las empresas proveedoras que necesitamos para que esto funcione, que los tratan por encargo nuestro:' },
        {
          lista: [
            'Cloudflare: aloja la web, recibe el formulario, lo protege de los envíos automáticos y cuenta las visitas.',
            'Brevo: nos hace llegar el mensaje del formulario por correo.',
            'Anthropic: si usas a Itza en Contacto, genera sus respuestas a partir de lo que le escribes. No guardamos esa conversación.',
            'Google Workspace: nuestro correo, donde llegan y se guardan los mensajes.',
          ],
        },
        { p: 'Cloudflare y Google pueden tratar datos fuera de la Unión Europea. Lo hacen con las garantías del Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión Europea. Brevo los trata en la Unión Europea. Anthropic trata lo que escribes a Itza en Estados Unidos, con las cláusulas contractuales tipo de la Comisión Europea.' },
      ],
    },
    {
      id: 'derechos',
      titulo: 'Qué derechos tienes',
      piezas: [
        { p: 'Puedes pedirnos ver tus datos, corregirlos, borrarlos, limitar su uso, oponerte a él o llevártelos a otro sitio. También puedes retirar tu consentimiento, sin que eso afecte a lo que ya hicimos con él.' },
        { p: 'Escríbenos diciendo qué quieres. Te contestamos en un mes como máximo.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'reclamar',
      titulo: 'Dónde reclamar',
      piezas: [
        { p: 'Si crees que no hemos tratado bien tus datos, puedes reclamar ante la autoridad de control.' },
        { enlace: { texto: 'Agencia Española de Protección de Datos', href: 'https://www.aepd.es/' } },
      ],
    },
  ],
};

export const COOKIES: PaginaLegal = {
  titulo: 'Política de cookies',
  entrada: ['Qué se guarda en tu navegador cuando visitas esta web y para qué sirve. Es casi nada.'],
  fecha: 'Última actualización: 11 de octubre de 2026.',
  descripcion: `${DOMINIO} no usa cookies. Qué se guarda en tu navegador al usar el formulario y por qué.`,
  bloques: [
    {
      id: 'que-es',
      titulo: 'Qué es una cookie',
      piezas: [
        { p: 'Un pequeño archivo que una web deja en tu navegador para recordar algo: que has iniciado sesión, qué hay en tu cesta o, muchas veces, por dónde te mueves. Hay otras formas de guardar cosas en el navegador, como su almacenamiento local, y la ley las trata igual.' },
      ],
    },
    {
      id: 'cuales',
      titulo: 'Cuáles usamos',
      piezas: [
        { p: 'Ninguna. Ni propias ni de terceros, ni de análisis ni de publicidad. Por eso no te enseñamos un aviso para aceptarlas: no hay nada que aceptar.' },
        { p: 'Las visitas las contamos con Cloudflare Web Analytics, que no guarda nada en tu navegador.' },
        { p: 'Solo se guarda una cosa, y solo si empiezas a rellenar el formulario de contacto:' },
        {
          datos: [
            ['Nombre', 'cf.turnstile.u'],
            ['De quién es', 'Cloudflare (Turnstile)'],
            ['Para qué sirve', 'Comprobar que quien envía el formulario no es un programa automático.'],
            ['Cuánto dura', 'Hasta que borras los datos de tu navegador.'],
            ['Tipo', 'Almacenamiento local, técnico.'],
          ],
        },
      ],
    },
    {
      id: 'necesarias',
      titulo: 'Cuáles son necesarias',
      piezas: [
        { p: 'Ese dato es técnico: sin él, el formulario no puede protegerse de los envíos automáticos. La ley no pide consentimiento para lo que hace falta para darte un servicio que tú pides, y aquí el servicio es enviarnos tu mensaje.' },
        { p: 'Si no usas el formulario, no se guarda nada.' },
      ],
    },
    {
      id: 'cambiar',
      titulo: 'Cómo cambiar tu elección',
      piezas: [
        { p: 'No hay panel de preferencias porque no hay nada que activar ni desactivar. Si quieres borrar el dato de Turnstile, puedes hacerlo desde los ajustes de privacidad de tu navegador, en los datos de sitios web.' },
        { p: 'Y si prefieres que no se guarde nada, escríbenos por correo en vez de usar el formulario.' },
        enlaceCorreo,
        { p: 'Si algún día añadimos algo que necesite tu permiso, te lo pediremos antes y lo contaremos aquí.' },
      ],
    },
  ],
};

export const ACCESIBILIDAD: PaginaLegal = {
  titulo: 'Declaración de accesibilidad',
  entrada: [
    'Nos dedicamos a esto, así que esta página no puede ser un trámite. Aquí está el estado real de accesibilidad de nuestra propia web, incluido lo que todavía no cumple.',
  ],
  fecha: 'Última revisión: 5 de noviembre de 2026.',
  descripcion: `Estado real de accesibilidad de ${DOMINIO}: grado de conformidad con WCAG 2.2 AA, limitaciones conocidas y cómo avisarnos.`,
  bloques: [
    {
      id: 'compromiso',
      titulo: 'Compromiso',
      piezas: [
        { p: `Accesibilidad Primero se compromete a que ${DOMINIO} sea utilizable por el mayor número de personas posible, con independencia de si navegan con teclado, con lector de pantalla, con la letra ampliada o con el movimiento reducido. Esta declaración se aplica a todo el sitio.` },
      ],
    },
    {
      id: 'conformidad',
      titulo: 'Grado de conformidad',
      piezas: [
        { p: 'Este sitio es parcialmente conforme con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA.' },
        { p: 'Parcialmente por dos razones: todavía no está hecha la revisión manual completa, lo explicamos en “Cómo se ha comprobado”, y hay un incumplimiento que conocemos y hemos decidido mantener, lo explicamos en “Contenido no accesible”.' },
        { p: 'Además, nos ponemos una regla más exigente que la norma: todo lo que se pulsa mide al menos 44 píxeles. WCAG pide 24.' },
      ],
    },
    {
      id: 'no-accesible',
      titulo: 'Contenido no accesible',
      piezas: [
        { p: 'Conocemos un incumplimiento, y es una decisión nuestra:' },
        {
          lista: [
            'El emblema de la página Estudio está siempre animado: sus cuadrados se apagan y se encienden despacio, sin parar, y no hay botón para detenerlo. Incumple el criterio 2.2.2 (Pausar, detener, ocultar). Es una licencia de diseño que nos damos en ese único dibujo. Si tienes activada la opción de reducir el movimiento en tu dispositivo, el emblema se queda quieto. Si te molesta o te distrae, escríbenos y lo reconsideramos.',
          ],
        },
        { p: 'Y conocemos estas limitaciones:' },
        {
          lista: [
            'El formulario de contacto necesita JavaScript, porque la protección contra envíos automáticos lo necesita. Sin JavaScript no aparece, y en su lugar se ofrece el correo.',
            'Si esa protección no puede comprobar el envío, por ejemplo con algunos bloqueadores, el formulario no se envía. Lo decimos en pantalla y damos el correo como alternativa.',
            'Las imágenes de “Sobre la mesa” vienen de nuestras publicaciones en Mastodon. Solo aparecen las que tienen texto alternativo, pero su calidad se revisa al publicarlas, no aquí.',
            'Los vídeos de los casos de estudio no tienen sonido. Lo que enseñan está descrito en su texto alternativo.',
          ],
        },
      ],
    },
    {
      id: 'comprobado',
      titulo: 'Cómo se ha comprobado',
      piezas: [
        { p: 'La primera revisión fue el 11 de octubre de 2026. Desde entonces la web tiene páginas nuevas, como los casos de estudio, los vídeos y las animaciones, y el 4 de noviembre de 2026 volvimos a comprobarla entera, con la web ya construida:' },
        {
          lista: [
            'axe-core 4.14 en Chromium, a 390, 768 y 1440 píxeles de ancho, y Lighthouse.',
            'Contraste medido píxel a píxel sobre la página pintada, no leído del código.',
            'Tamaño de todo lo que se pulsa, y sin desplazamiento horizontal a 320 píxeles.',
            'Recorrido con teclado del menú, del carrusel y de los desplegables.',
            'Cada vídeo y cada animación, con y sin la opción de reducir el movimiento. Lo que se mueve solo más de cinco segundos tiene botón de pausa, salvo el emblema de Estudio.',
            'El formulario de contacto, también con sus errores abiertos.',
          ],
        },
        { p: 'Todas estas comprobaciones pasan, salvo el incumplimiento del emblema que explicamos arriba.' },
        { p: 'Estas pruebas automáticas cubren alrededor de un tercio de los criterios de WCAG. La revisión manual con teclado está hecha: el 5 de noviembre de 2026 recorrimos la web entera con el tabulador, con el orden del foco, su anillo visible y sin paradas de más. La revisión con lectores de pantalla está pendiente. Cuando esté hecha, actualizaremos esta página con su fecha y su resultado.' },
      ],
    },
    {
      id: 'barrera',
      titulo: 'Si encuentras una barrera',
      piezas: [
        { p: 'Escríbenos contando qué intentabas hacer, en qué página y con qué navegador o tecnología de apoyo. Contestamos en un máximo de veinte días hábiles y, si el arreglo va a tardar más, te decimos cuánto.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'sin-respuesta',
      titulo: 'Si no te contestamos',
      piezas: [
        { p: 'Accesibilidad Primero es una microempresa, y la Ley 11/2023, que obliga a ciertos servicios a ser accesibles, exime a las microempresas que prestan servicios. Queremos cumplir igual, y por eso existe esta página.' },
        { p: 'Si consideras que has sufrido una discriminación por motivo de discapacidad, puedes dirigirte a la Oficina de Atención a la Discapacidad.' },
        { enlace: { texto: 'Oficina de Atención a la Discapacidad (OADIS)', href: 'https://www.rpdiscapacidad.gob.es/organismos/oadis.htm' } },
      ],
    },
    {
      id: 'compatibilidad',
      titulo: 'Compatibilidad',
      piezas: [
        { p: 'Probado en Chromium, el navegador sobre el que funcionan Chrome y Edge, a tres anchos de pantalla. Las pruebas con Safari, con Firefox y con lectores de pantalla forman parte de la revisión manual pendiente.' },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
   Catalán e inglés británico (05/11/2026). Traducción adaptada, no literal,
   con los términos del modelo de declaración de la Directiva (UE) 2016/2102 y
   el RD 1112/2018. Los datos reales (nombre, NIF, domicilio, correo) no se
   traducen. En caso de discrepancia prevalece el castellano, y PaginaLegal lo
   dice en la propia página.
   --------------------------------------------------------------------------- */

const PRIVACIDAD_CA: PaginaLegal = {
  titulo: 'Política de privacitat',
  entrada: [
    'Quines dades recollim, per a què les fem servir i com ens pots demanar que les esborrem. Explicat perquè s’entengui a la primera.',
  ],
  fecha: 'Darrera actualització: 8 de novembre de 2026.',
  descripcion: `Quines dades recollim a ${DOMINIO}, per a què les fem servir i com pots exercir els teus drets.`,
  bloques: [
    {
      id: 'quien',
      titulo: 'Qui tracta les teves dades',
      piezas: [
        { p: 'Johnny Vale Vigas, que treballa amb el nom comercial Accesibilidad Primero.' },
        {
          datos: [
            ['NIF', '23889384-C'],
            ['Domicili', "Mare de Deu de l'Assumpció 4, bajo izquierdo, 46020 Valencia"],
            ['Correu', CORREO],
          ],
        },
      ],
    },
    {
      id: 'que',
      titulo: 'Quines dades recollim',
      piezas: [
        { p: 'Només les que ens dones. Si fas servir el formulari: el teu nom, el teu correu, la teva organització si la indiques i el que ens expliquis. Si ens escrius per correu, el que hi hagi al teu missatge.' },
        { p: 'Si fas servir Itza a la pàgina de Contacte, el que li escrius per preparar el teu missatge. Itza et demana que no li donis dades personals: aquestes van al formulari.' },
        { p: 'Per protegir el formulari dels enviaments automàtics, Cloudflare Turnstile analitza dades tècniques de la teva connexió, com l’adreça IP i el navegador, sense demanar-te res. No les fem servir per identificar-te.' },
        { p: 'Per saber quantes visites rep el web fem servir Cloudflare Web Analytics, que compta les pàgines vistes sense galetes i sense seguir ningú.' },
      ],
    },
    {
      id: 'para-que',
      titulo: 'Per a què les fem servir',
      piezas: [
        { p: 'Per respondre’t. I, si de la conversa en surt un projecte, per gestionar-lo: pressupost, comunicació i facturació.' },
        { p: 'No les fem servir per enviar-te publicitat i no les venem a ningú.' },
      ],
    },
    {
      id: 'base',
      titulo: 'Amb quina base legal',
      piezas: [
        { p: 'El teu consentiment, quan ens escrius i marques la casella del formulari. El pots retirar quan vulguis.' },
        { p: 'Si contractes un projecte, el contracte i les obligacions legals que comporta, com la facturació.' },
        { p: 'La protecció del formulari i el recompte de visites es basen en el nostre interès legítim que el web funcioni i sigui segur.' },
      ],
    },
    {
      id: 'tiempo',
      titulo: 'Quant de temps les conservem',
      piezas: [
        { p: 'Els missatges que no acaben en projecte, un any des de la darrera comunicació. Després s’esborren.' },
        { p: 'Si treballem junts, mentre duri el projecte i, després, el temps que obliga la llei: sis anys la documentació comptable i quatre la fiscal.' },
      ],
    },
    {
      id: 'con-quien',
      titulo: 'Amb qui les compartim',
      piezas: [
        { p: 'Amb ningú perquè les faci servir pel seu compte. Només amb les empreses proveïdores que necessitem perquè tot això funcioni, que les tracten per encàrrec nostre:' },
        {
          lista: [
            'Cloudflare: allotja el web, rep el formulari, el protegeix dels enviaments automàtics i compta les visites.',
            'Brevo: ens fa arribar el missatge del formulari per correu.',
            'Anthropic: si fas servir Itza a Contacte, genera les seves respostes a partir del que li escrius. No guardem aquesta conversa.',
            'Google Workspace: el nostre correu, on arriben i es guarden els missatges.',
          ],
        },
        { p: 'Cloudflare i Google poden tractar dades fora de la Unió Europea. Ho fan amb les garanties del Marc de Privacitat de Dades UE-EUA i les clàusules contractuals tipus de la Comissió Europea. Brevo les tracta a la Unió Europea. Anthropic tracta el que escrius a Itza als Estats Units, amb les clàusules contractuals tipus de la Comissió Europea.' },
      ],
    },
    {
      id: 'derechos',
      titulo: 'Quins drets tens',
      piezas: [
        { p: 'Ens pots demanar veure les teves dades, corregir-les, esborrar-les, limitar-ne l’ús, oposar-t’hi o endur-te-les a un altre lloc. També pots retirar el teu consentiment, sense que això afecti el que ja hàgim fet amb ell.' },
        { p: 'Escriu-nos i digues-nos què vols. Et responem en un mes com a màxim.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'reclamar',
      titulo: 'On reclamar',
      piezas: [
        { p: 'Si creus que no hem tractat bé les teves dades, pots presentar una reclamació davant l’autoritat de control.' },
        { enlace: { texto: 'Agencia Española de Protección de Datos', href: 'https://www.aepd.es/' } },
      ],
    },
  ],
};

const PRIVACIDAD_EN: PaginaLegal = {
  titulo: 'Privacy policy',
  entrada: [
    'What data we collect, what we use it for and how you can ask us to delete it. Written so it makes sense the first time you read it.',
  ],
  fecha: 'Last updated: 8 November 2026.',
  descripcion: `What data we collect on ${DOMINIO}, what we use it for and how to exercise your rights.`,
  bloques: [
    {
      id: 'quien',
      titulo: 'Who processes your data',
      piezas: [
        { p: 'Johnny Vale Vigas, who trades as Accesibilidad Primero.' },
        {
          datos: [
            ['Tax ID (NIF)', '23889384-C'],
            ['Address', "Mare de Deu de l'Assumpció 4, bajo izquierdo, 46020 Valencia, Spain"],
            ['Email', CORREO],
          ],
        },
      ],
    },
    {
      id: 'que',
      titulo: 'What data we collect',
      piezas: [
        { p: 'Only what you give us. If you use the form: your name, your email address, your organisation if you include it and whatever you tell us. If you email us, whatever is in your message.' },
        { p: 'If you use Itza on the Contact page, what you write to it to prepare your message. Itza asks you not to give it personal details: those go in the form.' },
        { p: 'To protect the form from automated submissions, Cloudflare Turnstile analyses technical data about your connection, such as your IP address and browser, without asking you to do anything. We do not use it to identify you.' },
        { p: 'To find out how many visits the website gets, we use Cloudflare Web Analytics, which counts page views without cookies and without tracking anyone.' },
      ],
    },
    {
      id: 'para-que',
      titulo: 'What we use it for',
      piezas: [
        { p: 'To reply to you. And, if the conversation turns into a project, to manage it: quote, communication and invoicing.' },
        { p: 'We do not use it to send you advertising, and we do not sell it to anyone.' },
      ],
    },
    {
      id: 'base',
      titulo: 'Our lawful basis',
      piezas: [
        { p: 'Your consent, when you write to us and tick the box on the form. You can withdraw it at any time.' },
        { p: 'If you commission a project, the contract and the legal obligations that come with it, such as invoicing.' },
        { p: 'Protecting the form and counting visits rely on our legitimate interest in keeping the website working and secure.' },
      ],
    },
    {
      id: 'tiempo',
      titulo: 'How long we keep it',
      piezas: [
        { p: 'Messages that do not lead to a project are kept for one year from the last contact. Then they are deleted.' },
        { p: 'If we work together, for as long as the project lasts and, afterwards, for as long as the law requires: six years for accounting records and four for tax records.' },
      ],
    },
    {
      id: 'con-quien',
      titulo: 'Who we share it with',
      piezas: [
        { p: 'No one for their own purposes. Only with the providers we need to make all this work, who process it on our behalf:' },
        {
          lista: [
            'Cloudflare: hosts the website, receives the form, protects it from automated submissions and counts visits.',
            'Brevo: delivers the form message to us by email.',
            'Anthropic: if you use Itza on the Contact page, it generates Itza’s replies from what you write. We do not keep that conversation.',
            'Google Workspace: our email, where messages arrive and are stored.',
          ],
        },
        { p: 'Cloudflare and Google may process data outside the European Union. They do so under the safeguards of the EU-US Data Privacy Framework and the European Commission’s standard contractual clauses. Brevo processes it within the European Union. Anthropic processes what you write to Itza in the United States, under the European Commission’s standard contractual clauses.' },
      ],
    },
    {
      id: 'derechos',
      titulo: 'Your rights',
      piezas: [
        { p: 'You can ask us to access your data, correct it, delete it, restrict its use, object to its use or take it elsewhere. You can also withdraw your consent, without affecting anything we have already done on the basis of it.' },
        { p: 'Write to us and tell us what you would like. We reply within one month at most.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'reclamar',
      titulo: 'Where to complain',
      piezas: [
        { p: 'If you believe we have not handled your data properly, you can lodge a complaint with the supervisory authority, the Spanish Data Protection Agency.' },
        { enlace: { texto: 'Agencia Española de Protección de Datos', href: 'https://www.aepd.es/' } },
      ],
    },
  ],
};

const COOKIES_CA: PaginaLegal = {
  titulo: 'Política de galetes',
  entrada: ['Què es guarda al teu navegador quan visites aquest web i per a què serveix. Gairebé res.'],
  fecha: 'Darrera actualització: 11 d’octubre de 2026.',
  descripcion: `${DOMINIO} no fa servir galetes. Què es guarda al teu navegador quan fas servir el formulari i per què.`,
  bloques: [
    {
      id: 'que-es',
      titulo: 'Què és una galeta',
      piezas: [
        { p: 'Un petit fitxer que un web deixa al teu navegador per recordar alguna cosa: que has iniciat la sessió, què hi ha a la teva cistella o, moltes vegades, per on et mous. Hi ha altres maneres de guardar coses al navegador, com l’emmagatzematge local, i la llei les tracta igual.' },
      ],
    },
    {
      id: 'cuales',
      titulo: 'Quines fem servir',
      piezas: [
        { p: 'Cap. Ni pròpies ni de tercers, ni d’anàlisi ni de publicitat. Per això no et mostrem cap avís per acceptar-les: no hi ha res a acceptar.' },
        { p: 'Les visites les comptem amb Cloudflare Web Analytics, que no guarda res al teu navegador.' },
        { p: 'Només es guarda una cosa, i només si comences a omplir el formulari de contacte:' },
        {
          datos: [
            ['Nom', 'cf.turnstile.u'],
            ['De qui és', 'Cloudflare (Turnstile)'],
            ['Per a què serveix', 'Comprovar que qui envia el formulari no és un programa automàtic.'],
            ['Quant dura', 'Fins que esborres les dades del teu navegador.'],
            ['Tipus', 'Emmagatzematge local, tècnic.'],
          ],
        },
      ],
    },
    {
      id: 'necesarias',
      titulo: 'Quines són necessàries',
      piezas: [
        { p: 'Aquesta dada és tècnica: sense ella, el formulari no es pot protegir dels enviaments automàtics. La llei no demana consentiment per al que cal per oferir-te un servei que tu demanes, i aquí el servei és enviar-nos el teu missatge.' },
        { p: 'Si no fas servir el formulari, no es guarda res.' },
      ],
    },
    {
      id: 'cambiar',
      titulo: 'Com canviar la teva elecció',
      piezas: [
        { p: 'No hi ha cap tauler de preferències perquè no hi ha res a activar ni a desactivar. Si vols esborrar la dada de Turnstile, ho pots fer des de la configuració de privacitat del teu navegador, a les dades dels llocs web.' },
        { p: 'I si prefereixes que no es guardi res, escriu-nos per correu en lloc de fer servir el formulari.' },
        enlaceCorreo,
        { p: 'Si algun dia hi afegim alguna cosa que necessiti el teu permís, te’l demanarem abans i ho explicarem aquí.' },
      ],
    },
  ],
};

const COOKIES_EN: PaginaLegal = {
  titulo: 'Cookie policy',
  entrada: ['What is stored in your browser when you visit this website, and what it is for. Next to nothing.'],
  fecha: 'Last updated: 11 October 2026.',
  descripcion: `${DOMINIO} does not use cookies. What is stored in your browser when you use the form, and why.`,
  bloques: [
    {
      id: 'que-es',
      titulo: 'What a cookie is',
      piezas: [
        { p: 'A small file that a website leaves in your browser to remember something: that you are signed in, what is in your basket or, quite often, where you go. There are other ways of storing things in the browser, such as local storage, and the law treats them the same way.' },
      ],
    },
    {
      id: 'cuales',
      titulo: 'Which ones we use',
      piezas: [
        { p: 'None. No first-party or third-party cookies, no analytics cookies and no advertising cookies. That is why we do not show you a banner asking you to accept them: there is nothing to accept.' },
        { p: 'We count visits with Cloudflare Web Analytics, which stores nothing in your browser.' },
        { p: 'Only one thing is stored, and only if you start filling in the contact form:' },
        {
          datos: [
            ['Name', 'cf.turnstile.u'],
            ['Set by', 'Cloudflare (Turnstile)'],
            ['Purpose', 'To check that whoever is sending the form is not an automated program.'],
            ['Duration', 'Until you clear your browser data.'],
            ['Type', 'Local storage, strictly necessary.'],
          ],
        },
      ],
    },
    {
      id: 'necesarias',
      titulo: 'Which ones are necessary',
      piezas: [
        { p: 'That item is strictly necessary: without it, the form cannot protect itself from automated submissions. The law does not require consent for what is needed to provide a service you have asked for, and here the service is sending us your message.' },
        { p: 'If you do not use the form, nothing is stored.' },
      ],
    },
    {
      id: 'cambiar',
      titulo: 'How to change your choice',
      piezas: [
        { p: 'There is no preferences panel because there is nothing to switch on or off. If you want to delete the Turnstile item, you can do so in your browser’s privacy settings, under site data.' },
        { p: 'And if you would rather nothing were stored at all, email us instead of using the form.' },
        enlaceCorreo,
        { p: 'If we ever add anything that needs your permission, we will ask you first and explain it here.' },
      ],
    },
  ],
};

const ACCESIBILIDAD_CA: PaginaLegal = {
  titulo: 'Declaració d’accessibilitat',
  entrada: [
    'Ens dediquem a això, així que aquesta pàgina no pot ser un tràmit. Aquí hi ha l’estat real d’accessibilitat del nostre propi web, inclòs el que encara no compleix.',
  ],
  fecha: 'Darrera revisió: 5 de novembre de 2026.',
  descripcion: `Estat real d’accessibilitat de ${DOMINIO}: situació de compliment amb les WCAG 2.2 AA, limitacions conegudes i com avisar-nos.`,
  bloques: [
    {
      id: 'compromiso',
      titulo: 'Compromís',
      piezas: [
        { p: `Accesibilidad Primero es compromet que ${DOMINIO} el pugui fer servir el màxim nombre de persones possible, tant si naveguen amb teclat com amb lector de pantalla, amb la lletra ampliada o amb el moviment reduït. Aquesta declaració s’aplica a tot el lloc web.` },
      ],
    },
    {
      id: 'conformidad',
      titulo: 'Situació de compliment',
      piezas: [
        { p: 'Aquest lloc web és parcialment conforme amb les Pautes d’Accessibilitat per al Contingut Web (WCAG) 2.2, nivell AA.' },
        { p: 'Parcialment per dues raons: encara no s’ha fet la revisió manual completa, ho expliquem a “Com s’ha comprovat”, i hi ha un incompliment que coneixem i hem decidit mantenir, ho expliquem a “Contingut no accessible”.' },
        { p: 'A més, ens posem una regla més exigent que la norma: tot el que es prem fa almenys 44 píxels. Les WCAG en demanen 24.' },
      ],
    },
    {
      id: 'no-accesible',
      titulo: 'Contingut no accessible',
      piezas: [
        { p: 'Coneixem un incompliment, i és una decisió nostra:' },
        {
          lista: [
            'L’emblema de la pàgina AP està sempre animat: els seus quadrats s’apaguen i s’encenen a poc a poc, sense parar, i no hi ha cap botó per aturar-lo. Incompleix el criteri 2.2.2 (Posar en pausa, aturar, amagar). És una llicència de disseny que ens permetem en aquest únic dibuix. Si tens activada l’opció de reduir el moviment al teu dispositiu, l’emblema es queda quiet. Si et molesta o et distreu, escriu-nos i ho reconsiderarem.',
          ],
        },
        { p: 'I coneixem aquestes limitacions:' },
        {
          lista: [
            'El formulari de contacte necessita JavaScript, perquè la protecció contra els enviaments automàtics el necessita. Sense JavaScript no apareix, i en el seu lloc s’ofereix el correu.',
            'Si aquesta protecció no pot comprovar l’enviament, per exemple amb alguns blocadors, el formulari no s’envia. Ho diem a la pantalla i donem el correu com a alternativa.',
            'Les imatges de “Sobre la taula” vénen de les nostres publicacions a Mastodon. Només hi apareixen les que tenen text alternatiu, però la seva qualitat es revisa quan es publiquen, no aquí.',
            'Els vídeos dels casos d’estudi no tenen so. El que mostren està descrit al seu text alternatiu.',
          ],
        },
      ],
    },
    {
      id: 'comprobado',
      titulo: 'Com s’ha comprovat',
      piezas: [
        { p: 'La primera revisió es va fer l’11 d’octubre de 2026. Des d’aleshores el web té pàgines noves, com els casos d’estudi, els vídeos i les animacions, i el 4 de novembre de 2026 el vam tornar a comprovar sencer, amb el web ja construït:' },
        {
          lista: [
            'axe-core 4.14 a Chromium, a 390, 768 i 1440 píxels d’amplada, i Lighthouse.',
            'Contrast mesurat píxel a píxel sobre la pàgina pintada, no llegit del codi.',
            'Mida de tot el que es prem, i sense desplaçament horitzontal a 320 píxels.',
            'Recorregut amb teclat del menú, del carrusel i dels desplegables.',
            'Cada vídeo i cada animació, amb l’opció de reduir el moviment i sense. El que es mou tot sol més de cinc segons té botó de pausa, llevat de l’emblema de la pàgina AP.',
            'El formulari de contacte, també amb els errors oberts.',
          ],
        },
        { p: 'Totes aquestes comprovacions es superen, llevat de l’incompliment de l’emblema que expliquem més amunt.' },
        { p: 'Aquestes proves automàtiques cobreixen al voltant d’un terç dels criteris de les WCAG. La revisió manual amb teclat està feta: el 5 de novembre de 2026 vam recórrer tot el web amb el tabulador, amb l’ordre del focus, l’anell visible i sense parades de més. La revisió amb lectors de pantalla està pendent. Quan estigui feta, actualitzarem aquesta pàgina amb la data i el resultat.' },
      ],
    },
    {
      id: 'barrera',
      titulo: 'Si trobes una barrera',
      piezas: [
        { p: 'Escriu-nos i explica’ns què intentaves fer, en quina pàgina i amb quin navegador o tecnologia de suport. Responem en un màxim de vint dies hàbils i, si l’arranjament trigarà més, et diem quant.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'sin-respuesta',
      titulo: 'Si no et responem',
      piezas: [
        { p: 'Accesibilidad Primero és una microempresa, i la Llei 11/2023, que obliga determinats serveis a ser accessibles, n’eximeix les microempreses que presten serveis. Volem complir igualment, i per això existeix aquesta pàgina.' },
        { p: 'Si consideres que has patit una discriminació per motiu de discapacitat, et pots adreçar a l’Oficina d’Atenció a la Discapacitat.' },
        { enlace: { texto: 'Oficina de Atención a la Discapacidad (OADIS)', href: 'https://www.rpdiscapacidad.gob.es/organismos/oadis.htm' } },
      ],
    },
    {
      id: 'compatibilidad',
      titulo: 'Compatibilitat',
      piezas: [
        { p: 'Provat a Chromium, el navegador sobre el qual funcionen Chrome i Edge, a tres amplades de pantalla. Les proves amb Safari, amb Firefox i amb lectors de pantalla formen part de la revisió manual pendent.' },
      ],
    },
  ],
};

const ACCESIBILIDAD_EN: PaginaLegal = {
  titulo: 'Accessibility statement',
  entrada: [
    'This is what we do for a living, so this page cannot be a formality. Here is the real accessibility status of our own website, including what it does not yet meet.',
  ],
  fecha: 'Last reviewed: 5 November 2026.',
  descripcion: `The real accessibility status of ${DOMINIO}: compliance status with WCAG 2.2 AA, known limitations and how to let us know.`,
  bloques: [
    {
      id: 'compromiso',
      titulo: 'Commitment',
      piezas: [
        { p: `Accesibilidad Primero is committed to making ${DOMINIO} usable by as many people as possible, whether they browse with a keyboard, a screen reader, enlarged text or reduced motion. This statement applies to the whole website.` },
      ],
    },
    {
      id: 'conformidad',
      titulo: 'Compliance status',
      piezas: [
        { p: 'This website is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.2, level AA.' },
        { p: 'Partially, for two reasons: the full manual review has not been done yet, as we explain in “How it was tested”, and there is one non-compliance we know about and have chosen to keep, as we explain in “Non-accessible content”.' },
        { p: 'We also hold ourselves to a stricter rule than the standard: everything you can tap or click is at least 44 pixels. WCAG asks for 24.' },
      ],
    },
    {
      id: 'no-accesible',
      titulo: 'Non-accessible content',
      piezas: [
        { p: 'We know of one non-compliance, and it is our own decision:' },
        {
          lista: [
            'The emblem on the AP page is always animated: its squares fade out and back in slowly, without stopping, and there is no button to stop it. It fails success criterion 2.2.2 (Pause, Stop, Hide). It is a design licence we allow ourselves in that single drawing. If you have the reduce motion setting turned on on your device, the emblem stays still. If it bothers or distracts you, write to us and we will reconsider it.',
          ],
        },
        { p: 'And we know of these limitations:' },
        {
          lista: [
            'The contact form needs JavaScript, because its protection against automated submissions needs it. Without JavaScript the form does not appear, and our email address is offered instead.',
            'If that protection cannot verify the submission, for example with some content blockers, the form is not sent. We say so on screen and give our email address as an alternative.',
            'The images in “Work in progress” come from our posts on Mastodon. Only those with alt text are shown, but their quality is checked when they are posted, not here.',
            'The videos in the case studies have no sound. What they show is described in their alt text.',
          ],
        },
      ],
    },
    {
      id: 'comprobado',
      titulo: 'How it was tested',
      piezas: [
        { p: 'The first review was on 11 October 2026. Since then the website has gained new pages, such as the case studies, the videos and the animations, and on 4 November 2026 we tested all of it again, on the built website:' },
        {
          lista: [
            'axe-core 4.14 in Chromium, at 390, 768 and 1440 pixels wide, and Lighthouse.',
            'Contrast measured pixel by pixel on the rendered page, not read from the code.',
            'The size of everything you can tap or click, and no horizontal scrolling at 320 pixels.',
            'Keyboard navigation of the menu, the carousel and the expandable sections.',
            'Every video and every animation, with and without the reduce motion setting. Anything that moves on its own for more than five seconds has a pause button, except the emblem on the AP page.',
            'The contact form, including with its error messages showing.',
          ],
        },
        { p: 'All of these checks pass, except for the emblem non-compliance explained above.' },
        { p: 'These automated tests cover around a third of the WCAG success criteria. The manual keyboard review is done: on 5 November 2026 we went through the whole website with the Tab key, checking the focus order, a visible focus ring and no unnecessary stops. The review with screen readers is still to be done. When it is, we will update this page with its date and its result.' },
      ],
    },
    {
      id: 'barrera',
      titulo: 'If you find a barrier',
      piezas: [
        { p: 'Write to us and tell us what you were trying to do, on which page and with which browser or assistive technology. We reply within twenty working days at most and, if the fix will take longer, we tell you how long.' },
        enlaceCorreo,
      ],
    },
    {
      id: 'sin-respuesta',
      titulo: 'If we do not reply',
      piezas: [
        { p: 'Accesibilidad Primero is a micro-enterprise, and Spain’s Act 11/2023, which requires certain services to be accessible, exempts micro-enterprises that provide services. We want to comply all the same, and that is why this page exists.' },
        { p: 'If you believe you have been discriminated against on the grounds of disability, you can contact the Spanish Office for Disability Assistance.' },
        { enlace: { texto: 'Oficina de Atención a la Discapacidad (OADIS)', href: 'https://www.rpdiscapacidad.gob.es/organismos/oadis.htm' } },
      ],
    },
    {
      id: 'compatibilidad',
      titulo: 'Compatibility',
      piezas: [
        { p: 'Tested in Chromium, the browser that Chrome and Edge are built on, at three screen widths. Testing with Safari, Firefox and screen readers is part of the pending manual review.' },
      ],
    },
  ],
};

export type ClaveLegal = 'privacidad' | 'cookies' | 'accesibilidad';

/** Las tres páginas legales en cada idioma. */
export const LEGALES: Record<ClaveLegal, Record<Lang, PaginaLegal>> = {
  privacidad: { es: PRIVACIDAD, ca: PRIVACIDAD_CA, en: PRIVACIDAD_EN },
  cookies: { es: COOKIES, ca: COOKIES_CA, en: COOKIES_EN },
  accesibilidad: { es: ACCESIBILIDAD, ca: ACCESIBILIDAD_CA, en: ACCESIBILIDAD_EN },
};

/** El aviso de las versiones traducidas: manda el castellano. */
export const AVISO_IDIOMA: Record<Exclude<Lang, 'es'>, { titulo: string; texto: string; enlace: string }> = {
  ca: { titulo: 'Versió de referència', texto: 'En cas de discrepància, preval la versió en castellà.', enlace: 'Llegir la versió en castellà' },
  en: { titulo: 'Reference version', texto: 'In case of any discrepancy, the Spanish version prevails.', enlace: 'Read the Spanish version' },
};
