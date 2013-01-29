var Trigger = me.InvisibleEntity.extend({

    init: function (x, y, settings) {
        settings.image = "";
        settings.spritewidth = 0;
        settings.spriteheight = 0;
        settings.collidable = true;

        this.parent(x, y, settings);

        this.owner = settings.owner || null;
        this.type = me.game.ENTITY_TRIGGER;
        //this.gravity = 0.0;

        me.game.gameObjectsInvisible.push(this);
    },

    onCollision: function( res, obj ) {
        if (obj.type) {
            console.log("trigger", this.name, "is colliding with obj", obj.name);
        }
    },

});
