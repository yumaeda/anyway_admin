<?php

require_once("dbTables.php");
require_once("defines.php");

$dbCols = array(
    "aoc"             => "VARCHAR(300) NOT NULL",
    "jpn_aoc"         => "VARCHAR(1000) NOT NULL",
    "color"           => "INTEGER NOT NULL",
    "int_country"     => "INTEGER NOT NULL",
    "sort_order"      => "INTEGER NOT NULL",
    "general_region"  => "INTEGER NOT NULL",
    "aoc_order"       => "INTEGER NOT NULL",

    "tokkuri_price"   => "INTEGER NOT NULL",

    "category"        => "INTEGER NOT NULL",
    "bottling_method" => "VARCHAR(50) NULL",
    "manipulant"      => "INTEGER DEFAULT 0",
    "loc_producer"    => "VARCHAR(1000) NOT NULL",
    "mono_vintage"    => "BOOLEAN NOT NULL DEFAULT 0",
    "loc_name"        => "VARCHAR(1000) NOT NULL",
    "daily"           => "BOOLEAN NOT NULL DEFAULT 0",
    "market_price"    => "BOOLEAN NOT NULL DEFAULT 0",

    "ingredient"      => "VARCHAR(1000) NOT NULL",
    "romaji_name"     => "VARCHAR(300) NOT NULL",
    "hiragana_name"   => "VARCHAR(1000) NOT NULL",

    "alcohol"         => "VARCHAR(1000) NOT NULL",
    "volume"          => "INTEGER NOT NULL",

    "filename"        => "VARCHAR(300) NOT NULL",
    "dir"             => "VARCHAR(1000) NOT NULL",

    "rose"            => "BOOLEAN NOT NULL DEFAULT 0",
    "quantity"        => "INTEGER NOT NULL",
    "monthly"         => "BOOLEAN NOT NULL DEFAULT 0",

    "address"         => "VARCHAR(1000)",
    "tel"             => "VARCHAR(20)",
    "email"           => "VARCHAR(300)",

    "order_id"        => "VARCHAR(30) NOT NULL",
    "customer_id"     => "INTEGER UNSIGNED NOT NULL",
    "delivery_date"   => "VARCHAR(30) NOT NULL",
    "delivery_time"   => "VARCHAR(30) NOT NULL",
    "refrigerated"    => "BOOLEAN NOT NULL DEFAULT 1",
    "date_created"    => "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
    "url"             => "VARCHAR(1000)",
    "status"          => "TINYINT UNSIGNED NOT NULL",
    "payment_method"  => "VARCHAR(30) NOT NULL",

    "postCode"        => "VARCHAR(8) NOT NULL",
    "prefecture"      => "VARCHAR(10) NOT NULL",
    "orderDetail"     => "VARCHAR(10000) NOT NULL",

    "phonetic"        => "VARCHAR(300) NOT NULL",
    "year"            => "INTEGER NOT NULL DEFAULT 1900",
    "month"           => "INTEGER NOT NULL DEFAULT 1",
    "date"            => "INTEGER NOT NULL DEFAULT 1",
    "description"     => "VARCHAR(2000)",

    // Used by mitsugetsu_profiles and ofuro_profiles.
    "position"        => "VARCHAR(300) NOT NULL",
    "career_history"  => "VARCHAR(10000) NOT NULL",
    "favorite"        => "VARCHAR(300) NOT NULL",

    // [wines]
    "availability"       => "VARCHAR(50)",
    "barcode_number"     => "VARCHAR(6)",
    "price"              => "INTEGER NOT NULL DEFAULT 0",
    "net_price"          => "INTEGER NOT NULL DEFAULT 0",
    "member_price"       => "INTEGER NOT NULL DEFAULT 0",
    "cepage"             => "VARCHAR(1000) NOT NULL",
    "store_price"        => "INTEGER NOT NULL DEFAULT 0",
    "glass_price"        => "INTEGER NOT NULL DEFAULT 0",
    "rating"             => "VARCHAR(250)",
    "rating_jpn"         => "VARCHAR(750)",
    "cultivation_method" => "VARCHAR(30)",
    "stock"              => "INTEGER UNSIGNED NOT NULL DEFAULT 0",
    "importer"           => "VARCHAR(300) COLLATE utf8_unicode_ci",
    "type"               => "VARCHAR(30)",
    "country"            => "VARCHAR(30)",
    "producer"           => "VARCHAR(300) COLLATE utf8_unicode_ci",
    "producer_jpn"       => "VARCHAR(1000) COLLATE utf8_unicode_ci",
    "vintage"            => "VARCHAR(50)",
    "village"            => "VARCHAR(500)",
    "village_jpn"        => "VARCHAR(1500)",
    "district"           => "VARCHAR(500)",
    "district_jpn"       => "VARCHAR(1500)",
    "region"             => "VARCHAR(500)",
    "region_jpn"         => "VARCHAR(1500)",
    "apply"              => "VARCHAR(50)",
    "etc"                => "VARCHAR(50)",
    "comment"            => "VARCHAR(2000)",
    "name"               => "VARCHAR(300) NOT NULL",
    "name_jpn"           => "VARCHAR(1000)",
    "point"              => "VARCHAR(3000)",
    "catch_copy"         => "VARCHAR(1000)",
    "combined_name"      => "VARCHAR(1000)",
    "combined_name_jpn"  => "VARCHAR(3000)",
    "wholesale_price"    => "INTEGER NOT NULL DEFAULT 0",
    "capacity"           => "INTEGER NOT NULL DEFAULT 0",
    "capacity1"          => "INTEGER NOT NULL DEFAULT 0",
    "capacity2"          => "INTEGER NOT NULL DEFAULT 0",
    "capacity3"          => "INTEGER NOT NULL DEFAULT 0",
    "capacity4"          => "INTEGER NOT NULL DEFAULT 0",

    // [ofuro_recommended_wines]
    "page_number"     => "INTEGER NOT NULL DEFAULT 0",
    "item_number"     => "INTEGER NOT NULL DEFAULT 0",

    // [stock_records]
    "stock_date"      => "DATE",

    // [preorder_wines]
    "initial_stock"   => "INTEGER UNSIGNED NOT NULL DEFAULT 0",

    // [price_tags]
    "is_printed" => "BOOLEAN NOT NULL DEFAULT 0"
);


