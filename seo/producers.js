function generateDisplayPageLinkHtml(objProducer, iProducer)
{
    var dispPageUrl = UrlUtility.generateProducerPageUrl(objProducer),
        html        =
            '<a class="display-link" href="{0}" target="producer_detail">'.format(dispPageUrl) +
                iProducer + '.&nbsp;<span>' + objProducer.name + '</span>（' + objProducer.name_jpn + '）' +
            '</a>';

    return html;
}

function generateEditPageLinkHtml(objProducer)
{
    var editPageUrl = './generate_producer.php?name=' + encodeURIComponent(objProducer.name),
        html        = '<a href="{0}">[Edit]</a>'.format(editPageUrl);

    return html;
}

$(document).ready(function()
{
    $.ajax(
    { 
        url: '//anyway-grapes.jp/laravel5.3/public/api/v1/producer-details',
        dataType: 'json', 
        success: function(data)
        { 
            var html               = '',
                rgobjProducer      = data.details,
                objProducer        = null,
                cProducer          = rgobjProducer.length,
                urlEncodedProducer = '';

            for (var i = 0; i < cProducer; ++i)
            {
                html += '<div class="row" style="padding:10px;border:solid 1px rgb(222,222,222);">';
                html +=     '<div class="col-sm-10">' + generateDisplayPageLinkHtml(rgobjProducer[i], i + 1) + '</div>';
                html +=     '<div class="col-sm-2">' + generateEditPageLinkHtml(rgobjProducer[i]) + '&nbsp;&nbsp;<a href="#" class="delete-link">[Delete]</a></div>';
                html += '</div>';
            }

            $('div#container').html(html);

            $('div#container').on('click', 'a.delete-link', function()
            {
                var strProducer =
                    $(this).closest('div.row').find('a.display-link span').html();

                if (confirm('「{0}」のページを削除してもよろしいですか？'.format(strProducer)))
                {
                    $.ajax(
                    { 
                        url: '//anyway-grapes.jp/laravel5.3/public/api/v1/producer-details/' + strProducer,
                        type: 'DELETE',
                        cache: 'false',
                        success: function(strText)
                        {
                            location.reload();
                        },

                        error: function(){}
                    });
                }

                return false;
            });
        },

        error: function() {}
    });
});
