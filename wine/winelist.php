<?php

require_once("./winelist_base.php");

// Create SQL connection.
ob_start();
require_once("../defines.php");
require_once("../dbutils.php");
ob_get_clean();
$mysqli = connectToMySql();

function getPostValueForSql($strKey)
{
    $strValue = '';

    if (!empty($_POST[$strKey]))
    {
        $strValue = addslashes($_POST[$strKey]);
    }

    return $strValue;
}

// Copied from mysql.inc.php
function prepareNextQuery($dbc)
{
    while ($dbc->more_results())
    {
        $dbc->next_result();
        if ($res = $dbc->store_result())
        {
            $res->free(); 
        }
    }
}

function saveWineData($iWine)
{
    $dbTable     = $_POST["dbTable"];
    $page_number = $_POST["page_number"];

    $barcode_number = getPostValueForSql("barcode_number_$iWine");
    $color          = getPostValueForSql("color_$iWine");
    $sqlVintage     = getPostValueForSql("vintage_$iWine");
    $price          = getPostValueForSql("price_$iWine");
    $quantity       = getPostValueForSql("quantity_$iWine");
    $sqlName        = getPostValueForSql("name_$iWine");
    $sqlProducer    = getPostValueForSql("producer_$iWine");
    $sqlJpnName     = getPostValueForSql("name_jpn_$iWine");
    $sqlJpnProducer = getPostValueForSql("producer_jpn_$iWine");
    $sqlCountry     = getPostValueForSql("country_$iWine");
    $country_jpn    = getPostValueForSql("country_jpn_$iWine");
    $sqlJpnRegion   = getPostValueForSql("region_jpn_$iWine");
    $sqlCepage      = getPostValueForSql("cepage_$iWine");
    $sqlComment     = getPostValueForSql("comment_$iWine");

    if ($quantity === '')
    {
        $quantity = 0;
    }

    global $mysqli;

    $query = "DELETE FROM $dbTable WHERE (page_number=$page_number) AND (item_number=$iWine)";
    $mysqli->query($query);

    prepareNextQuery($mysqli);

    if ($barcode_number !== '')
    {
        $query = "INSERT INTO $dbTable (
            page_number,
            color,
            item_number,
            barcode_number,
            country,
            vintage,
            name,
            producer,
            name_jpn,
            producer_jpn,
            region_jpn,
            cepage,
            store_price,
            quantity,
            comment) VALUES (

            $page_number,
            $color,
            $iWine,
            $barcode_number,
            '$sqlCountry',
            '$sqlVintage',
            '$sqlName',
            '$sqlProducer',
            '$sqlJpnName',
            '$sqlJpnProducer',
            '$sqlJpnRegion',
            '$sqlCepage',
            $price,
            $quantity,
            '$sqlComment');";

        if (!($mysqli->query($query)))
        {
            echo "Query failed. <br />Query: $query";
        }
    }
}

function drawComment($leftX, $leftY, $strComment)
{
    $comment1 = mb_substr($strComment, 0, 60, 'utf-8');
    $comment2 = '';
    if (mb_strlen($strComment, 'utf-8') > 60)
    {
        $comment2 = mb_substr($strComment, 60, 60, 'utf-8');
    }

    $fontSize = 7;
    $pageNumber = $_POST["page_number"];
    if (($pageNumber == 9999) || ($pageNumber == 10000))
    {
        $fontSize -= 1;
    }

    drawJapaneseText($leftX, $leftY, $comment1, $fontSize, "L");
    drawJapaneseText($leftX, $leftY + 3, $comment2, $fontSize, "L");
}

// POSTs
$firstItemNumber = $_POST["firstItemNumber"];

