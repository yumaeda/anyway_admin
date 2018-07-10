//-------------------------------------------------------
//
// GoodsIssueControl
//
//-------------------------------------------- YuMaeda --
class GoodsIssueControl extends HtmlControl
{
    constructor($table)
    {
        super($('div#contentsPane'));

        var dt = new Date();
        this.m_intYear  = dt.getUTCFullYear();
        this.m_intMonth = dt.getUTCMonth() + 1,
        this.m_intDate  = dt.getUTCDate();
    }

    _appendTableRow(strCode, intQty, $table)
    {
        var html =
            '<tr id="{0}">'.format(strCode) +
                '<td>' +
                    '[' + ($table.find('tr').length + 1) + ']' +
                '</td>' +
                '<td class="codeCol">' +
                    '<input type="text" name="code" value="{0}" maxlength="5" class="codeFld" />'.format(strCode) +
                '</td>' +
                '<td class="nameCol"></td>' +
                '<td class="noprint">' +
                    '<span class="quantityFld">{0}</span>'.format(intQty) +
                '</td>' +
                '<td class="noprint">' +
                    '<input class="revertBtn" type="button" value="Revert" />' +
                '</td>' +
                '<td class="barcodeCol">' +
                    '<div></div>' +
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
            success: function(data)
            {
                var rgobjWine = data.wines;
                if (rgobjWine && rgobjWine.length == 1)
                {
                    var objWine = rgobjWine[0];

                    $tr.find('td.codeCol').html(barcode);
                    $tr.find('td.nameCol').html('{0}&nbsp;{1}<br />[{2}]'.format(objWine.vintage, objWine.combined_name, objWine.producer));
                    $tr.find('td.barcodeCol > div').barcode(barcode, 'code39', { barWidth: 1, barHeight: 30 });
                }
            },

            error: function() {}
        });
    }

    _getTimestamp()
    {
        var dateTime   = new Date(),
            strHour    = dateTime.getHours(),
            strMinutes = dateTime.getMinutes(),
            strSeconds = dateTime.getSeconds();

        if (strHour < 10)
        {
            strHour = '0' + strHour;
        }

        if (strMinutes < 10)
        {
            strMinutes = '0' + strMinutes;
        }

        if (strSeconds < 10)
        {
            strSeconds = '0' + strSeconds;
        }

        return '{0}:{1}:{2}'.format(strHour, strMinutes, strSeconds);
    }

    _saveCookie(strKey, strValue, intExpirationHour)
    {
        var objDate = new Date();
        if (objDate.getHours() >= intExpirationHour)
        {
            objDate.setDate(objDate.getDate() + 1); 
        }

        objDate.setHours(intExpirationHour, 0, 0);
        $.cookie(strKey, strValue, { expires: objDate });
    }

    _addLogToCookie(strKey, strValue)
    {
        var timestamp  = this._getTimestamp(),
            prevLogs   = $.cookie(strKey),
            strValue   = '[{0}] {1}'.format(timestamp, strValue),
            newLogs    = strValue;
        
        if (prevLogs)
        {
            newLogs = prevLogs + '#;' + strValue;
        }

        this._saveCookie(strKey, newLogs, 12);
    }

    _addError(strError)
    {
        this._addLogToCookie('error', strError);
        this._renderErrors();
    }

    _renderLogs()
    {
        var strLogs = $.cookie('log');
        if (strLogs)
        {
            var logHtml =
                '<h2>[Logs]</h2>{0}'.format(strLogs.replace(/#;/g, '<br />'));

            $('div#logPane').html(logHtml);
        }
    }

    _addLog(strLog)
    {
        this._addLogToCookie('log', strLog);
        this._renderLogs();
    }

    renderChildren()
    {
        var self   = this,
            $table = $('table');

        $table.html('');

        $.ajax(
        { 
            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/delivered-wines',
            dataType: 'json',
            success: function(data)
            {
                var rgobjWine = data.wines,
                    cWine     = rgobjWine.length,
                    objWine   = null;

                for (var i = 0; i < cWine; ++i)
                {
                    objWine = rgobjWine[i];
                    self._appendTableRow(objWine.barcode_number, 1, $table);

                    var $parentTr = $table.find('tr#' + objWine.barcode_number);
                    $parentTr.each(function()
                    {
                        var $tr     = $(this),
                            barcode = $tr.find('input[name=code]').val();

                        $tr.find('td.codeCol').html(objWine.barcode_number);
                        $tr.find('td.nameCol').html('{0}&nbsp;{1}<br />[{2}]'.format(objWine.vintage, objWine.combined_name, objWine.producer));
                        $tr.find('td.barcodeCol > div').barcode(barcode, 'code39', { barWidth: 2, barHeight: 50 });

                        $(this).find('input.revertBtn').fadeIn(1000);
                    });
                }

                self._appendTableRow('', 1, $table);
                self._appendTableRow('', 1, $table);

                $table.appendTo(self.$m_parentContainer);
            },

            error: function()
            {
                console.error('Failed to load the delivered wines.');
            }
        });
    }

    _renderErrors()
    {
        var strErrors = $.cookie('error');
        if (strErrors)
        {
            var errorHtml =
                '<h2>[Errors]</h2>{0}'.format(strErrors.replace(/#;/g, '<br />'));

            $('div#errorPane').html(errorHtml);
        }
    }

    _onTabClick($input, e, self)
    {
        var $parentTr  = $input.closest('tr'),
            $table     = $parentTr.closest('table'),
            strBarcode = $input.val(),
            keyCode    = e.keyCode || e.which; 

        if ((strBarcode != '') && (keyCode == 9))
        { 
            self._loadWineInfo($parentTr);

            $.ajax(
            { 
                url:  './checkout.php', 
                type: 'POST',
                data: { code: strBarcode, qty: 1 },

                success: function(strText)
                {
                    if (strText === 'SUCCESS')
                    {
                        $.ajax(
                        { 
                            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/delivered-wines',
                            type: 'POST',
                            data: { barcode_number: strBarcode },
                            success: function(strText)
                            {
                                if (strText === 'SUCCESS')
                                {
                                    $parentTr.find('input.revertBtn').fadeIn(1000);
                                    self._appendTableRow('', 1, $table);

                                    self._addLog('Delivered #' + strBarcode);
                                }
                            },
                            error: function()
                            {
                                self._addError('Failed to deliver #' + strBarcode);
                            }
                        });
                    }
                    else
                    {
                        self._addError('Failed to checkout #' + strBarcode);

                        $parentTr.remove();
                        self._appendTableRow('', 1, $table);
                    }
                },

                error: function()
                {
                    self._addError('Unexpected Error has occurred.');
                }
            });
        }
    }

    _onRevertBtnClick($button, self)
    {
        var $parentTr  = $button.closest('tr'),
            strBarcode = $parentTr.find('td.codeCol').html(),
            intQty     = parseInt($parentTr.find('span.quantityFld').html());

        $.ajax(
        { 
            url:  './checkout.php', 
            type: 'POST',
            data: { code: strBarcode, qty: (-1 * intQty) },

            success: function(strText)
            {
                if (strText === 'SUCCESS')
                {
                    self._addError('Reverted #' + strBarcode + ' x ' + intQty);

                    $.ajax(
                    { 
                        url: '//anyway-grapes.jp/laravel5.3/public/api/v1/delivered-wines/{0}'.format(strBarcode),
                        type: 'DELETE',
                        cache: 'false',
                        success: function(strText)
                        {
                            $parentTr.remove();
                        },

                        error: function(){}
                    });
                }
                else
                {
                    self._addError('Failed to revert [' + strBarcode + ']');
                }
            },

            error: function() {}
        });
    }

    postRender()
    {
        this._renderErrors();

        var self = this;

        this.$m_parentContainer.on('keydown', 'input[name=code]', function(e)
        {
            self._onTabClick($(this), e, self);
        });

        this.$m_parentContainer.on('click', 'input.revertBtn', function()
        {
            self._onRevertBtnClick($(this), self);
        });

        $('body').on('click', 'a.button--action-print', function()
        {
            window.print();
        });

        $('body').on('click', 'a.button--action-reset', function()
        {
            if (confirm('出庫済みのワインが全て消去されます。よろしいですか?'))
            {
                $.ajax(
                { 
                    url: '//anyway-grapes.jp/laravel5.3/public/api/v1/delivered-wines',
                    type: 'DELETE',
                    cache: 'false',
                    success: function(strText)
                    {
                        location.reload();
                    },

                    error: function(){}
                });
            }
        });
    }
}

