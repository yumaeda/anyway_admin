//-------------------------------------------------------
//
// OrderManager
//
//-------------------------------------------- YuMaeda --
class OrderManager
{
    constructor()
    {
        this.m_cItem      = 0;
        this.$m_menuTable = null;
    }

    _calculateWineTotal(strContents, fMember)
    {
        var rgstrItem    = strContents.split(';'),
            cItem        = rgstrItem.length,
            intWineTotal = 0;

        for (var i = 0; i < cItem; ++i)
        {
            var rgstrToken = rgstrItem[i].split('#');
            if (rgstrToken.length === 2)
            {
                var qty     = rgstrToken[1],
                    strCode = rgstrToken[0];

                if ((strCode < 50000) || (strCode >= 100000))
                {
                    $.ajax(
                    { 
                        url: '//anyway-grapes.jp/laravel5.3/public/api/v1/wines/{0}'.format(rgstrToken[0]),
                        dataType: 'json',
                        async: false,
                        success: function(data)
                        {
                            var rgobjWine = data.wines;
                            if (rgobjWine && rgobjWine.length == 1)
                            {
                                var objWine = rgobjWine[0],
                                    price   = (fMember ? objWine.member_price : objWine.price);

                                intWineTotal += (qty * price);
                            }
                        },

                        error: function() {}
                    });
                }
                else
                {
                    // TODO deal w/ wine set later.
                }
            }
        }

        return intWineTotal;
    }

    _generateDeliveryTimeHtml(objOrder)
    {
        var strDeliveryTime  = objOrder.delivery_time,
            selectTag        = new SelectTag(),
            objSelectedIndex =
            {
                '指定なし': 0,
                '午前中（8:00〜12:00）': 1,
                '12:00 ～ 14:00': 2,
                '14:00 ～ 16:00': 3,
                '16:00 ～ 18:00': 4,
                '18:00 ～ 20:00': 5,
                '19:00 ～ 21:00': 6
            },

            strOption = '';

        selectTag.addAttr('id', 'delivery-time-select');
        for (var key in objSelectedIndex)
        {
            if (objSelectedIndex.hasOwnProperty(key))
            {
                selectTag.addOption(key, key);
            }
        }

        selectTag.setSelectedIndex(objSelectedIndex[strDeliveryTime]);
        return selectTag.toHtml();
    }

    _generateDeliveryDateHtml(objOrder)
    {
        var inputTag = new InputTag('delivery-date', 'text', objOrder.delivery_date);
        return inputTag.toHtml();
    }

    _generatePaymentMethodHtml(objOrder)
    {
        var strPaymentMethod = ((objOrder.payment_method == 1) ? 'クレジットカード' : '銀行振り込み'),
            selectTag        = new SelectTag(),
            rgstrOption      = [ '未定', 'クレジットカード', '銀行振り込み' ],
            cOption          = rgstrOption.length;

        selectTag.addAttr('id', 'payment-method-select');
        for (var i = 0; i < cOption; ++i)
        {
            selectTag.addOption(rgstrOption[i], i);
        }

        if (strPaymentMethod == rgstrOption[1])
        {
            selectTag.setSelectedIndex(1);
        }
        else if (strPaymentMethod == rgstrOption[2])
        {
            selectTag.setSelectedIndex(2);
        }

        return selectTag.toHtml();
    }

    _generateOrderStatusHtml(intStatus)
    {
        var strStatus = '';
        
        switch (intStatus)
        {
        case 0:
            strStatus = '<span class="text--status-unconfirmed">未確定</span>';
            break;
        case 1:
            strStatus = '<span class="text--status-unconfirmed">未払い</span>';
            break;
        case 2:
        case 3:
            strStatus = '<span class="text--status-confirmed">支払い済み</span>';
            break;
        case 4:
            strStatus = '<span class="text--status-confirmed">発送済み</span>';
            break;
        default:
            break;
        }

        return strStatus;
    }

    _containsPreOrderItem(objOrder)
    {
        var fPreorder = false;

        if (objOrder)
        {
            var rgstrItem = objOrder.contents.split(';'),
                cItem     = rgstrItem.length;

            var i = 0;
            while (!fPreorder && (i < cItem))
            {
                var rgstrToken = rgstrItem[i].split('#');
                if ((rgstrToken.length === 2) && (parseInt(rgstrToken[0]) >= 100000))
                {
                    fPreorder = true;
                }

                ++i;
            }
        }

        return fPreorder;
    }

