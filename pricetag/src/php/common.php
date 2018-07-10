<?php

function convertRowsToJson($rows)
{
    $strJson = json_encode($rows);
    if (isset($_GET['xDomainCallback']))
    {
        $callback = $_GET['xDomainCallback'];
        $strJson  = "$callback($strJson)";
    }

    return $strJson;
}

function convertResultToJson($queryResult)
{
    $rows = array();
    while ($row = mysqli_fetch_assoc($queryResult))
    {
        $rows[] = $row;
    }

    return convertRowsToJson($rows);
}

$curDirPath = dirname(__FILE__);
if (!isset($definesFilePath))
{
    $definesFilePath = "$curDirPath/../../includes/defines.php";
}

// Include the definition file.
require_once($definesFilePath);

// MySQL DB Initialization
$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if (mysqli_connect_errno())
{
    printf("MySQL Connection Error: %s\n", mysqli_connect_error());
    exit();
}

mysqli_set_charset($dbc, 'utf8');
