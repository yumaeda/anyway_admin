//-------------------------------------------------------
// UrlQuery
//-------------------------------------------- YuMaeda --
var UrlQuery = (function()
{
    // Private members

    var m_urlQuery = null,

        _init = function()
        {
            // Get a URL query string w/o '?'.
            var strQueryParam =
                decodeURI(window.location.search.substring(1));

            if (strQueryParam)
            {
                m_urlQuery = {};

                var iequal, strKey, strKeyValue;

                var rgstrKeyValue = strQueryParam.split('&');
                for (var i = 0; i < rgstrKeyValue.length; ++i)
                {
                    strKeyValue = rgstrKeyValue[i];

                    iequal = strKeyValue.indexOf('=');
                    if (iequal === -1)
                    {
                        // handle the URL such as www.bobskitchen.com?id=2&menu 
                        m_urlQuery[strKeyValue] = '';
                    }
                    else
                    {
                        strKey = strKeyValue.substring(0, iequal);
                        if (iequal < (strKeyValue.length - 1)) 
                        {
                            m_urlQuery[strKey] = strKeyValue.substr(iequal + 1);
                        }
                        else
                        {
                            // handle the URL such as www.bobskitchen.com?id=2&menu= 
                            m_urlQuery[strKey] = '';
                        }
                    }
                }
            }
        },

        _getValue = function(strKey)
        {
            var strValue = '';

            if (!m_urlQuery)
            {
                _init();
            }
            
            if (m_urlQuery)
            {
                strValue = m_urlQuery[strKey];
            }

            return(strValue);
        };

    // Public members
    
    return(
    {
        getValue: _getValue
    });
})();

//-------------------------------------------------------
// seiya.utility-0.1.js
//
// Required: seiya.urlquery-0.1.js
//-------------------------------------------- YuMaeda --

function getRootFolderUrl()
{
    return (window.location.protocol + '//' + window.location.hostname);
}


function getLanguage()
{
    var strLang = UrlQuery.getValue('lang');
    if (!strLang)
    {
        strLang = 'ja';
    }

    return strLang;
}


// Datetime variables & functions.

var rgstrWeek =
[
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];

function getLastDateOfMonth(intYear, intMonth)
{
    return (new Date(intYear, intMonth, 0)).getDate();
}

function getDayOfWeek(intYear, intMonth, intDate)
{
    var intDayOfWeek = (new Date(intYear, intMonth - 1, intDate)).getDay();

    return rgstrWeek[intDayOfWeek];
}

function generateDateLabel(intYear, intMonth)
{
    var strLabel = (intYear >= 1900) ?
        intYear :
        (new Date()).getFullYear();

    if ((intMonth >= 1) && (intMonth <= 12))
    {
        strLabel += ('.' + intMonth);
    }

    return strLabel;
}

function formatNumber(intNumber)
{
    // convert int to string.
    intNumber += '';

    var rgstrToken = intNumber.split('.');
    var intToken = rgstrToken[0];
    var decimalToken = (rgstrToken.length > 1) ? '.' + rgstrToken[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(intToken))
    {
        intToken = intToken.replace(rgx, '$1' + ',' + '$2');
    }

    return (intToken + decimalToken);
}


function appendQuery(url, key, value)
{
    if (url)
    {
        var delimiter = (url.indexOf('?') >= 0) ? '&' : '?';
        url += (delimiter + key + '=' + value);
    }

    return url;
}


function getDefaultTextSizeCss()
{
    var strCss = null;

    if (getLanguage() === 'ja')
    {
        strCss = 'textSmall';
    }

    return strCss;
}


function contains(rgobj, obj)
{ 
    var fResult = false,
        cObj = rgobj.length;

    for (var i = 0; !fResult && (i < cObj); ++i)
    {
        if (rgobj[i] === obj)
        { 
            fResult = true;
        } 
    } 

    return fResult; 
} 


function getObjectKey(obj, index)
{
    var keys = [];
    for (var key in obj)
    {
        keys.push(key);
    }

    return keys[index];
}


// First, checks if it isn't implemented yet.
if (!String.prototype.format)
{
    String.prototype.format = function()
    {
        var args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number)
        { 
            return (typeof args[number] != 'undefined') ? args[number] : match;
        });
    };
}

// First, checks if it isn't implemented yet.
if (!String.prototype.startsWith)
{
    String.prototype.startsWith = function(str)
    {
        return this.slice(0, str.length) == str;
    };
}

// First, checks if it isn't implemented yet.
if (!String.prototype.endsWith)
{
    String.prototype.endsWith = function(str)
    {
        //return this.slice(-str.length) == str;
        return (this.indexOf(str, this.length - str.length) !== -1);
    };
}

//-------------------------------------------------------
// seiya.htmltag-0.1.js
//-------------------------------------------- YuMaeda --

var _generateClassAttribute = function(rgstrClass)
{
    var html = '',
        cClass = (rgstrClass ? rgstrClass.length: 0);

    if (cClass > 0)
    {
        html += 'class="';

        for (var i = 0; i < cClass; ++i)
        {
            if (rgstrClass[i])
            {
                html += rgstrClass[i];
            }

            if (i < (cClass - 1))
            {
                html += ' ';
            }
        }

        html += '"';
    }

    return html;
};


var _generateBeginTag = function(strTag, fHasEndTag, rgobjAttr, rgstrClass)
{
    var html = '';

    if (strTag)
    {
        html = '<' + strTag;

        // Adds class attributes.
        var strClassAttr = _generateClassAttribute(rgstrClass);
        if (strClassAttr !== '')
        {
            html += ' ' + strClassAttr;
        }

        var cAttr = (rgobjAttr ? rgobjAttr.length : 0),
            objAttr = null;

        for (var i = 0; i < cAttr; ++i)
        {
            objAttr = rgobjAttr[i];
            if (objAttr.value &&
                (objAttr.key !== 'class'))
            {
                html += ' ' + objAttr.key + '="' + objAttr.value + '"';
            }
        }

        if (!fHasEndTag)
        {
            html += ' />';
        }
        else
        {
            html += '>';
        }
    }
    else
    {
        console.error('_generateBeginTag: Invalid tag.');
    }

    return html;
};


var _generateEndTag = function(strTag)
{
    return ('</' + strTag + '>');
};


//-------------------------------------------------------
// BaseTag
//-------------------------------------------- YuMaeda --
function BaseTag(strTag, strValue)
{
    this.tag = strTag;
    this.value = strValue;

    this.attrs = [];
    this.classes = [];
}

BaseTag.prototype.isContainer = false;
BaseTag.prototype.hasEndTag = true;

BaseTag.prototype.addAttr = function(strKey, strValue)
{
    if (strKey && strValue)
    {
        this.attrs.push({ key: strKey, value: strValue });
    }
};

BaseTag.prototype.addClass = function(strClass)
{
    if (strClass)
    {
        this.classes.push(strClass);
    }
};

BaseTag.prototype.toHtml = function()
{
    if (!this.hasEndTag && this.value)
    {
        this.attrs.push({ key: 'value', value: this.value });
    }

    var html =
        _generateBeginTag(this.tag, this.hasEndTag, this.attrs, this.classes);

    if (this.hasEndTag)
    {
        html += this.value + _generateEndTag(this.tag);
    }

    return html;
};


//-------------------------------------------------------
// LabelTag
//-------------------------------------------- YuMaeda --

function LabelTag(strFor, innerHtml)
{
    // Call the parent constructor
    BaseTag.call(this, 'label', innerHtml);

    if (strFor)
    {
        this.attrs.push({ key: 'for', value: strFor });
    }

    this.classes.push('textNoWrap');
}

// inherit BaseTag
LabelTag.prototype = new BaseTag();
LabelTag.prototype.constructor = LabelTag;


//-------------------------------------------------------
// ImgTag
//-------------------------------------------- YuMaeda --

function ImgTag(strUrl)
{
    // Call the parent constructor
    BaseTag.call(this, 'img', '');

    this.attrs.push({ key: 'src', value: strUrl });
}

// inherit BaseTag
ImgTag.prototype = new BaseTag();
ImgTag.prototype.constructor = ImgTag;
ImgTag.prototype.hasEndTag = false;


//-------------------------------------------------------
// AnchorTag
//-------------------------------------------- YuMaeda --

function AnchorTag(strUrl, innerHtml)
{
    // Call the parent constructor
    BaseTag.call(this, 'a', innerHtml);

    this.attrs.push({ key: 'href', value: strUrl });
}

// inherit BaseTag
AnchorTag.prototype = new BaseTag();
AnchorTag.prototype.constructor = AnchorTag;


//-------------------------------------------------------
// SpanTag
//-------------------------------------------- YuMaeda --

function SpanTag(innerText)
{
    // Call the parent constructor
    BaseTag.call(this, 'span', innerText);
}

// inherit BaseTag
SpanTag.prototype = new BaseTag();
SpanTag.prototype.constructor = SpanTag;


//-------------------------------------------------------
// ParagraphTag
//-------------------------------------------- YuMaeda --

function ParagraphTag(innerHtml)
{
    // Call the parent constructor
    BaseTag.call(this, 'p', innerHtml);
}

// inherit BaseTag
ParagraphTag.prototype = new BaseTag();
ParagraphTag.prototype.constructor = ParagraphTag;
ParagraphTag.prototype.isContainer = true;


//-------------------------------------------------------
// DivTag
//-------------------------------------------- YuMaeda --

function DivTag(innerHtml)
{
    // Call the parent constructor
    BaseTag.call(this, 'div', innerHtml);
}

// inherit BaseTag
DivTag.prototype = new BaseTag();
DivTag.prototype.constructor = DivTag;
DivTag.prototype.isContainer = true;


//-------------------------------------------------------
// TextAreaTag
//-------------------------------------------- YuMaeda --

function TextAreaTag(strName, strValue)
{
    // Call the parent constructor
    BaseTag.call(this, 'textarea', strValue);

    this.attrs.push({ key: 'name', value: strName });
    this.attrs.push({ key: 'rows', value: '4' });
}

// inherit BaseTag
TextAreaTag.prototype = new BaseTag();
TextAreaTag.prototype.constructor = TextAreaTag;


//-------------------------------------------------------
// ButtonTag
//-------------------------------------------- YuMaeda --

function ButtonTag(strId, strCaption)
{
    // Call the parent constructor
    BaseTag.call(this, 'button', strCaption);

    this.attrs.push({ key: 'id', value: strId});
}

// inherit BaseTag
ButtonTag.prototype = new BaseTag();
ButtonTag.prototype.constructor = ButtonTag;


//-------------------------------------------------------
// FigureTag
//-------------------------------------------- YuMaeda --

function FigureTag(strUrl, strCaption)
{
    // Call the parent constructor
    BaseTag.call(this, 'figure', '');

    this.imgUrl     = strUrl;
    this.imgCaption = strCaption;
}

// inherit BaseTag
FigureTag.prototype = new BaseTag();
FigureTag.prototype.constructor = FigureTag;

// override toHtml().
FigureTag.prototype.toHtml = function()
{
    var imgTag     = new ImgTag(strUrl),
        captionTag = new BaseTag('figcaption', this.imgCaption);

    this.value = imgTag.toHtml() + captionTag.toHtml();

    return (BaseTag.prototype.toHtml.call(this));
};


//-------------------------------------------------------
// ListItemTag
//-------------------------------------------- YuMaeda --

function ListItemTag(innerHtml)
{
    BaseTag.call(this, 'li', innerHtml);
}

// inherit BaseTag
ListItemTag.prototype = new BaseTag();
ListItemTag.prototype.constructor = ListItemTag;


//-------------------------------------------------------
// ListTag
//-------------------------------------------- YuMaeda --

function ListTag(fOrdered)
{
    // Call the parent constructor
    if (fOrdered)
    {
        BaseTag.call(this, 'ol', '');
    }
    else
    {
        BaseTag.call(this, 'ul', '');
    }

    this.items = [];
}

// inherit BaseTag
ListTag.prototype = new BaseTag();
ListTag.prototype.constructor = ListTag;
ListTag.prototype.isContainer = true;

ListTag.prototype.addItem = function(listItemTag)
{
    this.items.push(listItemTag);
};

// override toHtml().
ListTag.prototype.toHtml = function()
{
    var cItem = this.items.length;

    for (var i = 0; i < cItem; ++i)
    {
        this.value += this.items[i].toHtml();
    }

    return (BaseTag.prototype.toHtml.call(this));
};


//-------------------------------------------------------
// InputTag
//-------------------------------------------- YuMaeda --

function InputTag(strName, strValue)
{
    // Call the parent constructor
    BaseTag.call(this, 'input', strValue);

    if (strName)
    {
        this.attrs.push({ key: 'name', value: strName });
    }
}

// inherit BaseTag
InputTag.prototype = new BaseTag();
InputTag.prototype.constructor = InputTag;
InputTag.prototype.hasEndTag = false;


//-------------------------------------------------------
// SelectTag
//-------------------------------------------- YuMaeda --

