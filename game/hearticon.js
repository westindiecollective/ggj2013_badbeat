
var HeartIcon = HUDIcon.extend({
    init: function(x, y, image, spritewidth, spriteheight) {
        this.parent(x, y, image, spritewidth, spriteheight);
    },

    update: function() {
        //@TODO: animate heart

        parent.update();

        return true;
    }
});
