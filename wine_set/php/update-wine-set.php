<?php

$disableSession = TRUE;
require_once('../defines.php');
require_once('../../../includes/config.inc.php');
require_once(MYSQL);
require(UTIL);

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $intType      = 0;
    $intId        = intval($_POST['set_id']);
    $strName      = mysqli_real_escape_string($dbc, $_POST['set_name']);
    $strComment   = mysqli_real_escape_string($dbc, $_POST['comment']);
    $intSetPrice  = intval($_POST['set_price']);
    $rgstrBarcode = $_POST['barcode'];

    if (mysqli_query($dbc, "CALL update_wine_set($intId, '$strName', $intType, '$strComment', $intSetPrice)") !== FALSE)
    {
        prepareNextQuery($dbc);

        if (mysqli_query($dbc, "CALL remove_from_wine_set($intId, '000000')") !== FALSE)
        {
            foreach ($rgstrBarcode as $strBarcode)
            {
                if (!empty($strBarcode))
                {
                    prepareNextQuery($dbc);
                    mysqli_query($dbc, "CALL add_to_wine_set($intId, '$strBarcode')");
                }
            }

            echo 'SUCCESS';
        }
    }
}

mysqli_close($dbc);

?>
