<?

$curDirPath = dirname(__FILE__);
include_once("$curDirPath/../../../producers/functions.php");
include_once("$curDirPath/../../../restaurant/common.php");

// Copied from UrlUtility.js
function generateCountryPageUrl($strCountry)
{
    $strUrl           = 'http://anyway-grapes.jp/producers';
    $strCountryFolder = $strCountry ? generateFolderName($strCountry, $strCountry) : '';
    if ($strCountryFolder !== '')
    {
        $strUrl = "$strUrl/$strCountryFolder";
    }

    return $strUrl;
}

// Copied from UrlUtility.js
function generateProducerPageUrl($sqlRow)
{
    $strCountry  = $sqlRow['country'];
    $strRegion   = !empty($sqlRow['region'])     ? generateFolderName($sqlRow['region'], $strCountry)     : '';
    $strDistrict = !empty($sqlRow['district'])   ? generateFolderName($sqlRow['district'], $strCountry)   : '';
    $strVillage  = !empty($sqlRow['village'])    ? generateFolderName($sqlRow['village'], $strCountry)    : '';
    $strProducer = !empty($sqlRow['short_name']) ? generateFolderName($sqlRow['short_name'], $strCountry) : '';
    $strUrl      = generateCountryPageUrl($strCountry);

    if ($strRegion !== '')
    {
        $strUrl = "$strUrl/$strRegion";
    }

    if ($strDistrict !== '')
    {
        if ($strCountry === 'France')
        {
            $strUrl = "$strUrl/$strDistrict";
        }
    }

    if ($strVillage !== '')
    {
        $strUrl = "$strUrl/$strVillage";
    }

    if ($strProducer !== '')
    {
        $strUrl = "$strUrl/$strProducer";
    }

    return $strUrl;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $strXml = '<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    $result = mysqli_query($dbc, "CALL get_producer_detail('')");
    if ($result !== FALSE)
    {
        $strLastMod = date('Y-m-d');
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
        {
            $strXml .= '
    <url>
        <loc>' . generateProducerPageUrl($row) . '</loc>
        <lastmod>' . $strLastMod . '</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>';
        }

        mysqli_free_result($result);
    }

    $strXml .= '
</urlset>';
}

mysqli_close($dbc);

file_put_contents('../../../sitemap.xml', $strXml);
echo 'Finished refreshing sitemap.xml :)';

?>
