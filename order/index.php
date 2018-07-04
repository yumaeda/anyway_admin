<?php

$curDirPath = dirname(__FILE__);

// If DB sync is already running, terminate the script.
$dbSyncStatusFilePath = "$curDirPath/../../../syncStatus.txt";
$dbSyncStatus         = file_get_contents($dbSyncStatusFilePath);
if ($dbSyncStatus == '1')
{
    header('Content-type: text/html; charset=utf-8');
    exit('只今同期中です。5分程お待ちください。');
}

$disableSession = TRUE;
require_once('../defines.php');
require('../../../includes/config.inc.php');
require(MYSQL);

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['order_id']) && isset($_POST['action']))
    {
        $action  = $_POST['action'];
        $orderId = $_POST['order_id'];

        if ($action === 'update')
        {
            if (isset($_POST['status']))
            {
                $status = $_POST['status'];
                mysqli_query($dbc, "CALL set_order_status('$orderId', $status)");
            }
        }
        elseif ($action === 'remove') // Checked-out wines will be reverted when the wine DB is sync'ed.
        {
            mysqli_query($dbc, "CALL remove_order('$orderId')");
        }
    }
}
else
{
    if (isset($_GET['action']))
    {
        $result = FALSE;

        $action = $_GET['action'];
        if ($action === 'get')
        {
            $orderId = '00000000-0000000000';
            if (isset($_GET['order_id']))
            {
                $orderId = $_GET['order_id'];
            }

            $result  = mysqli_query($dbc, "CALL get_order_contents('$orderId')");
        }

        if ($result !== FALSE)
        {
            echo generateJsonResponse($result);
            mysqli_free_result($result);
        }
    }
    else
    {
        echo '
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="index.min.css" />
        <script type="text/javascript">

        document.createElement("header");

        </script>
    </head>
    <body>
        <header></header>
        <div id="contents"></div>
        <div id="detailDialog" style="dispaly:hidden;"></div>
    </body>
</html>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="index.min.js?ver=20180110_003"></script>
';
    }
}

?>