    _generateChangeStatusButtonHtml(objOrder, self)
    {
        var html = '';

        if (!self._containsPreOrderItem(objOrder))
        {
            var statusBtn;

            switch (objOrder.status)
            {
            case 0:
                statusBtn = new ButtonTag('confirmOrderBtn', '注文を確定する。');
                break;
            case 1:
                statusBtn = new ButtonTag('confirmPaymentBtn', '支払い済みにする。');
                break;
            case 2:
                statusBtn = new ButtonTag('confirmIssueBtn', '出庫済みにする。');
                break;
            case 3:
                statusBtn = new ButtonTag('confirmDeliveryBtn', '発送済みにする。');
                break;
            case 4:
                statusBtn = new ButtonTag('finalizeOrderBtn', '完了する');
                break;
            default:
                break;
            }

            html = statusBtn.toHtml();
        }

        return html;
    }

    _generateCancelOrderButtonHtml()
    {
        return (new ButtonTag('cancelOrderBtn', '取り消す')).toHtml();
    }

    _addOrder(objOrder, self)
    {
        ++self.m_cItem;

        var orderNumberFld, nameFld,
            strOrderNumber      = (objOrder ? objOrder.order_id: ''),
            strTrackingId       = (objOrder ? objOrder.transaction_id : ''),
            strName             = (objOrder ? objOrder.customer_name: ''),
            strRefrigerated     = (objOrder.refrigerated ? 'クール便' : ''),
            strOrderStatus      = self._generateOrderStatusHtml(objOrder.status),
            strDeliveryDateTime = self._generateDeliveryInfoHtml(objOrder, self),
            totalPayment        = Math.floor((objOrder.fee + objOrder.wine_total) * 1.08);

	    if (strTrackingId &&
                (strTrackingId !== 'xxxxxxxx') &&
                (strTrackingId !== '0000-0000-0000'))
            {
		strTrackingId = '[Tracking #]&nbsp;{0}'.format(strTrackingId);
            }
            else
            {
                strTrackingId = strOrderNumber;
            }

         var rowHtml =
	    '<tr id="{0}" class="orderColumn">'.format(strOrderNumber) +
		'<td><a href="#">{0}</a></td>'.format(strTrackingId) +
		'<td>{0}</td>'.format(strName) +
		'<td>{0}</td>'.format(strRefrigerated) +
		'<td>{0} yen</td>'.format(totalPayment.format()) +
		'<td>{0}</td>'.format(strOrderStatus) +
		'<td style="font-size:11px;" class="deliveryDateTime">' + strDeliveryDateTime + '</td>' +
		'<td>' +
		    self._generateChangeStatusButtonHtml(objOrder, self) +
		'</td>' +
		'<td>' +
		    self._generateCancelOrderButtonHtml() +
		'</td>' +
	    '</tr>';

        this.$m_menuTable.append(rowHtml);
    }

    _tryLoadOrders()
    {
        var self = this;

        $.ajax(
        {
            url:      './index.php',
            type:     'GET',
            dataType: 'json', 
            data:
            {
                action:   'get',
                order_id: '00000000-0000000000'
            },

            success: function(rgobjOrder)
            { 
                var cOrder = rgobjOrder.length;
                for (var i = 0; i < cOrder; ++i)
                {
                    self._addOrder(rgobjOrder[i], self);
                }
            },

            error: function() {}
        });
    }

    _generateDeliveryInfoHtml(objOrder, self)
    {
        var html = '';
        if (objOrder)
        {
            if ((objOrder.name === '店頭引き取り') &&
                (objOrder.phone === '03-6413-9737') &&
                (objOrder.address == '世田谷区経堂 2-13-1-B1'))
            {
                html = '店頭引き取り';
            }
            else
            {
                html =
                    '{0} {1}'.format(objOrder.delivery_date, objOrder.delivery_time);
            }
        }

        return html;
    }