function SelectTag()
{
    // Call the parent constructor
    BaseTag.call(this, 'select', '');

    this.options = [];
    this.selectedIndex = -1;
    this.disabledIndex = -1;
}

// inherit BaseTag
SelectTag.prototype = new BaseTag();
SelectTag.prototype.constructor = SelectTag;

SelectTag.prototype.addOption = function(strText, objValue)
{
    if (strText)
    {
        this.options.push({ text: strText, value: objValue });
    }
};

SelectTag.prototype.addLabel = function(strText)
{
    this.disabledIndex = this.options.length;
    this.options.push({ text: strText, value: -1 });
};

SelectTag.prototype.setSelectedIndex = function(index)
{
    this.selectedIndex = index;
};

// override toHtml().
SelectTag.prototype.toHtml = function()
{
    var cOption = this.options.length,
        tmpOption = null,
        html = _generateBeginTag(this.tag, true, this.attrs, this.classes);

    for (var i = 0; i < cOption; ++i)
    {
        tmpOption = this.options[i];
        html += '<option value="' + tmpOption.value + '"';

        if (this.disabledIndex == i)
        {
            html += ' disabled="disabled"';
        }

        if (this.selectedIndex == i)
        {
            html += ' selected="selected"';
        }
            
        html += '>' + tmpOption.text + '</option>';
    }

    html += _generateEndTag(this.tag);

    return html;
};


//-------------------------------------------------------
// TableTag (TODO: Modify)
//------------------------------------------- YuMaeda --
var TableTag = (function()
{
    // Private members

    var
        m_classes = [],
        m_attrs = [],
        m_headRows = [],
        m_rows = [],
        m_footRows = [],

        _init = function()
        {
            m_classes.length = 0;
            m_attrs.length = 0;
            m_headRows.length = 0;
            m_rows.length = 0;
            m_footRows.length = 0;
        },

        _addClass = function(strClass)
        {
            m_classes.push(strClass);
        },

        _addAttr = function(strKey, objValue)
        {
            m_attrs.push({ key: strKey, value: objValue });
        },

        _addRowToHead = function(rgobjAttr, rgstrClass)
        {
            m_headRows.push({ attrs: rgobjAttr, classes: rgstrClass, cols: [] });
        },

        _addRowToFoot = function(rgobjAttr, rgstrClass)
        {
            m_footRows.push({ attrs: rgobjAttr, classes: rgstrClass, cols: [] });
        },

        _addColToHead = function(innerHtml, rgobjAttr, rgstrClass)
        {
            if (m_headRows.length > 0)
            {
                m_headRows[m_headRows.length - 1].cols.push({ html: innerHtml, attrs: rgobjAttr, classes: rgstrClass });
            }
        },

        _addColToFoot = function(innerHtml, rgobjAttr, rgstrClass)
        {
            if (m_footRows.length > 0)
            {
                m_footRows[m_footRows.length - 1].cols.push({ html: innerHtml, attrs: rgobjAttr, classes: rgstrClass });
            }
        },

        _addRow = function(rgobjAttr, rgstrClass)
        {
            m_rows.push({ attrs: rgobjAttr, classes: rgstrClass, cols: [] });
        },

        _addCol = function(innerHtml, rgobjAttr, rgstrClass)
        {
            if (m_rows.length > 0)
            {
                m_rows[m_rows.length - 1].cols.push({ html: innerHtml, attrs: rgobjAttr, classes: rgstrClass });
            }
        },

        _generateRowHtml = function(rgobjRow)
        {
            var html = '',
                cRow = rgobjRow.length;
                objRow = null;

            for (var i = 0; i < cRow; ++i)
            {
                objRow = rgobjRow[i];

                html += _generateBeginTag('tr', true, objRow.attrs, objRow.classes);

                var cCol = objRow.cols.length,
                    objCol = null;

                for (var j = 0; j < cCol; ++j)
                {
                    objCol = objRow.cols[j];

                    html +=
                        _generateBeginTag('td', true, objCol.attrs, objCol.classes) +
                        objCol.html +
                        _generateEndTag('td');
                }

                html += _generateEndTag('tr');
            }

            return(html);
        },

        _toHtml = function()
        {
            var html = _generateBeginTag('table', true, m_attrs, m_classes);

            if (m_headRows.length > 0)
            {
                html +=
                    '<thead>' +
                        _generateRowHtml(m_headRows) +
                    '</thead>';
            }

            if (m_footRows.length > 0)
            {
                html +=
                    '<tfoot>' +
                        _generateRowHtml(m_footRows) +
                    '</tfoot>'; 
            }

            html +=
                '<tbody>' +
                    _generateRowHtml(m_rows) +
                '</tbody>';

            html += _generateEndTag('table');

            return html;
        };

    // Public members
   
    return(
    {
        init:          _init,
        addAttr:       _addAttr,
        addClass:      _addClass,
        addRow:        _addRow,
        addRowToHead:  _addRowToHead,
        addRowToFoot:  _addRowToFoot,
        addCol:        _addCol,
        addColToHead:  _addColToHead,
        addColToFoot:  _addColToFoot,
        toHtml:        _toHtml
    });
})();

