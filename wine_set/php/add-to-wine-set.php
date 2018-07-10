<?php

$disableSession = TRUE;
require_once('../defines.php');
require_once('../../../includes/config.inc.php');
require_once(MYSQL);
require(UTIL);

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $intType      = 0;
    $strName      = mysqli_real_escape_string($dbc, $_POST['set_name']);
    $strComment   = mysqli_real_escape_string($dbc, $_POST['comment']);
    $intSetPrice  = intval($_POST['set_price']);
    $rgstrBarcode = $_POST['barcode'];

    mysqli_query($dbc, "CALL add_wine_set('$strName', $intType, '$strComment', $intSetPrice, @setId)");

    prepareNextQuery($dbc);
    $tmpResult = mysqli_query($dbc, 'SELECT @setId');
    if (($tmpResult !== FALSE) && (mysqli_num_rows($tmpResult) == 1))
    {
        list($setId) = mysqli_fetch_array($tmpResult);
        foreach ($rgstrBarcode as $strBarcode)
        {
            if (!empty($strBarcode))
            {
                prepareNextQuery($dbc);
                mysqli_query($dbc, "CALL add_to_wine_set($setId, '$strBarcode')");

            }
        }

        echo 'SUCCESS';
        mysqli_free_result($tmpResult);
    }
}

mysqli_close($dbc);

?>
