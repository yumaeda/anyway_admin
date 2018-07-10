//-------------------------------------------------------
//
// PriceTagForm
//
//-------------------------------------------- YuMaeda --
class PriceTagForm extends HtmlControl
{
    constructor($parentContainer)
    {
        super($parentContainer);

        this.m_fLandscape = true;
    }

    _generateOrientationSelectHtml()
    {
        var orientationSelect = new SelectTag();

        orientationSelect.addAttr('id', 'orientation-select');
        orientationSelect.addAttr('name', 'orientation');
        orientationSelect.addOption('Landscape', 1);
        orientationSelect.addOption('Portrait', 2);

        return orientationSelect.toHtml();
    }

    _generateClearLinkHtml()
    {
        var anchorTag = new AnchorTag('#', 'Clear');
        anchorTag.addAttr('id', 'clear-link');

        return anchorTag.toHtml();
    }

    _generateInputPaneInnerHtml(targetContainerId, iContainer, tabIndex)
    {
        var barcodeInput = new InputTag('barcode_{0}'.format(iContainer), 'text', ''),
            searchButton = new InputTag('', 'button', 'Search');

        barcodeInput.addAttr('tabindex', tabIndex);
        searchButton.addAttr('for', targetContainerId);
        searchButton.addAttr('tabindex', (tabIndex + 1));
        searchButton.addClass('search-btn');

        return (barcodeInput.toHtml() + searchButton.toHtml());
    }

    set isLandscape(fLandscape) { this.m_fLandscape = fLandscape; }

    preRender()
    {
        if (this.$m_parentContainer.find('form').length == 0)
        {
            var topInputPane    = new DivTag(''),
                topContainer    = new DivTag(''),
                bottomInputPane = new DivTag(''),
                bottomContainer = new DivTag('');

            topInputPane.addAttr('id', 'top-input-pane');
            topContainer.addAttr('id', 'top-container');
            topContainer.addAttr('index', '1');
            bottomInputPane.addAttr('id', 'bottom-input-pane');
            bottomContainer.addAttr('id', 'bottom-container');
            bottomContainer.addAttr('index', '2');

            var html =
                '<form target="_blank" action="printTag.php" method="POST">' +
                    this._generateOrientationSelectHtml() +
                    this._generateClearLinkHtml() +
                    '<br /><br />' +
                    topInputPane.toHtml() +
                    topContainer.toHtml() +
                    bottomInputPane.toHtml() +
                    bottomContainer.toHtml() +
                    '<button type="submit" tabindex="4">プライスタグを生成</button>' +
                '</form>';

            this.$m_parentContainer.html(html);
        }
    }

    renderChildren()
    {
        var strClass = (this.m_fLandscape ? 'landscape-container' : 'portrait-container');

        this.$m_parentContainer.find('div#top-container').removeClass('loandscape-container portrait-container').addClass(strClass);
        this.$m_parentContainer.find('div#bottom-container').removeClass('loandscape-container portrait-container').addClass(strClass);

        this.$m_parentContainer.find('div#top-input-pane').html(this._generateInputPaneInnerHtml('top-container', 1, 1));
        this.$m_parentContainer.find('div#bottom-input-pane').html(this._generateInputPaneInnerHtml('bottom-container', 2, 3));
    }

    postRender()
    {
        this.$m_parentContainer.on('click', 'input.search-btn', function()
        {
            var $this            = $(this),
                $targetContainer = $('div#' + $this.attr('for')), 
                targetNumber     = $this.siblings().val();

            $.ajax(
            {
                url : '//anyway-grapes.jp/wines/admin/get_admin_items.php',

                data:
                {
                    dbTable: 'wines',
                    condition: 'barcode_number=' + targetNumber
                },

                dataType: 'jsonp',
                jsonp:    'xDomainCallback',
                success: function(rgobjWine)
                {
                    if (rgobjWine.length == 1)
                    {
                        var objWine   = rgobjWine[0],
                            attrClass = $targetContainer.attr('class'),
                            iPriceTag = $targetContainer.attr('index'),
                            priceTag  = new PriceTagControl(objWine, iPriceTag);

                        $targetContainer.html(priceTag.toHtml());
                        $targetContainer.removeClass().addClass(WineInfo.getTypeCss(objWine.type)).addClass(attrClass);
                    }
                },

                error: function() {}
            });
        });

        var self = this;

        this.$m_parentContainer.on('change', 'select#orientation-select', function()
        {
            self.m_fLandscape = (($(this).val() == 1) ? true : false);
            self.render();
        });

        this.$m_parentContainer.on('click', 'a#clear-link', function()
        {
            self.$m_parentContainer.find('input[type=text]').val('');

            return false;
        });
    }
}

