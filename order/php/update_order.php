<?php

$curDirPath = dirname(__FILE__);
require("$curDirPath/../defines.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['order_id'])  &&
        isset($_POST['delivery_date']) &&
        isset($_POST['delivery_time']) &&
        isset($_POST['order_contents'])&&
        isset($_POST['wine_total']))
    {
        require_once("$curDirPath/../../../includes/config.inc.php");
        require(MYSQL);

        $orderId        = mysqli_real_escape_string ($dbc, $_POST['order_id']);
        $paymentMethod  = intval(mysqli_real_escape_string ($dbc, $_POST['payment_method']));
        $deliveryDate   = mysqli_real_escape_string ($dbc, $_POST['delivery_date']);
        $deliveryTime   = mysqli_real_escape_string ($dbc, $_POST['delivery_time']);
        $orderContents  = mysqli_real_escape_string ($dbc, $_POST['order_contents']);
        $wineTotal      = mysqli_real_escape_string ($dbc, $_POST['wine_total']);
        $transactionId  = mysqli_real_escape_string ($dbc, $_POST['transaction_id']);
        $transactionId2 = mysqli_real_escape_string ($dbc, $_POST['transaction_id2']);

        if (strlen($transactionId) !== 14)
        {
            $transactionId = '0000-0000-0000';
        }

        if (strlen($transactionId2) !== 14)
        {
            $transactionId2 = '0000-0000-0000';
        }

        if (mysqli_query($dbc, "CALL set_shipping_datetime('$orderId', '$deliveryDate', '$deliveryTime')") !== FALSE)
        {
            prepareNextQuery($dbc);
            if (mysqli_query($dbc, "CALL set_payment_method('$orderId', $paymentMethod)") !== FALSE)
            {
                prepareNextQuery($dbc);
                if (mysqli_query($dbc, "CALL set_order_contents('$orderId', '$orderContents', $wineTotal, '$transactionId', '$transactionId2')") !== FALSE)
                {
                    echo 'SUCCESS';
                }
            }
        }

        mysqli_close($dbc);
    }
}

?>
