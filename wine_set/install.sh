# Generate JS
cat "../vendor/extensions.js"     > "./build/index.js"
cat "./src/js/WineSetManager.js" >> "./build/index.js"
cat "./src/js/index.js"          >> "./build/index.js"

# Generate CSS
cat "./src/css/index.css" > "./build/index.css"

