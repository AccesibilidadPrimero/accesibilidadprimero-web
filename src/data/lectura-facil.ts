/* ---------------------------------------------------------------------------
   El contenido de la web en lectura fácil · castellano, catalán e inglés
   (Easy Read, desde el 07/11/2026).

   Revisión 2 (Johnny, 07/11/2026): «quiero una versión de lectura fácil del
   contenido de la web, no explicar qué es lectura fácil». Como las webs de
   referencia (el PAGe de la Administración, las guías Easy Read de GOV.UK y
   Mencap): cada página cuenta lo mismo que su página de la web completa, con
   lo importante primero, y una imagen junto al texto cuando ayuda a
   entenderlo. Sin aviso sobre la lectura fácil y sin recuadro de glosario:
   la palabra difícil se explica en la frase siguiente, donde aparece.

   Cinco páginas: Inicio, Quiénes somos, Qué hacemos, Cómo escribirnos y
   Accesibilidad. La va a validar Plena inclusión: hasta entonces es un
   BORRADOR y no lleva el logotipo europeo de lectura fácil.

   CÓMO SE ESCRIBE (UNE 153101:2018 EX). Es la norma con la que se valida:
   · Una idea por frase y una frase por línea (cada frase, su párrafo).
   · Presente, frases afirmativas y en activa. Sin gerundios, sin
     subjuntivos, sin «se + verbo» y sin dos verbos seguidos, salvo poder,
     querer y deber.
   · Sin paréntesis, punto y coma, comillas, «etcétera» ni símbolos como %.
   · Sin siglas sin explicar (AP no se usa: siempre Accesibilidad Primero).
   · Sin adverbios en -mente, sin palabras vagas (algo, cosa), sin metáforas
     y siempre la misma palabra para la misma idea.
   · Números en cifras y fechas completas. Listas para más de 3 elementos.
   --------------------------------------------------------------------------- */
import type { RouteKey } from '../i18n/config';

export type LangLF = 'es' | 'ca' | 'en';
export const IDIOMAS_LF: LangLF[] = ['es', 'ca', 'en'];

export type IdLF = 'inicio' | 'quienes' | 'hacemos' | 'contacto' | 'accesibilidad';

/** La dirección de cada página dentro de /lectura-facil/ (vacía, la portada). */
export const SLUG_LF: Record<IdLF, Record<LangLF, string>> = {
  inicio: { es: '', ca: '', en: '' },
  quienes: { es: 'quienes-somos', ca: 'qui-som', en: 'about-us' },
  hacemos: { es: 'que-hacemos', ca: 'que-fem', en: 'what-we-do' },
  contacto: { es: 'contacto', ca: 'contacte', en: 'contact' },
  accesibilidad: { es: 'accesibilidad', ca: 'accessibilitat', en: 'accessibility' },
};

/** Las imágenes que se pueden poner junto a un texto (src/paginas/lectura-facil.astro). */
export type ImagenLF = 'johnny' | 'foc' | 'eci' | 'izaskun' | 'itza' | 'a11y' | 'abstracts';

/** Un enlace: a otra página en lectura fácil, a la web completa o a otra web.
    Siempre en su propia línea (44 px). */
export type EnlaceLF =
  | { texto: string; lf: IdLF }
  | { texto: string; ruta: RouteKey }
  | { texto: string; url: string };

/** Una fila con imagen y texto: un proyecto, una herramienta, una persona. */
export interface TarjetaLF { imagen: ImagenLF; alt: string; titulo: string; frases: string[] }

export interface BloqueLF {
  titulo: string;
  frases?: string[];
  lista?: string[];
  despues?: string[];
  tarjetas?: TarjetaLF[];
  /** Una imagen junto a todo el bloque. */
  imagen?: { archivo: ImagenLF; alt: string };
  enlaces?: EnlaceLF[];
}

export interface PaginaLF {
  id: IdLF;
  /** El nombre corto, para el pie de la página y la pestaña. */
  nombre: string;
  titulo: string;
  /** Lo primero que se lee, debajo del título: lo más importante. */
  entrada: string[];
  /** Una lista o un enlace que forman parte de la entrada. */
  entradaLista?: string[];
  entradaEnlaces?: EnlaceLF[];
  descripcion: string;
  bloques: BloqueLF[];
}

