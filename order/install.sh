# Generate JS
cat "../vendor/extensions.js"   > "./build/index.js"
cat "./src/js/imports.js"      >> "./build/index.js"
cat "./src/js/OrderManager.js" >> "./build/index.js"
cat "./src/js/index.js"        >> "./build/index.js"

# Generate CSS
cat "../vendor/FontSize.css"      > "./build/index.css"
cat "./src/css/OrderManager.css" >> "./build/index.css"

