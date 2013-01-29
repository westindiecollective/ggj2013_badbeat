
var BeatRateHUD = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        var beatRateFont = "32x32_font";
        this.font = new me.BitmapFont(beatRateFont, 32);
    },

    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
});