var Lamp = me.ObjectEntity.extend({

    init: function (x, y, settings) {

        var useDefaultLamp = !settings.image;

        if (useDefaultLamp) {
            settings.image = "lamp_default";
            //@TODO: fix if require to handle vertical and horizontal doors
            settings.spritewidth = 48;
            settings.spriteheight = 19;
        }

        this.parent(x, y, settings);

        this.type = me.game.ENTITY_LAMP;

        this.gravity = 0.0;

        this.interactDistance = settings.interactDistance || 24;

        settings.width = settings.width + this.interactDistance;
        settings.height = settings.height + this.interactDistance;
        settings.owner = this;
        this.interactTrigger = new Trigger(x, y, settings);
    },

    update: function () {

        //this.interactTrigger.pos = this.pos;

        //this.updateMovement();

        this.parent(this);

        return true;
    },

    pickup: function() {
        this.collidable = false;
        this.visible = false;

        me.game.remove(this);
    }
});