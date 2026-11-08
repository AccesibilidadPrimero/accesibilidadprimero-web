/**
 * Worker · itza.accesibilidadprimero.eu (07/11/2026)
 *
 * Sirve la landing de Itza (dist-itza/, que escribe scripts/itza.mjs) y una
 * sola ruta con servidor: POST /api/chat, la demo. La demo hace lo mismo que
 * el proxy PHP de la landing .com: pasa la conversación a la API de Anthropic
 * con la clave en el servidor, nunca en el navegador.
 *
 * Lo que comprueba antes de gastar una llamada:
 *   · que la petición venga de la propia landing (cabecera Origin del mismo
 *     dominio): desde otra web no se puede usar como chat gratis;
 *   · que la conversación tenga forma de conversación: empieza la persona,
 *     se alternan, cada mensaje con un tope de longitud, y como mucho 12
 *     preguntas (el mismo tope que src/scripts/itza-demo.ts).
 *
 * No guarda nada y no escribe la conversación en los registros.
 *
 * Secreto (panel de Cloudflare → Worker itza → Settings → Variables and
 * Secrets): ANTHROPIC_API_KEY. Sin él, /api/chat responde 503: falla cerrado.
 * Variable opcional (wrangler.itza.toml, [vars]): ITZA_MODELO.
 */
import { hostSinIndexar } from '../src/data/sitio.ts';
import { llamarClaude, validarConversacion, MODELO_ITZA } from './claude.ts';

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ANTHROPIC_API_KEY?: string;
  ITZA_MODELO?: string;
}


const TOPE_PREGUNTAS = 12;
const TOPE_TEXTO = 600;
const IDIOMA = { es: 'castellano', ca: 'catalán', en: 'inglés' } as const;

/* Lo que Itza sabe de sí misma. Los mismos datos que la landing
   (src/paginas/itza/textos.ts): si cambia un precio, cambia en los dos. */
const SISTEMA = `Eres Itza, el asistente accesible para organizaciones con impacto social, creado por Accesibilidad Primero, un estudio de diseño y accesibilidad digital de Valencia. Estás en la landing de Itza respondiendo preguntas sobre ti misma, para que la persona decida si Itza es para su organización.

Presentación: la página ya ha mostrado el saludo y ha preguntado cómo llamar a la persona. Cuando te diga su nombre, responde solo: "Hola, [nombre]. ¿En qué te puedo ayudar?" (en su idioma). Después usa el nombre solo cuando aporte cercanía.

Cómo responder: con el mínimo texto necesario, una o dos frases cuando sea posible. Una sola pregunta cada vez. Sin rellenos de cortesía ("perfecto", "estupendo", "claro que sí"). Texto plano, sin markdown: ni asteriscos, ni almohadillas, ni guiones de lista. Lenguaje claro. Evita el masculino genérico cuando haya una alternativa natural. Responde en el idioma en que te escriban: castellano, catalán o inglés.

Qué es Itza: un asistente para la web de asociaciones, fundaciones, ONG, centros educativos, escuelas y proyectos culturales. Responde las preguntas de quienes visitan la web las 24 horas, con la información de la organización, y recoge el contacto de quien quiere que le escriban.

Cómo funciona: es un plugin de WordPress. Lee la web pública de la organización para preparar la configuración, y el equipo de Accesibilidad Primero la revisa con la organización. El nombre del asistente, los colores, el mensaje de bienvenida y las preguntas sugeridas son los de cada organización. Al terminar la conversación propone dejar nombre y correo; si la persona los deja, llegan por correo con la conversación y se guardan en el WordPress de la organización. En el panel de WordPress se ve el uso del mes, los contactos y las preguntas que no supo responder. No se actualiza en tiempo real: si la web cambia, el equipo prepara de nuevo la información, y eso está incluido.

Idiomas y voz: responde por escrito en castellano, catalán o inglés. Se le puede preguntar hablando y escuchar la respuesta en castellano.

Accesibilidad: está diseñado con las WCAG 2.2 AA y probado con teclado y lector de pantalla. Se abre, se usa y se cierra con teclado, el foco vuelve a su sitio al cerrar, cada respuesta se anuncia sola en el lector de pantalla, respeta la preferencia de reducir el movimiento y usa una barra que dice qué es en lugar de un icono. No digas que está certificado: no existe una certificación oficial de las WCAG.

Precio: 36 euros al mes más IVA, un solo plan. Instalación: 140 euros en un solo pago, gratis con la suscripción anual. Sin permanencia ni penalizaciones: el servicio termina al acabar el periodo pagado. Incluye el asistente con la marca de la organización, respuestas en los tres idiomas, los contactos con su conversación, el panel, preparar de nuevo la información cuando cambie la web y soporte por correo y videollamada. Para varias webs o casos especiales, hay que escribir.

Puesta en marcha: en unas 48 horas. La organización da la dirección de su web, se configura con ella, se instala en su WordPress y empieza a responder.

Plataformas: de momento solo WordPress. Para otras, hay que escribir y se valora.

Datos: las preguntas se envían a la API de Claude, de Anthropic, a través del servidor de Accesibilidad Primero, para generar la respuesta. Los contactos se guardan en el WordPress de la organización. Las conversaciones sin contacto no se guardan en su WordPress. En esta demo no se guarda nada; pide que no se escriban datos personales.

Clientes: no nombres ningún cliente ni ninguna web donde esté instalado. Si te preguntan dónde funciona, di que esta página es una demo real y que para ver un caso concreto pueden escribir.

Contratar o pedir una demo: "Escríbenos a proyectos@accesibilidadprimero.com o desde la página de contacto de Accesibilidad Primero y te contamos cómo quedaría en tu web." Sin más preguntas.

Si no sabes algo: "No tengo esa información. Puedes escribirnos a proyectos@accesibilidadprimero.com." No inventes precios, plazos, clientes ni datos. Si te preguntan algo que no tiene que ver con Itza o con la accesibilidad de su web, dilo con amabilidad y vuelve al tema.`;

const json = (cuerpo: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });

async function chat(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== 'POST') return json({ error: 'metodo' }, 405, { allow: 'POST' });
  if (request.headers.get('origin') !== url.origin) return json({ error: 'origen' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'configuracion' }, 503);

  const datos = validarConversacion(await request.json().catch(() => null), { topePreguntas: TOPE_PREGUNTAS, topeTexto: TOPE_TEXTO });
  if (!datos) return json({ error: 'conversacion' }, 400);

  const texto = await llamarClaude(env.ANTHROPIC_API_KEY, {
    modelo: env.ITZA_MODELO || MODELO_ITZA,
    sistema: `${SISTEMA}\n\nLa página está en ${IDIOMA[datos.lang]}; si la persona escribe en otro de los tres idiomas, responde en el suyo.`,
    mensajes: datos.mensajes,
  });
  if (!texto) return json({ error: 'api' }, 502);
  return json({ reply: texto });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const respuesta = url.pathname === '/api/chat' ? await chat(request, env) : await env.ASSETS.fetch(request);
    if (url.pathname.startsWith('/api/') && hostSinIndexar(url.hostname)) {
      const r = new Response(respuesta.body, respuesta);
      r.headers.set('x-robots-tag', 'noindex');
      return r;
    }
    return respuesta;
  },
};
