//-------------------------------------------------------
//
// HtmlControl (Requires jquery.js).
//
//-------------------------------------------- YuMaeda --
class HtmlControl
{
    constructor($parentContainer)
    {
        this.m_fValidParent     = ($parentContainer && ($parentContainer.length > 0));
        this.$m_parentContainer = $parentContainer;
    }

    preRender() {}
    renderChildren() {}

    render()
    {
        this.preRender();

        if (this.m_fValidParent)
        {
            this.renderChildren();
        }

        this.postRender();
    }

    postRender() {}
}

