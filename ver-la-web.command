#!/bin/zsh
# Doble clic desde el Finder y se abre la web en local.
# Lo único que hace es meterse en esta carpeta y arrancar el servidor de Astro.
# Para pararlo: Control + C en la ventana de Terminal que se abre, o cerrarla.
cd "$(dirname "$0")" || exit 1
echo "Arrancando… cuando aparezca la dirección, ábrela en el navegador."
echo "Para parar: Control + C"
echo
npm run dev
