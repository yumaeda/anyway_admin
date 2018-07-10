<?php

$disableSession = TRUE;
require_once('../defines.php');
require_once('../../../includes/config.inc.php');
require_once(MYSQL);
require(UTIL);

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $intId = mysqli_real_escape_string($dbc, $_POST['id']);

    if (mysqli_query($dbc, "CALL remove_wine_set($intId)") !== FALSE)
    {
        prepareNextQuery($dbc);
        if (mysqli_query($dbc, "CALL remove_wine_set($intId, '000000')") !== FALSE)
        {
            echo 'SUCCESS';
        }
    }
}

mysqli_close($dbc);

?>
