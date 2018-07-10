# Generate JS
cat "../vendor/extensions.js"       > "./build/index.js"
cat "../vendor/HtmlControl.js"     >> "./build/index.js"
cat "./src/js/imports.js"          >> "./build/index.js"
cat "./src/js/PriceTagControl.js"  >> "./build/index.js"
cat "./src/js/PriceTagForm.js"     >> "./build/index.js"
cat "./src/js/index.js"            >> "./build/index.js"

# Generate CSS
cat "./src/css/PriceTagForm.css"     > "./build/index.css"
cat "./src/css/PriceTagControl.css" >> "./build/index.css"
cat "./src/css/index.css"           >> "./build/index.css"

