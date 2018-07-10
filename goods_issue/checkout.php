<?php

$curDirPath = dirname(__FILE__);
require("$curDirPath/../defines.php");
require_once("$curDirPath/../../../restaurant/common.php");

////////////////////////////////////////
// Copied from mysql.inc.php
////////////////////////////////////////
function prepareNextQuery($dbc)
{
    while ($dbc->more_results())
    {
        $dbc->next_result();
        if ($res = $dbc->store_result())
        {
            $res->free(); 
        }
    }
}
////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    if (isset($_POST['code']) && isset($_POST['qty']))
    {
        $barcodeNumber = $_POST['code'];
        $quantity      = $_POST['qty'];

        if (mysqli_query($dbc, "CALL checkout_wine('$barcodeNumber', '$quantity', @fSuccess)") !== FALSE)
        {
            prepareNextQuery($dbc);
            $result = mysqli_query($dbc, 'SELECT @fSuccess');
            if (($result !== FALSE) && (mysqli_num_rows($result) == 1))
            {
                list($fSuccess) = mysqli_fetch_array($result);
                if ($fSuccess == 1)
                {
                    echo 'SUCCESS';
                }

                mysqli_free_result($result);
            }
        }
    }
}

mysqli_close($dbc);

?>
