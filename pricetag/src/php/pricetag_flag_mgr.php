<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $curDirPath      = dirname(__FILE__);
    $definesFilePath = "$curDirPath/../defines.php";
    include_once("$curDirPath/common.php");

    if (isset($_POST['barcode_number']) &&
        isset($_POST['action']))
    {
        $barcode = mysqli_real_escape_string($dbc, $_POST['barcode_number']);
        $action  = mysqli_real_escape_string($dbc, $_POST['action']);
        if ($action == 'set')
        {
            mysqli_query($dbc, "CALL seiya_anyway.set_printed_flag('$barcode')");
        }
        else
        {
            mysqli_query($dbc, "CALL seiya_anyway.init_printed_flag('$barcode')");
        }
    }
}

?>
