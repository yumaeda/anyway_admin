<?php

require_once('defines.php');

$curDirPath = dirname(__FILE__);
require_once("$curDirPath/imgutils_core.php");


function getThumbnailName($fileName)
{
    return("thumb_" . basename($fileName));
}


function generateFilePath($dir, $fileName)
{
    return(LOCAL_APP_DIR . $dir . $fileName);
}


function _isValidFileType($fileType)
{
    $fileType = strtolower($fileType);

    return(!(strpos($fileType, 'image') === false) && 
           (substr_count($fileType, '/') === 1));
}


function _isValidMimeType($uploadedFile)
{
    $imgInfo = getimagesize($uploadedFile);
    $validMimeTypes = array(
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/png"
    );

    return(in_array($imgInfo['mime'], $validMimeTypes));
}


function _validateUploadedFile($uploadedFile)
{
    $fileName = stripslashes($uploadedFile["name"]);
    if (!isSupportedExtension($fileName))
    {
        die("Invalid file extension for upload.");
    }

    $uploadedFileName = $uploadedFile['tmp_name'];
    if (!$uploadedFileName)
    {
        die("File was not uploaded correctly.");
    }

    if (filesize($uploadedFileName) > (MAX_SIZE * 1024))
    {
        die("You have exceeded the size limit!");
    }

    if (!_isValidMimeType($uploadedFileName))
    {
        die("Invalid Mime type!");
    }

    if (!_isValidFileType($uploadedFile['type']))
    {
        die("Invalid file type.");
    }
}


function savePhotoAndThumbnail($uploadedFile, $targetDir)
{
    _validateUploadedFile($uploadedFile);

    $fileName = stripslashes($uploadedFile["name"]);
    $targetFilePath = generateFilePath($targetDir, $fileName);
    if (file_exists($targetFilePath))
    {
        die("The file already exists.");
    }

    $imgSrc = createImg($fileName, $uploadedFile['tmp_name']);

    $uploadedFileName = $uploadedFile['tmp_name'];

    list($width, $height) = getimagesize($uploadedFileName);

    if ($width >= $height)
    {
        $newWidth  = 150;
        $newHeight = ($height / $width) * $newWidth;
    }
    else
    {
        $newHeight = 150;
        $newWidth = ($width / $height) * $newHeight;
    }

    $tmpThumb = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($tmpThumb, $imgSrc, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    $targetThumb = generateFilePath($targetDir, getThumbnailName($fileName));
    imagejpeg($tmpThumb, $targetThumb, 100);

    imagedestroy($imgSrc);
    imagedestroy($tmpThumb);

    $targetFilePath = generateFilePath($targetDir, basename($fileName));

    return(move_uploaded_file($uploadedFileName, $targetFilePath));
}


// Rename an image stored in the server.
function renameImage($oldName, $newName, $dir)
{
    $targetFilePath = generateFilePath($dir, $oldName);
    $targetThumbPath = generateFilePath($dir, getThumbnailName($oldName));

    if (!file_exists($targetFilePath) ||
        !file_exists($targetThumbPath))
    {
        die("Target files do not exist.");
    }

    rename($targetFilePath, generateFilePath($dir, $newName));
    rename($targetThumbPath, generateFilePath($dir, getThumbnailName($newName)));
}

?>

