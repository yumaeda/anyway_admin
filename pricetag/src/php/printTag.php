<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE);

if ($_SERVER["REQUEST_METHOD"] != "POST")
{
    exit();
}

require_once('../tcpdf/tcpdf.php');

$TAX_RATE = 0.1;
$orientation = $_POST['orientation'];

$xMargin = 0;
$yMargin = 0;

if ($orientation == 1)
{
    $pageWidth  = 148;
    $pageHeight = 100;
    $pdf = new TCPDF("L", "mm", array($pageWidth, $pageHeight), true, "UTF-8");
}
elseif ($orientation == 2)
{
    $pageWidth  = 100;
    $pageHeight = 148;
    $pdf        = new TCPDF("P", "mm", array($pageWidth, $pageHeight), true, "UTF-8");
}

$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->AddPage();
$pdf->SetMargins($xMargin, $yMargin, $xMargin, true);
$pdf->SetAutoPageBreak(false, 0);

// Japanese fonts.
ini_set("memory_limit", "-1");
$ipaexm = TCPDF_FONTS::addTTFfont('../font/ipaexm.ttf', 'TrueTypeUnicode', '', 32);

$pdf->SetFont('helvetica', '', 9);
if ($orientation == 1)
{
    $pdf->Line(0, $pageHeight / 2, $pageWidth, $pageHeight / 2, array("width"=>0.01));
}
else if ($orientation == 2)
{
    $upperLineY = ($pageHeight / 2 ) - 7.5;
    $lowerLineY = ($pageHeight / 2 ) + 8;
    $pdf->Line(0, $upperLineY, $pageWidth, $upperLineY, array("width"=>0.01));
    $pdf->Line(0, $lowerLineY, $pageWidth, $lowerLineY, array("width"=>0.01));
    $pdf->Line(8, 0, 8, 148, array("width"=>0.01));
}

function getFlagImgUri($intCountry)
{
    $imgUri = '';

    switch ($intCountry)
    {
    case 1:
        $imgUri= '../../images/flags/france.png';
        break;
    case 2:
        $imgUri= '../../images/flags/austria.png';
        break;
    case 3:
        $imgUri= '../../images/flags/italy.png';
        break;
    case 4:
        $imgUri= '../../images/flags/germany.png';
        break;
    case 5:
        $imgUri= '../../images/flags/japan.png';
        break;
    case 6:
        $imgUri= '../../images/flags/australia.png';
        break;
    case 7:
        $imgUri= '../../images/flags/portugal.png';
        break;
    case 8:
        $imgUri= '../../images/flags/america.png';
        break;
    case 9:
        $imgUri= '../../images/flags/new_zealand.png';
        break;
    case 10:
        $imgUri= '../../images/flags/south_africa.png';
        break;
    case 11:
        $imgUri= '../../images/flags/spain.png';
        break;
    case 12:
        $imgUri= '../../images/flags/croatia.png';
        break;
    case 13:
        $imgUri= '../../images/flags/argentina.png';
        break;
    case 14:
        $imgUri= '../../images/flags/hungary.png';
        break;
    case 15:
        $imgUri= '../../images/flags/united_kingdom.png';
        break;
    case 16:
        $imgUri= '../../images/flags/rumania.png';
        break;
    case 17:
        $imgUri= '../../images/flags/costa_rica.png';
        break;
    case 18:
        $imgUri= '../../images/flags/colombia.png';
        break;
    case 19:
        $imgUri= '../../images/flags/uyghur_turpan.png';
        break;
    case 20:
        $imgUri= '../../images/flags/india.png';
        break;
    case 21:
        $imgUri= '../../images/flags/malawi.png';
        break;
    case 22:
        $imgUri= '../../images/flags/turkey.png';
        break;
    case 23:
        $imgUri= '../../images/flags/canada.png';
        break;
    case 24:
        $imgUri= '../../images/flags/ukraine.png';
        break;
    case 25:
        $imgUri= '../../images/flags/switzerland.png';
        break;
    case 26:
        $imgUri= '../../images/flags/bulgaria.png';
        break;
    case 27:
        $imgUri= '../../images/flags/lebanon.png';
        break;
    case 28:
        $imgUri= '../../images/flags/chile.png';
        break;
    case 30:
        $imgUri= '../../images/flags/moldova.png';
        break;
    case 31:
        $imgUri= '../../images/flags/greece.png';
        break;
    case 32:
        $imgUri= '../../images/flags/georgia.png';
        break;
    case 33:
        $imgUri= '../../images/flags/czech.png';
        break;
    case 34:
        $imgUri= '../../images/flags/poland.png';
        break;
    case 35:
        $imgUri= '../../images/flags/slovenia.png';
        break;
    case 36:
        $imgUri= '../../images/flags/china.png';
        break;
    case 37:
        $imgUri= '../../images/flags/armenia.png';
        break;
    case 38:
        $imgUri= '../../images/flags/uruguay.png';
        break;
    case 39:
        $imgUri= '../../images/flags/luxembourg.png';
        break;
    default:
        break;
    }

    return $imgUri;
}