﻿var Constants =
{
    'COPYRIGHT_STATEMENT':      'Copyright © 2014 SEI-YA co.ltd. All rights reserved.',
    'WINE_LIST_NOTICE':         '※こちらのリストに掲載されているワインのストックは店舗外のセラーで管理しているため、ご要望のあるお客様は前日までに電話またはメールでご予約ください。また、姉妹店と在庫を共有しているため、売り切れている場合もございます。ご了承ください。',

    'GARGERY_STR':              'GARGERY',

    'ANYWAY_ADDRESS':           'B1F 2-13-1 Kyodo, Setagaya-ku, Tokyo 156-0052',
    'ANYWAY_TEL':               '03-6413-9737',
    'ANYWAY_FAX':               '03-6413-9736',

    'ANYWAY_EMAIL':             'mail@anyway-grapes.jp',
    'ANYWAY_OPENING_HOURS':     '12:00～24:00(Sun～Thr) 12:00～24:00(Fri～Sat)',
    'ANYWAY_CLOSED_ON':         'Tuesday',

    'MITSUGETSU_ADDRESS':       '1F 2-13-1 Kyodo, Setagaya-ku, Tokyo 156-0052',
    'MITSUGETSU_TEL':           '03-6413-1810',
    'MITSUGETSU_FAX':           '03-6413-9736',

    'MITSUGETSU_EMAIL':         'mitsu-getsu@sei-ya.jp',
    'MITSUGETSU_OPENING_HOURS': '15:00～24:00(Sun～Thr) 15:00～26:00(Fri～Sat)',
    'MITSUGETSU_CLOSED_ON':     'Tuesday',
    'OFURO_PAGE_TITLE':         '居酒屋おふろ｜京王線下高井戸',
    'OFURO_TEL':                '03-5300-6007',
    'OFURO_FAX':                '03-3325-4989',
    'OFURO_EMAIL':              'ofuro@sei-ya.jp',
    'OFURO_ADDRESS':            'Anshin-do building B1F 4-45-10 Akazutsumi, Setagaya-ku, Tokyo 156-0044',
    'OFURO_OPENING_HOURS':      '17:00～25:00(Sun～Thr) 17:00～27:00(Fri～Sat)',
    'OFURO_CLOSED_ON':          'Tuesday',
    'HONEYMOON_PAGE_TITLE':     'Wine Tasting Space Honey Moon｜小田急線経堂',

    'MITSUGETSU_COURSE_STR':    'Course Menu',
    'COURSE_TITLE_POSTFIX':     'のコースメニュー',
    'COURSE_DESCRIPTION':       '旬の食材をふんだんに使ったお得なコースメニューです。 アレルギー等や苦手な物がございましたらご遠慮なくご相談下さい。 代わりのメニューをご用意いたします。 10月ごろから2月ごろまではジビエ料理をいれた8,400円のコースもございます。',
    'MITSU_TITLE':              '蜜',
    'GETSU_TITLE':              '月',

    'TEL_STR':          'Tel',
    'FAX_STR':          'Fax',
    'EMAIL_STR':        'Email',
    'POST_CODE_SYMBOL': '〒',
    'RANGE_SYMBOL':     '～',

    'LEFT_BRACKET':  '【',
    'RIGHT_BRACKET': '】',

    'JUNMAI_STR':                    '純米',
    'TOKUBETSU_JUNMAI_STR':          '特別純米',
    'SHIROKOJIJIKOMI_JUNMAI_STR':    '白麹仕込み純米',
    'JUNMAISYUJIKOMI_KIJYOSHU_STR':  '純米酒仕込貴醸酒',
    'JUNMAIGINJYO_STR':              '純米吟醸',
    'SANPAIJUNMAI_STR':              '山廃純米',
    'JUNMAI_DAIGINJYO_STR':          '純米大吟醸',
    'DAIGINJYO_STR':                 '大吟醸',
    'SANPAIJUNMAI_GINJYO_STR':       '山廃純米吟醸',
    'MIZUMOTO_JUNMAI_STR':           '水もと純米',
    'KIMOTOJUNMAI_DAIGINJYO_STR':    'きもと純米大吟醸',
    'TOKUBETSU_HON_JYOUZOU_STR':     '特別本醸造',

    'MARC_DESCRIPTION':     'ワインを醸造する際に生ずる葡萄の搾り残しの部分を蒸留した物。',
    'FINE_DESCRIPTION':     '樽やタンクの部分に残ったワインを蒸留した物。',
    'CALVADOS_DESCRIPTION': 'リンゴを原料とした蒸留酒ペイ・ドージュと名乗れる物は限定地区内で収穫されたリンゴを単一蒸留した逸品。',
    'COGNAC_DESCRIPTION':   'フランスのコニャック地方周辺で産出されるブランデーであり、原材料の葡萄の品種は主にユニ・ブラン。',
    'ARMAGNAC_DESCRIPTION': 'フランスのコニャック地方周辺で産出されるブランデーであり、原材料の葡萄の品種は主にユニ・ブラン。',
    'RHUM_DESCRIPTION':     'サトウキビを原料として造られる西インド諸島の蒸留酒。',
    'GRAPPA_DESCRIPTION':   'ワインを醸造する際に生ずる葡萄の搾り残しの部分を蒸留した物。フランスのマールと同じ。',

    'en':
    {
        'TAXED_PRICE_NOTICE':    'The price contains all the taxes.',
        'TASTING_INFO_STR':      'Tasting Information',

        'WINE_SEARCH_SUBMENU':   'Search',
        'WINE_GOODS_SUBMENU':    'Goods',
        'WINE_LESSON_SUBMENU':   'Lesson',

        'WINE_ARRIVAL_SUBMENU':  'Wine Arrival',
        'WINE_SALE_SUBMENU':     'Sale',
        'WINE_TASTING_SUBMENU':  'Tasting Note',
        'WINE_EVENT_SUBMENU':    'Event',

        'HONEY_SUBMENU':         'Honey',
        'OLIVE_OIL_SUBMENU':     'Olive Oil',
        'MASTARD_SUBMENU':       'Mastard',
        'SALT_SUBMENU':          'Salt',
        'DRY_FRUIT_SUBMENU':     'Dry Fruit',

        'WINE_GLASS_STR':        'Wine Glass',
        'WINE_BASKET_STR':       'Wine Basket',
        'CHAMPAGNE_STOPPER_STR': 'Champagne Stopper',
        'LABEL_COLLECTOR_STR':   'Label Collector',

        'MAIL_MAGAZINE_SUBMENU': 'Mail Magazine',

        /* Sub Menu */
        'A_LA_CARTE':         'A la carte',
        'COURSE_STR':         'Course Menu',
        'DAILY_MENU_STR':     'Daily Menu',
        'NORMAL_MENU_STR':    'Normal Menu',
        'BEER_STR':           'Beer',
        'DIGESTIF_STR':       'Digestif',
        'LIQUOR_STR':         'Liquor',
        'COCKTAIL_STR':       'Cocktail',
        'OTHER_DRINKS_STR':   'Other Drinks',
        'SAKE_STR':           'Sake',
        'SHOCHU_STR':         'Shochu',

        'SPARKLING_ROSE_STR': 'Sparkling Rosé Wine',
        'SPARKLING_WINE_STR': 'Sparkling Wine',
        'WHITE_WINE_STR':     'White Wine',
        'VIN_JAUNE_STR':      'Vin Jaune',
        'RED_WINE_STR':       'Red Wine',
        'DESSERT_WINE_STR':   'Dessert Wine',
        'ROSE_WINE_STR':      'Rosé Wine',
        'EAU_DE_VIE_STR':     'Eau de Vie',
        'CHAMPAGNE_STR':      'Champagne',
        'CHAMPAGNE_ROSE_STR': 'Champagne Rosé',

        'GLASS_WINE_STR':     'Glass Wine',
        'WINE_LIST_STR':      'Wine List',

        'BOTTLE_WINE_STR':    'Bottle Wine',
        'JANUARY_STR':        'January',
        'FEBRUARY_STR':       'February',
        'MARCH_STR':          'March',
        'APRIL_STR':          'April',
        'MAY_STR':            'May',
        'JUNE_STR':           'June',
        'JULY_STR':           'July',
        'AUGUST_STR':         'August',
        'SEPTEMBER_STR':      'September',
        'OCTOBER_STR':        'October',
        'NOVEMBER_STR':       'November',
        'DECEMBER_STR':       'December',
        'STAFF_STR':          'Staff',
        'STORE_INTERIOR_STR': 'Store Interior',
        'DISH_STR':           'Dish',
        'MAGAZINE_STR':       'Magazine',

        'DRINK_STR':          'Drink',
        'WINE_STR':           'Wine',
        'FOOD_STR':           'Food',
        'GROCERY_STR':        'Grocery',
        'PHOTO_STR':          'Photo',
        'IMPORTER_STR':       'Importers',
        'REGISTER_STR':       'Register',
        'MAP_STR':            'Map',
        'SITE_TOP_STR':       'Site Top',
        'EVENT_STR':          'Event',
        'WHATS_NEW_STR':      'What\'s New',

        'SUNDAY_STR':         'Sun',
        'MONDAY_STR':         'Mon',
        'TUESDAY_STR':        'Tue',
        'WEDNESDAY_STR':      'Wed',
        'THURSDAY_STR':       'Thu',
        'FRIDAY_STR':         'Fri',
        'SATURDAY_STR':       'Sat',

        'IMPORTER_STR':               'Importers',
        'ORDER_METHOD_STR':           'Order',
        'PAYMENT_METHOD_STR':         'Payment',
        'CONTACT_STR':                'Contact',
        'PRIVACY_STR':                'Privacy',
        'COMMERCIAL_TRANSACTION_STR': 'Act on Specified Commercial Transactions',

        'COLD_APPETIZER_STR': 'Cold Hors d\'Oeuvres',
        'HOT_APPETIZER_STR':  'Hot Hors d\'Oeuvres',
        'FISH_DISH_STR':      'Fish Dishes',
        'MEAT_DISH_STR':      'Meat Dishes',
        'GIBIER_STR':         'Gibier',
        'DRY_FRUIT_STR':      'Dry Fruit',
        'SMALL_DISH_STR':     'Small Dish',
        'PASTA_STR':          'Pasta',
        'GOHAN_STR':          'Gohan',
        'CHEESE_STR':         'Cheese',
        'DESSERT_STR':        'Dessert',
        'SOFT_DRINK_STR':     'Soft Drink',
        'HERB_TEA_STR':       'Herb Tea',
        'MARC_STR':           'Marc',
        'WHISKY_STR':         'Whisky',
        'FINE_STR':           'Fine',
        'CALVADOS_STR':       'Calvados',
        'COGNAC_STR':         'Cognac',
        'ARMAGNAC_STR':       'Armagnac',
        'RHUM_STR':           'Rhum',
        'MADEIRA_STR':        'Madeira',
        'GRAPPA_STR':         'Grappa'
    },

    'fr':
    {
        'A_LA_CARTE':      'A la carte',
        'COURSE_STR':      'Menu',
        'DAILY_MENU_STR':  'Menu de Jour',
        'NORMAL_MENU_STR': 'Menu normal',

        'CHAMPAGNE_STR':       'Champagne',
        'CHAMPAGNE_ROSE_STR':  'Champagne Rosé',
        'CREMANT_STR':         'Crémant',
        'PETILLANT_STR':       'Pétillant',
        'OTHER_SPARKLING_STR': 'Autres Vins Mousseux',
        'LORRAINE_STR':        'Lorraine',
        'ALSACE_STR':          'Alsace',
        'LOIRE_STR':           'Vallée de la Loire',
        'BORDEAUX_STR':        'Bordeaux',
        'SUDWEST_STR':         'Sud-Ouest',
        'BOURGOGNE_STR':       'Bourgogne',
        'JURA_STR':            'Jura',
        'SAVOIE_FRANCHE_STR':  'Savoie & Franche-Comté',
        'RHONE_STR':           'Vallée du Rhône',
        'LANG_ROUS_STR':       'Languedoc & Roussillon',
        'PROVENCE_STR':        'Provence',
        'CORSE_STR':           'Corse',
        'JURA_FRANCHE_STR':    'Jura & Franche-Comté',
        'LANGUEDOC_STR':       'Languedoc',
        'ROUSSILLON_STR':      'Roussillon',
        'OTHER_LANG_ROUS_STR': 'Autres Vignobles de Languedoc et Roussillon',
        'FRANCE_MAIN_STR':     'C\'est Principalement du Français',

        'FRANCE_STR':          'France',
        'AUSTRIA_STR':         'Autrichie',
        'GERMANY_STR':         'Germanique',
        'NEW_ZEALAND_STR':     'Nouvelle-Zélande',
        'ITALY_STR':           'Italien',
        'AMERICA_STR':         'Américain',
        'SPAIN_STR':           'Espagnol',
        'JAPAN_STR':           'Japonais',
        'AUSTRALIA_STR':       'Australien',
        'SOUTH_AFRICA_STR':    'Afrique du Sud',
        'ENGLAND_STR':         'Anglais',
        'CROATIA_STR':         'Croatia',
        'PORTUGAL_STR':        'Portugal',
        'CANADA_STR':          'Canada',
        'UKRAINE_STR':         'Ukraine',
        'ARGENTINA_STR':       'Argentine',
        'SWITZERLAND_STR':     'Switzerland',
        'BULGARIA_STR':        'Bulgarie',
        'HANGARY_STR':         'Hongrie',
        'LEBANON_STR':         'Liban',
        'CHILE_STR':           'Chili',

        'SPARKLING_WINE_STR': 'Vin Mousseux',
        'WHITE_WINE_STR':     'Vin Blanc',
        'RED_WINE_STR':       'Vin Rouge',
        'ROSE_WINE_STR':      'Vin Rosé',
        'DESSERT_WINE_STR':   'Vin Moelleux',

        'SPARKLING_ROSE_STR':   'Vin Mousseux Rosé',
        'FRENCH_WHITE_STR':     'Vin Blancs de France',
        'GERMAN_WHITE_STR':     'Vin Blancs d\'Allemagne',
        'AUSTRIAN_WHITE_STR':   'Vin Blancs d\'Autriche',
        'ITALIAN_WHITE_STR':    'Vin Blancs d\'Italie',
        'SPANISH_WHITE_STR':    'Vin Blancs d\'Espagne',
        'AMERICAN_WHITE_STR':   'Vin Blancs d\'Etats-Unis',
        'AUSTRALIAN_WHITE_STR': 'Vin Blancs d\'Australie',
        'NEWZEALAND_WHITE_STR': 'Vin Blancs de Nouvelle-Zélande',
        'FRENCH_RED_STR':       'Vin Rouges de France',
        'AUSTRIAN_RED_STR':     'Vin Rouges d\'Autriche',
        'GERMAN_RED_STR':       'Vin Rouges d\'Allemagne',
        'ITALIAN_RED_STR':      'Vin Rouges d\'Italie',
        'SPANISH_RED_STR':      'Vin Rouges d\'Espagne',
        'AMERICAN_RED_STR':     'Vin Rouges d\'Etats-Unis',
        'AUSTRALIAN_RED_STR':   'Vin Rouges d\'Australie',
        'NEWZEALAND_RED_STR':   'Vin Rouges de Nouvelle-Zélande',

        'BEER_STR':       'Biéres',
        'DIGESTIF_STR':   'Digestif',
        'LIQUOR_STR':     'Liqueur',
        'COCKTAIL_STR':   'Cocktail',
        'SOFT_DRINK_STR': 'Sans Alcool',
        'HERB_TEA_STR':   'Tisane',
        'SHOCHU_STR':     'Eau de Vie de Japonais',
        'SAKE_STR':       'Alcool de Riz Japonais',
        'OTHER_DRINKS_STR': 'd\'Autres Boissons',

        'MARC_STR':     'Marc',
        'WHISKY_STR':   'Whisky',
        'FINE_STR':     'Fine',
        'CALVADOS_STR': 'Calvados',
        'COGNAC_STR':   'Cognac',
        'ARMAGNAC_STR': 'Armagnac',
        'RHUM_STR':     'Rhum',
        'MADEIRA_STR':  'Madère',
        'GRAPPA_STR':   'Grappa',

        'AWAMORI_STR':        'Awamori',
        'KOKUTOU_JOUCHU_STR': 'Kokutou-Jouchu',
        'KOME_JOUCHU_STR':    'Kome-Jouchu',
        'MUGI_JOUCHU_STR':    'Mugi-Jouchu',
        'IMO_JOUCHU_STR':     'Imo-Jouchu',
        'KURI_JOUCHU_STR':    'Kuri-Jouchu',

        'WINE_LIST_STR':      'La Carte des Vins',
        'GLASS_WINE_STR':     'Vin au verre',
        'BOTTLE_WINE_STR':    'vin à la bouteille'
    },

    'ja':
    {
        'TODAYS_GLASS_WINE_STR':        '本日のグラスワイン',
        'MONTHLY_RECOMMENDED_WINE_STR': '今月のオススメボトル',

        'TAXED_PRICE_NOTICE':     '※価格は税込価格となっております。',

        'WINE_SEARCH_SUBMENU':   '検索',
        'WINE_GOODS_SUBMENU':    'グッズ',
        'WINE_LESSON_SUBMENU':   'レッスン',

        'WINE_ARRIVAL_SUBMENU':  '入荷ワイン',
        'WINE_SALE_SUBMENU':     'セール',
        'WINE_TASTING_SUBMENU':  'テイスティング・ノート',
        'WINE_EVENT_SUBMENU':    'イベント',

        'HONEY_SUBMENU':         '蜂蜜',
        'OLIVE_OIL_SUBMENU':     'オリーブ・オイル',
        'MASTARD_SUBMENU':       'マスタード',
        'SALT_SUBMENU':          '塩',
        'DRY_FRUIT_SUBMENU':     'ドライフルーツ',

        'WINE_GLASS_STR':        'ワイングラス',
        'WINE_BASKET_STR':       'パニエ',
        'CHAMPAGNE_STOPPER_STR': 'シャンパーニュ・ストッパー',
        'LABEL_COLLECTOR_STR':   'ラベル・コレクター',

        'MAIL_MAGAZINE_SUBMENU': 'メルマガ',

        /* Sub Menu */
        'A_LA_CARTE':         'アラカルト',
        'COURSE_STR':         'コースメニュー',
        'DAILY_MENU_STR':     '日替わりメニュー',
        'NORMAL_MENU_STR':    '通常のメニュー',
        'BEER_STR':           '麦酒',
        'DIGESTIF_STR':       '食後酒',
        'LIQUOR_STR':         'リキュール',
        'COCKTAIL_STR':       'カクテル',
        'OTHER_DRINKS_STR':   'その他のドリンク',
        'SAKE_STR':           '日本酒',
        'SHOCHU_STR':         '焼酎',

        'SPARKLING_WINE_STR': 'スパークリング・ワイン',
        'SPARKLING_ROSE_STR': 'スパークリング・ロゼワイン',
        'WHITE_WINE_STR':     '白ワイン',
        'VIN_JAUNE_STR':      'ヴァン・ジョーヌ',
        'RED_WINE_STR':       '赤ワイン',
        'DESSERT_WINE_STR':   'デザートワイン',
        'ROSE_WINE_STR':      'ロゼワイン',
        'EAU_DE_VIE_STR':     'オー・ド・ヴィ',
        'CHAMPAGNE_STR':      'シャンパーニュ',
        'CHAMPAGNE_ROSE_STR': 'シャンパーニュ・ロゼ',

        'GLASS_WINE_STR':     'グラスワイン',
        'WINE_LIST_STR':      '秘蔵ワインリスト',

        'BOTTLE_WINE_STR':    'ボトルワイン',
        'JANUARY_STR':        '１月',
        'FEBRUARY_STR':       '２月',
        'MARCH_STR':          '３月',
        'APRIL_STR':          '４月',
        'MAY_STR':            '５月',
        'JUNE_STR':           '６月',
        'JULY_STR':           '７月',
        'AUGUST_STR':         '８月',
        'SEPTEMBER_STR':      '９月',
        'OCTOBER_STR':        '１０月',
        'NOVEMBER_STR':       '１１月',
        'DECEMBER_STR':       '１２月',
        'STAFF_STR':          'スタッフ',
        'STORE_INTERIOR_STR': '店内',
        'DISH_STR':           '料理',
        'MAGAZINE_STR':       '雑誌',

        'IMPORTER_STR':               '取り扱いインポーター',
        'ORDER_METHOD_STR':           '注文方法',
        'PAYMENT_METHOD_STR':         '支払い方法',
        'CONTACT_STR':                '問い合わせ',
        'PRIVACY_STR':                '個人情報',
        'COMMERCIAL_TRANSACTION_STR': '特定商取引法',

        'OFURO_ADDRESS':      '〒156-0044 東京都世田谷区赤堤４−４５−１０ 安心堂ビル B1F',
        'MITSUGETSU_ADDRESS': '〒156-0052 東京都世田谷区経堂２−１３−１ 1F',
        'ANYWAY_ADDRESS':     '〒156-0052 東京都世田谷区経堂２−１３−１ B1F',

        'COLD_APPETIZER_STR':  '冷たい前菜',
        'HOT_APPETIZER_STR':   '温かい前菜',
        'FISH_DISH_STR':       '魚料理',
        'MEAT_DISH_STR':       '肉料理',
        'GIBIER_STR':          'ジビエ',
        'DRY_FRUIT_STR':       'ドライフルーツ',
        'SMALL_DISH_STR':      '小皿',
        'PASTA_STR':           'パスタ',
        'GOHAN_STR':           'ごはん物',
        'CHEESE_STR':          'チーズ',
        'DESSERT_STR':         'デザート',
        'HERB_TEA_STR':        'ハーブ・ティー',

        'CHAMPAGNE_ROSE_STR':  'シャンパーニュ・ロゼ',
        'CREMANT_STR':         'クレマン',
        'PETILLANT_STR':       'ペティヤン（微発泡）',
        'OTHER_SPARKLING_STR': 'その他のスパークリングワイン',
        'LORRAINE_STR':        'ロレーヌ地方',
        'ALSACE_STR':          'アルザス地方',
        'LOIRE_STR':           'ロワール地方',
        'BORDEAUX_STR':        'ボルドー地方',
        'SUDWEST_STR':         '南西地方',
        'BOURGOGNE_STR':       'ブルゴーニュ地方',
        'JURA_STR':            'ジュラ地方',
        'SAVOIE_FRANCHE_STR':  'サヴォワ地方＆フランシュ・コンテ地方',
        'RHONE_STR':           'ローヌ河流域',
        'LANG_ROUS_STR':       'ラングドック地方＆ルーション地方',
        'PROVENCE_STR':        'プロヴァンス地方',
        'CORSE_STR':           'コルシカ島',
        'JURA_FRANCHE_STR':    'ジュラ地方＆フランシュ・コンテ地方',
        'LANGUEDOC_STR':       'ラングドック地方',
        'ROUSSILLON_STR':      'ルーション地方',
        'OTHER_LANG_ROUS_STR': 'ラングドック地方＆ルーション地方のその他の栽培地',
        'FRANCE_MAIN_STR':     '主にフランス',

        'FRANCE_STR':          'フランス',
        'AUSTRIA_STR':         'オーストリア',
        'GERMANY_STR':         'ドイツ',
        'NEW_ZEALAND_STR':     'ニュージーランド',
        'ITALY_STR':           'イタリア',
        'AMERICA_STR':         'アメリカ',
        'SPAIN_STR':           'スペイン',
        'JAPAN_STR':           '日本',
        'AUSTRALIA_STR':       'オーストラリア',
        'SOUTH_AFRICA_STR':    '南アフリカ',
        'ENGLAND_STR':         'イギリス',
        'CROATIA_STR':         'クロアチア',
        'PORTUGAL_STR':        'ポルトガル',
        'CANADA_STR':          'カナダ',
        'UKRAINE_STR':         'ウクライナ',
        'ARGENTINA_STR':       'アルゼンチン',
        'SWITZERLAND_STR':     'スイス',
        'BULGARIA_STR':        'ブルガリア',
        'HANGARY_STR':         'ハンガリー',
        'LEBANON_STR':         'レバノン',
        'CHILE_STR':           'チリ',

        'SPARKLING_ROSE_STR':   'スパークリングロゼワイン',
        'FRENCH_WHITE_STR':     'フランスの白ワイン',
        'GERMAN_WHITE_STR':     'ドイツの白ワイン',
        'AUSTRIAN_WHITE_STR':   'オーストリアの白ワイン',
        'ITALIAN_WHITE_STR':    'イタリアの白ワイン',
        'SPANISH_WHITE_STR':    'スペインの白ワイン',
        'AMERICAN_WHITE_STR':   'アメリカの白ワイン',
        'AUSTRALIAN_WHITE_STR': 'オーストラリアの白ワイン',
        'NEWZEALAND_WHITE_STR': 'ニュージーランドの白ワイン',
        'FRENCH_RED_STR':       'フランスの赤ワイン',
        'AUSTRIAN_RED_STR':     'オーストリアの赤ワイン',
        'GERMAN_RED_STR':       'ドイツの赤ワイン',
        'ITALIAN_RED_STR':      'イタリアの赤ワイン',
        'SPANISH_RED_STR':      'スペインの赤ワイン',
        'AMERICAN_RED_STR':     'アメリカの赤ワイン',
        'AUSTRALIAN_RED_STR':   'オーストラリアの赤ワイン',
        'NEWZEALAND_RED_STR':   'ニュージーランドの赤ワイン',

        'MARC_STR':     'マール',
        'WHISKY_STR':   'ウィスキー',
        'FINE_STR':     'フィーヌ',
        'CALVADOS_STR': 'カルヴァドス',
        'COGNAC_STR':   'コニャック',
        'ARMAGNAC_STR': 'アルマニャック',
        'RHUM_STR':     'ラム',
        'MADEIRA_STR':  'マデイラ',
        'GRAPPA_STR':   'グラッパ',

        'SOFT_DRINK_STR':   '無酒',

        'AWAMORI_STR':        '泡盛',
        'KOKUTOU_JOUCHU_STR': '黒糖焼酎',
        'KOME_JOUCHU_STR':    '米焼酎',
        'MUGI_JOUCHU_STR':    '麦焼酎',
        'IMO_JOUCHU_STR':     '芋焼酎',
        'KURI_JOUCHU_STR':    '栗焼酎'
    }
};