    _generateOrderDetailHtml(objOrder, self)
    {
        var totalPayment = Math.floor((objOrder.fee + objOrder.wine_total) * 1.08),
            html         =
            '<span style="font-size:20px;margin-right:10px;" id="orderIdText">' + objOrder.order_id + '</span><input type="button" id="receiptBtn" value="Receipt" />' +
            '<br /><br />' +
            '<ruby>' +
                '<rb class="text--size-medium">{0}'.format(objOrder.customer_name) + '</rb>' +
                '<rp>(</rp>' +
                '<rt>' + objOrder.customer_phonetic + '</rt>' +
                '<rp>)</rp>' +
            '</ruby><br />' +
            '<a class="text--size-small" href="mailto:' + objOrder.customer_email + '">' + objOrder.customer_email + '</a><br />' +
            '<span class="text--size-small">' + 'Tel:&nbsp;' + objOrder.customer_phone + '</span><br />' +
            '<span class="text--size-small">〒' + objOrder.customer_address + '</span><br /><br />' +
            '<span id="purchasedWineText" class="text--size-small">' +
                '[ 購入ワイン ]<br />' +
            '</span><br />' +
            '<span class="text--size-small">' +
                '[ 会員価格 ]<br />' +
                '<span id="memberPriceText">' + ((objOrder.member_discount === 1) ? 'Yes' : 'No') + '</span>' +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 合計額 ]<br />' +
                '{0} yen'.format(totalPayment.format()) +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 支払い方法 ]<br />' +
                self._generatePaymentMethodHtml(objOrder) +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 配送先 ]<br />' +
                objOrder.name + '<br />' +
                'Tel:&nbsp;' + objOrder.phone + '<br />' +
                '〒' + objOrder.post_code + ' ' + objOrder.prefecture + objOrder.address +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 配送業者 ]<br />' +
                objOrder.delivery_company +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 配送希望時間 ]<br />' +
                self._generateDeliveryDateHtml(objOrder) + '&nbsp;&nbsp;' +
                self._generateDeliveryTimeHtml(objOrder) +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ クール便 ]<br />' +
                ((objOrder.refrigerated === 1) ? 'Yes' : 'No') +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ コメント ]<br />' +
                objOrder.comment +
            '</span><br /><br />' +
            '<span class="text--size-small">' +
                '[ 送り状番号 ]<br />' +
                '<input type="text" name="transaction_id" value="' + objOrder.transaction_id + '" /><br />' +
                '<input type="text" name="transaction_id2" value="' + objOrder.transaction_id2 + '" />' +
            '</span><br /><br />' +
            '<input type="button" id="closeBtn" value="閉じる" />' +
            '<input type="button" id="updateBtn" value="更新" />';

        return html;
    }

    _registerCloseEvent()
    {
        $('div#detailDialog').on('click', 'input#closeBtn', function()
        {
            $('div#detailDialog').hide();
            $('div#contents').show();
        });
    }

    _registerReceiptEvent()
    {
        $('div#detailDialog').off('click', 'input#receiptBtn');
        $('div#detailDialog').on('click', 'input#receiptBtn', function()
        {
            var strOrderId = $('span#orderIdText').html();

            location.href = './receipt.php?order_id={0}'.format(strOrderId);
            return false;
        });
    }

    _registerUpdateEvent(self)
    {
        $('div#detailDialog').off('click', 'input#updateBtn');
        $('div#detailDialog').on('click', 'input#updateBtn', function()
        {
            var strOrderId        = $('span#orderIdText').html(),
                intPaymentMethod  = $('select#payment-method-select').val(),
                strDeliveryDate   = $('input[name=delivery-date]').val(),
                strDeliveryTime   = $('select#delivery-time-select').val(),
                fMember           = ('Yes' == $('span#memberPriceText').html()),
                strTransactionId  = $('input[name=transaction_id]').val(),
                strTransactionId2 = $('input[name=transaction_id2]').val(),
                strOrderContents  = '';

            $('input.barcodeFld').each(function(index, element)
            {
                var strBarcode = $(this).val(),
                    strQty     = $(this).attr('rel');

                if ((strBarcode.trim() !== '') &&
                    (strQty.trim() !== ''))
                {
                    if (strOrderContents != '')
                    {
                        strOrderContents += ';';
                    }

                    strOrderContents += '{0}#{1}'.format(strBarcode, strQty);
                }
            });

            if ((strOrderContents !== '') && (strOrderContents.indexOf('#') > 0))
            {
                $.ajax(
                { 
                    url: './update_order.php', 
                    type: 'POST',
                    data:
                    {
                        order_id: strOrderId,
                        payment_method: intPaymentMethod,
                        delivery_date: strDeliveryDate,
                        delivery_time: strDeliveryTime,
                        order_contents: strOrderContents,
                        wine_total: self._calculateWineTotal(strOrderContents, fMember),
                        transaction_id: strTransactionId,
                        transaction_id2: strTransactionId2
                    },

                    success: function(strResponse)
                    {
                        if (strResponse == 'SUCCESS')
                        {
                            location.reload();
                        }
                    },

                    error: function() {}
                });
            }
            else
            {
                alert('!!ERROR!! Cannot retrieve order contents.');
            }

            return false;
        });
    }

    _appendOrderedWine(strCode, intQty)
    {
        $.ajax(
        { 
            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/wines/{0}'.format(strCode),
            dataType: 'json',
            success: function(data)
            {
                var rgobjWine = data.wines;
                if (rgobjWine && rgobjWine.length == 1)
                {
                    var objWine           = rgobjWine[0],
                        purchasedWineHtml = '<span>#<input type="text" value="{0}" class="barcodeFld" rel="{4}"/>&nbsp;&nbsp;{1} {2} ({3}) x {4}</span><br />'.format(
                            objWine.barcode_number,
                            objWine.vintage,
                            objWine.combined_name,
                            objWine.producer,
                            intQty);

                    $('div#detailDialog span#purchasedWineText').append(purchasedWineHtml);
                }
            },

            error: function() {}
        });
    }

    _appendOrderedWineSet(strCode, intQty)
    {
        $.ajax(
        { 
            url: '//anyway-grapes.jp/laravel5.3/public/api/v1/wine-sets/{0}'.format(strCode - 50000),
            dataType: 'json',
            success: function(data)
            {
                var rgobjWineSet = data.wines;
                if (rgobjWineSet && rgobjWineSet.length == 1)
                {
                    var objWineSet        = rgobjWineSet[0],
                        purchasedWineHtml = '<span>#{0}:&nbsp;&nbsp;{1} x {2}</span><br />'.format(
                            objWineSet.id,
                            objWineSet.name,
                            intQty);

                    $('div#detailDialog span#purchasedWineText').append(purchasedWineHtml);
                }
            },

            error: function() {}
        });
    }

    _onShowDetail(strOrderId, self)
    {
        $.ajax(
        {
            url:      'index.php',
            type:     'GET',
            dataType: 'json', 
            data:
            {
                action:   'get',
                order_id: strOrderId
            },

            success: function(rgobjOrder)
            { 
                if (rgobjOrder.length == 1)
                {
                    $('div#contents').hide();

                    var objOrder      = rgobjOrder[0],
                        $detailDialog = $('div#detailDialog');

                    $detailDialog.show();
                    $detailDialog.html(self._generateOrderDetailHtml(objOrder, self));

                    self._registerCloseEvent();
                    self._registerReceiptEvent();
                    self._registerUpdateEvent(self);

                    // Render the list of purchased wines.

                    var rgstrItem = objOrder.contents.split(';'),
                        cItem     = rgstrItem.length;

                    for (var i = 0; i < cItem; ++i)
                    {
                        var rgstrToken = rgstrItem[i].split('#');
                        if (rgstrToken.length === 2)
                        {
                            var qty     = rgstrToken[1],
                                strCode = rgstrToken[0];

                            if ((strCode < 50000) || (strCode >= 100000))
                            {
                                self._appendOrderedWine(strCode, qty);
                            }
                            else
                            {
                                self._appendOrderedWineSet(strCode, qty);
                            }
                        }
                    }
                }
            },

            error: function() {}
        });

        return false;
    }

    _onStatusChange($button, self)
    {
        var $tr      = $button.closest('tr'),
            targetId = $tr.attr('id');

        var intStatus   = 0,
            strButtonId = $button.attr('id');

        if (strButtonId === 'confirmOrderBtn')
        {
            intStatus = 1;
            $.post('send_confirmed_mail.php', { orderId: targetId }, function(data)
            {
                $.post('record_purchased_items.php', { orderId: targetId });
            });
        }
        else if (strButtonId === 'confirmPaymentBtn')
        {
            intStatus = 2;
            $.post('send_payment_confirmation_mail.php', { orderId: targetId }, function(data){});
        }
        else if (strButtonId === 'confirmIssueBtn')
        {
            var strDeliveryDateTime =
                $button.closest('tr').find('td.deliveryDateTime').html();

            if (strDeliveryDateTime === '店頭引き取り')
            {
                intStatus = 3;
            }
            else
            {
                intStatus = 2;

                var inputTrackingId = window.prompt('Please enter the tracking ID.', '0000-0000-0000');
                if (inputTrackingId != null)
                {
                    if ((/^([0-9-]{14})$/.test(inputTrackingId)) && (inputTrackingId != '0000-0000-0000'))
                    {
                        intStatus = 3;
                        $.post('set_tracking_id.php', { orderId: targetId, trackingId: inputTrackingId }, function(data){});
                    }
                    else
                    {
                        alert('Invalid tracking ID!!');
                    }
                }
            }
        }
        else if (strButtonId == 'confirmDeliveryBtn')
        {
	    intStatus = 4;
	    $.post('send_shipped_mail.php', { orderId: targetId }, function(data){});
        }
        else if (strButtonId == 'finalizeOrderBtn')
        {
            intStatus = 5;
            $.post('send_aftercare_mail.php', { orderId: targetId }, function(data){});
        }

        $.ajax(
        {
            url: 'index.php',
            type: 'POST',
            data:
            {
                order_id: targetId,
                action:   'update',
                status:   intStatus
            },
            success: function()
            {
                self.$m_menuTable.html('');
                self._tryLoadOrders();

                return false;
            },

            error: function(xhr, status)
            {
                console.error('The order status of the item (' + targetId + ') could not modified.');
            }
        });
    }

    _onCancelOrder($button)
    {
        var $tableRow = $button.closest('tr');

        $.post('index.php',
        {
            order_id: $tableRow.attr('id'),
            action:   'remove'
        });
        
        $tableRow.remove();
        return false;
    }

    _createMenuTable()
    {
        var $contentsDiv = $('div#contents'),
            tableTag     = new TableTag(),
            tableRow     = new TableRow(),
            self         = this;

        // Bind event handlers.
        $contentsDiv.on('click', 'table a', function() { self._onShowDetail($(this).closest('tr').attr('id'), self) });
        $contentsDiv.on('click', 'button#confirmOrderBtn,button#confirmPaymentBtn,button#confirmIssueBtn,button#confirmDeliveryBtn,button#finalizeOrderBtn', function()
        {
            if (confirm('Are you sure to press [{0}] button?'.format($(this).html())))
            {
                self._onStatusChange($(this), self)
            }
        });

        $contentsDiv.on('click', 'button#cancelOrderBtn', function()
        {
            if (confirm('!!WARNING!! Are you sure to cancel the order?'))
            {
                self._onCancelOrder($(this))
            }
        });

        var hiddenFld = new HiddenField('dbTable', 'orders');
        tableRow.addColumn(new TableColumn('<label class="orderLabel">番号</label>'));
        tableRow.addColumn(new TableColumn('<label class="orderLabel">名前</label>'));
        tableRow.addColumn(new TableColumn(hiddenFld.toHtml()));
        tableTag.head.addRow(tableRow);

        // Adds a table.
        self.$m_menuTable = $(tableTag.toHtml());
        self.$m_menuTable.appendTo($contentsDiv);

        self._tryLoadOrders();
    }

    render()
    {
        document.title = '注文の管理';
        this._createMenuTable();

        // Add admin home link image.
        var imgTag = new ImageTag('//anyway-grapes.jp/images/adminHome.png');
        imgTag.addClass('adminHomeImg');
        $('header').html('<a href="http://sei-ya.jp/admin_home.html">{0}</a>'.format(imgTag.toHtml()));
    }
}

