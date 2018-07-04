# JS
cat "../../extensions/build/extensions.js"  > "./build/index.js"
cat "./imports.js"                         >> "./build/index.js"
cat "../../../external_libs/jquery.js"     >> "./build/index.js"
cat "./producers.js"                       >> "./build/index.js"

