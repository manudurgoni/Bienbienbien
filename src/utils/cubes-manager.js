/**
 * Manage cubes
 */

module.exports = {
  /**
   * [rotateCubes description]
   * @param  {[type]} el          [description]
   * @param  {[type]} duration    [description]
   * @param  {[type]} rotationX   [description]
   * @param  {[type]} rotationY   [description]
   * @param  {[type]} nbRepeat    [description]
   * @param  {[type]} repeatDelay [description]
   * @param  {[type]} stagger     [description]
   * @return {[type]}             [description]
   */
  rotateCubes: function(el, duration, rotationX, rotationY, nbRepeat, repeatDelay, stagger, delay, cb) {
    duration = duration || 1.2;
    rotationX = rotationX || 180;
    nbRepeat = nbRepeat || 1;
    rotationY = rotationY || 0;
    nbRepeat = nbRepeat || 1;
    repeatDelay = repeatDelay || 0.5;
    stagger = stagger || 0.5;
    delay = delay || 0;

    var tl = new TimelineMax();
    tl.staggerTo(el, duration, {
      rotationX: rotationX,
      rotationY: rotationY,
      ease: Cubic.easeInOut,
      repeat: nbRepeat,
      repeatDelay: nbRepeat,
    }, stagger, delay, cb);
  },

  hideCubes: function(el, duration, scale, y, delay, cb) {
    duration = duration || 1;
    scale = scale || 1;
    y = y || 0;
    delay = delay || 0;


    var tl = new TimelineMax();

    tl.to(el, duration, {
      scale: scale,
      y: y,
      autoAlpha: 0,
      display: 'none',
      ease: Cubic.easeInOut,
      onComplete: cb
    }, delay).set(el.querySelectorAll('.cube'), {
      rotationX: 0,
      rotationY: 0
    });

  },

  showCubes: function(el, duration, scale, y, delay, cb) {
    duration = duration || 1;
    scale = scale || 1;
    y = y || 0;
    delay = delay || 0;


    var tl = new TimelineMax();

    tl.to(el, duration, {
      scale: scale,
      y: y,
      autoAlpha: 1,
      display: 'block',
      ease: Cubic.easeInOut,
      onComplete: cb
    }, delay);
  },

  aleaWords: function() {

  }
}
