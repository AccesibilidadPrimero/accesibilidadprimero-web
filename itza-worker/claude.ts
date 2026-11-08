/**
 * Itza · lo común a sus dos usos (08/11/2026): la demo de la landing
 * (itza-worker/index.ts) y la ayuda de la página de Contacto de AP
 * (worker/index.ts, /api/itza-contacto).
 *
 *   · validarConversacion(): que lo que llega tenga forma de conversación
 *     (empieza la persona, se alternan, topes de longitud y de preguntas).
 *     Se comprueba ANTES de gastar una llamada.
 *   · llamarClaude(): la llamada a la API de Anthropic con la clave en el
 *     servidor. No escribe la conversación en los registros: solo el código.
 */
export interface Mensaje { role: 'user' | 'assistant'; content: string }
export type Idioma = 'es' | 'ca' | 'en';

/* Claude Haiku 5.5 desde el 08/11/2026 (Johnny): diez veces más barato que
   Haiku 4.5 (0,10 $ / 0,50 $ por millón de tokens, prompts de hasta 100.000). */
export const MODELO_ITZA = 'claude-haiku-5-5';

export function validarConversacion(
  cuerpo: unknown,
  { topePreguntas, topeTexto }: { topePreguntas: number; topeTexto: number },
): { mensajes: Mensaje[]; lang: Idioma } | null {
  if (!cuerpo || typeof cuerpo !== 'object') return null;
  const { messages, lang } = cuerpo as { messages?: unknown; lang?: unknown };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > topePreguntas * 2) return null;
  const mensajes: Mensaje[] = [];
  for (const [i, m] of messages.entries()) {
    const { role, content } = (m ?? {}) as { role?: unknown; content?: unknown };
    const esperado = i % 2 === 0 ? 'user' : 'assistant';
    if (role !== esperado || typeof content !== 'string') return null;
    const texto = content.trim();
    /* Las respuestas de Itza pueden ser más largas que una pregunta. */
    if (!texto || texto.length > (role === 'user' ? topeTexto : 3000)) return null;
    mensajes.push({ role: esperado, content: texto });
  }
  if (mensajes[mensajes.length - 1].role !== 'user') return null;
  const idioma: Idioma = lang === 'ca' || lang === 'en' ? lang : 'es';
  return { mensajes, lang: idioma };
}

/** El texto de la respuesta, o null si la API falla. */
export async function llamarClaude(
  clave: string,
  { modelo, sistema, mensajes, maxTokens = 400, registro = 'itza' }:
  { modelo?: string; sistema: string; mensajes: Mensaje[]; maxTokens?: number; registro?: string },
): Promise<string | null> {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: modelo || MODELO_ITZA, max_tokens: maxTokens, system: sistema, messages: mensajes }),
  }).catch(() => null);
  if (!r || !r.ok) {
    console.error(`[${registro}] la API respondió`, r?.status ?? 'sin conexión');
    return null;
  }
  const datos = (await r.json().catch(() => null)) as { content?: { type: string; text?: string }[] } | null;
  const texto = datos?.content?.filter((c) => c.type === 'text').map((c) => c.text ?? '').join('').trim();
  return texto || null;
}
