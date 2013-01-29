var HUDIcon = me.HUD_Item.extend({
    init: function(x, y, image, spritewidth, spriteheight) {
        this.parent(x, y);

        var icon = image || "default_icon";
        this.icon = me.loader.getImage(icon);
        this.spritewidth = spritewidth || 32;
        this.spriteheight = spriteheight || 32;
    },

    draw: function(context, x, y) {
        context.drawImage( this.icon, this.pos.x + x, this.pos.y + y, this.spritewidth, this.spriteheight );
    }
});
