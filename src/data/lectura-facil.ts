/* ---------------------------------------------------------------------------
   La web en lectura fácil · castellano y catalán (Johnny, 07/11/2026).

   Cinco páginas: Inicio, Quiénes somos, Qué hacemos, Contacto y
   Accesibilidad. La guía en vídeo y el blog quedan fuera. La va a validar
   Plena inclusión con su grupo de personas validadoras: hasta entonces es
   un BORRADOR y no lleva el logotipo europeo de lectura fácil.

   CÓMO SE ESCRIBE (UNE 153101:2018 EX). No es estilo: es la norma con la
   que se valida, así que cualquier cambio la sigue igual.
   · Una idea por frase y una frase por línea: cada frase es un elemento de
     `frases` y se pinta en su propio párrafo.
   · Presente, frases afirmativas y en activa. Sin gerundios, sin
     subjuntivos y sin dos verbos seguidos, salvo poder, querer y deber.
   · Sin paréntesis, sin punto y coma, sin comillas, sin «etcétera» y sin
     símbolos como % o /.
   · Sin siglas sin explicar (AP no se usa: siempre Accesibilidad Primero).
   · Sin adverbios en -mente, sin palabras en otro idioma que no se
     expliquen y siempre la misma palabra para la misma idea.
   · Números en cifras y fechas completas.
   · Las palabras difíciles van en el `glosario` del principio de la página,
     con un ejemplo. La norma pide negrita o un tamaño mayor para la palabra:
     aquí, tamaño mayor, porque la web usa un solo peso (AGENTS.md §4).
   · Listas para más de tres elementos.
   --------------------------------------------------------------------------- */
import type { RouteKey } from '../i18n/config';

export type LangLF = 'es' | 'ca';
export const IDIOMAS_LF: LangLF[] = ['es', 'ca'];

export type IdLF = 'inicio' | 'quienes' | 'hacemos' | 'contacto' | 'accesibilidad';

/** La dirección de cada página dentro de /lectura-facil/ (vacía, la portada). */
export const SLUG_LF: Record<IdLF, Record<LangLF, string>> = {
  inicio: { es: '', ca: '' },
  quienes: { es: 'quienes-somos', ca: 'qui-som' },
  hacemos: { es: 'que-hacemos', ca: 'que-fem' },
  contacto: { es: 'contacto', ca: 'contacte' },
  accesibilidad: { es: 'accesibilidad', ca: 'accessibilitat' },
};

/** Un enlace: a otra página en lectura fácil, a una página de la web
    completa o a otra web. Siempre en su propia línea (44 px). */
export type EnlaceLF =
  | { texto: string; lf: IdLF }
  | { texto: string; ruta: RouteKey; ancla?: string }
  | { texto: string; url: string };

export interface TerminoLF { palabra: string; explicacion: string[] }

export interface BloqueLF {
  titulo: string;
  frases?: string[];
  lista?: string[];
  /** Frases que van detrás de la lista. */
  despues?: string[];
  enlaces?: EnlaceLF[];
}

export interface PaginaLF {
  id: IdLF;
  /** El nombre corto, para el índice y el título de la pestaña. */
  nombre: string;
  titulo: string;
  descripcion: string;
  glosario?: TerminoLF[];
  bloques: BloqueLF[];
}

export const CORREO = 'proyectos@accesibilidadprimero.com';

/* Textos fijos de la plantilla. */
export const UI_LF: Record<LangLF, {
  aviso: string[];
  glosario: string;
  indice: string;
  completa: string;
  completaInicio: string;
  enlace: string;
}> = {
  es: {
    aviso: [
      'Esta página está en lectura fácil.',
      'Un grupo de personas con discapacidad intelectual revisa este texto.',
      'Así sabemos si las personas entienden bien el texto.',
      'Esta web también tiene una versión con textos más largos.',
      'Esa versión se llama web completa.',
    ],
    glosario: 'Palabras para entender esta página',
    indice: 'Páginas en lectura fácil',
    completa: 'Ver esta página en la web completa',
    completaInicio: 'Ir a la web completa',
    enlace: 'Lectura fácil',
  },
  ca: {
    aviso: [
      'Aquesta pàgina és en lectura fàcil.',
      'Un grup de persones amb discapacitat intel·lectual revisa aquest text.',
      'Així sabem si les persones entenen bé el text.',
      'Aquesta web també té una versió amb textos més llargs.',
      'Aquesta versió es diu web completa.',
    ],
    glosario: 'Paraules per entendre aquesta pàgina',
    indice: 'Pàgines en lectura fàcil',
    completa: 'Veure aquesta pàgina a la web completa',
    completaInicio: 'Anar a la web completa',
    enlace: 'Lectura fàcil',
  },
};

