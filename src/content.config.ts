import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIAS } from './data/blog';
import { CLAVES_TIPO } from './data/proyectos';

/* ---------------------------------------------------------------------------
   Esquemas de contenido.

   AGENTS.md §6: esto no son convenciones, son errores de compilación. Lo
   aprendido montando la plantilla de casos deja de depender de la disciplina
   personal a las once de la noche.
   --------------------------------------------------------------------------- */

/** Luminancia relativa (WCAG 2.x). */
function luminancia(hex: string): number {
  const c = hex.replace('#', '');
  const canal = (par: string) => {
    const v = parseInt(par, 16) / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = [canal(c.slice(0, 2)), canal(c.slice(2, 4)), canal(c.slice(4, 6))];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* El fondo de la Home es BLANCO desde el 08/10/2026 (antes era Silk). Esta
   constante no es decorativa: contra ella se valida en build el acento de cada
   proyecto, así que si se queda desactualizada el build aprueba paletas que no
   cumplen. */
const FONDO = '#ffffff';
const HEX = /^#[0-9a-fA-F]{6}$/;

const paleta = z.object({
  /* El color de identidad del proyecto. La Home no lo conoce: lo declara el
     caso, para que cambiar de destacado sea editar un campo y no rediseñar la
     portada. */
  acento: z.string().regex(HEX),
  /* Qué color de texto rinde ENCIMA del acento. No se deduce: se declara,
     porque el acento puede comportarse como fondo claro (naranja) o como
     fondo oscuro (azul, carmesí). */
  textoSobreAcento: z.string().regex(HEX),
  /* Blue AP solo sirve sobre papel claro. Sobre naranja hay que usar Ink;
     sobre azul y carmesí, Silk. */
  anilloFoco: z.string().regex(HEX),

  /* Para qué se usa el acento, declarado y no deducido:
       'fondo'     — es una superficie y lleva texto encima (el hero del caso).
       'indicador' — transmite información por sí solo sobre el fondo claro
                     (un punto de estado, una barra que identifica sin texto).
     La diferencia no es cosmética: un indicador tiene que dar 3:1 contra el
     fondo de la Home (1.4.11) y una superficie no, porque lo que se mide ahí
     es el texto que lleva encima. */
  uso: z.enum(['fondo', 'indicador']).default('fondo'),
});

const cifra = z.object({
  valor: z.string(),
  descripcion: z.string(),
  tipo: z.enum(['accesibilidad', 'diseno', 'negocio', 'alcance']),
});

const decision = z.object({
  titulo: z.string(),
  cuerpo: z.string(),
  /* El casi-error de Foc i Cor no puede repetirse en silencio. */
  autoria: z.enum(['propia', 'cliente', 'compartida']),
});

/* La página del caso (/proyectos/<slug>/), desde el 11/10/2026. Lo que no
   cabe en la ficha de la Home: titular, ficha, el reto, las fotos y el bloque
   corto de accesibilidad. Las fotos se compilan desde arte/proyectos/<slug>/. */
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: ({ image }) => z
    .object({
      titulo: z.string(),
      /* Las versiones en catalán e inglés (05/11/2026): la misma forma que el
         original, solo los textos. Las mezcla `localizar` (i18n/idioma.ts). */
      traducciones: z.record(z.enum(['ca', 'en']), z.any()).optional(),
      /* Titulares sin antetítulo y sin mayúsculas sostenidas. */
      resumen: z.string(),
      /* Lo que hizo AP, en una frase visible bajo el resumen de la home
         (04/11/2026): el resumen presenta al cliente; esto, el trabajo. */
      aporte: z.string().optional(),
      cliente: z.string(),
      web: z.string().url().optional(),
      /* El nombre para el enlace «Ir a …», cuando el título del caso es más
         largo de lo que pide un enlace: «ECI Conference», no «ECI Conference
         Mad 2027». Sin él, el enlace usa el título. */
      nombreCorto: z.string().optional(),
      orden: z.number().int(),
      /* El filtro de /proyectos/ al que pertenece (src/data/proyectos.ts).
         Obligatorio: un proyecto sin tipo no aparecería en ningún filtro. */
      tipo: z.enum(CLAVES_TIPO),
      destacado: z.boolean().default(false),
      paleta,

      /* La nota solo se publica si pasa de 90 Y la declaración existe. Las dos
         condiciones, no una. Ver claude/plan-notas-por-encima-de-90.md. */
      nota: z
        .object({
          valor: z.number().min(0).max(100),
          medidaEl: z.coerce.date(),
          declaracion: z.string().url().optional(),
          /* La etiqueta de conformidad. Las tres declaraciones dicen
             «conformidad parcial», que no es lo mismo que «WCAG 2.2 AA» a
             secas: se declara aquí para poder decir la verdad por proyecto. */
          conformidad: z.string().optional(),
        })
        .optional(),

      /* Un caso se publica cuando tiene su página escrita. Mientras tanto el
         proyecto puede aparecer en la Home y en la rejilla sin ella. */
      casoPublicado: z.boolean().default(false),
      /* Caso con página propia en src/pages/proyectos/<id>.astro, no la
         plantilla de [slug].astro (ECI, 29/10/2026: «una maqueta por
         proyecto»). Su contenido vive en esa página, así que aquí no se le
         piden `caso`, decisiones ni cifras. */
      maquetaPropia: z.boolean().default(false),
      decisiones: z.array(decision).optional(),
      cifras: z.array(cifra).optional(),
      imagenAlt: z.string().optional(),

      /* Las capturas del slider del caso. `alt` NO es opcional: AGENTS.md §6
         —sin alternativa escrita no compila—. Y describe lo que se ve en la
         captura, no «captura de la web de X», que no añade nada. */
      imagenes: z
        .array(z.object({ archivo: z.string(), alt: z.string().min(20) }))
        .optional(),

      /* Lo que dice la tarjeta del listado de Proyectos debajo del nombre. */
      linea: z.string().optional(),

      caso: z
        .object({
          /* El <h1>: un titular de resultado, no el nombre del cliente a secas. */
          titular: z.string(),
          /* El titular en los golpes con los que entra, como en Estudio. El
             primero va solo en su línea; unidos con un espacio tienen que dar
             exactamente `titular` (HeroPagina lo comprueba). */
          golpes: z.array(z.string()).min(2).optional(),
          entradilla: z.string(),
          anio: z.number().int(),
          queHicimos: z.string(),
          /* Lo que dice la declaración del cliente, no lo que nos gustaría. */
          conformidad: z.string(),
          reto: z.object({
            intro: z.string(),
            tensiones: z.array(z.object({ titulo: z.string(), cuerpo: z.string() })).length(2),
          }),
          fotos: z.object({
            /* `vertical`: la misma portada vista en un móvil. Si está, es la
               que se enseña en tablet y móvil, y la horizontal solo desde
               1024 (23/10/2026). El `alt` sirve para las dos. */
            portada: z.object({
              archivo: image(),
              vertical: image().optional(),
              alt: z.string().min(20),
              /* `video` (29/10/2026): la portada recorrida de arriba abajo,
                 grabada a 60 fps en los tres tamaños. Si está, sustituye a
                 las imágenes: escritorio desde 1024, tableta desde 768 y
                 móvil por debajo. Cada vídeo trae su primer fotograma como
                 `poster`, que es lo que se ve sin JS, con «reducir
                 movimiento» y mientras carga. Los archivos van en
                 public/video (URL fija, AGENTS.md §6). El `alt` describe el
                 recorrido entero y lo lleva la imagen; el vídeo es la misma
                 imagen en movimiento. */
              video: z.object({
                escritorio: z.object({ archivo: z.string().regex(/^\/video\/.+\.mp4$/), poster: image() }),
                tableta: z.object({ archivo: z.string().regex(/^\/video\/.+\.mp4$/), poster: image() }),
                movil: z.object({ archivo: z.string().regex(/^\/video\/.+\.mp4$/), poster: image() }),
                alt: z.string().min(20),
              }).optional(),
            }),
            par: z.array(z.object({ archivo: image(), alt: z.string().min(20) })).length(2),
            cierre: z.object({ archivo: image(), alt: z.string().min(20) }).optional(),
            /* Composición del Archivo (Figma 2211:2, recuperada el 23/10/2026).
               La foto del hero es ambiente: va con alt="" porque el titular
               está encima y no añade información. */
            hero: image().optional(),
            /* Dos capturas de la web del cliente, mismo tamaño, 12:5. */
            capturas: z.array(z.object({ archivo: image(), alt: z.string().min(20) })).length(2).optional(),
          }),
          /* La banda de color detrás de la foto del equipo. Solo lleva la
             foto encima, ni texto ni controles: no entra en 1.4.3 ni 1.4.11. */
          bandaEquipo: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
          /* Medido sobre la web publicada, con fecha. Si cambia la web, se
             vuelve a medir antes de tocar el texto (decisión del 30/08). */
          accesibilidad: z.object({
            medidoEl: z.coerce.date(),
            puntos: z.array(z.string()).min(3).max(5),
            declaracion: z.string().url().optional(),
          }),
          /* El titular del cierre de Contacto en esta página. */
          cierre: z.string().optional(),
          /* La voz del cliente (Figma `Bloque · Testimonio`, 23/10/2026), entre
             la foto del equipo y la accesibilidad. Literal y con su permiso:
             no se redacta ni se retoca. La cita va con sus comillas « ».
             `lang` solo si la cita no está en el idioma de la página (WCAG
             3.1.2), p. ej. 'ca' si Cesal la da en valenciano. */
          testimonio: z
            .object({
              cita: z.string().regex(/^“[\s\S]+”$/, 'La cita va entre “ ”.'),
              nombre: z.string(),
              cargo: z.string(),
              lang: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .superRefine((d, ctx) => {
      const err = (message: string, path: string[]) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });

      /* Contraste contra el fondo de la Home, solo si el acento transmite
         información por sí solo. Comprobado el 6/10/2026: el naranja de Foc i
         Cor (#ed6a12) da 2,93:1 sobre Silk, así que NO puede usarse nunca
         como indicador suelto sobre fondo claro. Como superficie va bien:
         lleva Ink encima a 5,70:1. */
      const ratio = contraste(d.paleta.acento, FONDO);
      if (d.paleta.uso === 'indicador' && ratio < 3) {
        err(
          `El acento ${d.paleta.acento} da ${ratio.toFixed(2)}:1 sobre el fondo de la Home (${FONDO}). Como indicador hacen falta 3:1 (WCAG 1.4.11). Si solo es superficie, declara uso: fondo.`,
          ['paleta', 'acento'],
        );
      }

      /* El texto declarado tiene que rendir de verdad encima del acento. */
      const sobreAcento = contraste(d.paleta.textoSobreAcento, d.paleta.acento);
      if (sobreAcento < 4.5) {
        err(
          `${d.paleta.textoSobreAcento} sobre ${d.paleta.acento} da ${sobreAcento.toFixed(2)}:1. Hacen falta 4,5:1 (WCAG 1.4.3).`,
          ['paleta', 'textoSobreAcento'],
        );
      }

      /* Y el anillo de foco también: un foco invisible es peor que ninguno. */
      const foco = contraste(d.paleta.anilloFoco, d.paleta.acento);
      if (foco < 3) {
        err(
          `El anillo ${d.paleta.anilloFoco} da ${foco.toFixed(2)}:1 sobre ${d.paleta.acento}. Hacen falta 3:1 (WCAG 1.4.11).`,
          ['paleta', 'anilloFoco'],
        );
      }

      if (/^[A-ZÁÉÍÓÚÑ\s·—-]{8,}$/.test(d.titulo)) {
        err('Titulares sin mayúsculas sostenidas.', ['titulo']);
      }

      /* Un destacado enseña su slider, y el slider del Figma tiene TRES. Ni
         dos ni cuatro: la composición de los tres casos está dibujada con tres
         y el control dice «1 de 3». */
      if (d.destacado && (!d.imagenes || d.imagenes.length !== 3)) {
        err(
          `Un proyecto destacado lleva exactamente 3 capturas y hay ${d.imagenes?.length ?? 0}. ` +
          'Déjalas en arte/proyectos/ y decláralas aquí con su alt.',
          ['imagenes'],
        );
      }

      if (!d.casoPublicado || d.maquetaPropia) return;

      if (!d.caso) err('Un caso publicado necesita su bloque `caso` (titular, ficha, reto, fotos y accesibilidad).', ['caso']);
      /* De 3 a 5 desde el 11/10/2026 (Johnny): el caso de Foc i Cor se sostiene
         con tres y la cuarta habría sido relleno. La sexta sigue sin compilar. */
      if (!d.decisiones || d.decisiones.length < 3 || d.decisiones.length > 5) {
        err(
          'Un caso publicado lleva entre 3 y 5 decisiones. Una sexta no compila: un hueco no es un problema que resolver, es el resultado.',
          ['decisiones'],
        );
      }
      if (!d.cifras || d.cifras.length !== 3) {
        err('Un caso publicado lleva exactamente 3 cifras.', ['cifras']);
      } else if (d.cifras.every((c) => c.tipo === 'accesibilidad')) {
        err(
          'Las tres cifras no pueden ser de accesibilidad. Es la prueba del algodón del equilibrio diseño/accesibilidad, automatizada.',
          ['cifras'],
        );
      }
    }),
});

/* ---------------------------------------------------------------------------
   Blog (11/10/2026). Los 8 artículos vienen de WordPress, convertidos a mano
   a Markdown (ver blog-borradores/LEEME.md, que cuenta qué se tocó).

   · En tres idiomas desde el 07/11/2026: los artículos con `clave` van en
     castellano, catalán e inglés o no compila (src/data/blog.ts). Los ocho
     de WordPress siguen solo en castellano.
   · `urlAntigua` es la dirección de WordPress: tiene que existir una 301 en
     public/_redirects hacia /blog/<slug>/. `npm run redirecciones` lo mira.
   · Sin `imagenAlt` no compila, como en Proyectos. Y no vale cualquier cosa:
     menos de 20 caracteres suele ser «WCAG» o «nothing», que no dicen nada.
   --------------------------------------------------------------------------- */

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string(),
        /* El <title> cuando el titular es demasiado largo para Google. */
        tituloSeo: z.string().optional(),
        descripcion: z.string().min(50, 'La descripción es lo que enseña Google: al menos 50 caracteres.'),
        fecha: z.coerce.date(),
        categorias: z.array(z.enum(Object.keys(CATEGORIAS) as [keyof typeof CATEGORIAS, ...(keyof typeof CATEGORIAS)[]])).min(1),
        imagen: image(),
        imagenAlt: z.string().min(20, 'Una alternativa de menos de 20 caracteres no describe la portada.'),
        urlAntigua: z.string().regex(/^\/[a-z0-9-]+\/$/).optional(),

        /* ---- Desde el 07/11/2026: los artículos en tres idiomas ----
           `clave` une las tres versiones de un artículo (src/data/blog.ts). */
        clave: z.string().regex(/^[a-z0-9-]+$/).optional(),
        /* El tipo de schema.org: un artículo de código es TechArticle. */
        tipoSchema: z.enum(['Article', 'TechArticle']).default('Article'),
        /* Quién lo firma. Sale en pantalla y en el JSON-LD, que enlaza a
           Sobre AP. Los de WordPress no lo traen: no se supone. */
        autor: z.literal('johnny').optional(),
        /* La caja de contacto del final. El destino es una ruta de la web,
           con su ancla si va a una sección (#diseno en Servicios). */
        cta: z.object({
          titulo: z.string(),
          texto: z.string(),
          enlace: z.string(),
          destino: z.enum(['contacto', 'servicios']),
          ancla: z.string().regex(/^#[a-z-]+$/).optional(),
        }).optional(),
        /* Las preguntas del final: se ven en la página y van en el FAQPage.
           Las preguntas sin «¿?», como en la guía (06/11/2026). */
        preguntas: z.array(z.object({
          pregunta: z.string().refine((q) => !/[¿?]/.test(q), 'Las preguntas van sin «¿?».'),
          respuesta: z.string().min(40),
        })).optional(),
      })
      .superRefine((d, ctx) => {
        if (/^[A-ZÁÉÍÓÚÑ\s·—-]{8,}$/.test(d.titulo)) {
          ctx.addIssue({ code: 'custom', message: 'Titulares sin mayúsculas sostenidas.', path: ['titulo'] });
        }
      }),
});

export const collections = { proyectos, blog };
