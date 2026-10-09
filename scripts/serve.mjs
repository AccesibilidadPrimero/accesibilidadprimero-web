/* Servidor estático mínimo para auditar el build. Sin dependencias. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath y NO .pathname. Un URL.pathname viene percent-encoded: si el
   proyecto vive en una ruta con espacios —«Mobile Documents» de iCloud, sin ir
   más lejos— .pathname devuelve «/Mobile%20Documents/» y ese directorio no
   existe. El servidor devolvía 404 a todo, los scripts auditaban una página
   que solo contenía la palabra «404», y la auditoría daba por buena una web
   que ni siquiera estaba mirando. Pasó de verdad, el 07/10/2026. */
const RAIZ = fileURLToPath(new URL('../dist/', import.meta.url));
const PUERTO = Number(process.env.PORT ?? 4321);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.json': 'application/json',
  /* El vídeo también: servido como octet-stream, Safari no lo reproduce y
     aquí no se notaba porque la vista previa no se miraba en Safari. */
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.avif': 'image/avif',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
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

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  servir().then(() => console.log(`http://localhost:${PUERTO}`));
}
