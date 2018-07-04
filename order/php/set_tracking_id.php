<?php

$curDirPath = dirname(__FILE__);
require("$curDirPath/../defines.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['orderId']) && isset($_POST['trackingId']))
    {
        require_once("$curDirPath/../../../includes/config.inc.php");
        require(MYSQL);

        $orderId    = mysqli_real_escape_string ($dbc, $_POST['orderId']);
        $trackingId = mysqli_real_escape_string ($dbc, $_POST['trackingId']);

        mysqli_query($dbc, "CALL set_tracking_id('$orderId', '$trackingId')");
    }
}

?>
