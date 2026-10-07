/* Lector de PNG mínimo, sin dependencias: solo lo necesario para muestrear
   píxeles de una captura. Soporta el PNG que produce Chromium (color type 6,
   8 bits, sin entrelazado). */
import { inflateSync } from 'node:zlib';

export async function loadImage(buffer) {
  let pos = 8; // firma
  let ancho = 0, alto = 0, tipo = 0, profundidad = 0;
  const trozos = [];
  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos);
    const nombre = buffer.toString('ascii', pos + 4, pos + 8);
    const datos = buffer.subarray(pos + 8, pos + 8 + len);
    if (nombre === 'IHDR') {
      ancho = datos.readUInt32BE(0);
      alto = datos.readUInt32BE(4);
      profundidad = datos[8];
      tipo = datos[9];
      if (datos[12] !== 0) throw new Error('PNG entrelazado no soportado');
    } else if (nombre === 'IDAT') trozos.push(datos);
    else if (nombre === 'IEND') break;
    pos += 12 + len;
  }
  if (profundidad !== 8) throw new Error(`Profundidad ${profundidad} no soportada`);
  const canales = { 0: 1, 2: 3, 4: 2, 6: 4 }[tipo];
  if (!canales) throw new Error(`Tipo de color ${tipo} no soportado`);

  const crudo = inflateSync(Buffer.concat(trozos));
  const bpp = canales;
  const stride = ancho * bpp;
  const pix = Buffer.alloc(alto * stride);

  for (let y = 0; y < alto; y++) {
    const filtro = crudo[y * (stride + 1)];
    const linea = crudo.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const destino = pix.subarray(y * stride, (y + 1) * stride);
    const arriba = y > 0 ? pix.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? destino[x - bpp] : 0;
      const b = arriba ? arriba[x] : 0;
      const c = arriba && x >= bpp ? arriba[x - bpp] : 0;
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      destino[x] = v & 0xff;
    }
  }

  return {
    ancho, alto,
    /* Rejilla de muestras dentro de la caja, evitando el borde: el antialias
       del texto contamina justo el perímetro. */
    muestrear({ x, y, w, h }) {
      const out = [];
      const pasos = 5;
      for (let i = 1; i < pasos; i++) {
        for (let j = 1; j < pasos; j++) {
          const px = Math.round(x + (w * i) / pasos);
          const py = Math.round(y + (h * j) / pasos);
          if (px < 0 || py < 0 || px >= ancho || py >= alto) continue;
          const o = py * stride + px * bpp;
          out.push([pix[o], pix[o + 1], pix[o + 2]]);
        }
      }
      return out;
    },
  };
}
export const createCanvas = null;
