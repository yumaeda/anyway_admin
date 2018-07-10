# Generate JS
cat "../vendor/extensions.js"             > "./build/index.js"
cat "../vendor/HtmlControl.js"           >> "./build/index.js"
cat "./src/js/imports.js"                >> "./build/index.js"
cat "./src/js/WineReservationControl.js" >> "./build/index.js"
cat "./src/js/index.js"                  >> "./build/index.js"

# Generate CSS
cat "./src/css/index.css" > "./build/index.css"