/** La página de la web completa que corresponde a cada una. */
export const EQUIVALENTE: Record<IdLF, RouteKey> = {
  inicio: 'home',
  quienes: 'estudio',
  hacemos: 'servicios',
  contacto: 'contacto',
  accesibilidad: 'accesibilidad',
};

/** Desde la web completa, a qué página en lectura fácil lleva el enlace
    «Lectura fácil»: la que cuenta lo mismo, o la portada. */
export function lfDesde(current: RouteKey): IdLF {
  const id = (Object.keys(EQUIVALENTE) as IdLF[]).find((k) => EQUIVALENTE[k] === current);
  return id ?? 'inicio';
}

/* LAS PALABRAS DIFÍCILES. Una vez aquí y en el glosario de CADA página que
   las usa: las páginas se abren sueltas, desde la web completa, y su glosario
   dice «para entender esta página» (revisión del 07/11/2026). */
type ClaveG =
  | 'accesibilidad' | 'web' | 'estudio' | 'organizacion' | 'congreso' | 'disenar' | 'barrera'
  | 'herramienta' | 'tecnologia' | 'lector' | 'declaracion' | 'actualizar' | 'programacion'
  | 'impuesto' | 'pautas' | 'formulario' | 'correo';

const G: Record<LangLF, Record<ClaveG, TerminoLF>> = {
  es: {
    accesibilidad: { palabra: 'Accesibilidad', explicacion: [
      'Accesibilidad quiere decir que todas las personas pueden usar un lugar, un objeto o una web.',
      'Por ejemplo, una rampa hace accesible una puerta para una persona en silla de ruedas.',
    ] },
    web: { palabra: 'Web', explicacion: [
      'Una web es un grupo de páginas en internet.',
      'Por ejemplo, esta página forma parte de la web de Accesibilidad Primero.',
    ] },
    estudio: { palabra: 'Estudio de diseño', explicacion: [
      'Un estudio de diseño es una empresa pequeña.',
      'En un estudio de diseño, las personas diseñan webs, carteles o libros.',
    ] },
    organizacion: { palabra: 'Organización social', explicacion: [
      'Una organización social es un grupo de personas.',
      'Este grupo ayuda a otras personas.',
    ] },
    congreso: { palabra: 'Congreso', explicacion: [
      'Un congreso es una reunión de muchas personas con el mismo trabajo.',
      'En un congreso, estas personas hablan de su trabajo.',
    ] },
    disenar: { palabra: 'Diseñar', explicacion: [
      'Diseñar es decidir la forma de un objeto antes de hacerlo.',
      'Por ejemplo, diseñar una web es decidir los textos, las fotos y los colores de cada página.',
    ] },
    barrera: { palabra: 'Barrera', explicacion: [
      'Una barrera hace difícil a una persona entrar en un lugar o usar una web.',
      'Por ejemplo, una escalera es una barrera para una persona en silla de ruedas.',
      'En una web, una letra muy pequeña es una barrera para una persona que ve poco.',
    ] },
    herramienta: { palabra: 'Herramienta', explicacion: [
      'Aquí, una herramienta es un programa de ordenador para hacer un trabajo.',
    ] },
    tecnologia: { palabra: 'Tecnología', explicacion: [
      'La tecnología son los aparatos y los programas que usamos cada día.',
      'Por ejemplo, los ordenadores, los móviles y las webs.',
    ] },
    lector: { palabra: 'Lector de pantalla', explicacion: [
      'Un lector de pantalla es un programa.',
      'Este programa lee en voz alta los textos de la pantalla.',
      'Por ejemplo, muchas personas ciegas usan un lector de pantalla para leer una web.',
    ] },
    declaracion: { palabra: 'Declaración de accesibilidad', explicacion: [
      'Una declaración de accesibilidad es una página de la web.',
      'Esta página explica qué pautas de accesibilidad cumple la web y qué pautas no cumple.',
    ] },
    actualizar: { palabra: 'Actualizar una web', explicacion: [
      'Actualizar una web es cambiar los textos y las fotos de la web.',
    ] },
    programacion: { palabra: 'Programación', explicacion: [
      'La programación es escribir las instrucciones de un programa o de una web.',
    ] },
    impuesto: { palabra: 'Impuesto', explicacion: [
      'Un impuesto es un dinero para el Estado.',
      'Pagamos un impuesto cuando compramos un producto o pagamos un trabajo.',
      'El IVA es el nombre de un impuesto.',
    ] },
    pautas: { palabra: 'Pautas WCAG', explicacion: [
      'Las pautas WCAG son unas normas para hacer webs accesibles.',
      'WCAG son las letras de un nombre en inglés.',
      'Muchos países usan estas pautas.',
      'Las pautas WCAG tienen 3 niveles.',
      'Las leyes de España y de Europa piden el nivel del medio.',
      'Ese nivel se llama doble A.',
    ] },
    formulario: { palabra: 'Formulario', explicacion: [
      'Un formulario es una página con espacios para escribir tus datos y tu mensaje.',
    ] },
    correo: { palabra: 'Correo electrónico', explicacion: [
      'Un correo electrónico es un mensaje por internet.',
      'Para mandar un correo electrónico necesitas la dirección de la otra persona.',
    ] },
  },
  ca: {
    accesibilidad: { palabra: 'Accessibilitat', explicacion: [
      'Accessibilitat vol dir que totes les persones poden utilitzar un lloc, un objecte o una web.',
      'Per exemple, una rampa fa accessible una porta per a una persona en cadira de rodes.',
    ] },
    web: { palabra: 'Web', explicacion: [
      'Una web és un grup de pàgines a internet.',
      'Per exemple, aquesta pàgina forma part de la web d’Accesibilidad Primero.',
    ] },
    estudio: { palabra: 'Estudi de disseny', explicacion: [
      'Un estudi de disseny és una empresa petita.',
      'En un estudi de disseny, les persones dissenyen webs, cartells o llibres.',
    ] },
    organizacion: { palabra: 'Organització social', explicacion: [
      'Una organització social és un grup de persones.',
      'Aquest grup ajuda altres persones.',
    ] },
    congreso: { palabra: 'Congrés', explicacion: [
      'Un congrés és una reunió de moltes persones amb la mateixa feina.',
      'En un congrés, aquestes persones parlen de la seva feina.',
    ] },
    disenar: { palabra: 'Dissenyar', explicacion: [
      'Dissenyar és decidir la forma d’un objecte abans de fer-lo.',
      'Per exemple, dissenyar una web és decidir els textos, les fotos i els colors de cada pàgina.',
    ] },
    barrera: { palabra: 'Barrera', explicacion: [
      'Una barrera fa difícil a una persona entrar en un lloc o utilitzar una web.',
      'Per exemple, una escala és una barrera per a una persona en cadira de rodes.',
      'En una web, una lletra molt petita és una barrera per a una persona que hi veu poc.',
    ] },
    herramienta: { palabra: 'Eina', explicacion: [
      'Aquí, una eina és un programa d’ordinador per fer una feina.',
    ] },
    tecnologia: { palabra: 'Tecnologia', explicacion: [
      'La tecnologia són els aparells i els programes que utilitzem cada dia.',
      'Per exemple, els ordinadors, els mòbils i les webs.',
    ] },
    lector: { palabra: 'Lector de pantalla', explicacion: [
      'Un lector de pantalla és un programa.',
      'Aquest programa llegeix en veu alta els textos de la pantalla.',
      'Per exemple, moltes persones cegues utilitzen un lector de pantalla per llegir una web.',
    ] },
    declaracion: { palabra: 'Declaració d’accessibilitat', explicacion: [
      'Una declaració d’accessibilitat és una pàgina de la web.',
      'Aquesta pàgina explica quines pautes d’accessibilitat compleix la web i quines pautes no compleix.',
    ] },
    actualizar: { palabra: 'Actualitzar una web', explicacion: [
      'Actualitzar una web és canviar els textos i les fotos de la web.',
    ] },
    programacion: { palabra: 'Programació', explicacion: [
      'La programació és escriure les instruccions d’un programa o d’una web.',
    ] },
    impuesto: { palabra: 'Impost', explicacion: [
      'Un impost és un diner per a l’Estat.',
      'Paguem un impost quan comprem un producte o paguem una feina.',
      'L’IVA és el nom d’un impost.',
    ] },
    pautas: { palabra: 'Pautes WCAG', explicacion: [
      'Les pautes WCAG són unes normes per fer webs accessibles.',
      'WCAG són les lletres d’un nom en anglès.',
      'Molts països utilitzen aquestes pautes.',
      'Les pautes WCAG tenen 3 nivells.',
      'Les lleis d’Espanya i d’Europa demanen el nivell del mig.',
      'Aquest nivell es diu doble A.',
    ] },
    formulario: { palabra: 'Formulari', explicacion: [
      'Un formulari és una pàgina amb espais per escriure les teves dades i el teu missatge.',
    ] },
    correo: { palabra: 'Correu electrònic', explicacion: [
      'Un correu electrònic és un missatge per internet.',
      'Per enviar un correu electrònic necessites l’adreça de l’altra persona.',
    ] },
  },
};
const g = (lang: LangLF, ...claves: ClaveG[]) => claves.map((c) => G[lang][c]);