export const CORREO = 'proyectos@accesibilidadprimero.com';

export const UI_LF: Record<LangLF, { otras: string; completa: string; enlace: string }> = {
  es: { otras: 'Otras páginas', completa: 'Ver esta página en la web completa', enlace: 'Lectura fácil' },
  ca: { otras: 'Altres pàgines', completa: 'Veure aquesta pàgina a la web completa', enlace: 'Lectura fàcil' },
  en: { otras: 'Other pages', completa: 'See this page on the full website', enlace: 'Easy read' },
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

const REDES: EnlaceLF[] = [
  { texto: 'LinkedIn', url: 'https://www.linkedin.com/company/aprimero' },
  { texto: 'Instagram', url: 'https://www.instagram.com/accesibilidadprimero/' },
  { texto: 'Mastodon', url: 'https://mastodon.social/@accesibilidadprimero' },
];

export const PAGINAS_LF: Record<LangLF, PaginaLF[]> = {
  es: [
    {
      id: 'inicio',
      nombre: 'Inicio',
      titulo: 'Hacemos webs para todas las personas',
      entrada: [
        'Somos Accesibilidad Primero.',
        'Somos un estudio de diseño en Valencia.',
        'Diseñamos webs para organizaciones y proyectos que ayudan a las personas.',
        'Todas las personas pueden usar nuestras webs.',
        'Por ejemplo, una persona ciega o una persona que no puede usar el ratón.',
      ],
      descripcion: 'Accesibilidad Primero en lectura fácil: hacemos webs para todas las personas.',
      bloques: [
        {
          titulo: 'Algunas webs que hacemos',
          tarjetas: [
            {
              imagen: 'foc', alt: 'La web de Foc i Cor en un teléfono móvil.',
              titulo: 'Foc i Cor',
              frases: [
                'Foc i Cor es un restaurante escuela en Catarroja.',
                'En un restaurante escuela, las personas aprenden el trabajo de un restaurante.',
                'En su web puedes leer la carta y reservar una mesa.',
              ],
            },
            {
              imagen: 'eci', alt: 'La web del congreso ECI Conference Madrid 2027.',
              titulo: 'ECI Conference Madrid 2027',
              frases: [
                'Es un congreso para profesionales que trabajan con niñas y niños pequeños.',
                'Un congreso es una reunión de muchas personas con el mismo trabajo.',
                'En su web puedes ver el programa y mandar tu trabajo.',
              ],
            },
            {
              imagen: 'izaskun', alt: 'Una obra de Izaskun Etxebarria en su web: un aro de metal sobre la hierba, junto al mar.',
              titulo: 'Izaskun Etxebarria',
              frases: [
                'Izaskun Etxebarria es una artista.',
                'En su web puedes ver sus obras.',
              ],
            },
          ],
        },
        {
          titulo: 'Nuestras herramientas',
          frases: ['También hacemos programas para resolver problemas de accesibilidad.'],
          tarjetas: [
            {
              imagen: 'itza', alt: 'Itza en una web: una persona pregunta y Itza responde.',
              titulo: 'Itza',
              frases: [
                'Itza está dentro de una web.',
                'Itza responde a las preguntas de las personas que visitan esa web.',
              ],
            },
            {
              imagen: 'a11y', alt: 'A11y Primero muestra una nota de 92 y las barreras de una web.',
              titulo: 'A11y Primero',
              frases: [
                'A11y Primero encuentra las barreras de una web.',
                'Una barrera es un problema que impide usar la web a una persona.',
              ],
            },
            {
              imagen: 'abstracts', alt: 'El formulario de Accesible Abstracts para mandar un trabajo a un congreso.',
              titulo: 'Accesible Abstracts',
              frases: [
                'Accesible Abstracts ordena los trabajos que recibe un congreso.',
                'Abstract es una palabra en inglés.',
                'Abstract quiere decir resumen.',
              ],
            },
          ],
        },
        {
          titulo: 'Cuéntanos tu proyecto',
          frases: ['Si tienes un proyecto, escríbenos.'],
          enlaces: [{ texto: 'Cómo escribirnos', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'quienes',
      nombre: 'Quiénes somos',
      titulo: 'Quiénes somos',
      entrada: [
        'Somos un estudio de diseño pequeño.',
        'Un estudio de diseño es una empresa que diseña.',
        'Diseñamos webs y aplicaciones.',
        'Una aplicación es un programa para el móvil o para el ordenador.',
      ],
      descripcion: 'Quiénes somos en Accesibilidad Primero, en lectura fácil.',
      bloques: [
        {
          titulo: 'Pensamos en todas las personas',
          frases: [
            'Pensamos en la accesibilidad antes de diseñar una web.',
            'Accesibilidad quiere decir que todas las personas pueden usar una web.',
            'Así ninguna persona encuentra barreras en la web.',
            'Una barrera es un problema que impide usar la web a una persona.',
            'Por ejemplo, una letra muy pequeña es una barrera para una persona que ve poco.',
          ],
        },
        {
          titulo: 'Quién trabaja en el estudio',
          tarjetas: [
            {
              imagen: 'johnny', alt: 'Retrato de Johnny Vigas.',
              titulo: 'Johnny Vigas',
              frases: [
                'Johnny Vigas creó el estudio en marzo de 2026.',
                'Johnny diseña las webs.',
                'Si trabajas con nosotros, hablas con Johnny.',
              ],
            },
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
            'La tecnología son los ordenadores, los móviles y las webs.',
          ],
        },
        {
          titulo: 'Con quién trabajamos',
          frases: ['Trabajamos con organizaciones sociales, artistas, arquitectos y congresos.'],
          lista: [
            'Cesal es una organización social.',
            'Cesal tiene el restaurante escuela Foc i Cor en Catarroja.',
            'AEIPI y Eurlyaid organizan el congreso ECI Conference Madrid 2027.',
            'Izaskun Etxebarria es una artista.',
            'Pau Jordà es un arquitecto.',
          ],
        },
        {
          titulo: 'Cuéntanos tu proyecto',
          frases: ['Si tienes un proyecto, escríbenos.'],
          enlaces: [{ texto: 'Cómo escribirnos', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'hacemos',
      nombre: 'Qué hacemos',
      titulo: 'Qué hacemos',
      entrada: ['Hacemos 3 trabajos:'],
      entradaLista: [
        'Diseñamos y hacemos webs accesibles.',
        'Revisamos webs.',
        'Damos clases a las personas que cambian los textos y las fotos de una web.',
      ],
      descripcion: 'Qué hace Accesibilidad Primero, en lectura fácil: webs accesibles, revisión de webs y clases.',
      bloques: [
        {
          titulo: 'Diseñamos y hacemos webs',
          imagen: { archivo: 'foc', alt: 'La web de Foc i Cor en un teléfono móvil.' },
          frases: [
            'Diseñamos una web nueva para cada organización.',
            'Pensamos en la accesibilidad antes de diseñar la web.',
            'Algunas personas no pueden usar el ratón.',
            'Estas personas usan solo el teclado.',
            'Por eso probamos cada web con el teclado.',
            'También probamos cada web con un lector de pantalla.',
            'Un lector de pantalla es un programa que lee la web en voz alta.',
            'Tu equipo puede cambiar los textos y las fotos de la web.',
            'Tu equipo hace estos cambios sin programar.',
          ],
        },
        {
          titulo: 'Revisamos webs',
          imagen: { archivo: 'a11y', alt: 'A11y Primero muestra una nota de 92 y las barreras de una web.' },
          frases: [
            'Revisamos tu web con las pautas WCAG.',
            'Las pautas WCAG son unas normas para hacer webs accesibles.',
            'Te explicamos cada barrera de tu web.',
            'Te damos un plan para quitar las barreras.',
            'También escribimos la declaración de accesibilidad de tu web.',
            'La declaración de accesibilidad es una página que explica qué cumple tu web y qué no cumple.',
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
            'Además de este precio, pagas el IVA.',
            'El IVA es un impuesto.',
          ],
        },
        {
          titulo: 'Damos clases',
          frases: [
            'Damos clases a las personas que cambian los textos y las fotos de una web.',
            'Así la web es accesible también después de cada cambio.',
            'Hay clases para cada trabajo: diseño, programación y textos.',
            'También hay clases cortas sobre un solo tema.',
            'Por ejemplo, una clase explica cómo hacer un documento PDF accesible.',
          ],
        },
        {
          titulo: 'Cuéntanos tu proyecto',
          frases: ['Si quieres uno de estos trabajos, escríbenos.'],
          enlaces: [{ texto: 'Cómo escribirnos', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'contacto',
      nombre: 'Cómo escribirnos',
      titulo: 'Cómo escribirnos',
      entrada: [
        'Puedes escribirnos un correo electrónico.',
        'Nuestra dirección de correo electrónico es esta:',
        CORREO,
      ],
      entradaEnlaces: [{ texto: 'Escribir un correo electrónico', url: `mailto:${CORREO}` }],
      descripcion: 'Cómo escribir a Accesibilidad Primero, en lectura fácil.',
      bloques: [
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
          titulo: 'Otras formas de escribirnos',
          frases: [
            'En la web completa hay un formulario.',
            'Un formulario es una página con espacios para escribir tu nombre y tu mensaje.',
          ],
          enlaces: [{ texto: 'Ir al formulario', ruta: 'contacto' }],
        },
        {
          titulo: 'Nuestras redes sociales',
          enlaces: REDES,
        },
      ],
    },
    {
      id: 'accesibilidad',
      nombre: 'Accesibilidad',
      titulo: 'La accesibilidad de esta web',
      entrada: [
        'Queremos una web para todas las personas.',
        'La última revisión de esta web es del 5 de noviembre de 2026.',
        'La web cumple casi todas las pautas WCAG.',
        'Las pautas WCAG son unas normas para hacer webs accesibles.',
      ],
      descripcion: 'Qué cumple y qué no cumple la web de Accesibilidad Primero, en lectura fácil.',
      bloques: [
        {
          titulo: 'Lo que cumple esta web',
          frases: [
            'Puedes usar toda la web con el teclado.',
            'Puedes leer bien los textos sobre el fondo.',
            'Los botones y los enlaces son grandes.',
            'Son fáciles de pulsar con el dedo.',
            'Los vídeos no tienen sonido.',
            'Cada vídeo tiene un texto que cuenta sus imágenes.',
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
        },
        {
          titulo: 'Lo que todavía debemos revisar',
          frases: [
            'Todavía debemos probar toda la web con un lector de pantalla.',
            'Un lector de pantalla es un programa que lee la web en voz alta.',
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
      titulo: 'Fem webs per a totes les persones',
      entrada: [
        'Som Accesibilidad Primero.',
        'Som un estudi de disseny a València.',
        'Dissenyem webs per a organitzacions i projectes que ajuden les persones.',
        'Totes les persones poden utilitzar les nostres webs.',
        'Per exemple, una persona cega o una persona que no pot utilitzar el ratolí.',
      ],
      descripcion: 'Accesibilidad Primero en lectura fàcil: fem webs per a totes les persones.',
      bloques: [
        {
          titulo: 'Algunes webs que fem',
          tarjetas: [
            {
              imagen: 'foc', alt: 'La web de Foc i Cor en un telèfon mòbil.',
              titulo: 'Foc i Cor',
              frases: [
                'Foc i Cor és un restaurant escola a Catarroja.',
                'En un restaurant escola, les persones aprenen la feina d’un restaurant.',
                'A la seva web pots llegir la carta i reservar una taula.',
              ],
            },
            {
              imagen: 'eci', alt: 'La web del congrés ECI Conference Madrid 2027.',
              titulo: 'ECI Conference Madrid 2027',
              frases: [
                'És un congrés per a professionals que treballen amb nenes i nens petits.',
                'Un congrés és una reunió de moltes persones amb la mateixa feina.',
                'A la seva web pots veure el programa i enviar el teu treball.',
              ],
            },
            {
              imagen: 'izaskun', alt: 'Una obra d’Izaskun Etxebarria a la seva web: un cèrcol de metall sobre l’herba, al costat del mar.',
              titulo: 'Izaskun Etxebarria',
              frases: [
                'Izaskun Etxebarria és una artista.',
                'A la seva web pots veure les seves obres.',
              ],
            },
          ],
        },
        {
          titulo: 'Les nostres eines',
          frases: ['També fem programes per resoldre problemes d’accessibilitat.'],
          tarjetas: [
            {
              imagen: 'itza', alt: 'Itza en una web: una persona pregunta i Itza respon.',
              titulo: 'Itza',
              frases: [
                'Itza és dins d’una web.',
                'Itza respon les preguntes de les persones que visiten aquesta web.',
              ],
            },
            {
              imagen: 'a11y', alt: 'A11y Primero mostra una nota de 92 i les barreres d’una web.',
              titulo: 'A11y Primero',
              frases: [
                'A11y Primero troba les barreres d’una web.',
                'Una barrera és un problema que impedeix utilitzar la web a una persona.',
              ],
            },
            {
              imagen: 'abstracts', alt: 'El formulari d’Accesible Abstracts per enviar un treball a un congrés.',
              titulo: 'Accesible Abstracts',
              frases: [
                'Accesible Abstracts ordena els treballs que rep un congrés.',
                'Abstract és una paraula en anglès.',
                'Abstract vol dir resum.',
              ],
            },
          ],
        },
        {
          titulo: 'Explica’ns el teu projecte',
          frases: ['Si tens un projecte, escriu-nos.'],
          enlaces: [{ texto: 'Com escriure’ns', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'quienes',
      nombre: 'Qui som',
      titulo: 'Qui som',
      entrada: [
        'Som un estudi de disseny petit.',
        'Un estudi de disseny és una empresa que dissenya.',
        'Dissenyem webs i aplicacions.',
        'Una aplicació és un programa per al mòbil o per a l’ordinador.',
      ],
      descripcion: 'Qui som a Accesibilidad Primero, en lectura fàcil.',
      bloques: [
        {
          titulo: 'Pensem en totes les persones',
          frases: [
            'Pensem en l’accessibilitat abans de dissenyar una web.',
            'Accessibilitat vol dir que totes les persones poden utilitzar una web.',
            'Així cap persona troba barreres a la web.',
            'Una barrera és un problema que impedeix utilitzar la web a una persona.',
            'Per exemple, una lletra molt petita és una barrera per a una persona que hi veu poc.',
          ],
        },
        {
          titulo: 'Qui treballa a l’estudi',
          tarjetas: [
            {
              imagen: 'johnny', alt: 'Retrat de Johnny Vigas.',
              titulo: 'Johnny Vigas',
              frases: [
                'Johnny Vigas va crear l’estudi el març de 2026.',
                'Johnny dissenya les webs.',
                'Si treballes amb nosaltres, parles amb Johnny.',
              ],
            },
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
            'La tecnologia són els ordinadors, els mòbils i les webs.',
          ],
        },
        {
          titulo: 'Amb qui treballem',
          frases: ['Treballem amb organitzacions socials, artistes, arquitectes i congressos.'],
          lista: [
            'Cesal és una organització social.',
            'Cesal té el restaurant escola Foc i Cor a Catarroja.',
            'AEIPI i Eurlyaid organitzen el congrés ECI Conference Madrid 2027.',
            'Izaskun Etxebarria és una artista.',
            'Pau Jordà és un arquitecte.',
          ],
        },
        {
          titulo: 'Explica’ns el teu projecte',
          frases: ['Si tens un projecte, escriu-nos.'],
          enlaces: [{ texto: 'Com escriure’ns', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'hacemos',
      nombre: 'Què fem',
      titulo: 'Què fem',
      entrada: ['Fem 3 feines:'],
      entradaLista: [
        'Dissenyem i fem webs accessibles.',
        'Revisem webs.',
        'Donem classes a les persones que canvien els textos i les fotos d’una web.',
      ],
      descripcion: 'Què fa Accesibilidad Primero, en lectura fàcil: webs accessibles, revisió de webs i classes.',
      bloques: [
        {
          titulo: 'Dissenyem i fem webs',
          imagen: { archivo: 'foc', alt: 'La web de Foc i Cor en un telèfon mòbil.' },
          frases: [
            'Dissenyem una web nova per a cada organització.',
            'Pensem en l’accessibilitat abans de dissenyar la web.',
            'Algunes persones no poden utilitzar el ratolí.',
            'Aquestes persones utilitzen només el teclat.',
            'Per això provem cada web amb el teclat.',
            'També provem cada web amb un lector de pantalla.',
            'Un lector de pantalla és un programa que llegeix la web en veu alta.',
            'El teu equip pot canviar els textos i les fotos de la web.',
            'El teu equip fa aquests canvis sense programar.',
          ],
        },
        {
          titulo: 'Revisem webs',
          imagen: { archivo: 'a11y', alt: 'A11y Primero mostra una nota de 92 i les barreres d’una web.' },
          frases: [
            'Revisem la teva web amb les pautes WCAG.',
            'Les pautes WCAG són unes normes per fer webs accessibles.',
            'T’expliquem cada barrera de la teva web.',
            'Et donem un pla per treure les barreres.',
            'També escrivim la declaració d’accessibilitat de la teva web.',
            'La declaració d’accessibilitat és una pàgina que explica què compleix la teva web i què no compleix.',
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
            'A més d’aquest preu, pagues l’IVA.',
            'L’IVA és un impost.',
          ],
        },
        {
          titulo: 'Donem classes',
          frases: [
            'Donem classes a les persones que canvien els textos i les fotos d’una web.',
            'Així la web és accessible també després de cada canvi.',
            'Hi ha classes per a cada feina: disseny, programació i textos.',
            'També hi ha classes curtes sobre un sol tema.',
            'Per exemple, una classe explica com fer un document PDF accessible.',
          ],
        },
        {
          titulo: 'Explica’ns el teu projecte',
          frases: ['Si vols una d’aquestes feines, escriu-nos.'],
          enlaces: [{ texto: 'Com escriure’ns', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'contacto',
      nombre: 'Com escriure’ns',
      titulo: 'Com escriure’ns',
      entrada: [
        'Ens pots escriure un correu electrònic.',
        'La nostra adreça de correu electrònic és aquesta:',
        CORREO,
      ],
      entradaEnlaces: [{ texto: 'Escriure un correu electrònic', url: `mailto:${CORREO}` }],
      descripcion: 'Com escriure a Accesibilidad Primero, en lectura fàcil.',
      bloques: [
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
          titulo: 'Altres maneres d’escriure’ns',
          frases: [
            'A la web completa hi ha un formulari.',
            'Un formulari és una pàgina amb espais per escriure el teu nom i el teu missatge.',
          ],
          enlaces: [{ texto: 'Anar al formulari', ruta: 'contacto' }],
        },
        {
          titulo: 'Les nostres xarxes socials',
          enlaces: REDES,
        },
      ],
    },
    {
      id: 'accesibilidad',
      nombre: 'Accessibilitat',
      titulo: 'L’accessibilitat d’aquesta web',
      entrada: [
        'Volem una web per a totes les persones.',
        'L’última revisió d’aquesta web és del 5 de novembre de 2026.',
        'La web compleix gairebé totes les pautes WCAG.',
        'Les pautes WCAG són unes normes per fer webs accessibles.',
      ],
      descripcion: 'Què compleix i què no compleix la web d’Accesibilidad Primero, en lectura fàcil.',
      bloques: [
        {
          titulo: 'El que compleix aquesta web',
          frases: [
            'Pots utilitzar tota la web amb el teclat.',
            'Pots llegir bé els textos sobre el fons.',
            'Els botons i els enllaços són grans.',
            'Són fàcils de prémer amb el dit.',
            'Els vídeos no tenen so.',
            'Cada vídeo té un text que explica les seves imatges.',
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
        },
        {
          titulo: 'El que encara hem de revisar',
          frases: [
            'Encara hem de provar tota la web amb un lector de pantalla.',
            'Un lector de pantalla és un programa que llegeix la web en veu alta.',
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
  en: [
    {
      id: 'inicio',
      nombre: 'Home',
      titulo: 'We make websites for everyone',
      entrada: [
        'We are Accesibilidad Primero.',
        'We are a design studio in Valencia, in Spain.',
        'We design websites for organisations and projects that help people.',
        'Everyone can use our websites.',
        'For example, a blind person or a person who cannot use a mouse.',
      ],
      descripcion: 'Accesibilidad Primero in easy read: we make websites for everyone.',
      bloques: [
        {
          titulo: 'Some websites we make',
          tarjetas: [
            {
              imagen: 'foc', alt: 'The Foc i Cor website on a mobile phone.',
              titulo: 'Foc i Cor',
              frases: [
                'Foc i Cor is a training restaurant in Catarroja.',
                'In a training restaurant, people learn to work in a restaurant.',
                'On its website you can read the menu and book a table.',
              ],
            },
            {
              imagen: 'eci', alt: 'The website of the ECI Conference Madrid 2027.',
              titulo: 'ECI Conference Madrid 2027',
              frases: [
                'It is a conference for people who work with young children.',
                'A conference is a meeting of many people who do the same work.',
                'On its website you can see the programme and send your work.',
              ],
            },
            {
              imagen: 'izaskun', alt: 'A work by Izaskun Etxebarria on her website: a metal ring on the grass, next to the sea.',
              titulo: 'Izaskun Etxebarria',
              frases: [
                'Izaskun Etxebarria is an artist.',
                'On her website you can see her work.',
              ],
            },
          ],
        },
        {
          titulo: 'Our tools',
          frases: ['We also make computer programs that solve accessibility problems.'],
          tarjetas: [
            {
              imagen: 'itza', alt: 'Itza on a website: a person asks a question and Itza answers.',
              titulo: 'Itza',
              frases: [
                'Itza is part of a website.',
                'Itza answers questions from the people who visit that website.',
              ],
            },
            {
              imagen: 'a11y', alt: 'A11y Primero shows a score of 92 and the barriers on a website.',
              titulo: 'A11y Primero',
              frases: [
                'A11y Primero finds the barriers on a website.',
                'A barrier is a problem that stops a person using the website.',
              ],
            },
            {
              imagen: 'abstracts', alt: 'The Accesible Abstracts form for sending work to a conference.',
              titulo: 'Accesible Abstracts',
              frases: [
                'Accesible Abstracts sorts the work that a conference receives.',
                'An abstract is a short summary of a piece of work.',
              ],
            },
          ],
        },
        {
          titulo: 'Tell us about your project',
          frases: ['If you have a project, write to us.'],
          enlaces: [{ texto: 'How to write to us', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'quienes',
      nombre: 'About us',
      titulo: 'About us',
      entrada: [
        'We are a small design studio.',
        'A design studio is a company that designs things.',
        'We design websites and apps.',
        'An app is a program for a mobile phone or a computer.',
      ],
      descripcion: 'About Accesibilidad Primero, in easy read.',
      bloques: [
        {
          titulo: 'We think about everyone',
          frases: [
            'We think about accessibility before we design a website.',
            'Accessibility means that everyone can use a website.',
            'This way, no person finds barriers on the website.',
            'A barrier is a problem that stops a person using the website.',
            'For example, very small letters are a barrier for a person who cannot see well.',
          ],
        },
        {
          titulo: 'Who works in the studio',
          tarjetas: [
            {
              imagen: 'johnny', alt: 'Portrait of Johnny Vigas.',
              titulo: 'Johnny Vigas',
              frases: [
                'Johnny Vigas started the studio in March 2026.',
                'Johnny designs the websites.',
                'If you work with us, you talk to Johnny.',
              ],
            },
          ],
        },
        {
          titulo: 'The university',
          frases: [
            'We work with the Universitat Politècnica de València.',
            'It is a university in Valencia.',
            'At the university there is a working group.',
            'The group is called Cátedra dicaTIC.',
            'This group wants to remove the barriers in technology for disabled people.',
            'Technology means computers, mobile phones and websites.',
          ],
        },
        {
          titulo: 'Who we work with',
          frases: ['We work with charities, artists, architects and conferences.'],
          lista: [
            'Cesal is a charity.',
            'Cesal runs the Foc i Cor training restaurant in Catarroja.',
            'AEIPI and Eurlyaid organise the ECI Conference Madrid 2027.',
            'Izaskun Etxebarria is an artist.',
            'Pau Jordà is an architect.',
          ],
        },
        {
          titulo: 'Tell us about your project',
          frases: ['If you have a project, write to us.'],
          enlaces: [{ texto: 'How to write to us', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'hacemos',
      nombre: 'What we do',
      titulo: 'What we do',
      entrada: ['We do 3 kinds of work:'],
      entradaLista: [
        'We design and build accessible websites.',
        'We check websites.',
        'We train the people who change the words and the photos on a website.',
      ],
      descripcion: 'What Accesibilidad Primero does, in easy read: accessible websites, website checks and training.',
      bloques: [
        {
          titulo: 'We design and build websites',
          imagen: { archivo: 'foc', alt: 'The Foc i Cor website on a mobile phone.' },
          frases: [
            'We design a new website for each organisation.',
            'We think about accessibility before we design the website.',
            'Some people cannot use a mouse.',
            'These people only use the keyboard.',
            'That is why we test every website with the keyboard.',
            'We also test every website with a screen reader.',
            'A screen reader is a program that reads the website out loud.',
            'Your team can change the words and the photos on the website.',
            'Your team does not need to write code for these changes.',
          ],
        },
        {
          titulo: 'We check websites',
          imagen: { archivo: 'a11y', alt: 'A11y Primero shows a score of 92 and the barriers on a website.' },
          frases: [
            'We check your website with the WCAG guidelines.',
            'The WCAG guidelines are rules for making accessible websites.',
            'We explain each barrier on your website.',
            'We give you a plan to remove the barriers.',
            'We also write the accessibility statement for your website.',
            'An accessibility statement is a page that says what your website does well and what it does not.',
          ],
        },
        {
          titulo: 'The price of a check',
          lista: [
            'A website with up to 10 pages costs between 590 euros and 790 euros.',
            'A website with up to 25 pages costs between 1200 euros and 1800 euros.',
            'A website for a public body or a large company costs 2500 euros or more.',
          ],
          despues: [
            'You also pay VAT on top of this price.',
            'VAT is a tax.',
          ],
        },
        {
          titulo: 'We give training',
          frases: [
            'We train the people who change the words and the photos on a website.',
            'This way the website stays accessible after every change.',
            'There is training for each job: design, code and writing.',
            'There are also short sessions about one subject.',
            'For example, one session shows how to make an accessible PDF document.',
          ],
        },
        {
          titulo: 'Tell us about your project',
          frases: ['If you want us to do this work, write to us.'],
          enlaces: [{ texto: 'How to write to us', lf: 'contacto' }],
        },
      ],
    },
    {
      id: 'contacto',
      nombre: 'How to write to us',
      titulo: 'How to write to us',
      entrada: [
        'You can send us an email.',
        'This is our email address:',
        CORREO,
      ],
      entradaEnlaces: [{ texto: 'Send an email', url: `mailto:${CORREO}` }],
      descripcion: 'How to write to Accesibilidad Primero, in easy read.',
      bloques: [
        {
          titulo: 'What you can tell us',
          frases: [
            'Tell us what your organisation does.',
            'Tell us what you want to do.',
            'You can write to us with an idea that is not finished.',
          ],
        },
        {
          titulo: 'We always answer',
          frases: [
            'We answer every email.',
            'Sometimes we are not the right studio for your project.',
            'Then we also answer and explain why.',
          ],
        },
        {
          titulo: 'Other ways to write to us',
          frases: [
            'There is a form on the full website.',
            'A form is a page with spaces to write your name and your message.',
          ],
          enlaces: [{ texto: 'Go to the form', ruta: 'contacto' }],
        },
        {
          titulo: 'Our social media',
          enlaces: REDES,
        },
      ],
    },
    {
      id: 'accesibilidad',
      nombre: 'Accessibility',
      titulo: 'How accessible this website is',
      entrada: [
        'We want a website for everyone.',
        'We last checked this website on 5 November 2026.',
        'The website meets almost all the WCAG guidelines.',
        'The WCAG guidelines are rules for making accessible websites.',
      ],
      descripcion: 'What the Accesibilidad Primero website does well and what it does not, in easy read.',
      bloques: [
        {
          titulo: 'What this website does well',
          frases: [
            'You can use the whole website with the keyboard.',
            'You can read the words well on the background.',
            'The buttons and the links are big.',
            'They are easy to press with your finger.',
            'The videos have no sound.',
            'Each video has words that explain its pictures.',
          ],
        },
        {
          titulo: 'What this website does not do well',
          frases: [
            'On the full website there is a page about our studio.',
            'On that page there is a drawing that moves all the time.',
            'The drawing has no button to stop it.',
            'Your phone and your computer have a setting to reduce movement.',
            'If you turn on this setting, the drawing stops.',
          ],
        },
        {
          titulo: 'What we still need to check',
          frases: [
            'We still need to test the whole website with a screen reader.',
            'A screen reader is a program that reads the website out loud.',
            'After this test, we will write the results on this page.',
          ],
        },
        {
          titulo: 'If you find a problem',
          frases: [
            'Send us an email.',
            'Tell us what you want to do.',
            'Tell us the name of the page too.',
            'We answer in 20 working days or less.',
          ],
          enlaces: [{ texto: 'Send an email', url: `mailto:${CORREO}` }],
        },
      ],
    },
  ],
};
