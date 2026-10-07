/* Servidor estático mínimo para auditar el build. Sin dependencias. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const RAIZ = new URL('../dist/', import.meta.url).pathname;
const PUERTO = Number(process.env.PORT ?? 4321);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.json': 'application/json',
};

export function servir(puerto = PUERTO) {
  const servidor = createServer(async (req, res) => {
    try {
      let ruta = join(RAIZ, decodeURIComponent((req.url ?? '/').split('?')[0]));
      const s = await stat(ruta).catch(() => null);
      if (!s || s.isDirectory()) ruta = join(ruta, 'index.html');
      const cuerpo = await readFile(ruta);
      res.writeHead(200, { 'content-type': TIPOS[extname(ruta)] ?? 'application/octet-stream' });
      res.end(cuerpo);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404');
    }
  });
  return new Promise((ok) => servidor.listen(puerto, () => ok(servidor)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  servir().then(() => console.log(`http://localhost:${PUERTO}`));
}
