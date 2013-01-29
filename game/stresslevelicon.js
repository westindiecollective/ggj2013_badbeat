
var StressLevelIcon = HUDIcon.extend({
    init: function(x, y, image, image_alter, spritewidth, spriteheight) {
        this.parent(x, y, image, spritewidth, spriteheight);

        this.useAlterIcon = false;
        var icon_alter = image_alter || "default_icon";
        this.iconAlter = me.loader.getImage(icon_alter);
    },

    update: function() {

        parent.update();

        return true;
    },

    set: function(value) {
        if (this.useAlterIcon != value) {
            this.useAlterIcon = value;
        }
    },

    draw: function(context, x, y) {
        if (this.useAlterIcon) {
            context.drawImage( this.iconAlter, this.pos.x + x, this.pos.y + y, this.spritewidth, this.spriteheight );
        }
        else {
            context.drawImage( this.icon, this.pos.x + x, this.pos.y + y, this.spritewidth, this.spriteheight );
        }
    }
});