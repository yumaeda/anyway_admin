# Generate JS
cat "../vendor/extensions.js"    > "./build/index.js"
cat "./src/js/imports.js"       >> "./build/index.js"
cat "./src/js/AdminHomePage.js" >> "./build/index.js"
cat "./src/js/index.js"         >> "./build/index.js"

# Generate CSS
cat "./src/css/index.css" > "./build/index.css"

