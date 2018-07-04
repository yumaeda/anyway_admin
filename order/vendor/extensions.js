//-------------------------------------------------------
// String.prototype.nl2br
//-------------------------------------------- YuMaeda --
if (!String.prototype.nl2br)
{
    String.prototype.nl2br = function()
    {
        return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
    };
}

//-------------------------------------------------------
// String.prototype.format
//-------------------------------------------- YuMaeda --
if (!String.prototype.format)
{
    String.prototype.format = function()
    {
        var args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number)
        { 
            return ((typeof args[number] != 'undefined') ? args[number] : match);
        });
    };
}

//-------------------------------------------------------
// Number.prototype.format
//-------------------------------------------- YuMaeda --
if (!Number.prototype.format)
{
    Number.prototype.format = function()
    {
        // convert int to string.
        var strNumber = this + '';

        var rgstrToken   = strNumber.split('.'),
            intToken     = rgstrToken[0],
            decimalToken = ((rgstrToken.length > 1) ? '.' + rgstrToken[1] : '');

        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(intToken))
        {
            intToken = intToken.replace(rgx, '$1' + ',' + '$2');
        }

        return (intToken + decimalToken);
    };
}

