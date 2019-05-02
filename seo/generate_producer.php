<?php

$curDirPath = dirname(__FILE__);
require_once("$curDirPath/../../../producers/functions.php");

function createProducerIndexPage($newDirPath, $fullName, $basePagePath)
{
    $producerPage = fopen("$newDirPath/index.php", 'w');
    fwrite($producerPage, "<?php\n");
    fwrite($producerPage, '$producer = \'' . $fullName . "';\n");
    fwrite($producerPage, "include_once('$basePagePath');\n");
    fwrite($producerPage, "?>");
    fclose($producerPage);
}

function createProducerPage($country, $region, $district, $village, $shortName, $name)
{
    $country = trim($country);
    $region  = trim($region);

    $basePagePath = '../../../producer_base.php';
    $strParentDir =
        '../../../producers/' .
        generateFolderName($country, $country) . '/' .
        generateFolderName($region, $country)  . '/';

    if ($district != '')
    {
        $district      = trim($district);
        $basePagePath  = '../' . $basePagePath;
        $strParentDir .= generateFolderName($district, $country) . '/';
    }

    if ($village != '')
    {
        $village       = trim($village);
        $basePagePath  = '../' . $basePagePath;
        $strParentDir .= generateFolderName($village, $country) . '/';
    }

    $newDirPath = $strParentDir . generateFolderName($shortName, $country);
    $oldDirPath = '';
    if (isset($_POST['short_name']) && ($shortName != $_POST['short_name']))
    {
        $oldDirPath = $strParentDir . generateFolderName($_POST['short_name'], $country);
    }

    if (!file_exists($newDirPath))
    {
        if (file_exists($oldDirPath))
        {
            rename($oldDirPath, $newDirPath);
            unlink("$newDirPath/index.php");
        }
        else
        {
            mkdir($newDirPath, 0777, true);
        }

        createProducerIndexPage($newDirPath, $name, $basePagePath);
    }
    else if (isset($_POST['full_name']) && ($_POST['full_name'] != $name))
    {
        unlink("$newDirPath/index.php");
        createProducerIndexPage($newDirPath, $name, $basePagePath);
    }
}

function saveProducer($dbc)
{
    $name               = mysqli_real_escape_string($dbc, $_POST['eng_producer_full']);
    $jpnName            = mysqli_real_escape_string($dbc, $_POST['jpn_producer_full']);
    $shortName          = $_POST['eng_producer'] ? mysqli_real_escape_string($dbc, $_POST['eng_producer']) : $name;
    $shortJpnName       = $_POST['jpn_producer'] ? mysqli_real_escape_string($dbc, $_POST['jpn_producer']) : $jpnName;
    $country            = trim(mysqli_real_escape_string($dbc, $_POST['eng_country']));
    $region             = trim(mysqli_real_escape_string($dbc, $_POST['eng_state']));
    $jpnRegion          = trim(mysqli_real_escape_string($dbc, $_POST['jpn_state']));
    $district           = isset($_POST['eng_district']) ? trim(mysqli_real_escape_string($dbc, $_POST['eng_district'])) : '';
    $jpnDistrict        = isset($_POST['jpn_district']) ? trim(mysqli_real_escape_string($dbc, $_POST['jpn_district'])) : '';
    $village            = isset($_POST['eng_village']) ?  trim(mysqli_real_escape_string($dbc, $_POST['eng_village'])) : '';
    $jpnVillage         = isset($_POST['jpn_village']) ?  trim(mysqli_real_escape_string($dbc, $_POST['jpn_village'])) : '';
    $homePageUrl        = mysqli_real_escape_string($dbc, $_POST['home_url']);
    $foundedYear        = mysqli_real_escape_string($dbc, $_POST['founded_year']);
    $headquarter        = mysqli_real_escape_string($dbc, $_POST['headquarter']);
    $jpnHeadquarter     = mysqli_real_escape_string($dbc, $_POST['jpn_headquarter']);
    $familyHead         = mysqli_real_escape_string($dbc, $_POST['manager_name']);
    $jpnFamilyHead      = mysqli_real_escape_string($dbc, $_POST['jpn_manager']);
    $fieldArea          = $_POST['total_ha'] ? (mysqli_real_escape_string($dbc, $_POST['total_ha'])) : '';
    $importer           = mysqli_real_escape_string($dbc, $_POST['importer']);
    $historyDetail      = mysqli_real_escape_string($dbc, $_POST['history_detail']);
    $fieldDetail        = mysqli_real_escape_string($dbc, $_POST['field_detail']);
    $fermentationDetail = mysqli_real_escape_string($dbc, $_POST['fermentation_detail']);
    $originalContents   = mysqli_real_escape_string($dbc, $_POST['other_detail']);
    $fOriginal          = isset($_POST['is_original']) ? mysqli_real_escape_string($dbc, $_POST['is_original']) : 0;
    $fMulti             = isset($_POST['is_multi']) ? mysqli_real_escape_string($dbc, $_POST['is_multi']) : 0;

    if (($region == 'Languedoc') || ($region == 'Roussillon'))
    {
        $region    = 'Languedoc et Roussillon';
        $jpnRegion = 'ラングドック地方とルーション地方';
    }

    if (isset($_POST['full_name']) && ($_POST['full_name'] != $_POST['eng_producer_full']))
    {
        $oldName = mysqli_real_escape_string($dbc, $_POST['full_name']);
        prepareNextQuery($dbc);
        mysqli_query($dbc, "CALL remove_producer('$oldName')");

        prepareNextQuery($dbc);
        mysqli_query($dbc, "CALL change_producer_name_in_favorite_list('$oldName', '$name')");
    }

    prepareNextQuery($dbc);
    mysqli_query($dbc, "CALL add_producer('$name', '$jpnName', '$shortName', '$shortJpnName', '$country', '$region', '$jpnRegion', '$district', '$jpnDistrict', '$village', '$jpnVillage', '$homePageUrl', '$foundedYear', '$headquarter', '$jpnHeadquarter', '$familyHead', '$jpnFamilyHead', '$fieldArea', '$importer', '$historyDetail', '$fieldDetail', '$fermentationDetail', '$originalContents', $fOriginal, $fMulti)");

    createProducerPage($country, $region, $district, $village, $shortName, $name);
}

