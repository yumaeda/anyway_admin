# Generate JS
cat "../vendor/extensions.js"      > "./build/index.js"
cat "./imports.js"                >> "./build/index.js"
cat "../vendor/HtmlControl.js"    >> "./build/index.js"
cat "./WineReservationControl.js" >> "./build/index.js"
cat "./index.js"                  >> "./build/index.js"

# Generate CSS
cat "./css/index.css"             > "./build/index.css"