var countryHash =
{
    'France':           { name: 'フランス',     value: 1, img: 'france.png' },
    'Autrichie':        { name: 'オーストリア',   value: 2, img: 'austria.png' },
    'Germanique':       { name: 'ドイツ',      value: 3, img: 'germany.png' },
    'Nouvelle-Zélande': { name: 'ニュージーランド', value: 4, img: 'new_zealand.png' },
    'Italien':          { name: 'イタリア',     value: 5, img: 'italy.png' },
    'Américain':        { name: 'アメリカ合衆国', value: 6, img: 'america.png' },
    'Espagnol':         { name: 'スペイン',     value: 7, img: 'spain.png' },
    'Japonais':         { name: '日本',      value: 8, img: 'japan.png' },
    'Australien':       { name: 'オーストラリア',  value: 9, img: 'australia.png' },
    'Afrique du Sud':   { name: '南アフリカ',    value: 10, img: 'south_africa.png' },
    'Anglais':          { name: 'イギリス',     value: 11, img: 'united_kingdom.png' },
    'Croatia':          { name: 'クロアチア',    value: 12, img: 'croatia.png' },
    'Portugal':         { name: 'ポルトガル',    value: 13, img: 'portugal.png' },
    'Canada':           { name: 'カナダ',      value: 14, img: 'canada.png' },
    'Ukraine':          { name: 'ウクライナ',    value: 15, img: 'ukraine.png' },
    'Argentine':        { name: 'アルゼンチン',   value: 16, img: 'argentina.png' },
    'Switzerland':      { name: 'スイス',      value: 17, img: 'switzerland.png' },
    'Bulgarie':         { name: 'ブルガリア',    value: 18, img: 'bulgaria.png' },
    'Hongrie':          { name: 'ハンガリー',    value: 19, img: 'hungary.png' },
    'Liban':            { name: 'レバノン',     value: 20, img: 'lebanon.png' },
    'Chili':            { name: 'チリ',       value: 21, img: 'chile.png' },
    'Taiwan':           { name: '台湾',      value: 22, img: 'taiwan.png' }
};

var wineTypeHash =
{
    'Mousseux':       { css: 'sparkling',     value: 0,  name: Constants['ja']['SPARKLING_WINE_STR'] },
    'Mousseux Rouge': { css: 'sparkling',     value: 0,  name: Constants['ja']['SPARKLING_WINE_STR'] },
    'Mousseux Rosé':  { css: 'sparkling',     value: 0,  name: Constants['ja']['SPARKLING_WINE_STR'] },
    'Blanc':          { css: 'white',         value: 2,  name: Constants['ja']['WHITE_WINE_STR'] },
    'Sherry':         { css: 'yellow',        value: 3,  name: Constants['ja']['VIN_JAUNE_STR'] },
    'Jaune':          { css: 'yellow',        value: 3,  name: Constants['ja']['VIN_JAUNE_STR'] },
    'Madeira':        { css: 'yellow',        value: 3,  name: Constants['ja']['VIN_JAUNE_STR'] },
    'Rouge':          { css: 'red',           value: 4,  name: Constants['ja']['RED_WINE_STR'] },
    'Port':           { css: 'sweet',         value: 5,  name: Constants['ja']['DESSERT_WINE_STR'] },
    'Doux':           { css: 'sweet',         value: 5,  name: Constants['ja']['DESSERT_WINE_STR'] },
    'Rosé':           { css: 'rose',          value: 6,  name: Constants['ja']['ROSE_WINE_STR'] },
    'Eau de Vie':     { css: 'brandy',        value: 7,  name: Constants['ja']['EAU_DE_VIE_STR'] },
    'Champagne':      { css: 'champagne',     value: 8,  name: Constants['ja']['CHAMPAGNE_STR'] },
    'Champagne Rosé': { css: 'champagneRose', value: 9,  name: Constants['ja']['CHAMPAGNE_ROSE_STR'] },
    'Liqueur':        { css: 'liqueur',       value: 10, name: 'リキュール' },
    'Goods':          { css: 'goods',         value: 11, name: 'グッズ' },
    'Food':           { css: 'food',          value: 12, name: 'グロッサリー' },
    'Beer':           { css: 'food',          value: 13, name: 'ビール' },
    'Cider':          { css: 'food',          value: 14, name: 'シードル' }
};

var cultivationMethodHash =
{
    'Biodynamie':      { name: 'ビオディナミ' },
    'Biologie':        { name: 'ビオロジック' },
    'Lutte raisonnée': { name: 'リュット・レゾネ' },
    'Lutte intégrée':  { name: 'リュット・アンテグレ' }
};

var rgstrCepage =
[
    'アリアニコ',
    'アリゴテ',
    'アルヴァリーニョ',
    'アルテッセ',
    'ヴァカレーズ',
    'ヴィオニエ',
    'ヴェルデーリョ',
    'ヴェルメンティーノ',
    'オーセロワ',
    'カベルネ・ソーヴィニヨン',
    'カベルネ・フラン',
    'ガメイ',
    'カリニャン',
    'カリニャン・ブラン',
    'ガルガーネガ',
    'ガルナッチャ',
    'カンノナウ',
    'クノワーズ',
    'グラウアー・ブルグンダー',
    'グラシアーノ',
    'クラレット・ローズ',
    'グランジェ',
    'グルナッシュ',
    'グルナッシュ・ブラン',
    'クレヴネール・ドゥ・ハイリゲンシュタイン',
    'クレレット',
    'クレレット・ブランシュ',
    'グロ・マンサン',
    'コー',
    'ゴデーリョ',
    'コリント・ネロ',
    'サヴァニャン',
    'サグランティーノ',
    'サンジョベーゼ',
    'サンソー',
    'シャカレロ',
    'ジャケール',
    'シャスラ',
    'シャルドネ',
    'シャルボノ',
    'シラー',
    'シルヴァネール',
    'ジンファンデル',
    'スキアカレロ',
    'セミヨン',
    'セルシアル',
    'ソーヴィニヨン・ブラン',
    'タナ',
    'ティンタ・ネグラ',
    'ティンタアマレラ',
    'テール・ブーレ',
    'デラウェア',
    'テランテス',
    'テレ・ノワール',
    'テンプラニーリョ',
    'トカイ・ピノ・グリ',
    'ニエルッキオ',
    'ネグレット',
    'ネッビオーロ',
    'ネレッロ・マスカレーゼ',
    'パスカレ',
    'バルベーラ',
    'ピカルダン',
    'ピクプール',
    'ピナン',
    'ピノ・オーセロワ',
    'ピノ・グリ',
    'ピノ・ネロ',
    'ピノ・ノワール',
    'ピノ・ブーロ',
    'ピノ・ブラン',
    'ピノ・ムニエ',
    'ピノタージュ',
    'ファランギーナ',
    'ブール・ブーラン',
    'プールサール',
    'ブールブーラン',
    'フォレ・ノワール',
    'プティ・ヴェルド',
    'プティ・クルビュ',
    'プティ・シラー',
    'プティ・ドレ',
    'プティ・マンサン',
    'ブラケット',
    'フリウラーノ',
    'ブルネロ',
    'ペコレッロ',
    'ボアル',
    'ボバレ',
    'マカブー',
    'マルヴァジア',
    'マルサンヌ',
    'マルベック',
    'ミュスカ',
    'ミュスカデル',
    'ミュスカルダン',
    'ムールヴェードル',
    'ムロン・ドゥ・ブルゴーニュ',
    'メルロー',
    'モスカート',
    'モンテプルチアーノ',
    'モンドゥーズ',
    'リースリング',
    'ゲヴェルツトラミネール',
    'シュナン・ブラン',
    'ユニ・ブラン',
    'ルーサンヌ',
    'レフォスコ',
    'プティヴェルド',
    'ロール',
    'ロモランタン',
    '甲州'
];
//-------------------------------------------------------
// seiya.language-0.1.js
//
// Required: seiya.utility-0.1.js
//           seiya.constants.js
//           seiya.strings.js
//           jquery.js
//-------------------------------------------- YuMaeda --

