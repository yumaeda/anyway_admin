<?php

$strName    = '';
$message    = '';
$rgstrError = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    require_once('../../../includes/config.inc.php');
    require_once(MYSQL);
    require(UTIL);

    if (isset($_POST['customer-name']) && (strlen($_POST['customer-name']) > 0))
    {
        $strName        = mysqli_real_escape_string($dbc, $_POST['customer-name']);
        $strPhonetic    = mysqli_real_escape_string($dbc, $_POST['name-phonetic']);
        $strEmail       = isset($_POST['email'])        ? mysqli_real_escape_string($dbc, $_POST['email'])        : 'info@sei-ya.jp';
        $strPhoneNumber = isset($_POST['phone-number']) ? mysqli_real_escape_string($dbc, $_POST['phone-number']) : '03-6413-9737';
        $strPostCode    = isset($_POST['post-code'])    ? mysqli_real_escape_string($dbc, $_POST['post-code'])    : '000-0000';
        $strPrefecture  = isset($_POST['prefecture'])   ? mysqli_real_escape_string($dbc, $_POST['prefecture'])   : '東京都';
        $strAddress     = isset($_POST['address'])      ? mysqli_real_escape_string($dbc, $_POST['address'])      : 'Anyway-Grapes';
        $intPreorder    = isset($_POST['preorder'])     ? intval($_POST['preorder']) : 0;
        $intCool        = isset($_POST['refrigerated']) ? intval($_POST['refrigerated']) : 0;
        $intShippingFee = ($intCool == 1) ? 300 : 0;
        
        if (isset($_POST['strReserveWines']) && isset($_POST['totalPrice']))
        {
            $strReserveWines =
                mysqli_real_escape_string($dbc, $_POST['strReserveWines']);

            $totalPrice =
                mysqli_real_escape_string($dbc, $_POST['totalPrice']);

            if ((strlen($strReserveWines) > 5) && ($totalPrice > 0))
            {
                $strReservationName = '予約分（' . $strName . '様）';
                if ($intPreorder)
                {
                    $strReservationName = $strName;
                }

                $result  =
                    mysqli_query($dbc, "CALL add_shipping('$strEmail', '$strReservationName', 'xxx', '$strPostCode', '$strPrefecture', '$strAddress', '$strPhoneNumber', 'ヤマト運輸', '指定なし', '指定なし', $intCool, '', $intShippingFee, @shippingId)");
                if ($result !== FALSE)
                {
                    prepareNextQuery($dbc);
                    $result = mysqli_query($dbc, 'SELECT @shippingId');
                    if (($result !== FALSE) && (mysqli_num_rows($result) == 1))
                    {
                        $orderId          = generateReservationId();
                        list($shippingId) = mysqli_fetch_array($result);
                        mysqli_free_result($result);

                        prepareNextQuery($dbc);
                        if (mysqli_query($dbc, "CALL add_order('$orderId', $shippingId, '$strReserveWines', 1, 0, 1, $totalPrice)") !== FALSE)
                        {
                            $strFullAddress = "$strPostCode$strPrefecture$strAddress";
                            prepareNextQuery($dbc);
                            $result = mysqli_query($dbc, "CALL set_customer_info('$orderId', '$strReservationName', '$strPhonetic', '$strEmail', '$strFullAddress', '$strPhoneNumber', '127.0.0.1', '127.0.0.1', 'N/A')");
                            if ($result !== FALSE)
                            {
                                $message = "$strName 様の予約分のワインを登録しました。<br /><br />";
                            }
                        }
                    }
                }
            }
            else
            {
                $rgstrError['strReserveWines'] = '予約するワインを入力して下さい。';
            }
        }
    }
    else
    {
        $rgstrError['customer-name'] = 'お客様の名前を入力して下さい。';
    }

    mysqli_close($dbc);
}

    echo '
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <title>Making a Reservation</title>
        <style>

        h1
        {
            font-size: 16px;
            color: rgb(80, 80, 80);
        }

        </style>
        <link rel="stylesheet" type="text/css" href="index.min.css" />
    </head>
    <body>';

    if ((strlen($message)) > 0)
    {
        echo $message . '
            <br /><br />
            <a href="http://anyway-grapes.jp/wines/admin/order/index.php">予約ワインを確認する。</a><br /> 
            <a href="http://anyway-grapes.jp/wines/admin/reservation/index.php">次の予約ワインを登録する。</a>';
    }
    else
    {
        echo '
        <form action="./index.php" method="POST">
            <input type="hidden" name="strReserveWines" />
            <input type="hidden" name="totalPrice" value="0" />
            <h1>Making a Researvation</h1>
            <table>
                <tr>
                    <td>Mr. / Ms. <span style="color:red;font-size:14px;">*</span></td>
                    <td><input id="nameFld" name="customer-name" type="text" value="' . $strName . '" />&nbsp;&nbsp;(例) 山田太郎</td>
                </tr>
                <tr>
                    <td>Phonetic:</td>
                    <td><input name="name-phonetic" type="text" value="' . $strPhonetic . '" />&nbsp;&nbsp;(例) やまだたろう</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td><input name="email" type="text" value="' . $strEmail . '" />&nbsp;&nbsp;(例) taro_yamada@sei-ya.jp</td>
                </tr>
                <tr>
                    <td>Tel:</td>
                    <td><input name="phone-number" type="text" value="' . $strPhoneNumber . '" />&nbsp;&nbsp;(例) 03-6413-9737</td>
                </tr>
                <tr>
                    <td>Post Code:</td>
                    <td><input name="post-code" type="text" value="' . $strPostCode . '" />&nbsp;&nbsp;(例) 156-0052</td>
                </tr>
                <tr>
                    <td>Prefecture:</td>
                    <td><input name="prefecture" type="text" value="' . $strPrefecture. '" />&nbsp;&nbsp;(例) 東京都</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td><input name="address" type="text" value="' . $strAddress . '" />&nbsp;&nbsp;(例) 世田谷区経堂2-13-1-B1</td>
                </tr>
                <tr>
                    <td>Pre-order:</td>
                    <td><input name="preorder" type="checkbox" value="1" /></td>
                </tr>
                <tr>
                    <td>Cool:</td>
                    <td><input name="refrigerated" type="checkbox" value="1" /></td>
                </tr>
            </table>
        ';

        if (array_key_exists('customer-name', $rgstrError))
        {
            echo '<br /><span style="color:red">' . $rgstrError['customer-name'] . '</span>';
        }

        echo '
                <br />
                <hr />
                <br />
                <div id="contentsPane"></div>';

        if (array_key_exists('strReserveWines', $rgstrError))
        {
            echo '<span style="color:red">' . $rgstrError['strReserveWines'] . '</span><br /><br />';
        }

        echo '
                <input type="submit" value="Reserve" />
            </form>';
    }

    echo '
    </body>
</html>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="./index.min.js?ver=20171224_001"></script>';

?>
