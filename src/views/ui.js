import $ from 'jQuery';
import BaseView from './base.js';
import imageContainer from '../templates/image-container.pug';
import loader from '../templates/loader.pug';

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
    $(imageContainer({ url: url }))
      .insertBefore('.ui.inverted.top.fixed.menu .item:last-child');
  }

  changeImage(e) {
    $('#original-image').attr('src', $(e.currentTarget).find('img').attr('src'));
    $('#svg-preview, #potrace-preview').html(loader());
    var callback = function(){
      this.views.imagetracer.createSVG();
      this.views.potrace.createSVG();
    };
    setTimeout(callback.bind(this), 100);
  }

  render3D() {
    this.views.three.$el.html(loader());
    setTimeout(this.views.three.createScene.bind(this.views.three), 100);
  }
}
