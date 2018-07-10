# Generates JS
cat "../vendor/extensions.js"      > "./build/index.js"
cat "../vendor/HtmlControl.js"    >> "./build/index.js"
cat "../vendor/jquery-barcode.js" >> "./build/index.js"
cat "./imports.js"                >> "./build/index.js"
cat "./GoodsIssueControl.js"      >> "./build/index.js"
cat "./index.js"                  >> "./build/index.js"

