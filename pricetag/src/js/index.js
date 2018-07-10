var cCandidateWine = 0,
    cRetrievedWine = 0;

var loadNewCandidateWines = function(intCode)
    {
        $.ajax(
        {
            url : '//anyway-grapes.jp/wines/admin/get_admin_items.php',
            data:
            {
                dbTable: 'wines',
                condition: 'barcode_number > 1000',
                orderBy: 'barcode_number DESC LIMIT 1'
            },

            dataType: 'jsonp',
            jsonp:    'xDomainCallback',
            success: function(rgobjWine)
            {
                if (rgobjWine.length == 1)
                {
                    var intFirstCode = intCode + 1,
                        intLastCode  = parseInt(rgobjWine[0].barcode_number, 10);

                    while (intFirstCode <= intLastCode)
                    {
                        $.post('./pricetag_flag_mgr.php', { barcode_number: intFirstCode, action: 'init' });
                        ++intFirstCode;
                    }
                }
            },

            error: function() {}
        });
    },

    generateTableRowHtml = function(objWine)
    {
        var html = 
            '<tr>' +
                '<td style="width:400px;padding:15px;">' +
                    ('[' + objWine.barcode_number + '] ' + objWine.vintage + ' ' + objWine.combined_name + ' / ' + objWine.producer + '<br />') +
                '</td>' +
                '<td style="padding:15px;">' +
                    '<span style="color:red;padding:0 15px 0 15px;">' + objWine.etc + '</span>' +
                '</td>' +
                '<td style="padding:15px;">' +
                    '<button id="' + objWine.barcode_number + '" class="register-button">Register</button>' +
                '</td>' +
            '</tr>';

        return html;
    },

    renderCandidateWine = function(tableId, objWine)
    {
        $('table#' + tableId).append(generateTableRowHtml(objWine));
    },

    retrieveCandidateWines = function()
    {
        $.ajax(
        {
            url : './pricetag_mgr.php',
            type: 'GET',
            dataType: 'json',
            success: function(rgobjCode)
            {
                var strCode        = '',
                    cCandidateWine = rgobjCode.length;

                for (var i = 0; i < cCandidateWine; ++i)
                {
                    strCode = rgobjCode[i].barcode_number;

                    $.ajax(
                    {
                        url : '//anyway-grapes.jp/wines/admin/get_admin_items.php',
                        data:
                        {
                            dbTable: 'wines',
                            condition: 'barcode_number=' + strCode 
                        },

                        dataType: 'jsonp',
                        jsonp:    'xDomainCallback',
                        success: function(rgobjWine)
                        {
                            if (rgobjWine.length == 1)
                            {
                                var objWine = rgobjWine[0];
                                if (objWine.stock > 0)
                                {
                                    switch (objWine.type)
                                    {
                                    case 'Champagne':
                                    case 'Champagne Rosé':
                                    case 'Mousseux':
                                    case 'Mousseux Rosé':
                                    case 'Mousseux Rouge':
                                        renderCandidateWine('sparkling-wine-table', objWine);
                                        break;
                                    case 'Blanc':
                                    case 'Gris':
                                    case 'Orange':
                                        renderCandidateWine('white-wine-table', objWine);
                                        break;
                                    case 'Jaune':
                                        renderCandidateWine('yellow-wine-table', objWine);
                                        break;
                                    case 'Rosé':
                                        renderCandidateWine('rose-wine-table', objWine);
                                        break;
                                    case 'Rouge':
                                        renderCandidateWine('red-wine-table', objWine);
                                        break;
                                    case 'Doux':
                                        renderCandidateWine('dessert-wine-table', objWine);
                                        break;
                                    case 'Beer':
                                    case 'Cider':
                                    case 'Liqueur':
                                        renderCandidateWine('liquor-table', objWine);
                                        break;
                                    case 'Eau de Vie':
                                    case 'Food':
                                        renderCandidateWine('etc-table', objWine);
                                        break;
                                    }

                                    ++cRetrievedWine;
                                }
                                else
                                {
                                    --cCandidateWine;
                                }

                                if (cCandidateWine == cRetrievedWine)
                                {
                                    $('div#loading-pane').hide();
                                }
                                else
                                {
                                    $('div#loading-pane').html(cRetrievedWine + ' / ' + cCandidateWine);
                                }
                            }
                        },

                        error: function() {}
                    });
                }

                loadNewCandidateWines(parseInt(strCode, 10));
            },

            error: function() {}
        });
    };

$(document).ready(function()
{
    var priceTagForm = new PriceTagForm($('aside'));
    priceTagForm.render();

    retrieveCandidateWines();

    $('table.candidate-table').on('click', 'button.register-button', function()
    {
        var $this          = $(this),
            strBarcode     = $(this).attr('id'),
            $barcodeInput1 = $('input[name=barcode_1]'),
            $barcodeInput2 = $('input[name=barcode_2]');

        if ($barcodeInput1.val() == '')
        {
            $barcodeInput1.val(strBarcode);
            $barcodeInput1.siblings('input.search-btn').trigger('click');
            $this.closest('tr').remove();
        }
        else if ($barcodeInput2.val() == '')
        {
            $barcodeInput2.val(strBarcode);
            $barcodeInput2.siblings('input.search-btn').trigger('click');
            $this.closest('tr').remove();
        }
    });
});