export const PAGINAS_LF: Record<LangLF, PaginaLF[]> = {
  es: [
    {
      id: 'inicio',
      nombre: 'Inicio',
      titulo: 'Accesibilidad Primero en lectura fácil',
      descripcion: 'La web de Accesibilidad Primero en lectura fácil: quiénes somos, qué hacemos y cómo escribirnos.',
      glosario: g('es', 'accesibilidad', 'web', 'estudio', 'organizacion', 'congreso'),
      bloques: [
        {
          titulo: 'Quiénes somos',
          frases: [
            'Accesibilidad Primero es un estudio de diseño.',
            'Estamos en Valencia.',
            'Hacemos webs accesibles.',
            'Trabajamos con organizaciones sociales, con artistas, con arquitectos y con congresos.',
          ],
        },
        {
          titulo: 'Qué hay en esta web',
          frases: ['Esta web tiene 4 páginas más en lectura fácil.'],
          enlaces: [
            { texto: 'Quiénes somos', lf: 'quienes' },
            { texto: 'Qué hacemos', lf: 'hacemos' },
            { texto: 'Cómo escribirnos', lf: 'contacto' },
            { texto: 'La accesibilidad de esta web', lf: 'accesibilidad' },
          ],
        },
      ],
    },
    {
      id: 'quienes',
      nombre: 'Quiénes somos',
      titulo: 'Quiénes somos',
      descripcion: 'Quiénes somos en Accesibilidad Primero, en lectura fácil.',
      glosario: g('es', 'estudio', 'disenar', 'accesibilidad', 'organizacion', 'congreso', 'tecnologia', 'barrera', 'herramienta'),
      bloques: [
        {
          titulo: 'El estudio',
          frases: [
            'Accesibilidad Primero es un estudio de diseño.',
            'Diseñamos webs y aplicaciones.',
            'Una aplicación es un programa para el teléfono móvil o para el ordenador.',
            'Pensamos en la accesibilidad antes de diseñar una web.',
            'Así todas las personas pueden usar la web.',
          ],
        },
        {
          titulo: 'Quién trabaja en el estudio',
          frases: [
            'Somos un estudio pequeño.',
            'Johnny Vigas creó el estudio en marzo de 2026.',
            'Johnny diseña las webs.',
            'Si trabajas con nosotros, hablas con Johnny.',
          ],
        },
        {
          titulo: 'Con quién trabajamos',
          frases: [
            'Trabajamos con organizaciones sociales, con artistas, con arquitectos y con congresos.',
            'Por ejemplo:',
          ],
          lista: [
            'Foc i Cor es un restaurante escuela en Catarroja.',
            'ECI es un congreso europeo para profesionales que trabajan con niñas y niños pequeños.',
            'Izaskun Etxebarria es una artista.',
            'Pau Jordà es un arquitecto.',
          ],
          despues: [
            'En un restaurante escuela, las personas aprenden el trabajo de un restaurante.',
            'Un arquitecto diseña edificios.',
          ],
        },
        {
          titulo: 'La universidad',
          frases: [
            'Trabajamos con la Universitat Politècnica de València.',
            'Es una universidad de Valencia.',
            'En la universidad hay un grupo de trabajo.',
            'Ese grupo se llama Cátedra dicaTIC.',
            'Este grupo quiere quitar las barreras de la tecnología para las personas con discapacidad.',
          ],
        },
        {
          titulo: 'Nuestras herramientas',
          frases: ['También hacemos 3 herramientas.'],
          lista: [
            'Itza está dentro de una web y contesta las preguntas de las personas que visitan esa web.',
            'A11y Primero encuentra las barreras de una web.',
            'Accesible Abstracts ordena los textos que recibe un congreso.',
          ],
          despues: [
            'A11y es una forma corta de escribir accesibilidad en inglés.',
            'Abstracts es una palabra en inglés.',
            'Abstracts quiere decir resúmenes.',
          ],
        },
      ],
    },
    {
      id: 'hacemos',
      nombre: 'Qué hacemos',
      titulo: 'Qué hacemos',
      descripcion: 'Qué hace Accesibilidad Primero, en lectura fácil: webs accesibles, revisión de webs y clases.',
      glosario: g('es', 'disenar', 'accesibilidad', 'barrera', 'lector', 'actualizar', 'programacion', 'pautas', 'declaracion', 'impuesto'),
      bloques: [
        {
          titulo: 'Hacemos 3 trabajos',
          lista: [
            'Diseñamos y hacemos webs accesibles.',
            'Revisamos webs.',
            'Damos clases a las personas que actualizan una web.',
          ],
        },
        {
          titulo: 'Diseñamos y hacemos webs',
          frases: [
            'Diseñamos una web nueva para cada organización.',
            'Pensamos en la accesibilidad antes de diseñar la web.',
            'Algunas personas no pueden usar el ratón.',
            'Estas personas usan solo el teclado.',
            'Por eso probamos cada web con el teclado.',
            'También probamos cada web con un lector de pantalla.',
            'Tu equipo puede cambiar los textos y las fotos de la web.',
            'Para estos cambios, tu equipo no necesita programación.',
            'También hacemos accesibles los documentos PDF.',
            'Un documento PDF es un documento para leer en el ordenador o en el móvil.',
          ],
        },
        {
          titulo: 'Revisamos webs',
          frases: [
            'Revisamos tu web con las pautas WCAG.',
            'Te explicamos cada barrera de tu web.',
            'Te damos un plan para quitar las barreras.',
            'También escribimos la declaración de accesibilidad de tu web.',
          ],
        },
        {
          titulo: 'El precio de una revisión',
          lista: [
            'Una web de hasta 10 páginas cuesta entre 590 euros y 790 euros.',
            'Una web de hasta 25 páginas cuesta entre 1200 euros y 1800 euros.',
            'Una web de una administración pública o de una empresa grande cuesta 2500 euros o más.',
          ],
          despues: [
            'Además de este precio, pagas un impuesto.',
            'Ese impuesto es el IVA.',
          ],
        },
        {
          titulo: 'Damos clases',
          frases: [
            'Damos clases a las personas que actualizan una web.',
            'Así la web es accesible también después de cada cambio.',
            'Hay clases para cada trabajo: diseño, programación y textos.',
            'También hay clases cortas sobre un solo tema.',
            'Por ejemplo, una clase explica cómo hacer un documento PDF accesible.',
          ],
        },
      ],
    },
    {
      id: 'contacto',
      nombre: 'Cómo escribirnos',
      titulo: 'Cómo escribirnos',
      descripcion: 'Cómo escribir a Accesibilidad Primero, en lectura fácil.',
      glosario: g('es', 'correo', 'formulario'),
      bloques: [
        {
          titulo: 'Escríbenos un correo electrónico',
          frases: [
            'Puedes escribirnos un correo electrónico.',
            'Nuestra dirección de correo electrónico es esta:',
            CORREO,
          ],
          enlaces: [{ texto: 'Escribir un correo electrónico', url: `mailto:${CORREO}` }],
        },
        {
          titulo: 'Qué puedes contarnos',
          frases: [
            'Cuéntanos qué hace tu organización.',
            'Cuéntanos qué quieres conseguir.',
            'Puedes escribirnos con una idea sin terminar.',
          ],
        },
        {
          titulo: 'Siempre te respondemos',
          frases: [
            'Respondemos a todos los correos electrónicos.',
            'A veces no somos el estudio adecuado para tu proyecto.',
            'Entonces también te respondemos y te lo explicamos.',
          ],
        },
        {
          titulo: 'El formulario',
          frases: ['En la web completa hay un formulario para escribirnos.'],
          enlaces: [{ texto: 'Ir al formulario', ruta: 'contacto' }],
        },
        {
          titulo: 'Nuestras redes sociales',
          frases: ['También estamos en 3 redes sociales.'],
          enlaces: [
            { texto: 'LinkedIn', url: 'https://www.linkedin.com/company/aprimero' },
            { texto: 'Instagram', url: 'https://www.instagram.com/accesibilidadprimero/' },
            { texto: 'Mastodon', url: 'https://mastodon.social/@accesibilidadprimero' },
          ],
        },
      ],
    },
    {
      id: 'accesibilidad',
      nombre: 'Accesibilidad',
      titulo: 'La accesibilidad de esta web',
      descripcion: 'Qué cumple y qué no cumple la web de Accesibilidad Primero, en lectura fácil.',
      glosario: g('es', 'accesibilidad', 'pautas', 'lector', 'correo'),
      bloques: [
        {
          titulo: 'Lo que cumple esta web',
          frases: [
            'Queremos una web para todas las personas.',
            'La última revisión de esta web es del 5 de noviembre de 2026.',
            'La web cumple casi todas las pautas WCAG del nivel doble A.',
            'Los botones y los enlaces de esta web son grandes.',
            'Son fáciles de pulsar con el dedo.',
          ],
        },
        {
          titulo: 'Lo que no cumple esta web',
          frases: [
            'En la web completa hay una página sobre nuestro estudio.',
            'En esa página hay un dibujo que se mueve siempre.',
            'El dibujo no tiene un botón para pararlo.',
            'Tu móvil y tu ordenador tienen una opción para reducir el movimiento.',
            'Si activas esta opción, el dibujo se para.',
          ],
          enlaces: [{ texto: 'Ver la página sobre nuestro estudio', ruta: 'estudio' }],
        },
        {
          titulo: 'Los vídeos',
          frases: [
            'Los vídeos de esta web no tienen sonido.',
            'Cada vídeo tiene un texto.',
            'El texto explica las imágenes del vídeo.',
          ],
        },
        {
          titulo: 'Lo que todavía debemos revisar',
          frases: [
            'Todavía debemos probar toda la web con un lector de pantalla.',
            'Después de esta prueba, escribimos los resultados en esta página.',
          ],
        },
        {
          titulo: 'Si encuentras un problema',
          frases: [
            'Escríbenos un correo electrónico.',
            'Cuéntanos qué quieres hacer.',
            'Dinos también el nombre de la página.',
            'Te respondemos en 20 días de trabajo o menos.',
          ],
          enlaces: [{ texto: 'Escribir un correo electrónico', url: `mailto:${CORREO}` }],
        },
      ],
    },
  ],

  ca: [
    {
      id: 'inicio',
      nombre: 'Inici',
      titulo: 'Accesibilidad Primero en lectura fàcil',
      descripcion: 'La web d’Accesibilidad Primero en lectura fàcil: qui som, què fem i com escriure’ns.',
      glosario: g('ca', 'accesibilidad', 'web', 'estudio', 'organizacion', 'congreso'),
      bloques: [
        {
          titulo: 'Qui som',
          frases: [
            'Accesibilidad Primero és un estudi de disseny.',
            'Som a València.',
            'Fem webs accessibles.',
            'Treballem amb organitzacions socials, amb artistes, amb arquitectes i amb congressos.',
          ],
        },
        {
          titulo: 'Què hi ha en aquesta web',
          frases: ['Aquesta web té 4 pàgines més en lectura fàcil.'],
          enlaces: [
            { texto: 'Qui som', lf: 'quienes' },
            { texto: 'Què fem', lf: 'hacemos' },
            { texto: 'Com escriure’ns', lf: 'contacto' },
            { texto: 'L’accessibilitat d’aquesta web', lf: 'accesibilidad' },
          ],
        },
      ],
    },
    {
      id: 'quienes',
      nombre: 'Qui som',
      titulo: 'Qui som',
      descripcion: 'Qui som a Accesibilidad Primero, en lectura fàcil.',
      glosario: g('ca', 'estudio', 'disenar', 'accesibilidad', 'organizacion', 'congreso', 'tecnologia', 'barrera', 'herramienta'),
      bloques: [
        {
          titulo: 'L’estudi',
          frases: [
            'Accesibilidad Primero és un estudi de disseny.',
            'Dissenyem webs i aplicacions.',
            'Una aplicació és un programa per al telèfon mòbil o per a l’ordinador.',
            'Pensem en l’accessibilitat abans de dissenyar una web.',
            'Així totes les persones poden utilitzar la web.',
          ],
        },
        {
          titulo: 'Qui treballa a l’estudi',
          frases: [
            'Som un estudi petit.',
            'Johnny Vigas va crear l’estudi el març de 2026.',
            'Johnny dissenya les webs.',
            'Si treballes amb nosaltres, parles amb Johnny.',
          ],
        },
        {
          titulo: 'Amb qui treballem',
          frases: [
            'Treballem amb organitzacions socials, amb artistes, amb arquitectes i amb congressos.',
            'Per exemple:',
          ],
          lista: [
            'Foc i Cor és un restaurant escola a Catarroja.',
            'ECI és un congrés europeu per a professionals que treballen amb nenes i nens petits.',
            'Izaskun Etxebarria és una artista.',
            'Pau Jordà és un arquitecte.',
          ],
          despues: [
            'En un restaurant escola, les persones aprenen la feina d’un restaurant.',
            'Un arquitecte dissenya edificis.',
          ],
        },
        {
          titulo: 'La universitat',
          frases: [
            'Treballem amb la Universitat Politècnica de València.',
            'És una universitat de València.',
            'A la universitat hi ha un grup de treball.',
            'Aquest grup es diu Càtedra dicaTIC.',
            'Aquest grup vol treure les barreres de la tecnologia per a les persones amb discapacitat.',
          ],
        },
        {
          titulo: 'Les nostres eines',
          frases: ['També fem 3 eines.'],
          lista: [
            'Itza és dins d’una web i contesta les preguntes de les persones que visiten aquesta web.',
            'A11y Primero troba les barreres d’una web.',
            'Accesible Abstracts ordena els textos que rep un congrés.',
          ],
          despues: [
            'A11y és una manera curta d’escriure accessibilitat en anglès.',
            'Abstracts és una paraula en anglès.',
            'Abstracts vol dir resums.',
          ],
        },
      ],
    },
    {
      id: 'hacemos',
      nombre: 'Què fem',
      titulo: 'Què fem',
      descripcion: 'Què fa Accesibilidad Primero, en lectura fàcil: webs accessibles, revisió de webs i classes.',
      glosario: g('ca', 'disenar', 'accesibilidad', 'barrera', 'lector', 'actualizar', 'programacion', 'pautas', 'declaracion', 'impuesto'),
      bloques: [
        {
          titulo: 'Fem 3 feines',
          lista: [
            'Dissenyem i fem webs accessibles.',
            'Revisem webs.',
            'Donem classes a les persones que actualitzen una web.',
          ],
        },
        {
          titulo: 'Dissenyem i fem webs',
          frases: [
            'Dissenyem una web nova per a cada organització.',
            'Pensem en l’accessibilitat abans de dissenyar la web.',
            'Algunes persones no poden utilitzar el ratolí.',
            'Aquestes persones utilitzen només el teclat.',
            'Per això provem cada web amb el teclat.',
            'També provem cada web amb un lector de pantalla.',
            'El teu equip pot canviar els textos i les fotos de la web.',
            'Per a aquests canvis, el teu equip no necessita programació.',
            'També fem accessibles els documents PDF.',
            'Un document PDF és un document per llegir a l’ordinador o al mòbil.',
          ],
        },
        {
          titulo: 'Revisem webs',
          frases: [
            'Revisem la teva web amb les pautes WCAG.',
            'T’expliquem cada barrera de la teva web.',
            'Et donem un pla per treure les barreres.',
            'També escrivim la declaració d’accessibilitat de la teva web.',
          ],
        },
        {
          titulo: 'El preu d’una revisió',
          lista: [
            'Una web de fins a 10 pàgines costa entre 590 euros i 790 euros.',
            'Una web de fins a 25 pàgines costa entre 1200 euros i 1800 euros.',
            'Una web d’una administració pública o d’una empresa gran costa 2500 euros o més.',
          ],
          despues: [
            'A més d’aquest preu, pagues un impost.',
            'Aquest impost és l’IVA.',
          ],
        },
        {
          titulo: 'Donem classes',
          frases: [
            'Donem classes a les persones que actualitzen una web.',
            'Així la web és accessible també després de cada canvi.',
            'Hi ha classes per a cada feina: disseny, programació i textos.',
            'També hi ha classes curtes sobre un sol tema.',
            'Per exemple, una classe explica com fer un document PDF accessible.',
          ],
        },
      ],
    },
    {
      id: 'contacto',
      nombre: 'Com escriure’ns',
      titulo: 'Com escriure’ns',
      descripcion: 'Com escriure a Accesibilidad Primero, en lectura fàcil.',
      glosario: g('ca', 'correo', 'formulario'),
      bloques: [
        {
          titulo: 'Escriu-nos un correu electrònic',
          frases: [
            'Ens pots escriure un correu electrònic.',
            'La nostra adreça de correu electrònic és aquesta:',
            CORREO,
          ],
          enlaces: [{ texto: 'Escriure un correu electrònic', url: `mailto:${CORREO}` }],
        },
        {
          titulo: 'Què ens pots explicar',
          frases: [
            'Explica’ns què fa la teva organització.',
            'Explica’ns què vols aconseguir.',
            'Ens pots escriure amb una idea sense acabar.',
          ],
        },
        {
          titulo: 'Sempre et responem',
          frases: [
            'Responem tots els correus electrònics.',
            'A vegades no som l’estudi adequat per al teu projecte.',
            'Llavors també et responem i t’ho expliquem.',
          ],
        },
        {
          titulo: 'El formulari',
          frases: ['A la web completa hi ha un formulari per escriure’ns.'],
          enlaces: [{ texto: 'Anar al formulari', ruta: 'contacto' }],
        },
        {
          titulo: 'Les nostres xarxes socials',
          frases: ['També som a 3 xarxes socials.'],
          enlaces: [
            { texto: 'LinkedIn', url: 'https://www.linkedin.com/company/aprimero' },
            { texto: 'Instagram', url: 'https://www.instagram.com/accesibilidadprimero/' },
            { texto: 'Mastodon', url: 'https://mastodon.social/@accesibilidadprimero' },
          ],
        },
      ],
    },
    {
      id: 'accesibilidad',
      nombre: 'Accessibilitat',
      titulo: 'L’accessibilitat d’aquesta web',
      descripcion: 'Què compleix i què no compleix la web d’Accesibilidad Primero, en lectura fàcil.',
      glosario: g('ca', 'accesibilidad', 'pautas', 'lector', 'correo'),
      bloques: [
        {
          titulo: 'El que compleix aquesta web',
          frases: [
            'Volem una web per a totes les persones.',
            'L’última revisió d’aquesta web és del 5 de novembre de 2026.',
            'La web compleix gairebé totes les pautes WCAG del nivell doble A.',
            'Els botons i els enllaços d’aquesta web són grans.',
            'Són fàcils de prémer amb el dit.',
          ],
        },
        {
          titulo: 'El que no compleix aquesta web',
          frases: [
            'A la web completa hi ha una pàgina sobre el nostre estudi.',
            'En aquesta pàgina hi ha un dibuix que es mou sempre.',
            'El dibuix no té cap botó per aturar-lo.',
            'El teu mòbil i el teu ordinador tenen una opció per reduir el moviment.',
            'Si actives aquesta opció, el dibuix s’atura.',
          ],
          enlaces: [{ texto: 'Veure la pàgina sobre el nostre estudi', ruta: 'estudio' }],
        },
        {
          titulo: 'Els vídeos',
          frases: [
            'Els vídeos d’aquesta web no tenen so.',
            'Cada vídeo té un text.',
            'El text explica les imatges del vídeo.',
          ],
        },
        {
          titulo: 'El que encara hem de revisar',
          frases: [
            'Encara hem de provar tota la web amb un lector de pantalla.',
            'Després d’aquesta prova, escrivim els resultats en aquesta pàgina.',
          ],
        },
        {
          titulo: 'Si trobes un problema',
          frases: [
            'Escriu-nos un correu electrònic.',
            'Explica’ns què vols fer.',
            'Digues-nos també el nom de la pàgina.',
            'Et responem en 20 dies feiners o menys.',
          ],
          enlaces: [{ texto: 'Escriure un correu electrònic', url: `mailto:${CORREO}` }],
        },
      ],
    },
  ],
};
