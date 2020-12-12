<?php

// Set default timezone (Will throw a notice otherwise).
date_default_timezone_set('Asia/Tokyo');

require_once('../../../../includes/PHPSpreadsheet/vendor/autoload.php');
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;

$curDirPath = dirname(__FILE__);
$disableSession = TRUE;
require_once("$curDirPath/../dbutils.php");
require_once("$curDirPath/../../../includes/config.inc.php");
require_once(MYSQL);

function getColumnNames()
{
    return array(
        'barcode_number',
        'type',
        'vintage',
        'combined_name',
        'producer',
        'capacity1',
        'initial_stock',
        'stock',
        'price',
        'member_price',
        'point',
        'country'
    );
}

if (isset($_FILES['file']['name']))
{
    $fileName = $_FILES['file']['name'];
    $fileExt  = pathinfo($fileName, PATHINFO_EXTENSION);

    if ($fileExt == 'xlsx')
    {
        $fileName      = $_FILES['file']['tmp_name'];
        $inputFileName = $fileName;

        try
        {
            $reader = new XlsxReader();
            $spreadsheet = $reader->load($inputFileName);
        }
        catch (Exception $ex)
        {
            die('Error loading file "' . pathinfo($inputFileName, PATHINFO_BASENAME) . '": ' . $ex->getMessage());
        }

        $tableName  = 'preorder_wines';
        $rgstrQuery = array();
        $mysqli     = connectToMySql();
        $barcode    = 100000;

        $sheetCount = $spreadsheet->getSheetCount();
        for ($i = 0; $i < $sheetCount; $i++)
        {
            $sheet = $spreadsheet->getSheet($i);
            $strType = $sheet->getTitle();
            $intMaxRow = $sheet->getHighestRow();
            $chMaxColumn = $sheet->getHighestColumn();
            //  Loop through each row of the worksheet in turn
            for ($row = 1; $row <= $intMaxRow; ++$row)
            {
                // Select all the cells in that row from cell A to highest column cell.
                $rowData = $sheet->rangeToArray("A$row:$chMaxColumn$row", NULL, TRUE, FALSE);
                if (count($rowData[0]) >= 7)
                {
                    $intPrice       = ceil(($rowData[0][5] / 0.6) / 100) * 100;
                    $intMemberPrice = ceil($intPrice * 0.8);
                    $rgobjCol = array();
                    $rgobjCol['barcode_number'] = ++$barcode;
                    $rgobjCol['type']           = $strType;
                    $rgobjCol['vintage']        = $rowData[0][0];
                    $rgobjCol['combined_name']  = $rowData[0][1];
                    $rgobjCol['producer']       = $rowData[0][2];
                    $rgobjCol['capacity1']      = $rowData[0][3];
                    $rgobjCol['initial_stock']  = $rowData[0][4];
                    $rgobjCol['stock']          = $rowData[0][4];
                    $rgobjCol['price']          = $intPrice;
                    $rgobjCol['member_price']   = $intMemberPrice;
                    $rgobjCol['point']          = $rowData[0][6];
                    $rgobjCol['country']        = 'France';
                    $rgstrQuery[] = generateSecureUpdateTableQuery($mysqli, $tableName, $rgobjCol, 0);
                }
            }
        }

        dropTable($tableName);
        createTable($tableName, getColumnNames(), 'id');

        $fFailed = FALSE;
        foreach ($rgstrQuery as $strQuery)
        {
            if ($strQuery)
            {
                if ($mysqli->query($strQuery) === FALSE)
                {
                    $fFailed = TRUE;
                    echo("Failed Query: $strQuery");
                }
            }
        }

        $mysqli->close();
    }
    else
    {
        echo '<p style="color:red;">Please upload file with xlsx extension only!!</p>'; 
    }   
}

?>