function loadResourceStrings(resourceDirUrl)
{
    var langScriptUrl =
        '{0}/{1}/seiya.strings.min.js'.format(resourceDirUrl, getLanguage());

    $.ajax(
    {
        url: langScriptUrl,
        dataType: 'script',
        async: false,
        success: function()
        {
            // Wait until the seiya.strings.js is loaded.
        }
    });
}

//-------------------------------------------------------
// BaseField
//-------------------------------------------- YuMaeda --

function BaseField(strName, strValue)
{
    this.inputTag = new InputTag(strName, strValue);
}

BaseField.prototype.setRequired = function(fRequired)
{
    this.required = fRequired;
};

BaseField.prototype.setCssClass = function(strClass)
{
    this.cssClass = strClass;
};

BaseField.prototype.addAttr = function(strKey, strValue)
{
    this.inputTag.addAttr(strKey, strValue);
};

BaseField.prototype.toHtml = function()
{
    if (this.required)
    {
        this.inputTag.addAttr('required', 'required');
    }

    if (this.cssClass)
    {
        this.inputTag.addClass(this.cssClass);
    }

    return(this.inputTag.toHtml());
};


//-------------------------------------------------------
// HiddenField
//-------------------------------------------- YuMaeda --

function HiddenField(strName, strValue)
{
    // Call the parent constructor
    BaseField.call(this, strName, strValue);

    this.inputTag.addAttr('type', 'hidden');
}

// inherit BaseField
HiddenField.prototype = new BaseField();
HiddenField.prototype.constructor = HiddenField;


//-------------------------------------------------------
// BooleanField
//-------------------------------------------- YuMaeda --

function BooleanField(strName, fSelected)
{
    // Call the parent constructor
    BaseField.call(this, strName, '1');

    this.inputTag.addAttr('type', 'checkbox');

    if (fSelected)
    {
        this.inputTag.addAttr('checked', 'checked');
    }
}

// inherit BaseField
BooleanField.prototype = new BaseField();
BooleanField.prototype.constructor = BooleanField;


//-------------------------------------------------------
// FileField
//-------------------------------------------- YuMaeda --

function FileField(strName)
{
    // Call the parent constructor
    BaseField.call(this, strName, '');

    this.inputTag.addAttr('type', 'file');
}

// inherit BaseField
FileField.prototype = new BaseField();
FileField.prototype.constructor = FileField;


//-------------------------------------------------------
// TextField
//-------------------------------------------- YuMaeda --

function TextField(strName, strValue)
{
    // Call the parent constructor
    BaseField.call(this, strName, strValue);

    this.cssClass = 'textFld';
    this.inputTag.addAttr('type', 'text');
}

// inherit BaseField
TextField.prototype = new BaseField();
TextField.prototype.constructor = TextField;


//-------------------------------------------------------
// MultiTextField
//-------------------------------------------- YuMaeda --

function MultiTextField(strName, strValue)
{
    this.inputTag = new TextAreaTag(strName, strValue);
}

// inherit BaseField
MultiTextField.prototype = new BaseField();
MultiTextField.prototype.constructor = MultiTextField;


//-------------------------------------------------------
// NumberField
//-------------------------------------------- YuMaeda --
//
function NumberField(strName, strValue)
{
    // Call the parent constructor
    BaseField.call(this, strName, strValue);

    this.inputTag.addAttr('type', 'number');
}

// inherit BaseField
NumberField.prototype = new BaseField();
NumberField.prototype.constructor = NumberField;


//-------------------------------------------------------
// CurrencyField
//-------------------------------------------- YuMaeda --

function CurrencyField(strName, strValue)
{
    // Call the parent constructor
    NumberField.call(this, strName, strValue);

    this.inputTag.addAttr('step', '10');
    this.cssClass = 'currencyFld';
    this.unit = 'yen';
}

// inherit NumberField
CurrencyField.prototype = new NumberField();
CurrencyField.prototype.constructor = CurrencyField;

// override toHtml().
CurrencyField.prototype.toHtml = function()
{
    return(NumberField.prototype.toHtml.call(this) + ' ' + this.unit);
};

CurrencyField.prototype.setUnit = function(strUnit)
{
    this.unit = strUnit;
};


//-------------------------------------------------------
// ChoiceField
//-------------------------------------------- YuMaeda --

function ChoiceField(strName, iSelected)
{
    // Call the parent constructor
    this.selectTag = new SelectTag();
    this.selectTag.addAttr('name', strName);

    if (iSelected >= 0)
    {
        this.selectTag.setSelectedIndex(iSelected);
    }
}

// inherit BaseField
ChoiceField.prototype = new BaseField();
ChoiceField.prototype.constructor = ChoiceField;

ChoiceField.prototype.addOption = function(strText, strValue)
{
    if (!strValue)
    {
        this.selectTag.addOption(strText, strText);
    }
    else
    {
        this.selectTag.addOption(strText, strValue);
    }
};

// override toHtml().
ChoiceField.prototype.toHtml = function()
{
    return this.selectTag.toHtml();
};



//-------------------------------------------------------
// FormValidator
//-------------------------------------------- YuMaeda --
var FormValidator = (function()
{
    // Private members

    var _validate = function($form)
        {
            var fValid = true;

            $fields = $form.find(':input').not(':hidden, button');
            $fields.removeClass('errorFld');
            $fields.removeAttr('title');

            $fields.each(function(idx, el)
            {
                var $this = $(this);

                if ($this.val() === '')
                {
                    if ($this.attr('required') === 'required')
                    {
                        fValid = false;
                        $this.addClass('errorFld');
                        $this.attr('title', Strings.getString('EMPTY_FLD_MSG'));
                    }
                }
                else
                {
                    if ($this.attr('type') === 'number')
                    {
                        if (!$.isNumeric($this.val()) || ($this.val() <= 0))
                        {
                            fValid = false;
                            $this.addClass('errorFld');
                            $this.attr('title', Strings.getString('INVALID_NUMBER_MSG'));
                        }
                    }
                }
            });

            return fValid;
        };

    // Public members
   
    return(
    {
        validate: _validate
    });
})();

﻿//-------------------------------------------------------
// Wine types & regions
//
// Required
//     seiya.constants.js
//-------------------------------------------- YuMaeda --

var rgobjSparklingWineRegion =
    [
        { resId: 'CHAMPAGNE_STR',	imgUrl: 'images/france.png',		value: 1 },
        { resId: 'CHAMPAGNE_ROSE_STR',	imgUrl: 'images/france.png',		value: 2 },
        { resId: 'CREMANT_STR',		imgUrl: 'images/france.png',		value: 3 },
        { resId: 'PETILLANT_STR',	imgUrl: '',				value: 4 },
        { resId: 'OTHER_SPARKLING_STR',	imgUrl: '',				value: 5 }
    ],

    rgobjChampagneRegion =
    [
    ],

    rgobjWhiteWineRegion =
    [
        { resId: 'CHAMPAGNE_STR',	imgUrl: 'images/france.png',		value: 1 },
        { resId: 'LORRAINE_STR',	imgUrl: 'images/france.png',		value: 6 },
        { resId: 'ALSACE_STR',		imgUrl: 'images/france.png',		value: 7 },
        { resId: 'LOIRE_STR',		imgUrl: 'images/france.png',		value: 8 },
        { resId: 'BORDEAUX_STR',	imgUrl: 'images/france.png',		value: 9 },
        { resId: 'SUDWEST_STR',  	imgUrl: 'images/france.png',		value: 10 },
        { resId: 'BOURGOGNE_STR',	imgUrl: 'images/france.png',		value: 11 },
        { resId: 'JURA_STR', 		imgUrl: 'images/france.png',		value: 12 },
        { resId: 'SAVOIE_FRANCHE_STR',	imgUrl: 'images/france.png',		value: 13 },
        { resId: 'RHONE_STR',		imgUrl: 'images/france.png',		value: 14 },
        { resId: 'LANG_ROUS_STR',	imgUrl: 'images/france.png',		value: 15 },
        { resId: 'PROVENCE_STR',	imgUrl: 'images/france.png',		value: 16 },
        { resId: 'CORSE_STR',		imgUrl: 'images/france.png',		value: 17 },
        { resId: 'GERMANY_STR',		imgUrl: 'images/germany.png',		value: 18 },
        { resId: 'AUSTRIA_STR',		imgUrl: 'images/austria.png',		value: 19 },
        { resId: 'ITALY_STR',		imgUrl: 'images/italy.png',		value: 20 },
        { resId: 'SPAIN_STR',		imgUrl: 'images/spain.png',		value: 21 },
        { resId: 'AMERICA_STR',		imgUrl: 'images/america.png',		value: 22 },
        { resId: 'AUSTRALIA_STR',	imgUrl: 'images/australia.png',		value: 23 },
        { resId: 'NEW_ZEALAND_STR',	imgUrl: 'images/newzealand.png',	value: 24 }
    ],

    rgobjRoseWineRegion =
    [
        { resId: 'FRANCE_MAIN_STR',	imgUrl: 'images/france.png',		value: 29 }
    ],

    rgobjRedWineRegion =
    [
        { resId: 'CHAMPAGNE_STR',      	imgUrl: 'images/france.png',		value: 1 },
        { resId: 'ALSACE_STR',		imgUrl: 'images/france.png',		value: 7 },
        { resId: 'LOIRE_STR',		imgUrl: 'images/france.png',		value: 8 },
        { resId: 'BORDEAUX_STR',	imgUrl: 'images/france.png',		value: 9 },
        { resId: 'SUDWEST_STR',		imgUrl: 'images/france.png',		value: 10 },
        { resId: 'BOURGOGNE_STR',	imgUrl: 'images/france.png',		value: 11 },
        { resId: 'JURA_FRANCHE_STR',	imgUrl: 'images/france.png',		value: 25 },
        { resId: 'RHONE_STR',		imgUrl: 'images/france.png',		value: 14 },
        { resId: 'LANGUEDOC_STR',	imgUrl: 'images/france.png',		value: 26 },
        { resId: 'ROUSSILLON_STR',	imgUrl: 'images/france.png',		value: 27 },
        { resId: 'OTHER_LANG_ROUS_STR',	imgUrl: 'images/france.png',		value: 28 },
        { resId: 'PROVENCE_STR',	imgUrl: 'images/france.png',		value: 16 },
        { resId: 'CORSE_STR',		imgUrl: 'images/france.png',		value: 17 },
        { resId: 'GERMANY_STR',		imgUrl: 'images/germany.png',		value: 18 },
        { resId: 'AUSTRIA_STR',		imgUrl: 'images/austria.png',		value: 19 },
        { resId: 'ITALY_STR',		imgUrl: 'images/italy.png',		value: 20 },
        { resId: 'SPAIN_STR',		imgUrl: 'images/spain.png',		value: 21 },
        { resId: 'AMERICA_STR',		imgUrl: 'images/america.png',		value: 22 },
        { resId: 'AUSTRALIA_STR',	imgUrl: 'images/australia.png',		value: 23 },
        { resId: 'NEW_ZEALAND_STR',	imgUrl: 'images/newzealand.png',	value: 24 }
    ],

    rgobjDessertWineRegion =
    [
    ],

    rgobjWineColor =
    [
        { resId: 'SPARKLING_WINE_STR', value: 1, items: rgobjSparklingWineRegion },
        { resId: 'CHAMPAGNE_STR',      value: 2, items: rgobjChampagneRegion     },
        { resId: 'WHITE_WINE_STR',     value: 3, items: rgobjWhiteWineRegion     },
        { resId: 'ROSE_WINE_STR',      value: 4, items: rgobjRoseWineRegion      },
        { resId: 'RED_WINE_STR',       value: 5, items: rgobjRedWineRegion       },
        { resId: 'DESSERT_WINE_STR',   value: 6, items: rgobjDessertWineRegion   }
    ],

    rgobjGlassWineType =
    [
        rgobjWineColor[0],
        rgobjWineColor[2],
        rgobjWineColor[3],
        rgobjWineColor[4],
        rgobjWineColor[5]
    ],

    getRegionName = function(intColor, intRegion)
    {
        var strRegion,
            rgobjRegion = rgobjWineColor[intColor - 1].items,
            cRegion = rgobjRegion.length;

        for (var i = 0; i < cRegion; ++i)
        {
            if (intRegion === rgobjRegion[i].value)
            {
                strRegion = Strings.getString(rgobjRegion[i].resId);
                break;
            }
        }

        return strRegion;
    };


