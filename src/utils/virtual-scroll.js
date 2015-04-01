/**
 * By bartekdrozdz.com
 */

//Add 'target' option to run only on the selected target


var VirtualScroll = function(){
  this.numListeners= []; 
  this.listeners= [];
  this.initialized=false;
  this.touchStartX=null;
  this.touchStartY=null;

  // [ These settings can be customized with the options() function below ]
  // Mutiply the touch action by two making the scroll a bit faster than finger movement
  this.touchMult= 2;
  // Firefox on Windows needs a boost, since scrolling is very slow
  this.firefoxMult= 15;
  // How many pixels to move with each key press
  this.keyStep= 120;
  // General multiplier for all mousehweel including FF
  this.mouseMult= 1;
  // Choose your target
  this.target= document;


  this.bodyTouchAction=null;

  this.hasWheelEvent= 'onwheel' in document;
  this.hasMouseWheelEvent= 'onmousewheel' in document;
  this.hasTouch= 'ontouchstart' in document;
  this.hasTouchWin= navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
  this.hasPointer= !!window.navigator.msPointerEnabled;
  this.hasKeyDown= 'onkeydown' in document;

  this.isFirefox= navigator.userAgent.indexOf('Firefox') > -1;

  this.event={
    y: 0,
    x: 0,
    deltaX: 0,
    deltaY: 0,
    originalEvent: null
  };
};

VirtualScroll.prototype = {
  

  on: function(f) {
    if (!this.initialized) this.initListeners();
    this.listeners.push(f);
    this.numListeners = this.listeners.length;
  },

  options: function(opt) {
    this.keyStep = opt.keyStep || 120;
    this.firefoxMult = opt.firefoxMult || 15;
    this.touchMult = opt.touchMult || 2;
    this.mouseMult = opt.mouseMult || 1;
    this.target = opt.target || document;
  },

  off: function(f) {
    this.listeners.splice(f, 1);
    this.numListeners = this.listeners.length;
    if (this.numListeners <= 0) this.destroyListeners();
  },

  notify: function(e) {
    this.event.x += this.event.deltaX;
    this.event.y += this.event.deltaY;
    this.event.originalEvent = e;

    for (var i = 0; i < this.numListeners; i++) {
      this.listeners[i](this.event);
    }
  },

  onWheel: function(e) {
    // In Chrome and in Firefox (at least the new one)
    this.event.deltaX = e.wheelDeltaX || e.deltaX * -1;
    this.event.deltaY = e.wheelDeltaY || e.deltaY * -1;

    // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad 
    // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    if (this.isFirefox && e.deltaMode == 1) {
      this.event.deltaX *= this.firefoxMult;
      this.event.deltaY *= this.firefoxMult;
    }

    this.event.deltaX *= this.mouseMult;
    this.event.deltaY *= this.mouseMult;

    this.notify(e);
  },

  onMouseWheel: function(e) {
    // In Safari, IE and in Chrome if 'wheel' isn't defined
    this.event.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
    this.event.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

    this.notify(e);
  },

  onTouchStart: function(e) {
    var t = (e.targetTouches) ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
  },

  onTouchMove: function(e) {
    // e.preventDefault(); // < This needs to be managed externally
    var t = (e.targetTouches) ? e.targetTouches[0] : e;

    this.event.deltaX = (t.pageX - this.touchStartX) * this.touchMult;
    this.event.deltaY = (t.pageY - this.touchStartY) * this.touchMult;

    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;

    this.notify(e);
  },

  onKeyDown: function(e) {
    // 37 left arrow, 38 up arrow, 39 right arrow, 40 down arrow
    this.event.deltaX = this.event.deltaY = 0;
    switch (e.keyCode) {
      case 37:
        this.event.deltaX = -this.keyStep;
        break;
      case 39:
        this.event.deltaX = this.keyStep;
        break;
      case 38:
        this.event.deltaY = this.keyStep;
        break;
      case 40:
        this.event.deltaY = -this.keyStep;
        break;
    }

    this.notify(e);
  },

  initListeners: function() {
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
    });

    if (this.hasWheelEvent) this.target.addEventListener("wheel", this.onWheel.bind(this));
    if (this.hasMouseWheelEvent) this.target.addEventListener("mousewheel", this.onMouseWheel.bind(this));

    if (this.hasTouch) {
      this.target.addEventListener("touchstart", this.onTouchStart.bind(this));
      this.target.addEventListener("touchmove", this.onTouchMove.bind(this));
    }

    if (this.hasPointer && this.hasTouchWin) {
      this.bodyTouchAction = document.body.style.msTouchAction;
      document.body.style.msTouchAction = "none";
      this.target.addEventListener("MSPointerDown", this.onTouchStart.bind(this), true);
      this.target.addEventListener("MSPointerMove", this.onTouchMove.bind(this), true);
    }

    if (this.hasKeyDown) this.target.addEventListener("keydown", this.onKeyDown.bind(this));

    this.initialized = true;
  },

  destroyListeners: function() {
    if (this.hasWheelEvent) this.target.removeEventListener("wheel", this.onWheel.bind(this));
    if (this.hasMouseWheelEvent) this.target.removeEventListener("mousewheel", this.onMouseWheel.bind(this));

    if (this.hasTouch) {
      this.target.removeEventListener("touchstart", this.onTouchStart.bind(this));
      this.target.removeEventListener("touchmove", this.onTouchMove.bind(this));
    }

    if (this.hasPointer && this.hasTouchWin) {
      document.body.style.msTouchAction = this.bodyTouchAction;
      this.target.removeEventListener("MSPointerDown", this.onTouchStart.bind(this), true);
      this.target.removeEventListener("MSPointerMove", this.onTouchMove.bind(this), true);
    }

    if (this.hasKeyDown) this.target.removeEventListener("keydown", this.onKeyDown.bind(this));

    this.initialized = false;
  }
};

module.exports = VirtualScroll;
