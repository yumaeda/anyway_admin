<?php

$curDirPath = dirname(__FILE__);

require_once("../../../../includes/dbreader.php");
require_once("$curDirPath/defines.php");
require_once("$curDirPath/dbutils.php");
require_once("$curDirPath/imgutils.php");

if ($_SERVER["REQUEST_METHOD"] != "POST")
{
    die("Invalid request method.");
}

$id       = $_POST["id"];
$strTable = $_POST["dbTable"];

if (!$id || !$strTable)
{
    die(URL_QUERY_ERR_MSG);
}

// Special handling for the Photo table.
$result = executeSelectQuery(null, $strTable, null, "id=$id", null);
if (($result !== FALSE) && (mysqli_num_rows($result) === 1))
{
    $row = mysqli_fetch_assoc($result);

    // TODO: Need to figure out the proper encoding for json.
    $dir      = htmlspecialchars(stripslashes($row["dir"]));
    $fileName = htmlspecialchars(stripslashes($row["filename"]));

    mysqli_free_result($result);
}
else
{
    die("Specified ID doesn't exist.");
}

if (execDBQuery(generateDeleteQuery($strTable, $id)))
{
    echo("Specified item was deleted.");

    if ($dir && $fileName)
    {
        // Remove the specified photo from the server.
        unlink(generateFilePath($dir, $fileName));
        unlink(generateFilePath($dir, getThumbnailName($fileName)));
    }
}

?>
