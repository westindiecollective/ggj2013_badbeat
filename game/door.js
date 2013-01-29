var Door = me.ObjectEntity.extend({

    init: function (x, y, settings) {

        var useDefaultDoor = !settings.image;

        if (useDefaultDoor) {
            settings.image = "door_default";
            //@TODO: fix if require to handle vertical and horizontal doors
            settings.spritewidth = 96;
            settings.spriteheight = 144;
        }
        settings.collidable = true;

        this.parent(x, y, settings);

        if (useDefaultDoor) {
            var colWidth = 96;
            var colHeight = 96;
            var colOffsetX = settings.spritewidth - colWidth;
            var colOffsetY = settings.spriteheight - colHeight;
            this.updateColRect(colOffsetX, colWidth, colOffsetY, colHeight);
        }

        this.type = me.game.ENTITY_DOOR;
        this.closed = settings.closed || true;
        this.locked = settings.locked || false;

        this.gravity = 0.0;

        this.interactDistance = settings.interactDistance || 24;

        settings.width = settings.width + this.interactDistance;
        settings.height = settings.height + this.interactDistance;
        settings.owner = this;
        this.interactTrigger = new Trigger(x, y, settings);
    },

    onCollision: function( res, obj ) {
        if (this.closed) {
            if (!obj.isTrigger) {
                obj.vel.x = res.x ? 0 : obj.vel.x;
                obj.vel.y = res.y ? 0 : obj.vel.y;
                obj.pos.x -= res.x;
                obj.pos.y -= res.y;
            }
        }
    },

    update: function () {

        //@TODO: adjust the bounding box if door is animated
        //this.updateColRect(14, 66, 60, 30);

        //this.interactTrigger.pos = this.pos;

        //this.updateMovement();

        this.parent(this);

        return true;
    },

    open: function () {
        if (this.closed && !this.locked) {
            this.closed = false;
            this.collidable = false;
            this.visible = false;

            me.game.remove(this);
        }
    }
});

