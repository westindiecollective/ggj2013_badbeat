var TitleScreen = me.ScreenObject.extend({
  
  init: function () {
    
    this.parent(true);
    
    this.title = null;    

  },
  
  onResetEvent: function () {
    
    if (this.title == null) {
      this.title = me.loader.getImage('menu');
    }
    
    me.input.bindKey(me.input.KEY.ENTER, 'enter', true);
    
  },
  
  update: function () {
    
    if (me.input.isKeyPressed('enter')) {
      me.state.change(me.state.PLAY);
    }
    
    return true;
  
  },
  
  draw: function (context) {
    
    context.drawImage(this.title, 0, 0);
    
  },
  
  onDestroyEvent: function () {
  
    me.input.unbindKey(me.input.KEY.ENTER);
  
  }
  
});