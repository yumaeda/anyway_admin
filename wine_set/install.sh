# Generate JS
cat "../vendor/extensions.js"  > "./build/index.js"
cat "./WineSetManager.js"     >> "./build/index.js"
cat "./index.js"              >> "./build/index.js"

# Generate CSS
cat "./css/index.css" > "./build/index.css"

