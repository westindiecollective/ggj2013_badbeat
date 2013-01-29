var Events	= function () {}

Events.on	= function (event, fct) {
	this._events = this._events || {};
	this._events[event] = this._events[event]	|| [];
	this._events[event].push(fct);
};

Events.off = function (event, fct) {
	this._events = this._events || {};
	if( event in this._events === false  )	return;
	this._events[event].splice(this._events[event].indexOf(fct), 1);
};

Events.fire	= function (event /* , args... */) {
	this._events = this._events || {};
	if( event in this._events === false  )	return;
	for(var i = 0; i < this._events[event].length; i++){
		this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
	}
};

Events.mixin	= function(destObject){
	var props	= ['on', 'off', 'fire'];
	for(var i = 0; i < props.length; i ++){
		destObject[props[i]]	= Events[props[i]];
	}
}


var Gamepad = (function () {

  var gamepadEvents = {};
      Events.mixin(gamepadEvents)
  
  var gamepadButtons = {};
  var gamepadAxes    = {};
  
  var buttonNames = ['button-1', 'button-2', 'button-3', 'button-4', 'button-left-shoulder-top', 'button-left-shoulder-bottom', 'button-right-shoulder-top', 'button-right-shoulder-bottom', 'button-select', 'button-start', 'stick-1', 'button-dpad-top', 'button-dpad-bottom', 'button-dpad-left', 'button-dpad-right'];
  var axeNames = ['stick-1-axis-x', 'stick-1-axis-y', 'stick-2-axis-x', 'stick-2-axis-y'];
  
  var TYPICAL_BUTTON_COUNT = 16;
  var TYPICAL_AXIS_COUNT   = 4;

  var ticking = false;

  var gamepads = [];

  var prevRawGamepadTypes = [];

  var prevTimestamps = [];

  var gamepadSupportAvailable = !!navigator.webkitGetGamepads ||
      !!navigator.webkitGamepads ||
      (navigator.userAgent.indexOf('Firefox/') != -1);

  if (!gamepadSupportAvailable) {
    
    throw new Error('Gamepad support not available');
  } else {

    window.addEventListener('MozGamepadConnected', onGamepadConnect, false);
    window.addEventListener('MozGamepadDisconnected', onGamepadDisconnect, false);

    if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
      startPolling();
    }
  }

  function onGamepadConnect (event) {

    gamepads.push(event.gamepad);

    gamepadEvents.fire('update', gamepads);

    startPolling();
  };

  // This will only be executed on Firefox.
  function onGamepadDisconnect (event) {
    // Remove the gamepad from the list of gamepads to monitor.
    for (var i in gamepads) {
      if (gamepads[i].index == event.gamepad.index) {
        gamepads.splice(i, 1);
        break;
      }
    }

    // If no gamepads are left, stop the polling loop.
    if (gamepads.length == 0) {
      stopPolling();
    }

    gamepadEvents.fire('update', gamepads);
  };

  function startPolling () {
    // Don’t accidentally start a second loop, man.
    if (!ticking) {
      ticking = true;
      tick();
    }
  };

  function stopPolling () {
    ticking = false;
  };

  function tick () {
    pollStatus();
    scheduleNextTick();
  };

  function scheduleNextTick () {
    // Only schedule the next frame if we haven’t decided to stop via
    // stopPolling() before.
    if (ticking) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(tick);
      } else if (window.mozRequestAnimationFrame) {
        window.mozRequestAnimationFrame(tick);
      } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(tick);
      }
      // Note lack of setTimeout since all the browsers that support
      // Gamepad API are already supporting requestAnimationFrame().
    }
  };

  function pollStatus () {
    // Poll to see if gamepads are connected or disconnected. Necessary
    // only on Chrome.
    pollGamepads();

    for (var i in gamepads) {
      var gamepad = gamepads[i];

      if (gamepad.timestamp &&
          (gamepad.timestamp == prevTimestamps[i])) {
        continue;
      }
      prevTimestamps[i] = gamepad.timestamp;

      update(i);
    }
  };

  function pollGamepads () {

    var rawGamepads =
        (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
        navigator.webkitGamepads;

    if (rawGamepads) {

      gamepads = [];

      var gamepadsChanged = false;

      for (var i = 0; i < rawGamepads.length; i++) {

        if (typeof rawGamepads[i] != prevRawGamepadTypes[i]) {
          gamepadsChanged = true;
          prevRawGamepadTypes[i] = typeof rawGamepads[i];
        }

        if (rawGamepads[i]) {
          gamepads.push(rawGamepads[i]);
        }
      }

      if (gamepadsChanged) {
        gamepadEvents.fire('update', gamepads);
      }
    }
  };

  function update (gamepadId) {
    var gamepad = gamepads[gamepadId];

    for (button in gamepad.buttons) {
      if (gamepadButtons != null) {
        if (gamepadButtons[button] != gamepad.buttons[button]) {
          gamepadEvents.fire(buttonNames[button], gamepad.buttons[button]);
          gamepadButtons[button] = gamepad.buttons[button];
        }
      } else {
        gamepadButtons[button] = gamepad.buttons[button];
      }
    }

    for (axe in gamepad.axes) {
      if (gamepadAxes != null) {
        if (gamepadAxes[axe] != gamepad.axes[axe]) {
          gamepadEvents.fire(axeNames[axe], gamepad.axes[axe]);
          gamepadAxes[axe] = gamepad.axes[axe];
        }
      } else {
        gamepadAxes[axe] = gamepad.axes[axe];
      }
    }

    // Update extraneous buttons.
//    var extraButtonId = TYPICAL_BUTTON_COUNT;
//    while (typeof gamepad.buttons[extraButtonId] != 'undefined') {
//      tester.updateButton(gamepad.buttons[extraButtonId], gamepadId,
//          'extra-button-' + extraButtonId);
//
//      extraButtonId++;
//    }

    // Update extraneous axes.
//    var extraAxisId = TYPICAL_AXIS_COUNT;
//    while (typeof gamepad.axes[extraAxisId] != 'undefined') {
//      tester.updateAxis(gamepad.axes[extraAxisId], gamepadId,
//          'extra-axis-' + extraAxisId);
//
//      extraAxisId++;
//    }

  };
  
  return gamepadEvents;
  
})();
