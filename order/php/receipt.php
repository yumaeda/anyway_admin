<?php

$disableSession = TRUE;
require_once('../defines.php');
require('../../../includes/config.inc.php');
require(MYSQL);

function getOrderedDate($orderId)
{
    $strDate = '';
    if (strlen($orderId) === 19)
    {
        $strDate = explode('-', $orderId)[0];
        $strDate = substr($strDate, 0, 4) . '/' . substr($strDate, 4, 2) . '/' . substr($strDate, 6, 2);
    }

    return $strDate;
}

function getCoolFee($row)
{
    $fCool      = ($row['refrigerated'] == 1);
    $cMaxBottle = (($row['delivery_company'] == 'ヤマト運輸') ? 8 : 12);
    $intFee     = ($row['refrigerated'] == 1) ? 300 : 0;

    $cItem     = 0;
    $rgstrItem = explode(';', trim($row['contents'], ';'));
    foreach ($rgstrItem as $strItem)
    {
        $rgToken = explode('#', $strItem);
        $cItem += intval($rgToken[1]);
    }

    return ($intFee * ceil($cItem / $cMaxBottle));
}

function getShippingFee($row)
{
    return ($row['fee'] - getCoolFee($row));
}

function isHappyBox($orderContents)
{
    $iDiscountCode = strrpos($orderContents, ';1000#');
    return ($iDiscountCode !== FALSE);
}