function drawLandscapePriceTag($iPriceTag)
{
    global $pageHeight, $pageWidth, $pdf, $ipaexm, $TAX_RATE;

    $leftX      = $pageWidth / 8;
    $rightX     = $pageWidth - ($pageWidth / 20);
    $topY       = ($iPriceTag === 1) ? 0 : ($pageHeight / 2);
    $separatorY = $topY + ($pageHeight / 4);

    // Add top margin.
    $topY += 3;

    // Draws a separator between English and Japanese text.
    $pdf->SetFont('helvetica', '', 9);
    $pdf->Line($leftX, $topY, $rightX - 13, $topY, array('width'=>0.25));
    $pdf->Line($leftX, $separatorY, $rightX, $separatorY, array('width'=>0.25));

    $vintage = $_POST["vintage_$iPriceTag"];
    if (!$vintage || empty($vintage))
    {
        if ($_POST["type_$iPriceTag"] != 11)
        {
            $vintage = 'S.A.';
        }
    }

    $barcode  = stripslashes($_POST["barcode_$iPriceTag"]);
    $region   = stripslashes($_POST["region_$iPriceTag"]);
    $producer = stripslashes($_POST["producer_$iPriceTag"]);
    $name     = stripslashes($_POST["name_$iPriceTag"]);
    $cuvee    = stripslashes($_POST["cuvee_$iPriceTag"]);
    if ($cuvee && !empty($cuvee))
    {
        $cuvee = '"' . $cuvee . '"';
    }

    $price       = $_POST["price_$iPriceTag"];
    $country     = $_POST["country_$iPriceTag"];
    $jpnProducer = $_POST["producer_jpn_$iPriceTag"];
    $jpnName     = $_POST["name_jpn_$iPriceTag"];
    $jpnCepage1  = $_POST["cepage1_$iPriceTag"];
    $jpnCepage2  = $_POST["cepage2_$iPriceTag"];
    $jpnRegion1  = $_POST["region_jpn1_$iPriceTag"];
    $jpnRegion2  = $_POST["region_jpn2_$iPriceTag"];

    // Draws a flag.
    $flagImgUri = getFlagImgUri($country);
    if ($flagImgUri !== '')
    {
        $pdf->Image($flagImgUri, ($rightX - 10), $topY, 10);
    }

    $jpnValueX = $leftX + 9;
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Text($leftX, $topY + 1, $vintage);

    $vintageWidth = $pdf->GetStringWidth($vintage, 'helvetica', 'B', 9);
    $pdf->Text($leftX + $vintageWidth + 2, $topY + 1, $region);

    $pdf->SetFont('helvetica', 'B', 12);
    $pdf->Text($leftX, $topY + 4.5, $producer);

    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->Text($leftX, $topY + 9, $name);
    $pdf->SetFont('helvetica', '', 10);
    $pdf->Text($leftX, $topY + 17, $cuvee);

    $pdf->SetFont($ipaexm, '', 6, '', false);
    $pdf->Text($leftX, $separatorY + 1, '生産者：');
    $pdf->Text($jpnValueX, $separatorY + 1, $jpnProducer);
    $pdf->Text(($rightX - 6), $separatorY + 1, $barcode);

    $pdf->Text($leftX, $separatorY + 4, '銘　柄：');
    $pdf->Text($jpnValueX, $separatorY + 4, $jpnName);

    $pdf->Text($leftX, $separatorY + 7, '品　種：');
    $pdf->Text($jpnValueX, $separatorY + 7, $jpnCepage1);
    $pdf->Text($jpnValueX, $separatorY + 10, $jpnCepage2);

    $pdf->Text($leftX, $separatorY + 13, '生産地：');
    $pdf->Text($jpnValueX, $separatorY + 13, $jpnRegion1);
    $pdf->Text($jpnValueX, $separatorY + 16, $jpnRegion2);

    $strPrice        = number_format($price);
    $strTaxedPrice   = ' YEN [ tax: ' . number_format($price * (1 + $TAX_RATE)) . ' YEN ] ';
    $priceWidth      = $pdf->GetStringWidth($strPrice, 'helvetica', '', 15);
    $priceHeight     = $pdf->GetStringHeight($strPrice, 'helvetica', '', 15);
    $taxedPriceWidth = $pdf->GetStringWidth($strTaxedPrice, 'helvetica', '', 7);

    $pdf->SetFont('helvetica', '', 7);
    $pdf->Text($rightX - $taxedPriceWidth, ($separatorY + 16 + 3), $strTaxedPrice);

    $pdf->SetFont('helvetica', 'B', 15);
    $pdf->Text($rightX - $taxedPriceWidth - $priceWidth, $separatorY + 16, $strPrice);
}

