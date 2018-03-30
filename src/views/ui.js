import $ from 'jQuery';
import BaseView from './base.js';

/**
  * Application UI.
  *
  * Manages all UI elements for the core application.
  */

export default class AppUI extends BaseView {
  constructor(imageTracerView, potraceView, threeView) {
    super({
      el: '#container',
      events: {
        'click #image_select': 'launchFileBrowser',
        'change #image_input': 'processFile',
        'click .js-change-image': 'changeImage',
        'click #btnRender': 'render3D'
      }  
    });
    this.views = {
      imagetracer: imageTracerView,
      potrace: potraceView,
      three: threeView
    };
  }

  launchFileBrowser(e) {
    $('#image_input').click();
    e.preventDefault();
  }

  processFile(e) {
    window.URL = window.URL || window.webkitURL || window.mozURL;
    var url = URL.createObjectURL(e.currentTarget.files[0]);
      $('<div class="item"><div class="ui white compact button js-change-image"><div class="ui fluid image mini"><img src="' + url + '" /></div></div></div>')
        .insertBefore('.ui.inverted.top.fixed.menu .item:last-child');
  }

  changeImage(e) {
    $('#original-image').attr('src', $(e.currentTarget).find('img').attr('src'));
    $('#svg-preview, #potrace-preview').html('<div class="ui active centered inline loader"></div>');
    var callback = function(){
      this.views.imagetracer.createSVG();
      this.views.potrace.createSVG();
    };
    setTimeout(callback.bind(this), 100);
  }

  render3D() {
    this.views.three.$el.html( '<div class="ui active centered inline loader"></div>' );
    setTimeout(this.views.three.createScene.bind(this.views.three), 100);
  }
}
