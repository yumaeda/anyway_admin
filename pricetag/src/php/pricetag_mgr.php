<?php

$curDirPath      = dirname(__FILE__);
$definesFilePath = "$curDirPath/../defines.php";
include_once("$curDirPath/common.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $result = mysqli_query($dbc, "CALL shop.get_untagged_wine_codes()");

    if ($result !== FALSE)
    {
        echo convertResultToJson($result);
        mysqli_free_result($result);
    }
}

mysqli_close($dbc);

?>
