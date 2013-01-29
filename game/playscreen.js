var PlayScreen = me.ScreenObject.extend({

  init: function () {
    this.parent(true);

    this.initHUD();
  },

  initHUD: function(){
      var hud_pos_x = 0;
      var hud_pos_y = 0;
      var hud_width = 640;
      var hud_height = 120;
      me.game.addHUD(hud_pos_x, hud_pos_y, hud_width, hud_height);
  },

  onResetEvent: function () {
  	me.audio.playTrack("ambiance");
    me.levelDirector.loadLevel('base');
  },

  onDestroyEvent: function () {
      me.game.disableHUD();
      me.audio.stopTrack();
  },
  
  draw: function (context) {
    
    var x = me.player.pos.x - me.game.viewport.pos.x + 20;
    var y = me.player.pos.y - me.game.viewport.pos.y + 20;
    
    var lum = Math.ceil(Math.random() * 40) + 100
    
    if (me.player.hasLamp) {  
      var grd = context.createRadialGradient(x, y, 0, x + 40, y + 40, 320);
    } else {
      var grd = context.createRadialGradient(x, y, 0, x + 40, y + 40, 150);
    }
    
        grd.addColorStop(0, 'rgba(' + lum + ', ' + lum + ', 100, 0)');
        grd.addColorStop(1, 'rgba(10, 0, 0, 0.95)');
    
    context.fillStyle = grd;
    context.fillRect(0, 0, 1000, 800);
  }
});
