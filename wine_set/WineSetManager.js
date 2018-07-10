//-------------------------------------------------------
//
// WineSetManager
//
//-------------------------------------------- YuMaeda --
class WineSetManager
{
    constructor()
    {
    }

    _getSetWineInputs()
    {
        var rgstrBarcode = [];

        for (var i = 1; i <= 12; ++i)
        {
            rgstrBarcode.push($('input[name=barcode{0}]'.format(i)).val());
        }

        return rgstrBarcode;
    }

    _renderList()
    {
        $.ajax(
        {
            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/wine-sets',
            dataType: 'json',
            success: function(data)
            {
                var html         = '<table>',
                    rgobjWineSet = data.wines,
                    cWineSet     = data.wines.length,
                    objWineSet   = null;

                for (var i = 0; i < cWineSet; ++i)
                {
                    objWineSet  = rgobjWineSet[i];

                    html +=
                        '<tr class="wine-set-row">' +
                            '<td>' +
                                '<a id="{0}" class="wine-set-link" href="#">{1}</a>'.format(objWineSet.id, objWineSet.name) +
                                '<input type="hidden" class="total-price-fld" value="{0}" />'.format(objWineSet.price) +
                                '<input type="hidden" class="comment-fld" value="{0}" />'.format(objWineSet.comment) +
                                '<input type="hidden" class="set-price-fld" value="{0}" />'.format(objWineSet.set_price) +
                            '</td>' +
                            '<td>' +
                                '<button type="button" class="remove-set-button">Remove</button>' +
                            '</td>' +
                        '</tr>';
                }

                $('div#left-pane').html(html + '</table>');
            },

            error: function() {}
        });
    }

    _registerEvents()
    {
        var self = this;

        $('div#left-pane').on('click', 'a.wine-set-link', function()
        {
            $('a#createLink').fadeOut(500);
            $('a#updateLink').fadeIn(500);

            $('tr').removeClass('selected-set');

            var $this       = $(this),
                intId       = $this.attr('id'),
                strName     = $this.html(),
                intPrice    = $(this).siblings('input.total-price-fld').val(),
                strComment  = $(this).siblings('input.comment-fld').val(),
                intSetPrice = $(this).siblings('input.set-price-fld').val();

            $this.closest('tr').addClass('selected-set');

            $('input[name=set_name]').val(strName);
            $('span#total-price-text').html(intPrice.format());
            $('textarea[name=comment]').val(strComment);
            $('input[name=set_price]').val(intSetPrice);

            $.ajax(
            {
                url: '//anyway-grapes.jp/laravel5.3/public/api/v1/set-wines/{0}'.format(intId),
                dataType: 'json',
                success: function(data)
                {
                    var rgobjSetWine = data.wines,
                        cSetWine     = data.wines.length,
                        objSetWine   = null;

                    for (var i = 0; i < cSetWine; ++i)
                    {
                        objSetWine = rgobjSetWine[i];
                        $('input[name=barcode{0}]'.format(i + 1)).val(objSetWine.barcode_number);
                    }
                },

                error: function() {}
            });

            return false;
        });

        $('div#left-pane').on('click', 'button.remove-set-button', function()
        {
            var $this     = $(this),
                $parentTr = $this.closest('tr'),
                intSetId  = $parentTr.find('a').attr('id');

            $.post('./php/remove-wine-set.php', { id: intSetId },
                function(data)
                {
                    alert('Set[ID:{0}] is removed successfully.'.format(intSetId));

                    $parentTr.remove();
                });
        });

        $('div#right-pane').on('click', 'a#createLink', function()
        {
            var rgstrBarcode = self._getSetWineInputs();

            $.post('./php/add-to-wine-set.php',
                {
                    set_name: $('input[name=set_name]').val(),
                    comment: $('textarea[name=comment]').val(),
                    set_price: $('input[name=set_price]').val(),
                    barcode: rgstrBarcode
                },
                function(data)
                {
                    if (data === 'SUCCESS')
                    {
                        location.reload();
                    }
                });
        });

        $('div#right-pane').on('click', 'a#updateLink', function()
        {
            var rgstrBarcode = self._getSetWineInputs(),
                intSetId     = $('tr.selected-set').find('a').attr('id');

            $.post('./php/update-wine-set.php',
                {
                    set_name:  $('input[name=set_name]').val(),
                    set_id:    intSetId,
                    comment:   $('textarea[name=comment]').val(),
                    set_price: $('input[name=set_price]').val(),
                    barcode:   rgstrBarcode
                },
                function(data)
                {
                    if (data === 'SUCCESS')
                    {
                        alert('Set[ID:{0}] is updated.'.format(intSetId));
                        location.reload();
                    }
                });
        });

        $('div#right-pane').on('click', 'a#resetLink', function()
        {
            location.reload();
        });
    }

    render()
    {
        this._renderList();
        this._registerEvents();
    }
}