function drawPortraitPriceTag($iPriceTag)
{
    global $pageHeight, $pageWidth, $pdf, $ipaexm, $TAX_RATE;

    $tagHeight      = 65;
    $leftX          = 11;
    $rightX         = $pageWidth - 3;
    $topY           = ($iPriceTag === 1) ? 0 : ($pageHeight / 2) + 8;
    $separatorY     = $topY + ($tagHeight / 2.3);
    $lastSeparatorY = $topY + ($tagHeight * 6 / 7);

    // Draws a separator between English and Japanese text.
    $pdf->SetFont('helvetica', '', 9);
    $pdf->Line($leftX, $topY + ($tagHeight / 4.5), $rightX, $topY + ($tagHeight / 4.5), array('width'=>0.25));
    $pdf->Line($leftX, $separatorY, $rightX, $separatorY, array('width'=>0.25));
    $pdf->Line($leftX, $lastSeparatorY, $rightX - 13, $lastSeparatorY, array('width'=>0.25));

    $vintage = $_POST["vintage_$iPriceTag"];
    if (!$vintage || empty($vintage))
    {
        if ($_POST["type_$iPriceTag"] != 11)
        {
            $vintage = 'S.A.';
        }
    }

    $region   = stripslashes($_POST["region_$iPriceTag"]);
    $producer = stripslashes($_POST["producer_$iPriceTag"]);
    $name     = stripslashes($_POST["name_$iPriceTag"]);
    $cuvee    = stripslashes($_POST["cuvee_$iPriceTag"]);
    if ($cuvee && !empty($cuvee))
    {
        $cuvee = '"' . $cuvee . '"';
    }

    $price       = $_POST["price_$iPriceTag"];
    $country     = $_POST["country_$iPriceTag"];
    $jpnProducer = $_POST["producer_jpn_$iPriceTag"];
    $jpnName     = $_POST["name_jpn_$iPriceTag"];
    $jpnCepage1  = $_POST["cepage1_$iPriceTag"];
    $jpnCepage2  = $_POST["cepage2_$iPriceTag"];
    $jpnRegion1  = $_POST["region_jpn1_$iPriceTag"];
    $jpnRegion2  = $_POST["region_jpn2_$iPriceTag"];

    $jpnValueX = $leftX + 10;
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->Text($leftX, $topY + 2, $vintage);

    $vintageWidth = $pdf->GetStringWidth($vintage, 'helvetica', 'B', 11);
    $pdf->Text($leftX + $vintageWidth + 2, $topY + 2, $region);

    $pdf->SetFont('helvetica', 'B', 14);
    $pdf->Text($leftX, $topY + 7, $producer);

    $pdf->SetFont('helvetica', 'B', 18);
    $pdf->Text($leftX, $topY + 14.5, $name);
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Text($leftX, $topY + 22, $cuvee);

    $pdf->SetFont($ipaexm, '', 7, '', false);
    $pdf->Text($leftX, $separatorY + 2, '生産者：');
    $pdf->Text($jpnValueX, $separatorY + 2, $jpnProducer);

    $pdf->Text($leftX, $separatorY + 6, '銘　柄：');
    $pdf->Text($jpnValueX, $separatorY + 6, $jpnName);

    $pdf->Text($leftX, $separatorY + 10, '品　種：');
    $pdf->Text($jpnValueX, $separatorY + 10, $jpnCepage1);
    $pdf->Text($jpnValueX, $separatorY + 14, $jpnCepage2);

    $pdf->Text($leftX, $separatorY + 18, '生産地：');
    $pdf->Text($jpnValueX, $separatorY + 18, $jpnRegion1);
    $pdf->Text($jpnValueX, $separatorY + 22, $jpnRegion2);

    $strPrice      = number_format($price);
    $strTaxedPrice = ' YEN [ tax: ' . number_format($price * (1 + $TAX_RATE)) . ' YEN ] ';
    $priceWidth    = $pdf->GetStringWidth($strPrice, 'helvetica', '', 15);
    $priceHeight   = $pdf->GetStringHeight($strPrice, 'helvetica', '', 15);

    $pdf->SetFont('helvetica', 'B', 15);
    $pdf->Text($leftX, $lastSeparatorY + 1, $strPrice);

    $pdf->SetFont('helvetica', '', 8);
    $pdf->Text($leftX + $priceWidth, $lastSeparatorY + 3.5, $strTaxedPrice);

    // Draws a flag.
    $flagImgUri = getFlagImgUri($country);
    if ($flagImgUri !== '')
    {
        $pdf->Image($flagImgUri, $rightX - 10, $lastSeparatorY, 10);
    }
}