function renderReceipt($row)
{
    $orderId        = $row['order_id'];
    $orderDate      = getOrderedDate($orderId);
    $paymentMethod  = 'Credit Card';
    $intShippingFee = getShippingFee($row);
    $intCoolFee     = getCoolFee($row);
    $total          = $row['wine_total'] + $intShippingFee + $intCoolFee;
    $tax            = floor($total * 0.08);
    $grandTotal     = number_format($total + $tax);
    $memberDiscount = $row['member_discount'];

    if ($row['payment_method'] == 0)
    {
        $paymentMethod = 'TBD';
    }
    else if ($row['payment_method'] == 2)
    {
        $paymentMethod = '銀行振込み';
    }

    echo "
<table>
    <thead>
        <tr>
            <td colspan=\"3\" class=\"titleCol\">Receipt</td>
            <td class=\"dateCol\">
                <span class=\"smallLabel\">DATE</span>
                <br />
                $orderDate
            </td>
            <td class=\"paidAmountCol\">
                <span class=\"smallLabel\">PAID AMOUNT</span>
                <br />
                $grandTotal
            </td>
            <td colspan=\"2\" class=\"orderIdCol\">
                <span class=\"smallLabel\">ORDER NUMBER</span>
                <br />
                $orderId
            </td>
        </tr>
        <tr class=\"label\">
            <td class=\"leftAlignedCol codeCol\">Code</td>
            <td>Description (Wine Brand)</td>
            <td class=\"vintageCol\">Vintage</td>
            <td>Producer</td>
            <td class=\"qtyCol\">Qty</td>
            <td class=\"unitPriceCol\">Unit Price</td>
            <td class=\"amountCol\">Amount</td>
        </tr>
    </thead>
    <tbody>
";

    $fHappyBox = isHappyBox($row['contents']);
    $rgstrItem = explode(';', $row['contents']);
    for ($i = 0; $i < count($rgstrItem); ++$i)
    {
        $rgstrToken = explode('#', $rgstrItem[$i]);
        if (count($rgstrToken) == 2)
        {
            $barcode = $rgstrToken[0];
            $qty     = $rgstrToken[1];

            global $dbc;
            prepareNextQuery($dbc);

            if (($barcode < 50000) || ($barcode >= 100000))
            {
                if ($barcode == 1000)
                {
echo "
        <tr>
            <td class=\"leftAlignedCol\">$barcode</td>
            <td class=\"leftAlignedCol descriptionCol\">割引</td>
            <td class=\"vintageCol\">&nbsp;</td>
            <td>&nbsp;</td>
            <td class=\"qtyCol\">1</td>
            <td class=\"unitPriceCol\">" . number_format(-1 * $qty) . "</td>
            <td class=\"amountCol\">" . number_format(-1 * $qty) . "</td>
        </tr>
    ";
                }
                else
                {
                    $wineResult = ($barcode >= 100000) ?
                        mysqli_query($dbc, "CALL get_preorder_wine($barcode)") :
                        mysqli_query($dbc, "CALL get_wine('$barcode')");

                    if ($wineResult !== FALSE)
                    {
                        if (mysqli_num_rows($wineResult) == 1)
                        {
                            $wineRow  = mysqli_fetch_array($wineResult, MYSQLI_ASSOC);
                            $vintage  = $wineRow['vintage'];
                            $producer = $wineRow['producer'];
                            $name     = $wineRow['combined_name'];
                            $jpnName  = isset($wineRow['combined_name_jpn']) ? $wineRow['combined_name_jpn'] : '';
                            $price    = $wineRow['price'];

                            if (!$fHappyBox)
                            {
                                $price = $wineRow['price'];

                                if (($memberDiscount == 1) || ($memberDiscount == 4))
                                {
                                    $price = $wineRow['member_price'];
                                }

                                if (($memberDiscount == 3) || ($memberDiscount == 4))
                                {
                                    if ($wineRow['etc'] == 'Special Offer')
                                    {
                                        $price = floor($wineRow['price'] * 0.7);
                                    }
                                }
                            }

                            $amount = $price * $qty;

echo "
            <tr>
                <td class=\"leftAlignedCol\">$barcode</td>
                <td class=\"leftAlignedCol descriptionCol\">$name</td>
                <td class=\"vintageCol\">$vintage</td>
                <td>$producer</td>
                <td class=\"qtyCol\">$qty</td>
                <td class=\"unitPriceCol\">" . number_format($price) . "</td>
                <td class=\"amountCol\">" . number_format($amount) . "</td>
            </tr>
            <tr class=\"jpnRow\">
                <td>&nbsp;</td>
                <td colspan=\"6\" class=\"leftAlignedCol\">$jpnName</td>
            </tr>";
                        }

                        mysqli_free_result($wineResult);
                    }
                }
            }
            else // Wine set
            {
                $setId = $barcode - 50000;

                $wineResult = mysqli_query($dbc, "CALL get_wine_set($setId)");
                if ($wineResult !== FALSE)
                {
                    if (mysqli_num_rows($wineResult) == 1)
                    {
                        $wineRow  = mysqli_fetch_array($wineResult, MYSQLI_ASSOC);
                        $name     = $wineRow['name'];
                        $price    = $wineRow['set_price'];
                        $amount   = ($price * $qty);
echo "
        <tr>
            <td class=\"leftAlignedCol\">$barcode</td>
            <td class=\"leftAlignedCol descriptionCol setTitleCol\">$name</td>
            <td class=\"vintageCol\">S.A.</td>
            <td>N/A</td>
            <td class=\"qtyCol\">$qty</td>
            <td class=\"unitPriceCol\">" . number_format($price) . "</td>
            <td class=\"amountCol\">" . number_format($amount) . "</td>
        </tr>
        <tr class=\"jpnRow\">
            <td colspan=\"7\">&nbsp;</td>
        </tr>
";
                    }

                    mysqli_free_result($wineResult);
                }
            }
        }
    }

echo "
    </tbody>
    <tfoot>
        <tr>
            <td>&nbsp;</td>
            <td class=\"leftAlignedCol label\">Cool</td>
            <td class=\"vintageCol rightAlignedCol\">" . number_format($intCoolFee) . "</td>
            <td>&nbsp;</td>
            <td class=\"leftAlignedCol qtyCol label\">Tax</td>
            <td>&nbsp;</td>
            <td class=\"rightAlignedCol amountCol\">" . number_format($tax) . "</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td class=\"leftAlignedCol label\">Shipping Fee</td>
            <td class=\"vintageCol rightAlignedCol\">" . number_format($intShippingFee) . "</td>
            <td>&nbsp;</td>
            <td class=\"leftAlignedCol qtyCol label\">Total</td>
            <td>&nbsp;</td>
            <td class=\"rightAlignedCol amountCol\">" . $grandTotal . "</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td class=\"leftAlignedCol qtyCol label\">Payment Method</td>
            <td>&nbsp;</td>
            <td class=\"rightAlignedCol amountCol\">$paymentMethod</td>
        </tr>
    </tfoot>
</table>
";
}