function createTable($strTable, $rgstrColumn, $keyColName)
{
    global $dbCols;

    $query = "CREATE TABLE $strTable (";
    if ($keyColName == "id")
    {
        $query .= "id INTEGER AUTO_INCREMENT NOT NULL,";
    }

    foreach ($rgstrColumn as $strColumn)
    {
        $query .= $strColumn . " " . $GLOBALS["dbCols"][$strColumn] . ", ";
    }

    $query .= "PRIMARY KEY($keyColName)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    if (execDBQuery($query))
    {
        echo("$strTable was created.");
    }
    else
    {
        echo("Failed to create $strTable!");
    }
}


function dropTable($tableName)
{
    $mysqli = connectToMySql();

    if ($mysqli->query("DROP TABLE IF EXISTS $tableName;") !== FALSE)
    {
        echo("$tableName was dropped.");
    }
    else
    {
        echo("Failed to drop $tableName.");
    }

    $mysqli->close();
}

function dropTableForCurrentDB($mysqli, $tableName)
{
    return $mysqli->query("DROP TABLE IF EXISTS $tableName;");
}


function getLineBreakString()
{
    // The newline char for the CSV, which is edited by Mac Vim is set to '\n'.
    return ((strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') ? "\r\n" : "\n");
}


function importCsv($filePath, &$rgrgstrDBTableColumn, $keyColName)
{
    $file = fopen("$filePath", "r");
    if ($file)
    { 
        $newline  = getLineBreakString();
        $rgstrRow = explode($newline, fread($file, filesize($filePath)));

        fclose($file);
    }

    // NOTE: Parsing fails if whitespace is inserted between CSV columns.
    $separator = "\",\"";

    // Exclude the first line (column names)
    $cLine = count($rgstrRow) - 1;

    // Trim extra double quotes from the first and last column name.
    $rgstrColName = explode($separator, $rgstrRow[0]);
    $rgstrColName[0] = ltrim($rgstrColName[0], "\"");
    $rgstrColName[count($rgstrColName) - 1] = rtrim($rgstrColName[count($rgstrColName) - 1], "\"");

    // Generate DB table name from the CSV file name.
    $iLastSlash = strrpos($filePath, "/");
    $fileName = substr($filePath, $iLastSlash + 1);
    $tableName = str_replace(".csv", "", $fileName);

    global $tmpDbTables;
    $rgrgstrDBTableColumn[$tableName] = $rgstrColName;

    dropTable($tableName);
    createTable($tableName, $rgstrColName, $keyColName);

    $fFailed = FALSE;
    $mysqli = connectToMySql();

    for ($i = 1; $i < $cLine; ++$i)
    {
        $j = 0;
        $rgobjCol = array();

        $rgstrColValue = explode($separator, $rgstrRow[$i]);

        // Trim extra double quotes from the first and last column value.
        $rgstrColValue[0] = ltrim($rgstrColValue[0], "\"");
        $rgstrColValue[count($rgstrColValue) - 1] = rtrim($rgstrColValue[count($rgstrColValue) - 1], "\"");

        foreach ($rgstrColName as $strColName)
        {
            $colValue = $rgstrColValue[$j++];
            $colValue = str_replace("\"\"", "\"", $colValue);
            $rgobjCol[$strColName] = $colValue; 
        }

        $query = generateUpdateTableQuery($tableName, $rgobjCol, 0);
        if ($query)
        {
            if ($mysqli->query($query) === FALSE)
            {
                $fFailed = TRUE;
                echo("Failed Query: $query");
            }
        }
    }

    $mysqli->close();
    return (!$fFailed);
}


function exportDBTableColumnNames($rgrgstrDBTableColumn)
{
    $file = fopen("dbTables.php", "w");
    if ($file)
    {
        $lineBreak = getLineBreakString();

        fwrite($file, "<?php");
        fwrite($file, "$lineBreak$lineBreak");
        fwrite($file, "\$dbTables = array(");
        fwrite($file, "$lineBreak");

        $iTable = 0;
        $cTable = count($rgrgstrDBTableColumn);
        foreach ($rgrgstrDBTableColumn as $key => $value)
        {
            fwrite($file, "    \"$key\" => array($lineBreak");

            $cCol = count($value);
            for ($i = 0; $i < $cCol; ++$i)
            {
                $strColName = $value[$i];

                fwrite($file, "        ");
                fwrite($file, "\"$strColName\"");

                if ($i < $cCol - 1)
                {
                    fwrite($file, ",");
                }

                fwrite($file, "$lineBreak");
            }

            fwrite($file, "    )");
            if ($iTable++ < $cTable - 1)
            {
                fwrite($file, ",$lineBreak");
            }
            fwrite($file, "$lineBreak");
        }

        fwrite($file, ");");
        fwrite($file, "$lineBreak$lineBreak");
        fwrite($file, "?>");
        fclose($file);
    }
}


function getPostedColumnKeyValues()
{
    $strTableName = $_POST["dbTable"];
    $rgstrKey = $GLOBALS["dbTables"][$strTableName];

    $rgobjValue = array();
    foreach ((array)$rgstrKey as $strKey)
    {
        $rgobjValue[$strKey] = $_POST[$strKey];
    }

    return($rgobjValue);
}


function getMaxIntFieldValue($mysqli, $strTable, $strFieldName)
{
    $maxValue = 0;
    $query ="SELECT MAX($strFieldName) FROM $strTable";

    $result = $mysqli->query($query);
    if ($result !== FALSE)
    {
        $row = mysqli_fetch_row($result);
        $maxValue = $row[0];
        mysqli_free_result($result);
    }

    return $maxValue;
}


function connectToMySql()
{
    if (defined('DB_USER'))
    {
        $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    }
    else
    {
        $mysqli = new mysqli(DB_SERVER, DB_LOGIN, DB_PWD, DB_NAME);
    }

    // check connection
    if ($mysqli->connect_errno)
    {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        exit();
    }

    $mysqli->query("SET NAMES 'utf8'");
    return $mysqli;
}


function execDBQuery($strQuery)
{
    $mysqli = connectToMySql();
    $result = $mysqli->query($strQuery);
    $mysqli->close();

    return $result;
}


function addQuantity($strTable, $id, $quantity)
{
    $query = "UPDATE $strTable SET quantity = quantity+$quantity WHERE id = $id";
    execDBQuery($query);
}


function incrementSortOrder($strTable, $after)
{
    $query = "UPDATE $strTable SET sort_order = sort_order+1 WHERE sort_order >= $after";
    execDBQuery($query);
}


function isIntColumn($colName)
{
    global $dbCols;

    return((strpos($dbCols[$colName], "TIMESTAMP ") === false) &&
           (strpos($dbCols[$colName], "VARCHAR(") === false) &&
           (strpos($dbCols[$colName], "CHAR(") === false) &&
           (strpos($dbCols[$colName], "DATE") === false));
}


function generateSecureKeyValue($mysqli, $key, $value)
{
    $strQuery = '';

    if (isIntColumn($key))
    {
        if ($value == '')
        {
            $value = 0;
        }

        // Remove comma from the formatted integer.
        $value    = str_replace(',', '', $value);
        $strQuery = "$key=$value";
    }
    else
    {
        $escapedValue = mysqli_real_escape_string($mysqli, $value);
        $strQuery     = "$key=\"$escapedValue\"";
    } 

    return $strQuery;
}
function generateSecureUpdateTableQuery($mysqli, $strTable, $rgobjCol, $targetId)
{
    $fInsert = ($targetId <= 0);

    $strQuery  = $fInsert ? 'INSERT INTO ' : 'UPDATE ';
    $strQuery .= "$strTable SET ";

    $i    = 0;
    $cCol = count($rgobjCol);
    foreach ($rgobjCol as $key => $value)
    {
        $strQuery .= generateSecureKeyValue($mysqli, $key, $value);
        if ($i++ < ($cCol - 1))
        {
            $strQuery .= ', ';
        }
    }

    if (!$fInsert)
    {
        $strQuery .= " WHERE id=$targetId";
    }

    $strQuery .= ';';

    return $strQuery;
}

function generateKeyValue($key, $value)
{
    $html = "";

    if (isIntColumn($key))
    {
        if ($value == "")
        {
            $value = 0;
        }

        // Remove comma from the formatted integer.
        $value = str_replace(",", "", $value);
        $html = "$key=$value";
    }
    else
    {
        $html = "$key=\"" . addslashes($value) . "\"";
    } 

    return($html);
}


function generateUpdateTableQuery($strTable, $rgobjCol, $targetId)
{
    $fInsert = ($targetId <= 0);

    $query = $fInsert ? "INSERT INTO " : "UPDATE ";
    $query .= "$strTable SET ";

    $i = 0;
    $cCol = count($rgobjCol);
    foreach ($rgobjCol as $key => $value)
    {
        $query .= generateKeyValue($key, $value);

        if ($i < ($cCol - 1))
        {
            $query .= ", ";
        }

        ++$i;
    }

    if (!$fInsert)
    {
        $query .= " WHERE id=$targetId";
    }

    $query .= ";";

    return($query);
}


function generateDeleteQuery($tableName, $id)
{
    return("DELETE FROM $tableName WHERE id=$id;");
}


// This function is not used, but it is still pretty useful.
function dropAllTables()
{
    $mysqli = connectToMySql();

    $result = $mysqli->query("SHOW TABLES FROM " . DB_NAME . ";");
    if (!$result)
    {
        die("Error, could not list tables. MySQL Error: " . mysql_error());
    }

    if (mysqli_num_rows($result) > 0)
    {
        while ($row = $result->fetch_row())
        {
            $foundTables[] = $row[0];
        }

        mysqli_free_result($result);

        foreach ($foundTables as $tableName)
        {
            $query = "DROP TABLE IF EXISTS " . DB_NAME . ".$tableName;";

            if ($mysqli->query($query) === TRUE)
            {
                echo "Success - table $tableName deleted.";
            }
            else
            {
                echo "Error deleting $tableName. MySQL Error: " . mysql_error();
            }
        }
    }

    $mysqli->close();
}

?>
