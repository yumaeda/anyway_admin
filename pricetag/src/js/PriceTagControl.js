//-------------------------------------------------------
//
// PriceTagControl
//
//-------------------------------------------- YuMaeda --
class PriceTagControl
{
    constructor(objWine, intId)
    {
        this.m_objWine = objWine;
        this.m_intId   = intId;
    }

    // Copied from seiya.wineutility-0.1.js
    _getRegionText(objWine)
    {
        var strRegion = objWine.region ? objWine.region : '';
        if (objWine.district)
        {
            strRegion = '{0} / {1}'.format(strRegion, objWine.district);
        }

        return strRegion;
    }

    _getProducer(objWine)
    {
        var strProducer = objWine.producer;

        if (objWine.region == 'Bordeaux')
        {
            if (objWine.village)
            {
                strProducer = objWine.village;
            }
            else
            {
                strProducer = objWine.district;
            }
        }

        return strProducer;
    }

    _getJpnProducer(objWine)
    {
        var strProducer = objWine.producer_jpn;

        if (objWine.region == 'Bordeaux')
        {
            if (objWine.village_jpn)
            {
                strProducer = objWine.village_jpn;
            }
            else
            {
                strProducer = objWine.district_jpn;
            }
        }

        return strProducer;
    }

    toHtml()
    {
        var html          = '',
            strJpnRegion  = this.m_objWine.region_jpn,
            intCountry    = CountryInfo.getCountryAsInt(this.m_objWine.country),
            strJpnCountry = CountryInfo.getJpnName(this.m_objWine.country);

        if (strJpnCountry)
        {
            strJpnRegion = '{0} / {1}'.format(strJpnCountry, strJpnRegion);
        }

        var label1Fld      = new HiddenField('lbl1', '生産者：'),
            label2Fld      = new HiddenField('lbl2', '銘　柄：'),
            label3Fld      = new HiddenField('lbl3', '品　種：'),
            label4Fld      = new HiddenField('lbl4', '生産地：'),
            countryFld     = new HiddenField('country_{0}'.format(this.m_intId), intCountry),
            typeFld        = new HiddenField('type_{0}'.format(this.m_intId), WineInfo.getTypeCss(this.m_objWine.type)),
            vintageFld     = new NumberField('vintage_{0}'.format(this.m_intId), this.m_objWine.vintage),
            regionFld      = new TextField('region_{0}'.format(this.m_intId), this._getRegionText(this.m_objWine)),
            producerFld    = new TextField('producer_{0}'.format(this.m_intId), this._getProducer(this.m_objWine)),
            nameFld        = new TextField('name_{0}'.format(this.m_intId), this.m_objWine.combined_name),
            cuveeFld       = new TextField('cuvee_{0}'.format(this.m_intId), ''),
            jpnProducerFld = new TextField('producer_jpn_{0}'.format(this.m_intId), this._getJpnProducer(this.m_objWine)),
            jpnNameFld     = new TextField('name_jpn_{0}'.format(this.m_intId), this.m_objWine.combined_name_jpn),
            cepage1Fld     = new TextField('cepage1_{0}'.format(this.m_intId), this.m_objWine.cepage),
            cepage2Fld     = new TextField('cepage2_{0}'.format(this.m_intId), ''),
            jpnRegion1Fld  = new TextField('region_jpn1_{0}'.format(this.m_intId), strJpnRegion),
            jpnRegion2Fld  = new TextField('region_jpn2_{0}'.format(this.m_intId), this.m_objWine.district_jpn),
            priceFld       = new CurrencyField('price_{0}'.format(this.m_intId), this.m_objWine.price);

    vintageFld.addClass('vintage-fld');
    regionFld.addClass('region-fld');
    producerFld.addClass('producer-fld');
    nameFld.addClass('name-fld');
    cuveeFld.addClass('cuvee-fld');
    jpnProducerFld.addClass('producer_jpn-fld');
    jpnNameFld.addClass('name_jpn-fld');
    cepage1Fld.addClass('cepage-fld');
    cepage2Fld.addClass('cepage-fld');
    jpnRegion1Fld.addClass('region-fld');
    jpnRegion2Fld.addClass('region-fld');
    priceFld.addClass('price-fld');

    html =
        label1Fld.toHtml() +
        label2Fld.toHtml() +
        label3Fld.toHtml() +
        label4Fld.toHtml() +
        countryFld.toHtml() +
        typeFld.toHtml() +
        '<hr class="lineThin" />' +
        vintageFld.toHtml() +
        regionFld.toHtml() + '<br />' +
        producerFld.toHtml() + '<br />' +
        nameFld.toHtml() + '<br />' +
        cuveeFld.toHtml() +
        '<hr class="lineThin" />' +
        '<table style="width:100%;">' +
            '<tr>' +
                '<td class="jpn-label">生産者：</td>' +
                '<td colspan="2">{0}</td>'.format(jpnProducerFld.toHtml()) +
            '</tr>' +
            '<tr>' +
                '<td class="jpn-label">銘　柄：</td>' +
                '<td colspan="2">{0}</td>'.format(jpnNameFld.toHtml()) +
            '</tr>' +
            '<tr>' +
                '<td class="jpn-label">品　種：</td>' +
                '<td colspan="2">{0}</td>'.format(cepage1Fld.toHtml()) +
            '</tr>' +
            '<tr>' +
                '<td class="jpn-label">&nbsp</td>' +
                '<td colspan="2">{0}</td>'.format(cepage2Fld.toHtml()) +
            '</tr>' +
            '<tr>' +
                '<td class="jpn-label">生産地：</td>' +
                '<td>{0}</td>'.format(jpnRegion1Fld.toHtml()) +
            '</tr>' +
            '<tr>' +
                '<td class="jpn-label">&nbsp</td>' +
                '<td>{0}</td>'.format(jpnRegion2Fld.toHtml()) +
                '<td class="textRight">{0}</td>'.format(priceFld.toHtml()) +
            '</tr>' +
        '</table>';

        return html;
    }
}

