<?php

if ($_SERVER["REQUEST_METHOD"] != "POST")
{
    exit();
}

require_once('../tcpdf/tcpdf.php');

$width           = 210;
$height          = 297;
$xMargin         = 18;
$yMargin         = 9;
$headerHeight    = (2.1 * $yMargin) - $yMargin;
$fDottedLine     = TRUE;
$fCenteredHeader = FALSE;

// Japanese characters
$lBracket  = "【";
$rBracket  = "】";
$cepageLbl = "品種";

$pdf = new TCPDF("P", "mm", "A4", true, "UTF-8" );
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->AddPage();
$pdf->SetMargins($xMargin, $yMargin, $xMargin, true);
$pdf->SetAutoPageBreak(false, 0);

// Japanese fonts.
ini_set("memory_limit", "-1");
$kozGoProL  = TCPDF_FONTS::addTTFfont('../font/KozGoPro-Light.ttf', 'TrueTypeUnicode', '', 32);
$kozGoProEL = TCPDF_FONTS::addTTFfont('../font/KozGoPro-ExtraLight.ttf', 'TrueTypeUnicode', '', 32);


function drawJapaneseText($x, $y, $txt, $fontSize, $style)
{
    global $pdf, $kozGoProL, $kozGoProEL;

    if ($style == "EL")
    {
        $pdf->SetFont($kozGoProEL, "", $fontSize, "", false);
    }
    else
    {
        $pdf->SetFont($kozGoProL, "", $fontSize, "", false);
    }

    $txt = str_replace(" ", " ", $txt);
    $pdf->Text($x, $y, $txt);
}

function drawImage($pdf, $imgUri)
{
    global $width, $xMargin, $yMargin;

    if ($imgUri != null && $imgUri != '')
    {
        // Draws an image.
        $flagAdjustY = -0.6;
        $pdf->Image($imgUri, ($width - (1.9 * $xMargin)), $yMargin + $flagAdjustY);
    }
}

function drawLine($pdf, $leftX, $leftY, $rightX, $rightY)
{
    $style = array("width" => 0.02, "cap" => "butt", "join" => "miter", "dash" => 0, "color" => array(0, 0, 0));
    $pdf->Line($leftX, $leftY, $rightX, $rightY, $style);
}

function drawHeader($pdf, $imgUri)
{
    global $width, $xMargin, $yMargin, $headerHeight, $fDottedLine, $fCenteredHeader;

    if ($fDottedLine)
    {
        $strDot   = "●     "; 
        $dotWidth = $pdf->GetStringWidth($strDot, 'kozgopromedium', '', 1);
        $cDot     = ($width - (2 * $xMargin)) / $dotWidth;

        $strLine = "";
        for ($i = 0; $i < $cDot; ++$i)
        {
            $strLine .= $strDot;
        }

        // Draws dotted lines (lower).
        $pdf->SetFont("kozgopromedium", "", 1);
        $pdf->Text($xMargin, ($yMargin + $headerHeight), $strLine);

        drawImage($pdf, $imgUri);

        // Draws dotted lines (upper).
        $pdf->Text($xMargin, $yMargin, $strLine);
    }
    else
    {
        drawLine($pdf, $xMargin, ($yMargin + $headerHeight), ($width - $xMargin), ($yMargin + $headerHeight));
        drawImage($pdf, $imgUri);
        drawLine($pdf, $xMargin, $yMargin, ($width - $xMargin), $yMargin);
    }

    // Draws header text.
    $headerLeftX = $xMargin;
    $strTitle    = stripslashes($_POST["pageTitle"]);
    $pdf->SetFont("helvetica", "B", 17);

    if ($fCenteredHeader)
    {
        $headerLeftX = ($width - $pdf->GetStringWidth($strTitle, 'helvetica', 'B', 17)) / 2;
    }

    $pdf->Text($headerLeftX, $yMargin + 1.5, $strTitle);

    // Draws header subtitle.
    $titleWidth = $pdf->GetStringWidth($strTitle, "helvetica", "B", 17);
    $strSubtitle = stripslashes($_POST["pageSubtitle"]);
    drawJapaneseText(($xMargin + $titleWidth + 3), ($yMargin + 3.5), $strSubtitle, 10, "EL");
}

function drawFooter($pdf)
{
    global $width, $height, $xMargin, $yMargin, $kozGoProL, $fDynamicFooterText;

    $engFooterText = "  / The price contains all the taxes.";
    if ($fDynamicFooterText)
    {
        $engFooterText = '';
    }

    $jpnFooterText = stripslashes($_POST["footerText"]);
    $footerFontSize = 9;

    $engFooterWidth = $pdf->GetStringWidth($engFooterText, "helvetica", "", $footerFontSize);
    $jpnFooterWidth = $pdf->GetStringWidth($jpnFooterText, $kozGoProL, "", $footerFontSize);

    $pdf->SetFont("helvetica", "", $footerFontSize);
    $pdf->Text(0, ($height - $yMargin * 1.8), $engFooterText, false, false, true, 0, 0, 'R');

    drawJapaneseText(($width - $xMargin - $engFooterWidth - $jpnFooterWidth), ($height - $yMargin * 1.8), $jpnFooterText, $footerFontSize, "L");
}
