//-------------------------------------------------------
//
// WineReservationControl
//
//-------------------------------------------- YuMaeda --
class WineReservationControl extends HtmlControl
{
    constructor($table)
    {
        super($('div#contentsPane'));
    }

    _appendRow(intQty, $table)
    {
        var html =
            '<tr>' +
                '<td>' +
                    '[' + ($table.find('tr').length + 1) + ']' +
                '</td>' +
                '<td class="codeCol">' +
                    '<input type="text" name="code" maxlength="5" class="codeFld" placeholder="コード" />' +
                '</td>' +
                '<td class="vintageCol"></td>' +
                '<td class="nameCol"></td>' +
                '<td class="producerCol"></td>' +
                '<td class="priceCol" style="display:none;"></td>' +
                '<td class="qtyCol">' +
                    '<input type="number" class="quantityFld" value="{0}" style="width:40px;" />'.format(intQty) +
                '</td>' +
                '<td class="confirmCol">' +
                    '<input class="confirmBtn" type="button" value="Confirm" />' +
                '</td>' +
                '<td class="revertCol" style="display:none;">' +
                    '<input class="revertBtn" type="button" value="Revert" />' +
                '</td>' +
            '</tr>';

        $table.append(html);
    }

    _loadWineInfo($tr)
    {
        var barcode = $tr.find('input[name=code]').val();

        $.ajax(
        { 
            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/wines/{0}'.format(barcode),
            dataType: 'json',
            async: false,
            success: function(data)
            {
                var rgobjWine = data.wines;
                if (rgobjWine && rgobjWine.length == 1)
                {
                    var objWine = rgobjWine[0];

                    $tr.find('td.codeCol').html(barcode);
                    $tr.find('td.vintageCol').html(objWine.vintage);
                    $tr.find('td.nameCol').html(objWine.combined_name);
                    $tr.find('td.producerCol').html('&nbsp;(' + objWine.producer + ')');
                    $tr.find('td.priceCol').html(objWine.member_price);
                    $tr.find('td.qtyCol').html($tr.find('td.qtyCol input').val());
                    $tr.find('td.confirmCol').fadeOut();
                    $tr.find('td.revertCol').fadeIn();
                }
            },

            error: function() {}
        });
    }

    _onConfirmBtnClick($button, self)
    {
        var $parentTr  = $button.closest('tr'),
            strBarcode = $parentTr.find('td.codeCol input').val(),
            intQty     = $parentTr.find('td.qtyCol input').val();

        if (strBarcode != '')
        { 
            self._loadWineInfo($parentTr);

            $.ajax(
            { 
                url:  '../goods_issue/checkout.php', 
                type: 'POST',
                data: { code: strBarcode, qty: intQty },

                success: function(strText)
                {
                    if (strText === 'SUCCESS')
                    {
                        var strReserveWines = $('input[name=strReserveWines]').val();
                        if (strReserveWines && strReserveWines.length > 0)
                        {
                            strReserveWines += ';';
                        }

                        // Calculate the total price.
                        var totalPrice = parseInt($('input[name=totalPrice]').val(), 10),
                            intPrice   = parseInt($parentTr.find('td.priceCol').html(), 10);

                        totalPrice += (intPrice * intQty);

                        $('input[name=strReserveWines]').val(strReserveWines + strBarcode + '#' + intQty);
                        $('input[name=totalPrice]').val(totalPrice);
                        $parentTr.find('input.revertBtn').fadeIn(1000);
                    }
                    else
                    {
                        $parentTr.remove();
                    }

                    self._appendRow(1, $parentTr.closest('table'));
                },

                error: function() {}
            });
        }
    }

    _onRevertBtnClick($button)
    {
        var $parentTr  = $button.closest('tr'),
            strBarcode = $parentTr.find('td.codeCol').html(),
            intQty     = parseInt($parentTr.find('span.quantityFld').html());

        $.ajax(
        { 
            url:  '../goods_issue/checkout.php', 
            type: 'POST',
            data: { code: strBarcode, qty: (-1 * intQty) },

            success: function(strText)
            {
                if (strText === 'SUCCESS')
                {
                    var strReserveWines = $('input[name=strReserveWines]').val(),
                        rgstrToken      = strReserveWines.split(';'),
                        strToken        = '',
                        fFoundToken     = false,
                        cToken          = rgstrToken.length;

                    strReserveWines = '';
                    for (var i = 0; i < cToken; ++i)
                    {
                        strToken = rgstrToken[i];
                        if (fFoundToken || (strToken !== (strBarcode + '#1')))
                        {
                            if (strReserveWines.length > 0)
                            {
                                strReserveWines += ';';
                            }

                            strReserveWines += strToken;
                        }
                        else
                        {
                            fFoundToken = true;
                        }
                    }

                    $('input[name=strReserveWines]').val(strReserveWines);
                    $parentTr.remove();
                }
            },

            error: function() {}
        });
    }

    renderChildren()
    {
        this.$m_parentContainer.html('<table id="contentsTable"></table>');
        this._appendRow(1, this.$m_parentContainer.find('table#contentsTable'));
    }

    postRender()
    {
        var self = this;

        self.$m_parentContainer.on('click', 'input.confirmBtn', function(e)
        {
            self._onConfirmBtnClick($(this), self);
        });

        self.$m_parentContainer.on('click', 'input.revertBtn', function(e)
        {
            self._onRevertBtnClick($(this));
        });
    }
}