//-------------------------------------------------------
// Wine caetgories
//-------------------------------------------- YuMaeda --

var rgobjWineCategory =
    [
        { resId: 'SPARKLING_WINE_STR',   cssClass: 'colorOrange',    value: 1 },
        { resId: 'SPARKLING_ROSE_STR',   cssClass: 'colorPink',      value: 2 },
        { resId: 'FRENCH_WHITE_STR',     cssClass: 'colorCadetBlue', value: 3 },
        { resId: 'GERMAN_WHITE_STR',     cssClass: 'colorCadetBlue', value: 4 },
        { resId: 'AUSTRIAN_WHITE_STR',   cssClass: 'colorCadetBlue', value: 5 },
        { resId: 'ITALIAN_WHITE_STR',    cssClass: 'colorCadetBlue', value: 6 },
        { resId: 'SPANISH_WHITE_STR',    cssClass: 'colorCadetBlue', value: 7 },
        { resId: 'AMERICAN_WHITE_STR',   cssClass: 'colorCadetBlue', value: 8 },
        { resId: 'AUSTRALIAN_WHITE_STR', cssClass: 'colorCadetBlue', value: 9 },
        { resId: 'NEWZEALAND_WHITE_STR', cssClass: 'colorCadetBlue', value: 10 },
        { resId: 'FRENCH_RED_STR',       cssClass: 'colorRed',       value: 11 },
        { resId: 'AUSTRIAN_RED_STR',     cssClass: 'colorRed',       value: 12 },
        { resId: 'GERMAN_RED_STR',       cssClass: 'colorRed',       value: 13 },
        { resId: 'ITALIAN_RED_STR',      cssClass: 'colorRed',       value: 14 },
        { resId: 'SPANISH_RED_STR',      cssClass: 'colorRed',       value: 15 },
        { resId: 'AMERICAN_RED_STR',     cssClass: 'colorRed',       value: 16 },
        { resId: 'AUSTRALIAN_RED_STR',   cssClass: 'colorRed',       value: 17 },
        { resId: 'NEWZEALAND_RED_STR',   cssClass: 'colorRed',       value: 18 },
        { resId: 'ROSE_WINE_STR',        cssClass: 'colorPink',      value: 19 }
    ];


//-------------------------------------------------------
// Drink types
//-------------------------------------------- YuMaeda --
var rgobjDrinkCategory =
    [
        { resId: 'BEER_STR',       value: 1 },
        { resId: 'MARC_STR',       value: 2 },
        { resId: 'FINE_STR',       value: 3 },
        { resId: 'CALVADOS_STR',   value: 4 },
        { resId: 'COGNAC_STR',     value: 5 },
        { resId: 'ARMAGNAC_STR',   value: 6 },
        { resId: 'MADEIRA_STR',    value: 7 },
        { resId: 'GRAPPA_STR',     value: 8 },
        { resId: 'WHISKY_STR',     value: 9 },
        { resId: 'SHOCHU_STR',     value: 10 },
        { resId: 'SAKE_STR',       value: 11 },
        { resId: 'LIQUOR_STR',     value: 12 },
        { resId: 'COCKTAIL_STR',   value: 13 },
        { resId: 'SOFT_DRINK_STR', value: 14 },
        { resId: 'HERB_TEA_STR',   value: 15 }
    ];


//-------------------------------------------------------
// Shochu types
//-------------------------------------------- YuMaeda --

var rgobjShochuCategory =
    [
        { resId: 'AWAMORI_STR',        value: 1 },
        { resId: 'KOKUTOU_JOUCHU_STR', value: 2 },
        { resId: 'KOME_JOUCHU_STR',    value: 3 },
        { resId: 'MUGI_JOUCHU_STR',    value: 4 },
        { resId: 'IMO_JOUCHU_STR',     value: 5 },
        { resId: 'KURI_JOUCHU_STR',    value: 6 }
    ];


var _getFlagImage = function(strCountry)
{
    var strImg = countryHash[strCountry] ?
        countryHash[strCountry].img :
        '';

    return strImg;
};

var _getWineColorResourceId = function(intCategory)
{
    var objWineColor,
        resId = '';

    for (var i = 0; i < rgobjWineColor.length; ++i)
    {
        objWineColor = rgobjWineColor[i];
        if (objWineColor.value == intCategory)
        {
            resId = objWineColor.resId;
            break;
        }
    }

    return resId;
};


//-------------------------------------------------------
// Dropdowns
//-------------------------------------------- YuMaeda --
var _generateSelectHtml = function(rgobjOption, strId, strName, strLabel, iSelected)
    {
        var cOption = rgobjOption.length,
            objOption = null,
            strText = '';

        var selectTag = new SelectTag();
        selectTag.addAttr('name', strName);

        if (strId)
        {
            selectTag.addAttr('id', strId);
        }

        if (strLabel)
        {
            selectTag.addLabel(strLabel);
        }

        selectTag.setSelectedIndex(iSelected);

        for (var i = 0; i < cOption; ++i)
        {
            objOption = rgobjOption[i];

            strText = Strings.getString(objOption.resId);
            if (strText == null)
            {
                // TODO yumaeda: Remove this workaround code.
                strText = Constants[objOption.resId];
                if (strText == null)
                {
                    strText = Constants['ja'][objOption.resId];
                }
            }

            selectTag.addOption(strText, objOption.value);
        }

        return selectTag.toHtml();
    },

    _generateCategorySelectHtml = function(rgobjCategory, strId, strLabel)
    {
        return(_generateSelectHtml(rgobjCategory, strId, 'category', strLabel, 0));
    };


//-------------------------------------------------------
// Item Getters
//-------------------------------------------- YuMaeda --
var _getCategory = function(rgCategory, intValue)
    {
        var cCategory = rgCategory.length,
            objCategory = null;

        for (var i = 0; !objCategory && (i < cCategory); ++i)
        {
            if (rgCategory[i].value == intValue)
            {
                objCategory = rgCategory[i];
            }
        }

        return(objCategory);
    },

    getWineColor = function(intValue)
    {
        return(_getCategory(rgobjWineColor, intValue));
    },

    getGeneralRegion = function(intColor, intValue)
    {
        return(_getCategory(rgobjWineColor[intColor - 1].items, intValue));
    };