$curDirPath      = dirname(__FILE__);
$definesFilePath = "$curDirPath/../defines.php";
include_once("$curDirPath/common.php");

$barcode1 = '';
if (isset($_POST['name_1']))
{
    if ($orientation == 1)
    {
        drawLandscapePriceTag(1);
    }
    elseif ($orientation == 2)
    {
        drawPortraitPriceTag(1);
    }

    if (isset($_POST['barcode_1']))
    {
        $barcode1 = mysqli_real_escape_string($dbc, $_POST['barcode_1']);
        mysqli_query($dbc, "CALL seiya_anyway.set_printed_flag('$barcode1')");
    }
}

$barcode2 = '';
if (isset($_POST['name_2']))
{
    if ($orientation == 1)
    {
        drawLandscapePriceTag(2);
    }
    elseif ($orientation == 2)
    {
        drawPortraitPriceTag(2);
    }

    if (isset($_POST['barcode_2']))
    {
        $barcode2 = mysqli_real_escape_string($dbc, $_POST['barcode_2']);
        mysqli_query($dbc, "CALL seiya_anyway.set_printed_flag('$barcode2')");
    }
}

mysqli_close($dbc);

header("Content-Type: application/pdf");
$pdf->Output(($barcode1 . '_' . $barcode2 . '.pdf'), 'I');

?>
