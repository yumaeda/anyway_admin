<?php

$curDirPath = dirname(__FILE__);
require("$curDirPath/../defines.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['orderId']))
    {
        require_once("$curDirPath/../../../includes/config.inc.php");
        require(MYSQL);

        $orderId = mysqli_real_escape_string($dbc, $_POST['orderId']);

        $result = mysqli_query($dbc, "CALL get_order_contents('$orderId')");
        if ($result !== FALSE)
        {
            if (mysqli_num_rows($result) === 1)
            {
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $cartContents    = $row['contents'];
                $deliverTo       = $row['name'];
                $postCode        = $row['post_code'];
                $prefecture      = $row['prefecture'];
                $shippingAddress = $row['address'];
                $phoneNumber     = $row['phone'];
                $deliveryCompany = $row['delivery_company'];
                $deliveryDate    = $row['delivery_date'];
                $deliveryTime    = $row['delivery_time'];
                $name            = $row['customer_name'];
                $email           = $row['customer_email'];
                $memberDiscount  = $row['member_discount'];
                $shippingFee     = $row['fee'];
                $totalWinePrice  = $row['wine_total'];
                $paymentMethod   = $row['payment_method'];

                // Send a payment confirmation email.
                // ---------------------------------
                $subject      = 'Anyway-Grapes: ご入金確認のお知らせ';
                $orderMail    = 'order@anyway-grapes.jp';
                $archiveEmail = 'archive@anyway-grapes.jp';

                if ($paymentMethod == 2) // 銀行振り込み
                {
                    require_once("$curDirPath/../../../mails/text/payment_confirmed_mail_body.php");
                    require(E_MAIL);
                    sendMailAsPlainText(
                        $email,
                        "$name 様",
                        $orderMail,
                        $archiveEmail,
                        $subject,
                        $textMessage
                    );
                }
                // ---------------------------------
            }

            mysqli_free_result($result);
        }
    }
}

?>