if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    if (isset($_GET['order_id']))
    {
        $orderId = mysqli_real_escape_string($dbc, $_GET['order_id']);

        echo "
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv=\"Content-type\" content=\"text/html;charset=UTF-8\" />
        <title>$orderId</title>
        <style>

        *
        {
            margin: 0;
            padding: 0;
        }

        body
        {
            font-family: 'HelveticaNeue-Thin';
            font-size: 10px;

            margin: 10px;
        }

        div.customerNamePane
        {
            font-size: 15px;
            text-align: left;

            float: left;
            padding-top: 25px;
        }

        div.logoPane
        {
            text-align: right;
            margin-bottom: 10px;
        }

        img
        {
            width: 100px;
            vertical-align: middle
        }

        table
        {
            color: black;
            background-color: white;

            width: 100%;

            border-collapse: collapse;
        }

        td
        {
            text-align: center;
        }

        thead tr:nth-child(2) > td
        {
            padding-top: 15px;
        }

        tbody tr:first-child > td
        {
            padding-top: 15px;
        }

        tfoot tr:first-child > td
        {
            padding-top: 15px;
        }

        tr.jpnRow
        {
            font-size: 6px;
            font-family: '小塚ゴシック Pro EL';
        }

        tr.jpnRow > td
        {
            padding-bottom: 5px;
        }

        td.titleCol
        {
            font-size: 22px;

            text-align: left;
        }

        td.setTitleCol
        {
            font-family: '小塚ゴシック Pro EL';
        }

        td.paidAmountCol
        {
            color: white;
            background-color: rgb(120, 120, 130);

            border: 1px solid rgb(80, 80, 80);
            font-size: 18px;
        }

        td.dateCol, td.orderIdCol
        {
            border: 1px solid rgb(80, 80, 80);
            font-size: 12px;
        }

        td.leftAlignedCol
        {
            text-align: left;
        }

        td.rightAlignedCol
        {
            text-align: right;
        }

        td.codeCol
        {
            width: 35px;
        }

        td.descriptionCol
        {
            width: 33%;
        }

        td.vintageCol
        {
            width: 40px;
        }

        td.qtyCol
        {
            width: 85px;
        }

        td.unitPriceCol
        {
            width: 70px;
        }

        td.amountCol
        {
            width: 70px;
        }

        .label
        {
            font-size: 11p
        }

        span.smallLabel
        {
            font-size: 6px;
        }

        div#footer
        {
            position: absolute;
            top: 900px;

            width: 100%;
            text-align: center;

            font-size: 10px;
            font-family: '小塚ゴシック Pro EL';
        }

        </style>
    </head>
    <body>";

        $result  = mysqli_query($dbc, "CALL get_order_contents('$orderId')");
        if (($result !== FALSE) && (mysqli_num_rows($result) == 1))
        {
            $row          = mysqli_fetch_array($result, MYSQLI_ASSOC);
            $customerName = $row['customer_name'];

echo "
        <div class=\"customerNamePane\">
            $customerName 様<br />
        </div>
        <div class=\"logoPane\">
            <img src=\"../../../images/logo.png\" /><br />
        </div>
";

            renderReceipt($row);
            mysqli_free_result($result);

echo "
        <div id=\"footer\">
            <p style=\"color:red;font-size:14px;\">※ ヴィンテージワイン（特に赤ワイン）は到着後、澱が舞っている場合がございます。<br />
            最低一週間はワインを休ませてからお飲みください。
            </p>
            <br /><br />
            有限会社&nbsp;誠屋&nbsp;&nbsp;Anyway-Grapes&nbsp;&nbsp;156-0052&nbsp;東京都&nbsp;世田谷区&nbsp;経堂&nbsp; 2-13-1&nbsp;B1&nbsp;&nbsp;Tel:03.6413.9737&nbsp;&nbsp;Fax:03.6413.9736
        </div>";
        }

echo "
    </body>
</html>";
    }
}

mysqli_close($dbc);

?>
