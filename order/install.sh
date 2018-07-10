# Generate JS
cat "../vendor/extensions.js" > "./build/index.js"
cat "./imports.js"           >> "./build/index.js"
cat "./OrderManager.js"      >> "./build/index.js"
cat "./index.js"             >> "./build/index.js"

# Generate CSS
cat "../vendor/FontSize.css"   > "./build/index.css"
cat "./css/OrderManager.css"  >> "./build/index.css"

