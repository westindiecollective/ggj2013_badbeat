// GAME!

var Game = {

  initEntities: function() {
      me.game.ENTITY_DEFAULT = me.game.ACTION_OBJECT + 1;
      me.game.ENTITY_DOOR = me.game.ENTITY_DEFAULT;
      me.game.ENTITY_PORTAL = me.game.ENTITY_DEFAULT + 1;
      me.game.ENTITY_TRIGGER = me.game.ENTITY_DEFAULT + 2;
      me.game.ENTITY_LAMP = me.game.ENTITY_DEFAULT + 3;

      me.game.gameObjectsInvisible = [];
      me.game.collideInvisibles = function(objB) {
          var result = [];

          // this should be replace by a list of the 4 adjacent cell around the object requesting collision
          for ( var i = this.gameObjectsInvisible.length, obj; i--, obj = this.gameObjectsInvisible[i];)//for (var i = objlist.length; i-- ;)
          {
              if (obj.visible && obj.collidable && obj.isEntity && (obj!=objB))
              {
                  // if return value != null, we have a collision
                  var collision = obj.checkCollision(objB);
                  if (collision) {
                      result.push(collision);
                  }
              }
          }
          return result;
      }
  },

  load: function () {
    if (!me.video.init('game', 1000, 800)) {
      console.log('Oups, no HTML5 :(');
      return;
    }

    this.initEntities();

    me.audio.init('ogg');

    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(resources);

    me.state.change(me.state.LOADING);
  },

  initInput: function () {

      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "up");
      me.input.bindKey(me.input.KEY.DOWN, "down");

      me.input.bindKey(me.input.KEY.O, "playerOpenDoor");

      //@DEBUG
      me.input.bindKey(me.input.KEY.C, "debugPlayerCollision");
      me.input.bindKey(me.input.KEY.K, "debugPlayerStressIncr");
      me.input.bindKey(me.input.KEY.L, "debugPlayerStressDecr");
  },

  loaded: function () {

    this.initInput();

    me.state.set(me.state.MENU, new TitleScreen());
    me.state.set(me.state.PLAY, new PlayScreen());

    me.state.transition('fade', '#FFFFFF', 250);
    
    me.entityPool.add("player", Player);
    me.entityPool.add("door", Door);
    me.entityPool.add("lampe", Lamp);
    
    me.state.change(me.state.MENU);
  }

};

window.addEventListener('DOMContentLoaded', function () {
  Game.load();
});
