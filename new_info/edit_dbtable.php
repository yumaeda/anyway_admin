<?php

header('Content-Type: text/html;charset=utf-8');

$curDirPath = dirname(__FILE__);

ob_start();
require_once("$curDirPath/defines.php");
require_once("$curDirPath/dbutils.php");
require_once("$curDirPath/imgutils.php");
ob_get_clean();

if ($_SERVER["REQUEST_METHOD"] != "POST")
{
    die(METHOD_ERR_MSG);
}

$id       = $_POST["id"];
$dbTable  = $_POST["dbTable"];
$dir      = $_POST["dir"];
$rgobjCol = getPostedColumnKeyValues();

// TODO yumaeda: Need to properly encode space in the file name.
if ($dir)
{
    $uploadedFile = $_FILES["uploadedFile"];
    if (!$id)
    {
        if ($uploadedFile && savePhotoAndThumbnail($uploadedFile, $dir))
        {
            $rgobjCol["filename"] = stripslashes($uploadedFile["name"]);
        }
    }
    else
    {
        renameImage($_POST["prevFileName"], $_POST["filename"], $dir);
    }
}

$mysqli = connectToMySql();
$insertAfter = $rgobjCol["sort_order"];
if ($insertAfter > 0)
{
    incrementSortOrder($dbTable, $insertAfter);
}
else
{
    $rgobjCol["sort_order"] =
        getMaxIntFieldValue($mysqli, $dbTable, "sort_order") + 1;
}

$query = generateUpdateTableQuery($dbTable, $rgobjCol, $id);
if ($mysqli->query($query))
{
    echo("<script>window.close();</script>");
}
else
{
    echo mysqli_error($mysqli);
}

$mysqli->close();

?>