$pageNumber = $_POST["page_number"];
if (($pageNumber == 2) || ($pageNumber == 3) || ($pageNumber == 9999) || ($pageNumber == 10000))
{
    $pdf->SetImageScale(4.5);

    $imgPath = "./today.png";
    $startId = 1000;

    $categoryPadding = 12.5;
    $itemPadding     = 6;
    $lineHeight      = 4;

    if ($pageNumber == 3)
    {
        $now      = new DateTime();
        $intMonth = (int)$now->format("m");
        $imgPath  = "./$intMonth.png";

        $startId += 12;
    }
    else if (($pageNumber == 9999) || ($pageNumber == 10000))
    {
        $imgPath         = '';
        $fDottedLine     = FALSE;
        $fCenteredHeader = TRUE;
        $startId         = 1;

        $categoryPadding = 8;
        $itemPadding     = 8.5;
        $lineHeight      = 3.4;
    }

    $endId = $startId + 12;

    drawHeader($pdf, $imgPath);

    $leftX  = $xMargin;
    $rightX = $width - $xMargin;
    $leftY  = $yMargin + $headerHeight + 9;

    $wineLabels = array(
        "Sparkling & Champagne / ",
        "",
        "White Wine / ",
        "Rosé Wine / ",
        "Red Wine / ",
        "Dessert Wine / "
    );

    $wineJpnLabels = array(
        "スパークリングワイン＆シャンパーニュ",
        "",
        "白ワイン",
        "ロゼワイン",
        "赤ワイン",
        "デザートワイン"
    );

    $colorHash = array();

    for ($i = $startId; $i < $endId; ++$i)
    {
        saveWineData($i);

        if (!empty($_POST["barcode_number_$i"]))
        {
            $color        = $_POST["color_$i"];
            $vintage      = $_POST["vintage_$i"];
            $price        = $_POST["price_$i"];
            $quantity     = $_POST["quantity_$i"];
            $name         = stripslashes($_POST["name_$i"]);
            $producer     = stripslashes($_POST["producer_$i"]);
            $name_jpn     = stripslashes($_POST["name_jpn_$i"]);
            $producer_jpn = stripslashes($_POST["producer_jpn_$i"]);
            $country_jpn  = stripslashes($_POST["country_jpn_$i"]);
            $region_jpn   = stripslashes($_POST["region_jpn_$i"]);
            $cepage       = stripslashes($_POST["cepage_$i"]);
            $comment      = stripslashes($_POST["comment_$i"]);
            $nameFontSize   = 7;
            $regionFontSize = 7;

            if (!$colorHash[$color])
            {
                $colorHash[$color] = true;

                if ($i > $startId)
                {
                    $leftY += $categoryPadding;
                }

                $engLabelWidth = $pdf->GetStringWidth($wineLabels[$color - 1], "helvetica", "B", 11);
                $pdf->SetFont("helvetica", "B", 11);
                $pdf->Text($leftX, $leftY, $wineLabels[$color - 1]);

                drawJapaneseText(($leftX + $engLabelWidth), ($leftY + 1), $wineJpnLabels[$color - 1], 8, "L");

                $lineAdjustX = 1;

                $leftY += $itemPadding + 1;
                if (($pageNumber == 9999) || ($pageNumber == 10000))
                {
                    $leftY -= 4;
                    $nameFontSize   = 5;
                    $regionFontSize = 6;
                }

                $style = array("width" => 0.02, "cap" => "butt", "join" => "miter", "dash" => 0, "color" => array(0, 0, 0));
                $pdf->Line($leftX + $lineAdjustX, $leftY, $rightX, $leftY, $style);
                $leftY += 2;
            }
            else
            {
                $leftY += $itemPadding;
            }

            $engName   = "$vintage $name / $producer";
            $jpnName   = "$name_jpn / $producer_jpn";
            $jpnRegion = "$country_jpn : $region_jpn / $cepageLbl : $cepage";
            $strPrice  = number_format($price) . "yen";

            $pdf->SetFont("helvetica", "", 9);
            $pdf->Text($leftX, $leftY, $engName);
            $pdf->Text($leftX, $leftY, $strPrice, false, false, true, 0, 0, "R");

            $leftY += ($lineHeight + 0.6);
            drawJapaneseText($leftX, $leftY, $jpnName, $nameFontSize, "L");

            // Renders quantity for the wines by the glass.
            if (($pageNumber == 2) && $quantity)
            {
                $pdf->SetFont("helvetica", "", 9);
                $pdf->Text($leftX, $leftY, "[ $quantity ml ]", false, false, true, 0, 0, "R");
            }

            $leftY += $lineHeight;
            drawJapaneseText($leftX, $leftY, $jpnRegion, $regionFontSize, "L");

            if (($pageNumber == 9999) || ($pageNumber == 10000))
            {
                $leftY += $lineHeight;
                drawComment($leftX, $leftY, $comment);
            }
        }
    }
}
else
{
    $pdf->SetImageScale(2.2);
    drawHeader($pdf, '');

    $leftX = $xMargin + 15;
    $leftY = $yMargin + $headerHeight + 8;

    $cMaxItem        = 9;
    $separatorHeight = 12;
    $lineHeight      = 5;
    if (($pageNumber == 999) || ($pageNumber == 1000) || ($pageNumber == 1001))
    {
        $cMaxItem           = 12;
        $separatorHeight    = 7;
        $lineHeight         = 4.2;
        $fDynamicFooterText = TRUE;
    }

    for ($i = 0; $i < $cMaxItem; ++$i)
    {
        $iItem = $firstItemNumber + $i;

        saveWineData($iItem);

        if (!empty($_POST["barcode_number_$iItem"]))
        {
            $vintage        = $_POST["vintage_$iItem"];
            $price          = $_POST["price_$iItem"];
            $name           = stripslashes($_POST["name_$iItem"]);
            $producer       = stripslashes($_POST["producer_$iItem"]);
            $name_jpn       = stripslashes($_POST["name_jpn_$iItem"]);
            $producer_jpn   = stripslashes($_POST["producer_jpn_$iItem"]);
            $country        = stripslashes($_POST["country_$iItem"]);
            $country_jpn    = stripslashes($_POST["country_jpn_$iItem"]);
            $region_jpn     = stripslashes($_POST["region_jpn_$iItem"]);
            $cepage         = stripslashes($_POST["cepage_$iItem"]);
            $comment        = stripslashes($_POST["comment_$iItem"]);
            $flagImage      = stripslashes($_POST["flagImg_$iItem"]);

            if ($i > 0)
            {
                $leftY += $separatorHeight;
            }

            $rightX = $width;

            $engName   = "$vintage $name ($producer)";
            $jpnName   = "$vintage $name_jpn ($producer_jpn)";
            $jpnRegion = "$country_jpn / $region_jpn$lBracket$cepage$rBracket";
            $strPrice  = number_format($price) . "yen";

            $flagAdjust = 1;
            $pdf->Image("../../images/$flagImage", $xMargin + $flagAdjust, $leftY + $flagAdjust);

            $pdf->SetFont('helvetica', 'B', 12);
            $pdf->Text($leftX, $leftY, $engName);

            $pdf->SetFont('helvetica', '', 9);
            $pdf->Text(0, $leftY, $strPrice, false, false, true, 0, 0, 'R');
            $leftY += ($lineHeight + 1);
            drawJapaneseText($leftX, $leftY, $jpnName, 9, "L");
            $leftY += $lineHeight;
            drawJapaneseText($leftX, $leftY, $jpnRegion, 9, "L");
            $leftY += $lineHeight;

            $strNumber = "#$iItem";
            $numberWidth = $pdf->GetStringWidth($strNumber, "helvetica", "", 9);
            $pdf->SetFont('helvetica', '', 9);
            $pdf->Text($xMargin + 11 - $numberWidth, $leftY, $strNumber);

            drawComment($leftX, $leftY, $comment);
        }
    }
}

// Close SQL connection.
$mysqli->close();

if ($pageNumber != 10000)
{
    drawFooter($pdf);
}

header("Content-Type: application/pdf");
$pdf->Output("recommended_wines.pdf", "I");

?>
