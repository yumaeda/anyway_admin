<?php

$curDirPath = dirname(__FILE__);
require("$curDirPath/../defines.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['orderId']))
    {
        require_once("$curDirPath/../../../includes/config.inc.php");
        require(MYSQL);

        $orderId = mysqli_real_escape_string ($dbc, $_POST['orderId']);

        $result = mysqli_query($dbc, "CALL get_order_contents('$orderId')");
        if ($result !== FALSE)
        {
            if (mysqli_num_rows($result) === 1)
            {
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $deliverTo = $row['name'];
                if ($deliverTo !== '店頭引き取り')
		{
		    $cartContents    = $row['contents'];
		    $trackingId      = $row['transaction_id'];
		    $trackingId2     = $row['transaction_id2'];
		    $postCode        = $row['post_code'];
		    $prefecture      = $row['prefecture'];
		    $shippingAddress = $row['address'];
		    $phoneNumber     = $row['phone'];
		    $deliveryCompany = $row['delivery_company'];
		    $deliveryDate    = $row['delivery_date'];
		    $deliveryTime    = $row['delivery_time'];
		    $name            = $row['customer_name'];
		    $email           = $row['customer_email'];
		    $orderMail       = 'order@anyway-grapes.jp';

		    require_once("$curDirPath/../../../mails/text/aftercare_mail_body.php");
		    require(E_MAIL);
		    sendMailAsPlainText(
			$email,
			"$name 様",
			$orderMail,
			$orderMail,
			'Anyway-Grapes: ご利用頂きありがとうございました',
			$textMessage
		    );
		}
            }

            mysqli_free_result($result);
        }
    }
}

?>
