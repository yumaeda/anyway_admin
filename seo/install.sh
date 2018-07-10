# Generate JS
cat "../vendor/extensions.js" > "./build/index.js"
cat "../vendor/jquery.js"    >> "./build/index.js"
cat "./src/js/imports.js"    >> "./build/index.js"
cat "./src/js/producers.js"  >> "./build/index.js"

