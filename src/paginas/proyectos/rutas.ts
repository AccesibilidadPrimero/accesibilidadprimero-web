/* Los casos con la plantilla común (caso.astro). Los usan las tres rutas,
   /proyectos/, /ca/projectes/ y /en/projects/: el slug es el mismo en los tres
   idiomas (05/11/2026). */
import { getCollection } from 'astro:content';

export async function rutasCaso() {
  return (await getCollection('proyectos'))
    /* Solo los casos con la composición de esta plantilla (`caso`). Los que
       tienen maqueta propia (ECI, 29/10/2026) viven en su propia página. */
    .filter((p) => p.data.casoPublicado && !p.data.maquetaPropia)
    .map((p) => ({ params: { slug: p.id }, props: { p } }));
}
