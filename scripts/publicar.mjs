/**
 * Publicar: un commit y un push.
 *
 * Por qué existe este script y no es solo `git push`:
 *
 * 1. Las credenciales de GitHub son de Johnny y viven en su llavero de macOS.
 *    Ningún agente las tiene ni debe tenerlas. El push lo lanza él, aquí, en
 *    su propio ordenador y con su propia identidad. Lo que automatizamos es
 *    todo lo demás, no la firma.
 * 2. `npm run publicar` ejecuta antes `npm run verificar`. Si la tipografía no
 *    cuadra con el Figma, si axe encuentra algo o si falla un contraste, NO
 *    llega a hacer commit. Es la última reja antes de que algo roto salga a
 *    producción.
 * 3. El mensaje de commit se construye solo con los archivos que han cambiado,
 *    para no tener que inventarse uno cada vez.
 *
 * Uso:
 *   npm run publicar
 *   npm run publicar -- "mensaje propio"
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

// GitHub rechaza cualquier archivo de más de 100 MB, y lo rechaza en el push,
// cuando el commit ya está hecho. Aquí se corta a la mitad para tener margen y
// para que nada pesado llegue a confirmarse. Ya pasó: itza.gif, 214 MB, 9/10/2026.
const LIMITE_MB = 50;

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const salir = (codigo, texto) => {
  console.log(texto);
  process.exit(codigo);
};

// --- 1. ¿Hay algo que publicar? ---------------------------------------------
const pendiente = git('status', '--porcelain');
if (!pendiente) salir(0, 'No hay cambios que publicar. La carpeta está igual que el último commit.');

// --- 2. Rama -----------------------------------------------------------------
const rama = git('rev-parse', '--abbrev-ref', 'HEAD');
if (rama !== 'main') {
  salir(1, `Estás en la rama «${rama}», no en «main». Cloudflare solo despliega main.\nSi es a propósito, haz el push a mano.`);
}

// --- 3. Mensaje --------------------------------------------------------------
const propio = process.argv.slice(2).join(' ').trim();

git('add', '-A');
const tocados = git('diff', '--cached', '--name-only').split('\n').filter(Boolean);

// --- 3b. Tamaño: ningún archivo de más de LIMITE_MB --------------------------
// Se mide cada archivo que va a entrar en el commit (los borrados no pesan).
// Si uno pasa del límite se deshace el `git add` —los archivos no se tocan,
// solo dejan de estar preparados— y se dice cuál es y qué hacer.
const entran = git('diff', '--cached', '--name-only', '--diff-filter=d').split('\n').filter(Boolean);
const pesos = entran.map((f) => ({ f, mb: statSync(f).size / 1024 / 1024 }));
const gordos = pesos.filter((p) => p.mb > LIMITE_MB);

if (gordos.length) {
  git('reset', '-q');
  salir(
    1,
    `\nNo se confirma nada: ${gordos.length === 1 ? 'hay un archivo' : `hay ${gordos.length} archivos`} de más de ${LIMITE_MB} MB.\n` +
      gordos.map((p) => `  ${p.f}  (${p.mb.toFixed(1)} MB)`).join('\n') +
      '\n\nGitHub no admite nada de más de 100 MB. El original se queda en el disco;\n' +
      'añade su ruta (o su tipo) a .gitignore y vuelve a lanzar npm run publicar.\n',
  );
}

// La comprobación dice qué ha medido, para que se vea que ha mirado.
const mayor = pesos.reduce((a, b) => (b.mb > a.mb ? b : a), { f: '—', mb: 0 });
console.log(`Tamaños: ${pesos.length} archivo(s) medidos, ninguno pasa de ${LIMITE_MB} MB. El mayor: ${mayor.f} (${mayor.mb.toFixed(1)} MB).`);

function describir(archivos) {
  const zonas = new Set();
  for (const f of archivos) {
    if (f.startsWith('src/content/')) zonas.add('contenido');
    else if (f.startsWith('src/assets/') || f.startsWith('public/')) zonas.add('imágenes');
    else if (f.startsWith('src/styles/')) zonas.add('estilos');
    else if (f.startsWith('src/components/') || f.startsWith('src/layouts/')) zonas.add('componentes');
    else if (f.startsWith('src/pages/')) zonas.add('páginas');
    else if (f.startsWith('scripts/') || f.startsWith('.github/')) zonas.add('verificación');
    else zonas.add('configuración');
  }
  return [...zonas].join(', ');
}

const mensaje = propio || `Web 2.0: ${describir(tocados)} (${tocados.length} archivo${tocados.length === 1 ? '' : 's'})`;

// --- 4. Commit y push --------------------------------------------------------
console.log(`\n${tocados.length} archivo(s):`);
for (const f of tocados) console.log(`  ${f}`);
console.log(`\nMensaje: ${mensaje}\n`);

try {
  git('commit', '-m', mensaje);
} catch (e) {
  salir(1, `El commit ha fallado:\n${e.stderr || e.message}`);
}

try {
  execFileSync('git', ['push'], { stdio: 'inherit' });
} catch {
  salir(
    1,
    '\nEl commit está hecho pero el push ha fallado.\n' +
      'Suele ser la autenticación de GitHub. Vuelve a intentarlo con:\n  git push\n',
  );
}

console.log(
  '\nSubido a GitHub. Cloudflare empieza a construir solo.\n' +
    'Tarda un minuto o dos: https://accesibilidadprimero.proyectos-44e.workers.dev/\n',
);
