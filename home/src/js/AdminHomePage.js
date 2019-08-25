//-------------------------------------------------------
//
// AdminHomePage
//
//-------------------------------------------- YuMaeda --
class AdminHomePage
{
    constructor()
    {
        this.$m_header   = $('header');
        this.$m_contents = $('div');
    }

    _generateSiteSelectHtml()
    {
        var selectTag = new SelectTag();

        selectTag.addAttr('id', 'siteSelect');
        selectTag.addLabel('ウェブサイトを選択してください。');
        selectTag.addOption('Japanese Food & Wine Mitsu-Getsu', 1);
        selectTag.addOption('居酒屋おふろ', 2);
        selectTag.addOption('Conceptual Wine Boutique Anyway Grapes', 3);
        selectTag.addOption('業務卸し', 4);
        selectTag.addOption('Wine Tasting Space Honey Moon', 5);
        selectTag.setSelectedIndex(0);

        return selectTag.toHtml();
    }

    _generateMitsugetsuCmdListHtml()
    {
        var html      = '',
            anchorTag = new AnchorTag('/mitsu-getsu/admin/winelist/full-winelist.html', 'ワインリストを印刷');

        anchorTag.addAttr('id', 'printLnk');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('mitsu-getsu/admin/index.html?site=1', 'データーベースの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('mitsu-getsu/admin/wine/index.html', 'ワインリストの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/restaurant/wine_checker/?ver=20171224_001', 'ワインの情報を表示');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('mitsu-getsu/admin/photo/index.html?site=1', '写真のアップロード');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('http://anyway-grapes.jp/wines/admin/soldout/index.php', '在庫切れワイン');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        return html;
    }

    _generateOfuroCmdListHtml()
    {
        var html      = '',
            anchorTag = new AnchorTag('ofuro/admin/dailymenu.html', '日替わりメニューの編集');

        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/restaurant/wine_checker/?ver=20171224_001', 'ワインの情報を表示');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('ofuro/admin/index.html?site=2', 'データーベースの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('ofuro/admin/winemgr/index.html', 'ワインリストの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('ofuro/admin/photo/index.html?site=2', '写真のアップロード');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        return html;
    }

    _generateAnywayCmdListHtml()
    {
        var html      = '',
            anchorTag = new AnchorTag('anyway-grapes/admin/wine/index.html', 'お勧めワインリストを作成');

        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('anyway-grapes/admin/index.html?site=3', 'データーベースの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('anyway-grapes/admin/photo/index.html?site=3', '写真のアップロード');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/reservation/index.php', 'ワインを予約する');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/goods_issue/index.html', 'Mitsu-Getsuへの出庫');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/order2', '注文の管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/preorders', '予約販売の管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/wine_set', 'ワインセットの管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('anyway-grapes/admin/pricetag/index.html', 'プライスタグを印刷');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/seo/generate_producer.php', '生産者情報を登録する。');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/sitemap_generator/index.php', 'サイトマップの更新');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/photo_upload/index.html', 'ワイン画像のアップロード');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        return html;
    }

    _generateWholesaleCmdListHtml()
    {
        var html      = '',
            anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/wholesale/register.php', '卸先の登録');

        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/wholesale/order_mgr.php', '注文の管理');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        anchorTag = new AnchorTag('//anyway-grapes.jp/wines/admin/wholesale/pdf_upload/', '納品書のアップロード');
        anchorTag.addClass('adminLink');
        html += '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());

        return html;
    }

    _generateHoneymoonCmdListHtml()
    {
        var anchorTag =
            new AnchorTag('honeymoon/admin/index.html', '試飲情報の更新');

        anchorTag.addClass('adminLink');

        return '<div class="adminBtn"><div>{0}</div></div>'.format(anchorTag.toHtml());
    }

    _onSiteSelect($select, self)
    {
        switch (parseInt($select.val(), 10))
        {
        case 1: 
            self.$m_contents.html(self._generateMitsugetsuCmdListHtml());
            break;
        case 2:
            self.$m_contents.html(self._generateOfuroCmdListHtml());
            break;
        case 3:
            self.$m_contents.html(self._generateAnywayCmdListHtml());
            break;
        case 4:
            self.$m_contents.html(self._generateWholesaleCmdListHtml());
            break;
        case 5:
            self.$m_contents.html(self._generateHoneymoonCmdListHtml());
            break;
        default:
            break;
        }
    }

    render()
    {
        var self = this;

        this.$m_header.append(this._generateSiteSelectHtml());
        this.$m_header.on('change', 'select#siteSelect', function()
        {
            self._onSiteSelect($(this), self);
        });
    }
}

