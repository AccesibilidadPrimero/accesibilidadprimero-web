---
titulo: "Cómo construimos nuestra propia extensión de Chrome para auditar accesibilidad"
tituloSeo: "A11y Primero: extensión Chrome para auditar accesibilidad web"
descripcion: "Cómo construimos nuestra propia extensión de Chrome para auditar accesibilidad web. Qué hace, cómo funciona y por qué la creamos."
fecha: 2026-03-21
categorias: [accesibilidad-digital, auditoria-wcag]
imagen: ../../assets/blog/a11yprimero.png
imagenAlt: "Captura de la extensión A11y Primero abierta en el navegador: una puntuación de 72 y la lista de categorías con su semáforo."
urlAntigua: /a11yprimero/
---

## 1. El problema

## 2. La decisión: construir sin saber programar

Herramientas de accesibilidad web hay muchas. [WAVE](https://wave.webaim.org/), [axe DevTools](https://www.levelaccess.com/audit-test/), Lighthouse, [Accessibility Insights](https://accessibilityinsights.io/)… las conocemos y las usamos. Son potentes, están bien mantenidas y tienen comunidades enormes detrás.

Pero todas comparten algo en común: están pensadas para desarrolladores.

Cuando trabajamos en Accesibilidad Primero nos encontramos siempre ante dos situaciones muy distintas que ninguna herramienta cubría a la vez:

- La reunión con el cliente, donde necesitamos que entienda el problema sin abrumarle con criterios técnicos o interfaces pensadas para perfiles de desarrollo.
- El informe técnico para el equipo que va a corregir los errores, donde sí necesitamos precisión: qué criterio WCAG incumple, qué nivel (A, AA, AAA), y el selector CSS del elemento exacto que hay que corregir.

Ninguna herramienta existente resolvía estas dos necesidades en el mismo sitio. Así que decidimos construir la nuestra.

![Esquema «El hueco que ninguna herramienta cubría». A la izquierda, las herramientas existentes (WAVE, axe, Lighthouse): detectan errores, con lenguaje técnico y para desarrolladores, sin resumen para cliente, sin historial y sin PDF. A la derecha, A11y Primero, dos modos en una sola herramienta: resumen para el cliente con puntuación y semáforo, historial comparativo, auditoría WCAG con criterio, nivel y selector CSS, e informe PDF. Todo en el mismo sitio, sin salir de la página.](../../assets/blog/a11yprimero/5510.png)

![Esquema «Cómo fue la colaboración» en tres columnas. Accesibilidad Primero aporta el conocimiento: criterios WCAG, flujo de trabajo real, necesidades del cliente y decisiones de diseño. Claude aporta la implementación: código JS, CSS y HTML, diagnóstico de errores, propuestas de mejora y esquemas. El resultado es una iteración continua: probar en Chrome, detectar el problema, pedir la corrección y tener una nueva versión lista.](../../assets/blog/a11yprimero/5526.png)

No somos desarrolladores de formación. Pero llevamos tiempo explorando cómo la IA puede actuar como un colaborador técnico que amplía lo que somos capaces de hacer.

La propuesta fue clara: usar Claude (el modelo de IA de Anthropic) como compañero de desarrollo. Nosotros aportaríamos el conocimiento de dominio —qué debe hacer la herramienta, cómo debe comunicarse, qué criterios WCAG importan y por qué— y Claude aportaría la implementación técnica.

> _No estamos inventando nada nuevo. Pero ninguna herramienta existente era exactamente lo que necesitábamos para nuestro flujo diario de trabajo._

Lo que empezó como un experimento se convirtió en semanas de iteración, correcciones, propuestas de diseño y decisiones que tomamos juntos.

## 3. El proceso con Claude: iterar, corregir, decidir

### De la idea al primer prototipo

Empezamos con algo muy sencillo: una extensión que evaluara los errores más básicos de accesibilidad en cualquier página web. Imágenes sin alt, enlaces sin texto, ausencia de H1, idioma no declarado.

El primer problema que encontramos fue que la extensión no funcionaba en la mayoría de webs. Páginas con políticas de seguridad estrictas (CSP) bloqueaban la inyección de scripts. Faltaba el permiso host_permissions en el manifest. Siete botones no tenían ninguna función asignada.

> _Aprendizaje: Cuando algo no funciona en una extensión de Chrome, la consola de DevTools del popup es tu mejor aliada. Cada error tiene una causa concreta._

### Diseño de la interfaz: usabilidad sobre cantidad

Una de las decisiones más importantes fue priorizar la usabilidad por encima de la cantidad de funciones. Nos preguntamos qué estructura tenía más sentido para un auditor profesional y llegamos a cuatro pestañas:

- Resumen: para el cliente. Score global animado, semáforo por categorías, lenguaje sencillo.
- WCAG: para el técnico. Criterios exactos, nivel A/AA, selector CSS del elemento afectado, descripción y corrección.
- Historial: guarda las tres últimas auditorías por dominio, con comparativa lado a lado.
- Ver como…: simulaciones de visión (daltonismo, baja visión, alto contraste).

![Esquema «Anatomía de A11y Primero», una extensión de Chrome con cuatro pestañas: Resumen, WCAG, Historial y Ver como. La pestaña Resumen, para el cliente: puntuación global de 0 a 100, cuatro categorías con semáforo (imágenes, estructura, formularios y contraste), recuento de H1, H2 y H3 y resumen en lenguaje sencillo. La pestaña WCAG, para el equipo técnico: criterio exacto, nivel de conformidad A, AA o AAA, selector CSS del elemento afectado e instrucción de corrección.](../../assets/blog/a11yprimero/5529.png)

Durante este proceso Claude generó wireframes comparativos que nos ayudaron a visualizar las propuestas antes de implementarlas. Ver el estado actual frente a la propuesta mejorada en un mismo diagrama aceleró mucho la toma de decisiones.

### El score por categorías y el semáforo

Una de las funcionalidades que más nos gustó fue la idea de dividir el score global en cuatro categorías independientes, cada una con su propio semáforo:

- Imágenes: porcentaje de imágenes con texto alternativo correcto.
- Estructura: jerarquía de encabezados, idioma declarado, H1 presente y único.
- Formularios: porcentaje de inputs con etiqueta asociada.
- Contraste: elementos con ratio de contraste inferior a 4.5:1.

El score global es una media ponderada de las cuatro categorías. La estructura tiene un peso ligeramente mayor por su impacto en la navegación con tecnologías de asistencia.

![Cómo se calcula la puntuación de accesibilidad. Cuatro categorías con su peso: imágenes con alternativa correcta, 25 %; estructura (H1, idioma y enlaces), 30 %; formularios con etiqueta, 25 %; contraste según el 4,5:1 de la WCAG, 20 %. La puntuación global de 0 a 100 es su media ponderada: de 80 a 100, excelente, semáforo verde; de 50 a 79, mejorable, amarillo; de 0 a 49, problemas graves, rojo. La estructura pesa más por su impacto directo en la navegación con tecnologías de apoyo.](../../assets/blog/a11yprimero/5644.png)

### El historial comparativo

Una herramienta de auditoría que no permite seguir la evolución de una web en el tiempo tiene un valor limitado. Por eso añadimos un historial que guarda las últimas tres auditorías por dominio y permite comparar dos de ellas lado a lado.

La comparativa muestra el score global de cada auditoría, la diferencia en puntos (▲+8 de mejora / ▼-3 de retroceso), y el desglose por categorías con la columna Δ. Cuando hay una comparativa activa, el PDF la incluye como tercera página.

### El PDF profesional

El informe PDF fue uno de los puntos más complejos técnicamente. Chrome bloquea la carga de librerías externas desde extensiones por política de seguridad, lo que hizo que varias aproximaciones fallaran antes de dar con la solución correcta.

El resultado final es un PDF de dos páginas (más una tercera opcional con la comparativa histórica):

- Página 1: score visual con barra de progreso, puntuación por categorías con mini-barras y puntos de color, conteo de encabezados H1/H2/H3, y resumen en lenguaje sencillo para el cliente.
- Página 2: auditoría técnica WCAG con criterios numerados, nivel A/AA en badge de color, instrucción de corrección y selectores CSS de los elementos afectados.
- Página 3 (opcional): comparativa entre dos auditorías del historial, con delta global y desglose por categorías.

## 4. Lo que construimos: un recorrido por A11y Primero

### La extensión se llama A11y Primero y está en la v1.6.

Funciona en cualquier página web desde Chrome, sin necesidad de salir de la página ni usar herramientas externas.

<!-- PENDIENTE · vídeo: Vídeo demostración A11y Primero · https://iframe.mediadelivery.net/embed/670767/0f808bd9-940c-4963-a784-6a6e7bfeb389 -->

### Pestaña Resumen

(para el cliente)

Al pulsar ‘Evaluar accesibilidad’, la extensión analiza la página y muestra simultáneamente el score global animado, las cuatro categorías con semáforo y barra de progreso, el conteo de encabezados H1/H2/H3, y un resumen en lenguaje accesible de los problemas detectados.

En el mismo momento, los errores se marcan visualmente en la página con etiquetas de colores: rojo para imágenes sin alt, naranja para enlaces vacíos, azul para encabezados, morado para inputs sin etiqueta.

### Pestaña WCAG

(para el equipo técnico)

La auditoría WCAG muestra cada violación como un bloque expandible que incluye el criterio exacto (1.1.1, 2.4.4, 3.1.1…), el nivel de conformidad (A o AA), una descripción del problema, la instrucción de corrección, y los selectores CSS de los elementos afectados.

![La extensión A11y Primero abierta sobre accesibilidadprimero.com, con anotaciones: cuatro pestañas especializadas; una puntuación global animada de 72 sobre 100, «mejorable»; un semáforo con minibarra por categoría (imágenes 85, estructura 60, formularios 50, contraste 45); el recuento de encabezados; un resumen para el cliente en lenguaje sencillo («19 imágenes sin descripción visual», «La página no tiene título H1»); y los botones para evaluar y para descargar un informe PDF de dos páginas.](../../assets/blog/a11yprimero/5608.png)

### Pestaña Ver como…

Las simulaciones de visión permiten ver la página como la percibiría una persona con daltonismo, baja visión, visión borrosa, o en modo alto contraste. Son especialmente útiles en reuniones con clientes para generar empatía con los usuarios afectados.

### Pestaña Historial

El historial guarda automáticamente cada auditoría por dominio (máximo 3 por URL). Permite seleccionar dos auditorías y compararlas lado a lado para evaluar si los cambios aplicados han mejorado la accesibilidad de la web.

## 5. Lo que aprendimos

### Sobre construir con IA

La colaboración con Claude no fue simplemente ‘pedirle código’. Fue un proceso de decisión conjunta donde nosotros aportábamos el contexto y las necesidades, y Claude aportaba la implementación y las propuestas técnicas.

También es relevante la utilización de la herramienta correcta, ya que el proyecto lo comenzamos con Chatgpt y por multiples errores nos cambiamos a Claude. (tema que da para otro post).  
Lo más valioso fue poder iterar rápido: ver un resultado, identificar qué no funcionaba o qué faltaba, y corregirlo en la misma sesión. Un ciclo que en desarrollo tradicional habría llevado días, aquí llevaba minutos.

> _Aprendizaje: Diseñar accesibilidad también es diseñar cómo se comunica la accesibilidad. Y esta herramienta nace justo ahí._

### Sobre las limitaciones

A11y Primero no reemplaza una auditoría manual completa. Detecta errores automáticos —los más frecuentes y los más graves— pero hay aspectos de la accesibilidad que solo pueden evaluarse con criterio humano: si el texto alternativo de una imagen es realmente descriptivo, si el flujo de navegación con teclado es lógico, si el contenido tiene sentido para alguien que usa un lector de pantalla.  
La herramienta es un punto de partida y una forma de acelerar el proceso, no un sustituto de la expertise.

### Sobre la accesibilidad de la propia herramienta

No podíamos construir una herramienta de accesibilidad sin cuidar su propia accesibilidad.

Todos los botones tienen estados focus-visible, el contraste cumple WCAG AA, los textos de los botones son descriptivos, y se respeta la preferencia de movimiento reducido del sistema.

## 6.Próximos pasos

![Evolución de la interfaz de A11y Primero en cinco versiones, de la 1.0 a la 1.6. La 1.0 tenía siete botones sueltos sin código; la 1.2 añadió la puntuación y el semáforo por categoría; la 1.3, las pestañas; la 1.4, las minibarras y la dirección analizada, con el PDF aún sin resolver. La 1.6 resuelve el historial y el PDF.](../../assets/blog/a11yprimero/5604.png)

### Estamos en la v1.6 y seguimos desarrollando.

Algunas de las mejoras que tenemos en mente:

- Informe PDF con el logotipo personalizable para agencias y consultoras.
- Exportar los selectores CSS directamente como lista de correcciones para el desarrollador.
- Integración con el widget de accesibilidad de nuestra web para coherencia entre herramientas.
- Publicación en la Chrome Web Store.

Si trabajas en accesibilidad y quieres probar la extensión cuando esté disponible públicamente, escríbenos.

Estaremos encantados de recibir feedback de personas que entienden el problema desde dentro.

Se vienen cositas 🙂