var rgobjRegion =
    [
        { text: 'Champagne',                                      	locText: 'シャンパーニュ地方',			value: 1,	categories: [ 3, 11 ] },
        { text: 'Champagne / Montagne de Reims',                  	locText: 'シャンパーニュ地方 / モンターニュ・ド・ランス地区',	value: 2,	categories: [ 1 ] },			
        { text: 'Champagne / Valée de la Marne',                  	locText: 'シャンパーニュ地方 / ヴァレ・ド・ラ・マルヌ地区', 	value: 3,	categories: [ 1 ] },		
        { text: 'Champagne / Côte des Blancs',                    	locText: 'シャンパーニュ地方 / コート・デ・ブラン地区',	value: 4,	categories: [ 1 ] },		
        { text: 'Champagne / Petit et Grand-Mont',                	locText: 'シャンパーニュ地方 / プティ・エ・グラン・モン地区',	value: 5,	categories: [ 1 ] },		
        { text: 'Champagne / Côte des Bar',                       	locText: 'シャンパーニュ地方 / コート・デ・バール地区',	value: 6,	categories: [ 1 ] },		
        { text: 'Champagne / Côte de Champagne',                  	locText: 'シャンパーニュ地方 / コート・ドゥ・シャンパーニュ地区',	value: 7,	categories: [ 1 ] },		
        { text: 'Champagne Rosé',                                 	locText: 'シャンパーニュ・ロゼ',			value: 8,	categories: [ 2 ] },
        { text: 'Crémant',                                        	locText: 'クレマン',			        value: 20,	categories: [ 1 ] },
        { text: 'Vin Mousseux',                                   	locText: 'ヴァン・ムスー',			value: 21,	categories: [ 1 ] },
        { text: 'Vin Mousseux　Rosé',                              	locText: 'ヴァン・ムスー・ロゼ',			value: 22,	categories: [ 1 ] },			
        { text: 'Pétillant',                                      	locText: 'ペティヤン',         		value: 23,	categories: [ 1 ] },
        { text: 'Lorraine',                                       	locText: 'ロレーヌ地方',			value: 30,	categories: [ 3 ] },
        { text: 'Alsace / Riesling',                              	locText: 'アルザス地方 / リースリング',		value: 40,	categories: [ 3 ] },	
        { text: 'Alsace / Gewurztraminer',                        	locText: 'アルザス地方 / ゲヴェルツトラミネール',		value: 41,	categories: [ 3 ] },	
        { text: 'Alsace / Pinot Gris',                            	locText: 'アルザス地方 / ピノ・グリ',		value: 42,	categories: [ 3 ] },	
        { text: 'Alsace / Musucat',                               	locText: 'アルザス地方 / ミュスカ',		value: 43,	categories: [ 3 ] },	
        { text: 'Alsace / Sylvaner',                              	locText: 'アルザス地方 / シルヴァネール',		value: 44,	categories: [ 3 ] },	
        { text: 'Alsace / Pinot Blanc',                           	locText: 'アルザス地方 / ピノ・ブラン',		value: 45,	categories: [ 3 ] },
        { text: 'Alsace / Pinot Noir',                            	locText: 'アルザス地方 / ピノ・ノワール',		value: 46,	categories: [ 11 ] },					
        { text: 'Autres de Alsace',                               	locText: 'その他のアルザス地方',			value: 47,	categories: [ 3 ] },	
        { text: 'Vallée de la Loire / Pays Nantais',              	locText: 'ロワール河流域 / ナント地区',		value: 60,	categories: [ 3 ] },				
        { text: 'Vallée de la Loire / Anjou & Saumur',            	locText: 'ロワール河流域 / アンジュー＆ソミュール地区',	value: 61,	categories: [ 3, 11 ] },		
        { text: 'Vallée de la Loire / Touraine',                  	locText: 'ロワール河流域 / トゥーレーヌ地区',		value: 62,	categories: [ 3, 11 ] },	
        { text: 'Vallée de la Loire / Centre',                    	locText: 'ロワール河流域 / 中央フランス地区',		value: 63,	categories: [ 3, 11 ] },	
        { text: 'Vallée de la Loire / Autres Vignobles de Loire',	locText: 'ロワール河流域 / ロワール河流域のその他の栽培地',	value: 64,	categories: [ 3 ] },			
        { text: 'Bordeaux',                                       	locText: 'ボルドー地方',			value: 80,	categories: [ 3 ] }, 
        { text: 'Bordeaux / Médoc',                               	locText: 'ボルドー地方 / メドック地区',		value: 81,	categories: [ 11 ] },
        { text: 'Bordeaux / Graves',                              	locText: 'ボルドー地方 / グラーヴ地区',		value: 82,	categories: [ 11 ] },
        { text: 'Bordeaux / Saint-Émilion',                       	locText: 'ボルドー地方 / サンテミリオン地区',		value: 83,	categories: [ 11 ] },	
        { text: 'Bordeaux / Pomerol',                             	locText: 'ボルドー地方 / ポムロル地区',		value: 84,	categories: [ 11 ] },
        { text: 'Bordeaux / Rive Droit de la Dordogne',           	locText: 'ボルドー地方 / ドルドーニュ右岸地区',		value: 85,	categories: [ 11 ] },		
        { text: 'Sud-Ouest',                                      	locText: '南西地方',	        	value: 100,	categories: [ 3 ] },				
        { text: 'Bourgogne',                                      	locText: 'ブルゴーニュ',			value: 110,	categories: [ 3, 11, 19 ] },
        { text: 'Bourgogne / Auxerois',                           	locText: 'ブルゴーニュ地方 / オーセロワ地区',		value: 111,	categories: [ 11 ] },
        { text: 'Bourgogne / Chablis',                            	locText: 'ブルゴーニュ地方 / シャブリ地区',		value: 112,	categories: [ 3 ] },
        { text: 'Bourgogne / Côte de Nuits',                      	locText: 'ブルゴーニュ地方 / コート・ド・ニュイ地区',	value: 113,	categories: [ 3, 11 ] },	
        { text: 'Bourgogne / Côte de Beaune',                     	locText: 'ブルゴーニュ地方 / コート・ド・ボーヌ地区',	value: 114,	categories: [ 3, 11 ] },	
        { text: 'Bourgogne / Côte Chalonnaise',                   	locText: 'ブルゴーニュ地方 / コート・シャロネーズ地区',	value: 115,	categories: [ 3, 11 ] },	
        { text: 'Bourgogne / Mâconnais',                          	locText: 'ブルゴーニュ地方 / マコネー地区',		value: 116,	categories: [ 3 ] },
        { text: 'Bourgogne / Beaujolais',                         	locText: 'ブルゴーニュ地方 / ボージョレ地区',		value: 117,	categories: [ 11 ] },					
        { text: 'Jura',                                           	locText: 'ジュラ地方',			value: 130,	categories: [ 3, 11 ] },
        { text: 'Franche-Comté',                                  	locText: 'フランシュ・コンテ地方',			value: 140,	categories: [ 3, 11 ] },				
        { text: 'Savoie',                                         	locText: 'サヴォワ地方',			value: 150,	categories: [ 3 ] },
        { text: 'Vallée du Rhône / Vignoble Septentrional',       	locText: 'ローヌ河流域 / ローヌ地方北部の栽培地域',	value: 160,	categories: [ 3, 11 ] },			
        { text: 'Vallée du Rhône / Vignoble Méridional',        	locText: 'ローヌ河流域 / ローヌ地方南部の栽培地域',	value: 161,	categories: [ 3, 11 ] },		
        { text: 'Vallée du Rhône / Autres Vignobles de Rhône',  	locText: 'ローヌ河流域 / ローヌ河流域のその他の栽培地',	value: 162,	categories: [ 3 ] },			
        { text: 'Côtes du Rhône Villages',                      	locText: 'コート・デュ・ローヌ・ヴィラージュ',		value: 163,	categories: [ 11 ] },
        { text: 'Côtes du Rhône & Autres Vignobles',            	locText: 'コート・デュ・ローヌとその他の栽培地',		value: 164,	categories: [ 11 ] },						
        { text: 'Languedoc',                                    	locText: 'ラングドック地方',			value: 180,	categories: [ 11, 19 ] },
        { text: 'Roussillon',                                   	locText: 'ルーション地方',			value: 181,	categories: [ 11 ] },
        { text: 'Languedoc & Roussillon',                       	locText: 'ラングドック地方＆ルーション地方',		value: 182,	categories: [ 3 ] },			
        { text: 'Autres Vignobles de Languedoc et Roussillon',  	locText: 'ラングドック地方＆ルーション地方のその他の栽培地',	value: 183,	categories: [ 11 ] },			
        { text: 'Provence',                                     	locText: 'プロヴァンス地方',			value: 190,	categories: [ 3, 11, 19 ] },	
	
        { text: 'Corse',						locText: 'コルシカ島',			value: 195,	categories: [ 3, 11 ] },

        { text: 'Mosel-Saar-Ruwer',					locText: 'モーゼル・ザール・ルヴァー地区',		value: 200,	categories: [ 4 ] },
        { text: 'Rheingau',         					locText: 'ラインガウ地区',			value: 201,	categories: [ 4 ] },
        { text: 'Pfalz',            					locText: 'ファルツ地区',			value: 202,	categories: [ 4 ] },
        { text: 'Barden',           					locText: 'バーデン地区',			value: 203,	categories: [ 4, 13 ] },

        { text: 'Niederösterreich / Kamptal',       			locText: 'ニーダーエスタライヒ州 / カンプタール地区',	value: 300,	categories: [ 5 ] },
        { text: 'Niederösterreich / Wien',          			locText: 'ニーダーエスタライヒ州 / ヴィーン地区',		value: 301,	categories: [ 5 ] },
        { text: 'Niederösterreich / Donauland',     			locText: 'ニーダーエスタライヒ州 / ドナウラント地区',	value: 302,	categories: [ 5 ] },	
        { text: 'Niederösterreich / Kremstal',      			locText: 'ニーダーエスタライヒ州 / クレムスタール地区',	value: 303,	categories: [ 5 ] },
        { text: 'Niederösterreich / Wachau',        			locText: 'ニーダーエスタライヒ州 / ヴァッハウ地区',   	value: 304,	categories: [ 5 ] },	
        { text: 'Niederösterreich / Thermenregion',			locText: 'ニーダーエスタライヒ州 / テルメンレギオン地区',    	value: 305,	categories: [ 12 ] },
        { text: 'Burgenland / Neusiedlersee',       			locText: 'ブルゲンラント州 / ノイジードラーゼー地区',  	value: 306,	categories: [ 5 ] },	
        { text: 'Steiermark / Südsteiermark',       			locText: 'シュタイヤーマルク州 / ズュートシュタイヤーマルク地区',	value: 307,	categories: [ 5 ] },

        { text: 'Trentino Alto-Adige',					locText: 'トレンティーノ・アルト・アディジェ州',		value: 400,	categories: [ 6 ] },
        { text: 'Vallée d\'Aoste',					locText: 'ヴァッレ・ダオスタ州',			value: 401,	categories: [ 14 ] },
        { text: 'Friuli-Venezia-Giulia',				locText: 'フリウ-リ・ヴェネツィア・ジューリア州',		value: 402,	categories: [ 6, 14 ] },
        { text: 'Veneto',						locText: 'ヴェネト州',			value: 403,	categories: [ 14 ] },
        { text: 'Emilia Romagna',					locText: 'エミリア・ロマーニャ州',	 		value: 404,	categories: [ 14 ] },			
        { text: 'Piemonte',						locText: 'ピエモンテ州',	 		value: 405,	categories: [ 6, 14 ] },	
        { text: 'Toscana',						locText: 'トスカーナ州',			value: 406,	categories: [ 6, 14 ] },
        { text: 'Umbria',						locText: 'ウンブリア州',	 		value: 407,	categories: [ 6, 14 ] },
        { text: 'Marche',						locText: 'マルケ州',	 		value: 408,	categories: [ 6, 14 ] },
        { text: 'Abruzzo',						locText: 'アブルッツォ州',	 		value: 409,	categories: [ 6, 14 ] },
        { text: 'Lazio',						locText: 'ラツィオ州',	 		value: 410,	categories: [ 6, 14 ] },
        { text: 'Molise',						locText: 'モリーゼ州',			value: 411,	categories: [ 14 ] },
        { text: 'Campagna',						locText: 'カンパーニャ州',	 		value: 412,	categories: [ 6, 14 ] },
        { text: 'Basilicata',						locText: 'バジリカータ州',	 		value: 413,	categories: [ 14 ] },
        { text: 'Sardegna',						locText: 'サルディーニャ州',	 		value: 414,	categories: [ 14 ] },
        { text: 'Sicilia',						locText: 'シチリア州',	 		value: 415,	categories: [ 14 ] },

        { text: 'Galicia',						locText: 'ガリシア州',			value: 500,	categories: [ 7 ] },
        { text: 'Castilla Y León',					locText: 'カスティーリャ・イ・レオン州',		value: 501,	categories: [ 15 ] },
        { text: 'Cataluña',						locText: 'カタルーニャ州',			value: 502,	categories: [ 15 ] },
        { text: 'Valenciana',						locText: 'ヴァレンシア州',			value: 503,	categories: [ 15 ] },
        { text: 'Murcia',						locText: 'ムルシア州',			value: 504,	categories: [ 15 ] },

        { text: 'Washington',						locText: 'ワシントン州',			value: 600,	categories: [ 8 ] },
        { text: 'Oregon',						locText: 'オレゴン州',			value: 601,	categories: [ 8, 16 ] },
        { text: 'California',						locText: 'カルフォルニア州',			value: 602,	categories: [ 8, 16 ] },

        { text: 'Victoria / Macedon',					locText: 'ヴィクトリア州 / マセドン地区',		value: 700,	categories: [ 17 ] },
        { text: 'Victoria / Gippsland',					locText: 'ヴィクトリア州 / ジップスランド地区',		value: 701,	categories: [ 9, 17 ] },
        { text: 'Victoria / Geelong',					locText: 'ヴィクトリア州・ジーロング地区',		value: 702,	categories: [ 17 ] },	
        { text: 'Victoria / Mornington Peninsula',			locText: 'ヴィクトリア州 / モーニングトン・ペニンシュラ地区',	value: 703,	categories: [ 9, 17 ] },
        { text: 'Victoria / Yarra Valley',				locText: 'ヴィクトリア州 / ヤラ・ヴァレー',		value: 704,	categories: [ 17 ] },
        { text: 'South Australia / Barossa Valley',			locText: 'サウス・オーストラリア州 / バロッサ・ヴァレイ',	value: 705,	categories: [ 17 ] },		
        { text: 'South Australia / Langhorne Creek',			locText: 'サウス・オーストラリア州・ラングホーン・クリーク地区',	value: 706,	categories: [ 17 ] },		
        { text: 'New South Wales / Cowra',				locText: 'ニュー・サウス・ウェールズ州 / カウラ地区',	value: 707,	categories: [ 17 ] },
        { text: 'South Australia / McLaren Vale',			locText: 'サウス・オーストラリア州 / マクラーレン・ヴェール地区',	value: 708,	categories: [ 17 ] },			
        { text: 'Tasmania / Northeast Coast Tasmania',			locText: 'タスマニ州 / 北東地域タスマニア地区',	value: 709,	categories: [ 9, 17 ] },		
        { text: 'Tasmania / Derwent Valley',				locText: 'タスマニ州 / ダーヴェント・ヴァレー地区',	value: 710,	categories: [ 9 ] },		
        { text: 'Western Australia / Pemberton',			locText: 'ウエスタン・オーストラリア州 / ペンバートン地区',	value: 711,	categories: [ 9 ] },	

        { text: 'Waiheke Island',					locText: 'ワイヘキ島',			value: 800,	categories: [ 18 ] },
        { text: 'North Island',						locText: '北島',				value: 801,	categories: [ 10, 18 ] },
        { text: 'South Island',						locText: '南島',				value: 802,	categories: [ 10, 18 ] }
    ];


var getObjWine = function(intValue)
    {
        return(_getCategory(rgobjWineCategory, intValue));
    },

    getObjRegion = function(intValue)
    {
        return(_getCategory(rgobjRegion, intValue));
    },

    getObjDrink = function(intValue)
    {
        return(_getCategory(rgobjDrinkCategory, intValue));
    },

    getObjShochu = function(intValue)
    {
        return(_getCategory(rgobjShochuCategory, intValue));
    },

    _getRegionsByCategory = function(intCategory)
    {
        var cRegion = rgobjRegion.length,
            rgobjTargetRegion = [];

        for (var i = 0; i < cRegion; ++i)
        {
            var fFound = false,
                cCategory = rgobjRegion[i].categories.length;

            for (var j = 0; (!fFound && (j < cCategory)); ++j)
            {
                if (rgobjRegion[i].categories[j] == intCategory)
                {
                    rgobjTargetRegion.push(rgobjRegion[i]);
                    fFound = true;
                }
            }
        }

        return(rgobjTargetRegion);
    };


var generateRegionSelectHtml = function(intCategory)
    {
        var rgobjRegion = _getRegionsByCategory(intCategory);
        var cRegion = rgobjRegion.length;

        var selectTag = new SelectTag();
        selectTag.addAttr('id', 'regionSelect');
        selectTag.addAttr('name', 'aoc');
        selectTag.addLabel(Strings.getString('REGION_STR'));

        for (var i = 0; i < cRegion; ++i)
        {
            selectTag.addOption(rgobjRegion[i].text, rgobjRegion[i].value);
        }

        selectTag.setSelectedIndex(0);
        return selectTag.toHtml();
    },

    generateRegionSelectHtmlByColor = function(intColor)
    {
        var rgobjRegion = _getCategory(rgobjWineColor, intColor).items;
        var cRegion = rgobjRegion.length;

        var selectTag = new SelectTag();
        selectTag.addAttr('id', 'regionSelect');
        selectTag.addAttr('name', 'general_region');
        selectTag.addLabel(Strings.getString('REGION_STR'));

        for (var i = 0; i < cRegion; ++i)
        {
            selectTag.addOption(Strings.getString(rgobjRegion[i].resId), rgobjRegion[i].value);
        }

        selectTag.setSelectedIndex(0);
        return selectTag.toHtml();
    },

    generateManipulantSelectHtml = function()
    {
        var selectTag = new SelectTag();
        selectTag.addAttr('id', 'manipulantSelect');
        selectTag.addAttr('name', 'manipulant');
        selectTag.addLabel('マニピュランの種類');
        selectTag.addOption('Recoltant Manipulant', 1);
        selectTag.addOption('Negociant Manipulant', 2);
        selectTag.addOption('Cooperative Manipulant', 3);
        selectTag.setSelectedIndex(0);

        return(selectTag.toHtml());
    },

    generateWineCategorySelectHtml = function()
    {
        return(_generateCategorySelectHtml(rgobjWineCategory, 'wineCategorySelect', Strings.getString('WINE_TYPE_STR')));
    },

    generateDrinkCategorySelectHtml = function()
    {
        return(_generateCategorySelectHtml(rgobjDrinkCategory, 'drinkCategorySelect', Strings.getString('DRINK_TYPE_STR')));
    };
