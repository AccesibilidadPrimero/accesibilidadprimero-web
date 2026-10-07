/**
 * Worker mínimo.
 *
 * Hoy solo existe para una cosa que un sitio estático no puede hacer: recibir
 * el formulario de contacto. Todo lo demás lo sirve el runtime de assets sin
 * pasar por aquí.
 *
 * Pendiente de decidir antes de activarlo: a dónde se envía el mensaje
 * (correo, almacenamiento) y qué protección antiabuso se usa. Lo que NO se va
 * a usar es un CAPTCHA visual: es una barrera de accesibilidad y en esta web
 * sería contradictorio. Turnstile en modo no interactivo es la alternativa a
 * valorar.
 */
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contacto' && request.method === 'POST') {
      return new Response(
        JSON.stringify({ error: 'El endpoint de contacto aún no está activo.' }),
        { status: 501, headers: { 'content-type': 'application/json; charset=utf-8' } },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
