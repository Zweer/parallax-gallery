define(['jquery', 'iscroll-probe'], function ($, IScroll) {
  'use strict';

  var ParallaxGallery = function (options) {
    this.$elements = options.elements;

    $.each(this.$elements, $.proxy(this._initElement, this));

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  };

  ParallaxGallery.prototype._initElement = function (index, option) {
    var $element = $(option.element);
    var scroll = new IScroll(option.element, {
      probeType: 3,
      mouseWheel: true
    });

    scroll.on('scroll', $.proxy(this._onScroll, this, scroll, index));
    scroll.on('scrollEnd', $.proxy(this._onScroll, this, scroll, index));

    $element.data('scroll', scroll);

    this.$elements[index].scroll = scroll;
  };

  ParallaxGallery.prototype._onScroll = function (scroll, index) {
    var element = this.$elements[index];
    var speed   = element.speed;
    var x       = element.scroll.x;
    var y       = element.scroll.y;
    var width   = element.scroll.maxScrollX || 1;
    var height  = element.scroll.maxScrollY || 1;
    var reverse = element.reverse;

    for (var i = 0; i < this.$elements.length; ++i) {
      if (i !== index) {
        var myElement = this.$elements[i];
        var mySpeed   = myElement.speed;
        var myX       = x;
        var myY       = y;
        var myWidth   = myElement.scroll.maxScrollX;
        var myHeight  = myElement.scroll.maxScrollY;
        var myReverse = myElement.reverse;
        var ratioX    = 1;
        var ratioY    = 1;

        if (speed === 0 || mySpeed === 0) {
          ratioX = myWidth / width;
          ratioY = myHeight / height;
        }

        myX *= ratioX;
        myY *= ratioY;

        if (reverse !== myReverse) {
          myX = myWidth - myX;
          myY = myHeight - myY;
        }

        myElement.scroll.scrollTo(myX, myY);
      }
    }
  };

  $.parallaxGallery = function (options) {
    return new ParallaxGallery(options);
  };

  return ParallaxGallery;
});