function generateOptionTag($strCountry, $fSelected)
{
    global $rgobjCountry;

    $jpnCountry = $rgobjCountry[$strCountry];

    $html = '';
    if ($fSelected)
    {
        $html = '<option value="' . $strCountry . '" selected="selected">' . $jpnCountry . '</option>';
    }
    else
    {
        $html = '<option value="' . $strCountry . '">' . $jpnCountry . '</option>';
    }

    return $html;
}

$disableSession = TRUE;
require_once('../defines.php');
require('../../../includes/config.inc.php');
require(MYSQL);

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    saveProducer($dbc);

    $engCountry      = $_POST['eng_country'];
    $jpnCountry      = $rgobjCountry[$engCountry];
    $engState        = $_POST['eng_state'];
    $jpnState        = $_POST['jpn_state'];
    $engProducerFull = $_POST['eng_producer_full'];
    $jpnProducerFull = $_POST['jpn_producer_full'];
    $engProducer     = $_POST['eng_producer'] ? $_POST['eng_producer'] : $engProducerFull;
    $jpnProducer     = $_POST['jpn_producer'] ? $_POST['jpn_producer'] : $jpnProducerFull;
    $homeUrl         = $_POST['home_url'];
    $foundedYear     = $_POST['founded_year'] ? ($_POST['founded_year'] . '年') : '';
    $headquarter     = $_POST['headquarter'];
    $jpnHeadquarter  = $_POST['jpn_headquarter'];
    $managerName     = $_POST['manager_name'];
    $jpnManagerName  = $_POST['jpn_manager'];
    $totalHa         = $_POST['total_ha'] ? ($_POST['total_ha'] . 'ha') : '';
    $importer        = $_POST['importer'];

    $historyAndDetail   = $_POST['history_detail'];
    $fieldDetail        = $_POST['field_detail'];
    $fermentationDetail = $_POST['fermentation_detail'];

    $engDistrict = isset($_POST['eng_district']) ? $_POST['eng_district'] : '';
    $jpnDistrict = isset($_POST['jpn_district']) ? $_POST['jpn_district'] : '';

    $engVillage = isset($_POST['eng_village']) ? $_POST['eng_village'] : '';
    $jpnVillage = isset($_POST['jpn_village']) ? $_POST['jpn_village'] : '';

    if ($historyAndDetail)
    {
        $historyAndDetail = nl2br($historyAndDetail);
    }
    else
    {
        $historyAndDetail = 'Not Available...';
    }

    if ($fieldDetail)
    {
        $fieldDetail = nl2br($fieldDetail);
    }
    else
    {
        $fieldDetail = 'Not Available...';
    }

    if ($fermentationDetail)
    {
        $fermentationDetail = nl2br($fermentationDetail);
    }
    else
    {
        $fermentationDetail = 'Not Available...';
    }

    $strKeywords    = "$engProducer,$jpnProducer,$engCountry,$jpnCountry,$engState,$jpnState,ワイン,wine";
    $countryPageUrl = 'http://anyway-grapes.jp/producers/' . str_replace(' ', '-', strtolower($engCountry));

    $stateFolderName = generateFolderName($engState, $engCountry);
    $statePageUrl    = $countryPageUrl . '/' . $stateFolderName;
    $metaDescription = $engProducerFull . '（' . $jpnProducerFull . '）' . 'についての情報をまとめているページです。';

    echo '
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <title>' . $engProducer . '（' . $jpnProducer . '）</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="description" content="' . $metaDescription . '" />
        <meta name="keywords" content="' . $strKeywords . '">
        <meta name="author" content="Conceptual Wine Boutique Anyway-Grapes">
        <script type="text/javascript">

        document.createElement(\'header\');
        document.createElement(\'footer\');

        </script>
        <style type="text/css">

        blockquote
        {
            padding: 0;
            margin: 0;
        }

        table
        {
            border-collapse: collapse;
            width: 100%;
        }

        table.propertyTable td
        {
            font-size: 10px;
            border: none;
        }

        td
        {
            border: 1px solid rgb(224, 224, 224);
            padding: 5px 10px 5px 10px;
        }

        td:nth-child(1)
        {
            width: 80px;
        }

        td.itemFooterCol, td.priceCol
        {
            text-align: center;
        }

        div.container
        {
            width: 950px;

            font-family: "KozGoPro-Light", "小塚ゴシック Pro L", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "游ゴシック", YuGothic, "メイリオ", Meiryo, sans-serif;
            font-size: 12px;

            background-color: white;
            color: rgb(80, 80, 80);

            margin: 0 auto 0 auto;
            padding: 15px 100px 15px 100px;
        }

        body
        {
            background-image: url("http://anyway-grapes.jp/images/background.jpg");
            background-size: 30%;
        }

        header, div.contents, footer
        {
            width: 100%;
            margin: 0 auto 30px auto;
        }

        header ul
        {
            margin: 0;
            padding: 5px;
        }

        header ul li
        {
            padding-right: 10px;
            display: inline;
        }

        header ul li:first-child
        {
            padding: 0;
        }

        .jpnSmallText
        {
            font-size: 9px;
            font-family: "KozGoPro-Light", "小塚ゴシック Pro L", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "游ゴシック", YuGothic, "メイリオ", Meiryo, sans-serif;
        }

        .jpnMediumText
        {
            font-size: 11px;
            font-family: "KozGoPro-Light", "小塚ゴシック Pro L", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "游ゴシック", YuGothic, "メイリオ", Meiryo, sans-serif;
        }

        .engLargeText
        {
            font-size: 20px;
            font-family: Helvetica, Arial, sans-serif;
        }

        div.contents h1
        {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 20px;
            margin-bottom: 0;
        }

        div.contents h2
        {
            font-size: 12px;
            margin-top: 0;
        }

        div.contents h3
        {
            font-size: 12px;
        }

        div.imagePane
        {
            height: 238px;
            margin-bottom: 30px;
        }

        div.imagePane img
        {
            border: none;
            width: 33.3%;

            float: left;
        }

        footer
        {
            text-align: center;
        }

        footer img.shopLogo
        {
            padding: 10px;
            width: 125px;
            border: 1px solid rgb(224, 224, 224);
        }

        footer img:hover, table img:hover
        {
            cursor: pointer;
            opacity: 0.5;
        }

        div.fb-like
        {
            vertical-align: top;
        }

        iframe#twitter-widget-0
        {
            vertical-align: bottom;
        }

        ul#wineList
        {
            padding: 0;
            list-style-type: none;
        }
 
        ul#wineList > li
        {
            padding: 15px 0 15px 0;
        }

        @media only screen and (max-device-width: 480px)
        {
            div.container
            {
                width: 100%;

                margin: 0;
                padding: 15px 0 15px 0;
            }

            header ul li
            {
                display: block;
                padding: 10px 0 0 0;
            }

            iframe#twitter-widget-0
            {
                margin-right: 20px;
            }

            td.itemFooterCol
            {
                text-align: left;
            }

            td.itemFooterCol span
            {
                display: block;
            }

            ul#wineList img
            {
                max-width: 100px;
            }

            div.imagePane
            {
                height: auto;
            }

            div.imagePane img
            {
                float: none;
                width: 100%;
            }
        }

        </style>
    </head>
    <body>
        <div id="fb-root"></div>
        <script async="async" type="text/javascript">

        // Facebook function
        (function(d, s, id)
        {
            var js,
                fjs = d.getElementsByTagName(s)[0];

            if (!d.getElementById(id))
            {
                js     = d.createElement(s);
                js.id  = id;
                js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.4";

                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, \'script\', \'facebook-jssdk\'));

        // Twitter function
        !function(d, s, id)
        {
            var js,
                fjs = d.getElementsByTagName(s)[0],
                p   = /^http:/.test(d.location) ? \'http\' : \'https\';

            if (!d.getElementById(id))
            {
                js     = d.createElement(s);
                js.id  = id;
                js.src = p + \'://platform.twitter.com/widgets.js\';

                fjs.parentNode.insertBefore(js,fjs);
            }
        }(document, \'script\', \'twitter-wjs\');

        </script>
        <div class="container">
            '. $engProducerFull . '
            <header>
                <ul>
                    <li><a href="' . $countryPageUrl . '">' . $engCountry . ' / <span class="jpnSmallText">' . $jpnCountry . '</span></a></li>
                    <li>&nbsp;&nbsp;&gt;&gt;</li>
                    <li><a href="' . $statePageUrl . '">' . $engState . ' / <span class="jpnSmallText">' . $jpnState . '</span></a></li>
                    <li>&nbsp;&nbsp;&gt;&gt;</li>';

    if (($engDistrict != '') && ($jpnDistrict != ''))
    {
        $districtFolderName = generateFolderName($engDistrict, $engCountry);
        $districtPageUrl    = $statePageUrl . '/' . $districtFolderName;

        echo '
                    <li><a href="' . $districtPageUrl . '">' . $engDistrict . ' / <span class="jpnSmallText">' . $jpnDistrict . '</span></a></li>
                    <li>&nbsp;&nbsp;&gt;&gt;</li>';

        if (($engVillage != '') && ($jpnVillage != ''))
        {
            $villageFolderName = generateFolderName($engVillage, $engCountry);
            $villagePageUrl    = $districtPageUrl . '/' . $villageFolderName;

            echo '
                    <li><a href="' . $villagePageUrl . '">' . $engVillage . ' / <span class="jpnSmallText">' . $jpnVillage . '</span></a></li>
                    <li>&nbsp;&nbsp;&gt;&gt;</li>';
        }
    }

    $twitterHash = generateFolderName($engProducer, $engCountry);

    echo '
                    <li><strong>' . $engProducer . '（' . $jpnProducer . '）</strong></li>
                </ul>
                <br />
                <a href="https://twitter.com/share" class="twitter-share-button" data-lang="ja" data-count="none" data-hashtags="' . $twitterHash . '">ツイート</a>
                <div class="fb-like" data-layout="button_count" data-show-faces="true" data-share="false"></div>
            </header>
        <div class="contents">
            <h1>' . $engProducerFull . '</h1>
            <h2>' . $jpnProducerFull . '</h2>
            <div class="imagePane">
                <img src="./' . $twitterHash . '-1.jpg" alt="' . $jpnProducerFull . 'の写真1" />
                <img src="./' . $twitterHash . '-2.jpg" alt="' . $jpnProducerFull . 'の写真2" />
                <img src="./' . $twitterHash . '-3.jpg" alt="' . $jpnProducerFull . 'の写真3" />
            </div>
            <table>
                <tr>
                    <td>URL</td>
                    <td><a href="' . $homeUrl . '" rel="nofollow">' . $homeUrl . '</a></td>
                </tr>
                <tr>
                    <td>設立</td>
                    <td>' . $foundedYear . '</td>
                </tr>
                <tr>
                    <td>本拠地</td>
                    <td>' . $headquarter . '（' . $jpnHeadquarter . '）</td>
                </tr>
                <tr>
                    <td>当主</td>
                    <td>' . $managerName . '（' . $jpnManagerName . '）</td>
                </tr>
                <tr>
                    <td>畑の総面積</td>
                    <td>' . $totalHa . '</td>
                </tr>
                <tr>
                    <td>インポーター</td>
                    <td>' . $importer . '</td>
                </tr>
                <tr>
                    <td>資料提供</td>
                    <td>' . $importer . '</td>
                </tr>
            </table>
            <br />
            <h3>❦ 詳細・歴史</h3>
            <blockquote>' . $historyAndDetail . '</blockquote>
            <h3>❦ 畑</h3>
            <blockquote>' . $fieldDetail . '</blockquote>
            <h3>❦ 醸造</h3>
            <blockquote>' . $fermentationDetail . '</blockquote>
            <ul id="wineList">';

$i           = 1;
$wineName    = '';
$wineJpnName = '';
$wineDetail  = '';

while (isset($_POST["barcode_$i"]) || isset($_POST["wine_detail_$i"]))
{
    $barcode           = isset($_POST["barcode_$i"])     ? $_POST["barcode_$i"]     : '';
    $wineDetail        = isset($_POST["wine_detail_$i"]) ? $_POST["wine_detail_$i"] : '';
    $wineName          = '';
    $wineJpnName       = '';
    $strCepage         = '';
    $escapedProducer   = mysqli_real_escape_string($dbc, $engProducerFull);
    $escapedWineDetail = mysqli_real_escape_string($dbc, $wineDetail);

    if ($wineDetail)
    {
        $wineDetail = nl2br($wineDetail);
    }

    if ($barcode != '')
    {
        prepareNextQuery($dbc);
        $result = mysqli_query($dbc, "CALL get_wine('$barcode')");
        if ($result !== FALSE)
        {
            global $curDirPath;

            // Get tax rate from config file.
            $config = include("$curDirPath/../../../config.php");
            $taxRate = $config['tax']['rate']();

            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

            $wineName    = $row['combined_name'];
            $wineJpnName = $row['combined_name_jpn'];
            $strType     = $row['type'];
            $strVintage  = $row['vintage'];
            $strCepage   = $row['cepage'];
            $intStock    = intval($row['stock']);
            $strPrice    = number_format(floor($row['price'] * (1 + $taxRate)));

            if (!$wineDetail)
            {
                $wineDetail = nl2br($row['comment']);
            }

            echo '
                    <li>
                        <table>
                            <tr>
                                <td>
                                    <img src="http://anyway-grapes.jp/producers/images/wines/' . $barcode . '.png" alt="' . $wineJpnName . '" />
                                </td>
                                <td>
                                    <strong>' . $wineName . '</strong>
                                    <br />
                                    <span id="' . $barcode . '" class="jpnSmallText">' . $wineJpnName . '</span>
                                    <br /><br />
                                    <table class="propertyTable">
                                        <tr>
                                            <td>タイプ:</td>
                                            <td>' . $strType . '</td>
                                        </tr>
                                        <tr>
                                            <td>生産年:</td>
                                            <td>' . $strVintage . '</td>
                                        </tr>
                                        <tr>
                                            <td>ブドウ品種:</td>
                                            <td>' . $strCepage . '</td>
                                        </tr>
                                    </table>
                                    <br />
                                    <blockquote>' . $wineDetail . '</blockquote>
                                </td>
                            </tr>
                            <tr>
                                <td class="priceCol jpnMediumText"><span class="engLargeText">' . $strPrice . '</span>円 (税込)</td>
                                <td class="itemFooterCol">';
    if ($intStock > 0)
    {
        echo '
                                    <span>
                                        <a href="#" onclick="addItemToCart(\'' . $barcode . '\', \'' . $wineJpnName . '\');return false;">
                                            <img src="http://anyway-grapes.jp/campaign/add_to_cart.png" title="カートに追加する" />カートに追加する。
                                        </a>
                                    </span>';
    }

    echo '
                                    <span>
                                        <a href="https://anyway-grapes.jp/cart.php"><img src="http://anyway-grapes.jp/campaign/cash_register.png" title="レジへ進む" /> レジへ進む。</a>
                                    </span>
                                    <br />
                                </td>
                            </tr>
                        </table>
                    </li>';

            mysqli_free_result($result);
        }
    }
    else
    {
        if ($wineDetail != '')
        {
            $barcode = '0000';

            echo '
                    <li>
                        <strong>' . $wineName . '</strong>
                        <br />' .
                        $wineDetail . '
                    </li>';
        }
    }

    if ($barcode != '')
    {
        prepareNextQuery($dbc);
        mysqli_query($dbc, "CALL add_wine_detail('$escapedProducer', '$barcode', '$escapedWineDetail')");
    }

    ++$i;
}

$purchasePageUrl = 'http://anyway-grapes.jp/index.php?pc_view=1&amp;submenu=campaign&amp;producer=' . str_replace(' ', '%20', htmlentities($engProducerFull, ENT_QUOTES));

echo '
            </ul>
        </div>
        <footer>
            <a href="http://anyway-grapes.jp"><img src="http://anyway-grapes.jp/producers/logo.png" alt="ワインのAnyway-Grapes｜世田谷区 経堂" class="shopLogo" /></a>
        </footer>
    </body>
</html>

<script type="text/javascript">

function encodeHtmlForm(data)
{
    var params = [];

    for (var name in data)
    {
        var value = data[name];
        var param = encodeURIComponent(name) + \'=\' + encodeURIComponent(value);

        params.push(param);
    }

    return params.join(\'&\').replace(/%20/g, \'+\');
}

function addItemToCart(itemId, itemName)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject(\'Microsoft.XMLHTTP\');
    }

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == XMLHttpRequest.DONE)
        {
            if (xmlhttp.status == 200)
            {
                alert(\'カートに\' + itemName + \'が追加されました。\');
            }
            else if (xmlhttp.status == 400)
            {
                console.error(\'ERROR 400\');
            }
            else
            {
                console.error(\'UNKNOWN ERROR\');
            }
        }
    }

    var data = { action: \'add\', pid: itemId, qty: 1 }; 
    xmlhttp.open(\'POST\', \'http://anyway-grapes.jp/cart.php\', true);
    xmlhttp.setRequestHeader(\'Content-Type\', \'application/x-www-form-urlencoded\');
    xmlhttp.send(encodeHtmlForm(data));
}

</script>
';
}
else
{
    $country            = '';
    $fullName           = '';
    $jpnFullName        = '';
    $shortName          = '';
    $jpnShortName       = '';
    $homeUrl            = '';
    $foundedYear        = '';
    $headquarter        = '';
    $jpnHeadquarter     = '';
    $managerName        = '';
    $jpnManagerName     = '';
    $totalHa            = '';
    $importer           = '';
    $historyAndDetail   = '';
    $fieldDetail        = '';
    $fermentationDetail = '';
    $originalContents   = '';
    $intIsMulti         = 0;
    $strOriginalChecked = '';
    $region             = '';
    $jpnRegion          = '';
    $district           = '';
    $jpnDistrict        = '';
    $village            = '';
    $jpnVillage         = '';

    if (isset($_GET['name']))
    {
        $fullName    = $_GET['name'];
        $sqlFullName = mysqli_real_escape_string($dbc, $_GET['name']);

        $result = mysqli_query($dbc, "CALL get_producer_detail('$sqlFullName')");
        if ($result !== FALSE)
        {
            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
            $country        = $row['country'];
            $region         = $row['region'];
            $jpnRegion      = $row['region_jpn'];

            $district    = isset($row['district'])     ? $row['district'] : '';
            $jpnDistrict = isset($row['district_jpn']) ? $row['district_jpn'] : '';
            $village     = isset($row['village'])      ? $row['village'] : '';
            $jpnVillage  = isset($row['village_jpn'])  ? $row['village_jpn'] : '';

            $jpnFullName    = $row['name_jpn'];
            $shortName      = $row['short_name'];
            $jpnShortName   = $row['short_name_jpn'];
            $homeUrl        = $row['home_page'];
            $foundedYear    = $row['founded_year'];
            $headquarter    = $row['headquarter'];
            $jpnHeadquarter = $row['headquarter_jpn'];
            $managerName    = $row['family_head'];
            $jpnManagerName = $row['family_head_jpn'];
            $totalHa        = $row['field_area'];
            $importer       = $row['importer'];

            $historyAndDetail   = $row['history_detail'];
            $fieldDetail        = $row['field_detail'];
            $fermentationDetail = $row['fermentation_detail'];
            $originalContents   = $row['original_contents'];

            if (isset($row['is_original']) && ($row['is_original'] == 1))
            {
                $strOriginalChecked = 'checked="checked"';
            }

            if (isset($row['is_multi']) && ($row['is_multi'] == 1))
            {
                $intIsMulti = 1;
            }
        }
    }

echo '
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <title>生産者ページ生成ツール</title>
        <meta name="author" content="Yukitaka Maeda">
        <style>
        
        table
        {
            font-size: 12px;
        }

        td.inputCol > input, textarea
        {
            width: 400px;
        }

        input.barcodeFld
        {
            width: 50px;
        }

        select#districtSelect, select#villageSelect
        {
            display: none;
        }

        </style>
    </head>
    <body>
        <form action="./generate_producer.php" method="POST">
            <table>
                <tr>
                    <td>
                        <select name="eng_country" id="countrySelect">';

echo generateOptionTag('South Africa',   ($country == 'South Africa'));
echo generateOptionTag('France',         ($country == 'France'));
echo generateOptionTag('Italy',          ($country == 'Italy'));
echo generateOptionTag('Spain',          ($country == 'Spain'));
echo generateOptionTag('Germany',        ($country == 'Germany'));
echo generateOptionTag('Georgia',        ($country == 'Georgia'));
echo generateOptionTag('Austria',        ($country == 'Austria'));
echo generateOptionTag('Rumania',        ($country == 'Rumania'));
echo generateOptionTag('Portugal',       ($country == 'Portugal'));
echo generateOptionTag('United Kingdom', ($country == 'United Kingdom'));
echo generateOptionTag('Hungary',        ($country == 'Hungary'));
echo generateOptionTag('Slovenia',       ($country == 'Slovenia'));
echo generateOptionTag('Croatia',        ($country == 'Croatia'));
echo generateOptionTag('Canada',         ($country == 'Canada'));
echo generateOptionTag('United States',  ($country == 'United States'));
echo generateOptionTag('Australia',      ($country == 'Australia'));
echo generateOptionTag('New Zealand',    ($country == 'New Zealand'));
echo generateOptionTag('Chile',          ($country == 'Chile'));
echo generateOptionTag('Argentina',      ($country == 'Argentina'));
echo generateOptionTag('Moldova',        ($country == 'Moldova'));
echo generateOptionTag('Bulgaria',       ($country == 'Bulgaria'));
echo generateOptionTag('Greece',         ($country == 'Greece'));
echo generateOptionTag('Japan',          ($country == 'Japan'));

echo '
                        </select>
                    </td>
                    <td>
                        <select name="eng_state" id="regionSelect">';

if ($region == '')
{
    echo '<option value="Western Cape">西ケープ州</option>';
}
else
{
    echo '<option value="' . $region . '">' . $jpnRegion . '</option>';
}

echo '
                        </select>
                    </td>';

if (!isset($_GET['name']))
{
	echo '
                    <td>
                        <select name="eng_district" id="districtSelect">
                            <option value="">(None)</option>
                            <option value="Côte de Nuits">コート・ド・ニュイ地区</option>
                            <option value="Côte de Beaune">コート・ド・ボーヌ地区</option>
                            <option value="Beaujolais">ボジョレー地区</option>
                            <option value="Chablis & Grand Auxerrois">シャブリ＆グラン・オーセロワ地区</option>
                            <option value="Côte Chalonnaise">コート・シャロネーズ地区</option>
                            <option value="Mâconnais">マコネー地区</option>
                            <option value="Châtillonnais">シャティヨネ地区</option>
                        </select>
                    </td>
                    <td>
                        <select name="eng_village" id="villageSelect">
                        </select>
                    </td>';
}
else
{
    if ($district != '')
    {
        echo '<td>
                  <select name="eng_district" id="districtSelect" style="display:inline;">
                      <option value="' . $district . '">' . $jpnDistrict . '</option>
                  </select>
              </td>';
    }
    else
    {
        echo '<td><select name="eng_district" id="districtSelect" style="display:none;"></select></td>';
    }

    if ($village != '')
    {
        echo '<td>
                  <select name="eng_village" id="villageSelect" style="display:inline;">
                      <option value="' . $village . '">' . $jpnVillage . '</option>
                  </select>
              </td>';
    }
    else
    {
        echo '<td><select name="eng_village" id="villageSelect" style="display:none;"></select></td>';
    }

    echo '
        </tr>
        <tr>
            <td>
                <input type="hidden" name="short_name" value="' . $shortName . '" />
            </td>
            <td>
                <input type="hidden" name="full_name" value="' . $_GET['name'] . '" />
            </td>
        </tr>
';
}

echo '
                </tr>
                <tr>
                    <td>
                        生産者名
                    </td>
                    <td class="inputCol">
                        <input type="text" name="eng_producer_full" value="' . $fullName . '" /><br />
                    </td>
                </tr>
                <tr>
                    <td>
                        生産者名（日本語）
                    </td>
                    <td class="inputCol">
                        <input type="text" name="jpn_producer_full" value="' . $jpnFullName . '" /><br />
                    </td>
                </tr>
                <tr>
                    <td>
                        検索用の生産者名
                    </td>
                    <td class="inputCol">
                        <input type="text" name="eng_producer" value="' . $shortName . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        検索用の生産者名（日本語）
                    </td>
                    <td class="inputCol">
                        <input type="text" name="jpn_producer" value="' . $jpnShortName . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        ホームページURL
                    </td>
                    <td class="inputCol">
                        <input type="text" name="home_url" value="' . $homeUrl . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        設立年
                    </td>
                    <td class="inputCol">
                        <input type="number" name="founded_year" value="' . $foundedYear . '" />年
                    </td>
                </tr>
                <tr>
                    <td>
                        本拠地
                    </td>
                    <td class="inputCol">
                        <input type="text" name="headquarter" value="' . $headquarter . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        本拠地（日本語）
                    </td>
                    <td class="inputCol">
                        <input type="text" name="jpn_headquarter" value="' . $jpnHeadquarter . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        当主
                    </td>
                    <td class="inputCol">
                        <input type="text" name="manager_name" value="' . $managerName . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        当主（日本語）
                    </td>
                    <td class="inputCol">
                        <input type="text" name="jpn_manager" value="' . $jpnManagerName . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        輸入元
                    </td>
                    <td class="inputCol">
                        <input type="text" name="importer" value="' . $importer . '" />
                    </td>
                </tr>
                <tr>
                    <td>
                        畑の総面積
                    </td>
                    <td class="inputCol">
                        <input type="number" name="total_ha" value="' . $totalHa . '" />ha
                    </td>
                </tr>
                <tr>
                    <td>
                        オリジナル・コンテンツ
                    </td>
                    <td class="inputCol">
                        <input type="checkbox" name="is_original" value="1" ' . $strOriginalChecked . '/>
                    </td>
                </tr>
                <tr>
                    <td>
                        詳細・歴史
                    </td>
                    <td class="inputCol">
                        <textarea name="history_detail" rows="10">' . $historyAndDetail . '</textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        畑
                    </td>
                    <td class="inputCol">
                        <textarea name="field_detail" rows="10">' . $fieldDetail . '</textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        醸造
                    </td>
                    <td class="inputCol">
                        <textarea name="fermentation_detail" rows="10">' . $fermentationDetail . '</textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        その他
                    </td>
                    <td class="inputCol">
                        <textarea name="other_detail" rows="10">' . $originalContents . '</textarea>
                    </td>
                </tr>
            </table>
            <br /><hr />
            <input type="hidden" name="is_multi" value="' . $intIsMulti . '" />
            <input type="submit" value="生産者ページを生成" />
            <br /><hr /><br />';

$inputListHtml = '';

if (!isset($_GET['name']))
{
    for ($i = 1; $i <= 30; ++$i)
    {
        $inputListHtml .= "
            【<input type=\"text\" name=\"barcode_$i\" placeholder=\"コード\" class=\"barcodeFld\" />】<br />
             <textarea name=\"wine_detail_$i\" rows=\"5\" placeholder=\"ワインの説明\"></textarea><br />";
    }
}
else
{
    $i        = 1;
    $producer = mysqli_real_escape_string($dbc, $_GET['name']);

    prepareNextQuery($dbc);

    $result = mysqli_query($dbc, "CALL get_wine_details('$producer')");
    if ($result !== FALSE)
    {
        $cRow = mysqli_num_rows($result);
        while (($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) || ($i <= ($cRow + 15)))
        {
            $barcode    = $row['barcode_number'];
            $wineDetail = $row['detail'];

            $inputListHtml .= "
                【<input type=\"text\" name=\"barcode_$i\" placeholder=\"コード\" class=\"barcodeFld\" value=\"$barcode\"/>】<br />
                 <textarea name=\"wine_detail_$i\" rows=\"5\" placeholder=\"ワインの説明\">$wineDetail</textarea><br />";

            ++$i;
        }
    }
}

echo $inputListHtml;

echo '
            <br /><hr />
            <input type="submit" value="生産者ページを生成" />
            <input type="hidden" name="jpn_state" value="'    . $jpnRegion   . '" />
            <input type="hidden" name="jpn_district" value="' . $jpnDistrict . '" />
            <input type="hidden" name="jpn_village" value="'  . $jpnVillage  . '" />
        </form>
    </body>
</html>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">

$(document).ready(function()
{
    $("body").on("change", "select#countrySelect", function()
    {
        $("select#districtSelect").fadeOut(500);
        $("select#villageSelect").fadeOut(500);

        var strCountry = $(this).val();
        $.ajax(
        {
            url : "../../../laravel5.3/public/api/v1/regions/" + strCountry,
            dataType: "json",
            success: function(data)
            {
                var rgobjRegion = data.regions,
                    objRegion   = null,
                    cRegion     = rgobjRegion.length;
                    html        = "";

                for (var i = 0; i < cRegion; ++i)
                {
                    objRegion = rgobjRegion[i];
                    if (objRegion.region)
                    {
                        html += "<option value=\"" + objRegion.region + "\">" + objRegion.region_jpn + "</option>";
                    }
                }

                $("select#regionSelect").html(html);

                var strJpnRegion = $($("select#regionSelect option").get(0)).text();
                $("form input[name=\"jpn_state\"]").val(strJpnRegion);

                $("select#regionSelect").trigger("change");
                $("select#districtSelect").fadeIn(500);
            },

            error: function() {}
        });
    });

    $("body").on("change", "select#regionSelect", function()
    {
        $("select#districtSelect").html(\'\');

        var strEngRegion = $(this).val(),
            strJpnRegion = $(this).find("option[value=\"" + strEngRegion + "\"]").text();

        $("form input[name=\"jpn_state\"]").val(strJpnRegion);

        if ((strEngRegion == "Champagne") ||
            (strEngRegion == "Vallée du Rhône") ||
            (strEngRegion == "Bourgogne") ||
            (strEngRegion == "Vallée de la Loire") ||
            (strEngRegion == "Primorska"))
        {
            $.ajax(
            {
                url : "//anyway-grapes.jp/laravel5.3/public/api/v1/districts/" + strEngRegion,
                dataType: "json",
                success: function(data)
                {
                    var objDistrict   = null,
                        rgobjDistrict = data.districts,
                        cDistrict     = rgobjDistrict.length,
                        html          = "";

                    for (var i = 0; i < cDistrict; ++i)
                    {
                        objDistrict = rgobjDistrict[i];
                        if (objDistrict.district)
                        {
                            html += "<option value=\"" + objDistrict.district + "\">" + objDistrict.district_jpn + "</option>";
                        }
                    }

                    $("select#districtSelect").html(html);

                    var strJpnDistrict = $($("select#districtSelect option").get(0)).text();
                    $("form input[name=\"jpn_district\"]").val(strJpnDistrict);
                },

                error: function() {}
            });

            $("select#districtSelect").fadeIn(500);
        }
        else if (strEngRegion == "Bordeaux")
        {
            var html =
                "<option value=\"Saint-Estèphe\">サン・テステフ</option>" +
                "<option value=\"Pauillac\">ポイヤック</option>" +
                "<option value=\"Saint-Julien\">サン・ジュリアン</option>" +
                "<option value=\"Margaux \">マルゴー</option>" +
                "<option value=\"Haut Médoc\">オー・メドック</option>" +
                "<option value=\"Pessac-Léognan\">ペサック・レオニャン</option>" +
                "<option value=\"Sauternes\">ソーテルヌ</option>" +
                "<option value=\"Saint-Émilion\">サン・テミリオン地区</option>" +
                "<option value=\"Pomerol \">ポムロル地区</option>" +
                "<option value=\"Lalande de Pomerol\">ラランド・ドゥ・ポムロル</option>" +
                "<option value=\"Côtes de Bordeaux\">コート・ド・ボルドー</option>";

            $("select#districtSelect").html(html);
            $("select#districtSelect").fadeIn(500);

            var strJpnDistrict = $($("select#districtSelect option").get(0)).text();
            $("form input[name=\"jpn_district\"]").val(strJpnDistrict);
        }
        else
        {
            $("select#districtSelect").html("");
            $("select#districtSelect").fadeOut(500);
        }
    });

    $("body").on("change", "select#districtSelect", function()
    {
        var strEngDistrict = $(this).val(),
            strJpnDistrict = $(this).find("option[value=\"" + strEngDistrict + "\"]").text();

        $("form input[name=\"jpn_district\"]").val(strJpnDistrict);

        if ((strEngDistrict == "Côte de Nuits")  ||
            (strEngDistrict == "Côte de Beaune") ||
            (strEngDistrict == "Côte Chalonnaise"))
        {
            $.ajax(
            {
                url : "//anyway-grapes.jp/laravel5.3/public/api/v1/villages/" + strEngDistrict,
                dataType: "json",
                success: function(data)
                {
                    var rgobjVillage = data.villages,
                        objVillage   = null,
                        cVillage     = rgobjVillage.length;
                        html         = "";

                    for (var i = 0; i < cVillage; ++i)
                    {
                        objVillage = rgobjVillage[i];
                        if (objVillage.village)
                        {
                            if (objVillage.village == "Vosne-Romanée / Flagey-Echézeaux")
                            {
                                html += "<option value=\"Flagey-Echézeaux\">フラジェ・エシェゾー</option>";
                            }
                            else
                            {
                                html += "<option value=\"" + objVillage.village + "\">" + objVillage.village_jpn + "</option>";
                            }
                        }
                    }

                    //
                    html += "<option value=\"" + objVillage.village + "\">" + objVillage.village_jpn + "</option>";

                    $("select#villageSelect").html(html);

                    var strJpnVillage = $($("select#villageSelect option").get(0)).text();
                    $("form input[name=\"jpn_village\"]").val(strJpnVillage);
                },

                error: function() {}
            });

            $("select#villageSelect").fadeIn(500);
        }
        else
        {
            $("select#villageSelect").html("");
            $("select#villageSelect").fadeOut(500);
        }
    });

    $("body").on("change", "select#villageSelect", function()
    {
        var strEngVillage = $(this).val(),
            strJpnVillage = $(this).find("option[value=\"" + strEngVillage + "\"]").text();

        $("form input[name=\"jpn_village\"]").val(strJpnVillage);
    });
});

</script>';
}

mysqli_close($dbc);

?>
