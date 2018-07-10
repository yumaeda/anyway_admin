# Generate JS
cat "../vendor/extensions.js"        > "./build/index.js"
cat "../vendor/HtmlControl.js"      >> "./build/index.js"
cat "../vendor/jquery-barcode.js"   >> "./build/index.js"
cat "./src/js/imports.js"           >> "./build/index.js"
cat "./src/js/GoodsIssueControl.js" >> "./build/index.js"
cat "./src/jsindex.js"              >> "./build/index.js"

