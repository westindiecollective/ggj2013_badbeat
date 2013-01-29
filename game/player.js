var Player = me.ObjectEntity.extend({
  
  init: function (x, y, settings) {

    me.player = this;

  	settings.image = settings.image || "player";
  	settings.spritewidth = settings.spritewidth || 94;
    settings.spriteheight = settings.spriteheight || 94;

    this.parent(x, y, settings);

    this.gravity = 0.0;

    var originVelocity = new me.Vector2d(4.0, 4.0);
    var originFriction = new me.Vector2d(0.35,0.35);
    
    this.setVelocity(originVelocity.x, originVelocity.y);
    this.setFriction(originFriction.x, originFriction.y);
            
    this.addAnimation("idle",  [2]);
    this.addAnimation("down",  [0, 1]);
    this.addAnimation("left",  [3, 4]);
    this.addAnimation("up",    [6, 7]);
    this.addAnimation("right", [9, 10]);
    
    this.updateColRect(28, 48, 50, 40);

    this.initActions();

    this.initStressLevels();

    this.initHUD();

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    var self = this;
    Gamepad.on('stick-1-axis-x', function (value) {
      if (value < -0.1) {
        self.vel.x -= self.accel.x * me.timer.tick;
        self.direction = "left";
      } else if (value > 0.1) {
        self.vel.x += self.accel.x * me.timer.tick;
        self.direction = "right";
      }
    });
    
    Gamepad.on('stick-1-axis-y', function (value) {
      if (value < -0.1) {
        self.vel.y -= self.accel.y * me.timer.tick;
        self.direction = "up";
      } else if (value > 0.1) {
        self.vel.y += self.accel.y * me.timer.tick;
        self.direction = "down";
      }
    });

  },

  initActions: function () {
      this.ACTION_NONE = 0;
      this.ACTION_OPEN_DOOR = 1;
      this.actions = [];

      this.hasLamp = false;
  },

  initStressLevels: function () {
      this.stressMax = 210;
      this.stressMin = 60;
      this.stress = this.stressMin;
      this.stressLevels = [90,120,150,180];
      this.stressLevel = 0;
  },

  initHUD: function () {
      var heart_pos_x = 10;
      var heart_pos_y = 10;
      var heart_img = "heart_icon";
      var heart_width = 32;
      var heart_height = 32;
      me.game.HUD.addItem("hearticon", new HeartIcon(heart_pos_x, heart_pos_y, heart_img, heart_width, heart_height));

      var beatrate_pos_x = 48 * 3 + heart_pos_x + heart_width;
      var beatrate_pos_y = 10;
      me.game.HUD.addItem("beatrate", new BeatRateHUD(beatrate_pos_x, beatrate_pos_y));

      var levelCount = this.stressLevels.length;
      for (var levelIdx = 0; levelIdx < levelCount; ++levelIdx)
      {
          var hudelem = "stresslevelicon" + levelIdx;
          var img = "stress_level_icon_" + levelIdx;
          var img_alter = "stress_level_icon_alter_" + levelIdx;
          var pos_x = 10 + 48 * levelIdx;
          var pos_y = 60;
          var width = 32;
          var height = 32;
          me.game.HUD.addItem(hudelem, new StressLevelIcon(pos_x, pos_y, img, img_alter, width, height));
      }

      me.game.sort();
  },

  setBeatRate: function (beatrate) {
      me.game.HUD.setItemValue("beatrate", beatrate);
  },

  decreaseStress: function (stressDecrement) {
      if (this.stress > this.stressMin + stressDecrement) {
          this.stress = this.stress - stressDecrement;
      }
      else {
          this.stress = this.stressMin;
      }
  },

  increaseStress: function (stressIncrement) {
      if (this.stress < this.stressMax - stressIncrement) {
          this.stress = this.stress + stressIncrement;
      }
      else {
          this.stress = this.stressMax;
      }
  },

  updateStressLevel: function () {

      var stressLevel = 0;
      var levelCount = this.stressLevels.length;
      for (var levelIdx = 0, levelLimit = 0; levelIdx < levelCount, levelLimit = this.stressLevels[levelIdx]; ++levelIdx)
      {
          var hudelem = "stresslevelicon" + levelIdx;

          var useIconAlter = false;
          if (this.stress >= levelLimit) {
              stressLevel = levelIdx+1;
              useIconAlter = true;
          }
          me.game.HUD.setItemValue(hudelem, useIconAlter);
      }
      this.stressLevel = stressLevel;

      this.setBeatRate(this.stress);
  },

  updatePlayerCollision: function () {
      // check for collision with other objects and trigger OnCollision() on those objects
      var res = me.game.collide(this);
  },

  updateAnimation: function() {

    if ( this.vel.x != 0.0 || this.vel.y != 0.0 ) {
      this.setCurrentAnimation(this.direction);
    } else {
      this.setCurrentAnimation("idle");
    }

  },

  updateInput: function () {
    if ( me.input.isKeyPressed( "left" ) ) {
      this.vel.x -= this.accel.x * me.timer.tick;
      this.direction = "left";
    } else if (me.input.isKeyPressed( "right" )) {
      this.vel.x += this.accel.x * me.timer.tick;
      this.direction = "right";
    }

    if ( me.input.isKeyPressed( "up" ) ) {
      this.vel.y -= this.accel.y * me.timer.tick;
      this.direction = "up";
    } else if ( me.input.isKeyPressed( "down" ) ) {
      this.vel.y += this.accel.y * me.timer.tick;
      this.direction = "down";
    }

      if (me.input.isKeyPressed('playerOpenDoor')) {
          this.actions.push(this.ACTION_OPEN_DOOR);
      }

      //@DEBUG
      if (me.input.isKeyPressed('debugPlayerCollision'))
      {
          me.debug.renderHitBox = !me.debug.renderHitBox;
      }

      var debugStressDelta = 5;
      if (me.input.isKeyPressed('debugPlayerStressDecr'))
      {
          this.decreaseStress(debugStressDelta);
      }
      if (me.input.isKeyPressed('debugPlayerStressIncr'))
      {
          this.increaseStress(debugStressDelta);
      }
  },

  updateActions: function() {
      var colliders = me.game.collideInvisibles(this);

      for ( var actionIdx = this.actions.length, action; actionIdx--, action = this.actions[actionIdx];)
      {
          if (action == this.ACTION_OPEN_DOOR) {

              for ( var colliderIdx = colliders.length, collider; colliderIdx--, collider = colliders[colliderIdx];)
              {
                  var obj = collider.obj;
                  if (obj && obj.type == me.game.ENTITY_TRIGGER) {
                      obj = obj.owner;
                  }
                  if (obj && obj.type == me.game.ENTITY_DOOR) {
                      var door = obj;
                      door.open();
                  }
              }
          }
      }
      this.actions = [];

      //checking trigger related to passive actions (aka pickup)
      for ( var colliderIdx = colliders.length, collider; colliderIdx--, collider = colliders[colliderIdx];)
      {
          var obj = collider.obj;
          if (obj && obj.type == me.game.ENTITY_TRIGGER) {
              obj = obj.owner;
          }
          if (obj && obj.type == me.game.ENTITY_LAMP) {
              var lamp = obj;
              lamp.pickup();
              this.hasLamp = true;
          }
      }

      var stressDelta = 1;
      var playerVelocityCalmLimit = 3;
      var playerVelocity = this.vel.x + this.vel.y;

      if (playerVelocity < playerVelocityCalmLimit){
          this.decreaseStress(stressDelta);
      }
      else {
          console.log("Velocity:" + playerVelocity);
          this.increaseStress(stressDelta);
      }
  },

  update: function () {

    this.updateStressLevel();

    this.updateInput();

    this.updateAnimation();

    this.updatePlayerCollision();

    this.updateActions();
    
    this.updateMovement();
    
    if (this.vel.x != 0 || this.vel.y != 0) {
      this.parent(this);
      return true;
    }
    
    return false;
    
  }
});