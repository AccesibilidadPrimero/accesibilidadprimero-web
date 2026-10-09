import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z
    .object({
      titulo: z.string(),
      /* Titulares sin antetítulo y sin mayúsculas sostenidas. */
      resumen: z.string(),
      cliente: z.string(),
      web: z.string().url().optional(),
      orden: z.number().int(),
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
      decisiones: z.array(decision).optional(),
      cifras: z.array(cifra).optional(),
      imagenAlt: z.string().optional(),

      /* Las capturas del slider del caso. `alt` NO es opcional: AGENTS.md §6
         —sin alternativa escrita no compila—. Y describe lo que se ve en la
         captura, no «captura de la web de X», que no añade nada. */
      imagenes: z
        .array(z.object({ archivo: z.string(), alt: z.string().min(20) }))
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

      if (!d.casoPublicado) return;

      if (!d.decisiones || d.decisiones.length < 4 || d.decisiones.length > 5) {
        err(
          'Un caso publicado lleva entre 4 y 5 decisiones. Una sexta no compila: un hueco no es un problema que resolver, es el resultado.',
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

export const collections = { proyectos };
