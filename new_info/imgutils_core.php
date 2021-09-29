<?php

function getExtension($argFileName)
{
    $iExt = strrpos($argFileName, '.');
    if (!$iExt)
    {
        return '';
    }

    $cExt   = strlen($argFileName) - $iExt;
    $strExt = substr($argFileName, $iExt + 1, $cExt);

    return $strExt;
}

function isSupportedExtension($fileName)
{
    $fileExt = strtolower(getExtension($fileName));

    $rgstrSupported = array(
        'jpg',
        'jpeg',
        'gif',
        'png'
    ); 

    return in_array($fileExt, $rgstrSupported);
}

function createImg($fileName, $fileTmpName)
{
    $objImg  = null;
    $fileExt = strtolower(getExtension($fileName));

    if (($fileExt == 'jpg') || ($fileExt == 'jpeg'))
    {
        $objImg = imagecreatefromjpeg($fileTmpName);
    }
    else if ($fileExt == 'png')
    {
        $objImg = imagecreatefrompng($fileTmpName);
    }
    else if ($fileExt == 'gif')
    {
        $objImg = imagecreatefromgif($fileTmpName);
    }

    return $objImg;
}

function writeImg($objImg, $targetPath)
{
    $fileExt = strtolower(getExtension($targetPath));
    if (($fileExt == 'jpg') || ($fileExt == 'jpeg'))
    {
        imagejpeg($objImg, $targetPath, 100);
    }
    else if ($fileExt == 'png')
    {
        imagepng($objImg, $targetPath, 0);
    }
    else if ($fileExt == 'gif')
    {
        imagegif($objImg, $targetPath);
    }
    else
    {
        die('Unsupported file extention.');
    }
}
