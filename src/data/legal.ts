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
  fecha: 'Última actualización: 11 de octubre de 2026.',
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
        { p: 'Con nadie para su propio uso. Solo con los proveedores que necesitamos para que esto funcione, que los tratan por encargo nuestro:' },
        {
          lista: [
            'Cloudflare: aloja la web, recibe el formulario, lo protege de los envíos automáticos y cuenta las visitas.',
            'Brevo: nos hace llegar el mensaje del formulario por correo.',
            'Google Workspace: nuestro correo, donde llegan y se guardan los mensajes.',
          ],
        },
        { p: 'Cloudflare y Google pueden tratar datos fuera de la Unión Europea. Lo hacen con las garantías del Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión Europea. Brevo los trata en la Unión Europea.' },
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
  fecha: 'Última revisión: 11 de octubre de 2026.',
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
        { p: 'Parcialmente porque todavía no está hecha la revisión manual completa, no porque conozcamos un incumplimiento. Lo explicamos en «Cómo se ha comprobado».' },
        { p: 'Además, nos ponemos una regla más exigente que la norma: todo lo que se pulsa mide al menos 44 píxeles. WCAG pide 24.' },
      ],
    },
    {
      id: 'no-accesible',
      titulo: 'Contenido no accesible',
      piezas: [
        { p: 'A fecha de esta revisión no conocemos ningún incumplimiento. Sí conocemos estas limitaciones:' },
        {
          lista: [
            'El formulario de contacto necesita JavaScript, porque la protección contra envíos automáticos lo necesita. Sin JavaScript no aparece, y en su lugar se ofrece el correo.',
            'Si esa protección no puede comprobar el envío, por ejemplo con algunos bloqueadores, el formulario no se envía. Lo decimos en pantalla y damos el correo como alternativa.',
            'Las imágenes de «Sobre la mesa» vienen de nuestras publicaciones en Mastodon. Solo aparecen las que tienen texto alternativo, pero su calidad se revisa al publicarlas, no aquí.',
          ],
        },
      ],
    },
    {
      id: 'comprobado',
      titulo: 'Cómo se ha comprobado',
      piezas: [
        { p: 'El 11 de octubre de 2026, en todas las páginas y con la web ya construida:' },
        {
          lista: [
            'axe-core 4.14 en Chromium, a 390, 768 y 1440 píxeles de ancho.',
            'Contraste medido píxel a píxel sobre la página pintada, no leído del código.',
            'Tamaño de todo lo que se pulsa, y sin desplazamiento horizontal a 320 píxeles.',
            'Recorrido con teclado del menú y del carrusel.',
            'El formulario de contacto, también con sus errores abiertos.',
          ],
        },
        { p: 'Estas pruebas automáticas cubren alrededor de un tercio de los criterios de WCAG. La revisión manual con teclado y con lectores de pantalla está pendiente. Cuando esté hecha, actualizaremos esta página con su fecha y su resultado.' },
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