var RecommendedWineContents =
{
    siteName: '',
    dbTable: '',
    headerText: '',
    footerText: '',
    headerSubText: '',
    pageNumber: 0,
    iFirstItemNumber: 0,

    cExpectedItem: 9,
    cFocusout: 0,

    _generateBarcodeNumberFldHtml: function(index)
    {
        var barcodeNumberFld = new TextField('barcode_number_{0}'.format(index), '');

        barcodeNumberFld.addAttr('maxlength', 4);
        barcodeNumberFld.addAttr('tabindex', index);

        return barcodeNumberFld.toHtml();
    },

    _renderPreviewPane: function(objWine, index)
    {
        if (objWine)
        {
            var strCountry, flagImgName, flagImgPath,
                intColor = RecommendedWineContents._getColorAsInt(objWine);
            if (intColor == 2)
            {
                alert(Strings.getString('INVALID_BARCODE_FOR_WINE_MSG'));
                return;
            }

            $tableRow  = $('td#previewPane{0}'.format(index)).closest('tr');
            $tableRow.css('background-color', RecommendedWineContents._getCssColor(intColor));

            if (objWine.country && countryHash[objWine.country])
            {
                strCountry  = countryHash[objWine.country].name;
                flagImgName = countryHash[objWine.country].img;
                flagImgPath = '{0}/{1}/images/{2}'.format(getRootFolderUrl(), RecommendedWineContents.siteName, flagImgName);
            }

            var strCepage  = objWine.cepage ? objWine.cepage : '',
                strComment = objWine.comment ? objWine.comment : '';

            var colorFld       = new HiddenField('color_{0}'.format(index), intColor),
                flagImgFld     = new HiddenField('flagImg_{0}'.format(index), flagImgName),
                countryFld     = new HiddenField('country_{0}'.format(index), objWine.country),
                jpnCountryFld  = new HiddenField('country_jpn_{0}'.format(index), strCountry),
                vintageFld     = new TextField('vintage_{0}'.format(index), objWine.vintage),
                nameFld        = new TextField('name_{0}'.format(index), objWine.name),
                producerFld    = new TextField('producer_{0}'.format(index), objWine.producer),
                priceFld       = new TextField('price_{0}'.format(index), objWine.store_price),
                jpnNameFld     = new TextField('name_jpn_{0}'.format(index), objWine.name_jpn),
                jpnProducerFld = new TextField('producer_jpn_{0}'.format(index), objWine.producer_jpn),
                jpnRegionFld   = new TextField('region_jpn_{0}'.format(index), objWine.region_jpn),
                cepageFld      = new TextField('cepage_{0}'.format(index), strCepage),
                commentFld     = new TextField('comment_{0}'.format(index), strComment);

            vintageFld.setCssClass('vintageFld');
            nameFld.setCssClass('nameFld');
            producerFld.setCssClass('producerFld');
            priceFld.setCssClass('priceFld');
            priceFld.addAttr('maxlength', 7);
            jpnNameFld.setCssClass('jpnNameFld');
            jpnProducerFld.setCssClass('jpnProducerFld');
            jpnRegionFld.setCssClass('jpnRegionFld');
            cepageFld.setCssClass('cepageFld');
            commentFld.setCssClass('commentFld');

            var html =
                colorFld.toHtml() +
                flagImgFld.toHtml() +
                countryFld.toHtml() +
                jpnCountryFld.toHtml() +
                vintageFld.toHtml() +
                '{0}&nbsp;({1})'.format(nameFld.toHtml(), producerFld.toHtml()) +
                priceFld.toHtml() +
                '<span class="textSmall">&nbsp;yen</span><br />' +
                jpnNameFld.toHtml() +
                '<span>&nbsp;({0})</span><br />'.format(jpnProducerFld.toHtml()) +
                jpnRegionFld.toHtml() +
                '<span>{0}{1}{2}</span>'.format(Constants['LEFT_BRACKET'], cepageFld.toHtml(), Constants['RIGHT_BRACKET']) +
                commentFld.toHtml();

            if (objWine.barcode_number)
            {
                $('td.firstCol > input[name=barcode_number_{0}]'.format(index)).val(objWine.barcode_number);
            }

            $('td#previewPane{0}'.format(index)).html(html);
            $('img#flagImg{0}'.format(index)).attr('src', flagImgPath);
        }

        if ($('.firstCol > img[src!=""]').length == RecommendedWineContents.cExpectedItem)
        {
            $('button#printBtn').fadeIn(600);
        }
        else
        {
            $('button#printBtn').hide();
        }
    },

    _getColorAsInt: function(objWine)
    {
        var intColor;

        if (objWine.type)
        {
            switch (wineTypeHash[objWine.type].value)
            {
            case 0: // Sparkling
                intColor = 1;
                break;
            case 2: // White Wine
            case 3: // Vin Jaune
                intColor = 3;
                break;
            case 4: // Red Wine
                intColor = 5;
                break;
            case 5: // Dessert Wine
                intColor = 6;
                break;
            case 6: // Rose Wine
                intColor = 4;
                break;
            case 8: // Champagne
                intColor = 1;
                break;
            case 9: // Champagne Rose
                intColor = 1;
                break;
            default:
                intColor = 2; // Others
                break;
            }
        }
        else
        {
            intColor = objWine.color;
        }

        return intColor;
    },

    _getCssColor: function(intColor)
    {
        var colorValue = '';

        switch (intColor)
        {
        case 1:
            colorValue = 'rgb(254,188,90)';
            break;
        case 3:
            colorValue = 'rgb(68,191,227)';
            break;
        case 4:
            colorValue = 'rgb(253,179,193)';
            break;
        case 5:
            colorValue = 'rgb(218,24,58)';
            break;
        case 6:
            colorValue = 'rgb(170,85,0)';
            break;
        default:
            break;
        }

        return colorValue;
    },

    _clearPreview: function(index)
    {
        $('td#previewPane{0} input'.format(index)).val('');
        $('img#flagImg{0}'.format(index)).attr('src', '');
    },

    _generateRowHtml: function(index)
    {
        var buttonsHtml = '';

        if ((index % RecommendedWineContents.cExpectedItem) !== 1)
        {
            buttonsHtml +=
                '<img id="upBtn%%INDEX%%" src="../../images/upArrow.png" class="buttonImage" />';
        }

        if ((index % RecommendedWineContents.cExpectedItem) !== 0)
        {
            buttonsHtml +=
                '<img id="downBtn%%INDEX%%" src="../../images/downArrow.png" class="buttonImage" />';
        }

        var html =
            '<tr>' +
                '<td class="firstCol">' +
                    RecommendedWineContents._generateBarcodeNumberFldHtml(index) + '<br />' +
                    '<img id="flagImg%%INDEX%%" src="" alt="FLAG" />' + '<br />' +
                    '<span>#{0}</span>'.format(index) +
                '</td>' +
                '<td class="secondCol" id="previewPane%%INDEX%%"></td>' +
                '<td class="thirdCol">' +
                    buttonsHtml +
                '</td>' +
            '</tr>';

        return html.replace(/%%INDEX%%/g, index);
    },

    onPageSelectChange: function()
    {
        $('button#printBtn').hide();

        RecommendedWineContents.pageNumber = $(this).val();
        if (RecommendedWineContents.pageNumber == 2)
        {
            RecommendedWineContents.cExpectedItem    = 12;
            RecommendedWineContents.iFirstItemNumber = 1000;
            RecommendedWineContents.headerSubText    = Constants['ja']['TODAYS_GLASS_WINE_STR'];
        }
        else if (RecommendedWineContents.pageNumber == 3)
        {
            RecommendedWineContents.cExpectedItem    = 12;
            RecommendedWineContents.iFirstItemNumber = 1012;
            RecommendedWineContents.headerSubText    = Constants['ja']['MONTHLY_RECOMMENDED_WINE_STR'];
        }
        else
        {
            RecommendedWineContents.cExpectedItem    = 9;
            RecommendedWineContents.iFirstItemNumber =
                ((RecommendedWineContents.pageNumber - 9) * RecommendedWineContents.cExpectedItem) + 1;
            RecommendedWineContents.headerSubText    = '';
        }

        RecommendedWineContents.headerText = $(this).find('option:selected').text();
        RecommendedWineContents.footerText = Constants['ja']['TAXED_PRICE_NOTICE'];
        RecommendedWineContents.onRenderWineList();
    },

    onRenderWineList: function()
    {
        var html =
            '<input type="hidden" name="dbTable"         value="{0}" />'.format(RecommendedWineContents.dbTable) +
            '<input type="hidden" name="pageTitle"       value="{0}" />'.format(RecommendedWineContents.headerText) +
            '<input type="hidden" name="footerText"      value="{0}" />'.format(RecommendedWineContents.footerText) +
            '<input type="hidden" name="firstItemNumber" value="{0}" />'.format(RecommendedWineContents.iFirstItemNumber) +
            '<input type="hidden" name="page_number"     value="{0}" />'.format(RecommendedWineContents.pageNumber);

        if (RecommendedWineContents.headerSubText)
        {
            html += '<input type="hidden" name="pageSubtitle" value="{0}" />'.format(RecommendedWineContents.headerSubText);
        }

        html += '<table style="border-collapse:collapse;">';
        for (var i = 0; i < RecommendedWineContents.cExpectedItem; ++i)
        {
            html += RecommendedWineContents._generateRowHtml(RecommendedWineContents.iFirstItemNumber + i);
        }
        html += '</table>';

        $('div').html(html);

        $.ajax(
        { 
            url:      '../../get_items.php',
            dataType: 'json', 
            data:
            {
                dbTable: RecommendedWineContents.dbTable,
                condition: 'page_number={0}'.format(RecommendedWineContents.pageNumber)
            },

            success: function(data)
            { 
                var objWine = null,
                    cWine   = data.length;

                for  (var i = 0; i < cWine; ++i)
                {
                    objWine = data[i];
                    RecommendedWineContents._renderPreviewPane(objWine, objWine.item_number);
                }
            },

            error: function() {}
        });

        $('img.buttonImage').click(RecommendedWineContents.onImageButtonClick);

        var $inputs = $('td.firstCol > input');
        $inputs.focusout(RecommendedWineContents.onBarcodeNumberInputFocusout);
        $inputs.keyup(function() { RecommendedWineContents.cFocusout = 0; });
    },

    onImageButtonClick: function()
    {
        var $this      = $(this),
            $curRow    = $this.closest('tr'),
            $targetRow = null,
            srcRowId   = $curRow.find('td.firstCol > span').html().replace('#', '');

        if (this.id.startsWith('upBtn'))
        {
            $targetRow = $curRow.closest('tr').prev();
        }
        else if (this.id.startsWith('downBtn'))
        {
            $targetRow = $curRow.closest('tr').next();
        }

        var targetRowId      = $targetRow.find('td.firstCol > span').html().replace('#', ''),
            tmpBarcodeNumber = $targetRow.find('td.firstCol > input').val(),
            tmpFlagImageUrl  = $targetRow.find('td.firstCol > img').attr('src'),
            tmpColorCss      = $targetRow.css('background-color');

        $targetRow.find('td.firstCol > input').val($curRow.find('td.firstCol > input').val());
        $targetRow.find('td.firstCol > img').attr('src', $curRow.find('td.firstCol > img').attr('src'));
        $targetRow.css('background-color', $curRow.css('background-color'));

        $curRow.find('td.firstCol > input').val(tmpBarcodeNumber);
        $curRow.find('td.firstCol > img').attr('src', tmpFlagImageUrl);
        $curRow.css('background-color', tmpColorCss);

        var iTargetField   = 0,
            iCurField      = 0,
            tmpFieldValues = [],
            $targetFields  = $targetRow.find('td.secondCol input'),
            $curFields     = $curRow.find('td.secondCol input');

        $targetFields.each(function()
        {
            var $this = $(this);

            tmpFieldValues.push($this.val());
            $this.val($($curFields.get(iTargetField)).val());

            // Replace the index suffix in the 'name' attribute.
            var nameAttr = $this.attr('name');
            $this.attr('name', nameAttr.replace(srcRowId, targetRowId));

            ++iTargetField;
        });

        $curFields.each(function()
        {
            var $this = $(this);

            $this.val(tmpFieldValues[iCurField]);

            // Replace the index suffix in the 'name' attribute.
            var nameAttr = $this.attr('name');
            $this.attr('name', nameAttr.replace(targetRowId, srcRowId));

            ++iCurField;
        });
    },

    onBarcodeNumberInputFocusout: function()
    {
        if (RecommendedWineContents.cFocusout !== 0)
        {
            return;
        }

        RecommendedWineContents.cFocusout += 1;

        var $this            = $(this),
            index            = $this.attr('tabindex'),
            intBarcodeNumber = $this.val();

        $.ajax(
        {
            url : "http://anyway-grapes.jp/wines/admin/get_admin_items.php",
            data:
            {
                dbTable: 'wines',
                condition: 'barcode_number={0}'.format(intBarcodeNumber)
            },

            dataType: "jsonp",
            jsonp:    "xDomainCallback",
            success: function(data)
            {
                if (data.length === 1)
                {
                    RecommendedWineContents._renderPreviewPane(data[0], index);
                }
            },

            error: function()
            {
                RecommendedWineContents._clearPreview(index);
            }
        });
    }
};

