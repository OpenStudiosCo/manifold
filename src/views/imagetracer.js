import ImageTracer from 'ImageTracer';
import BaseView from './base.js';
import ImageTracerControls from '../models/controls/imagetracer.js';

/**
  * ImageTracer view.
  *
  * Manages all UI elements relating to ImageTracer integration.
  */

export default class ImageTracerView extends BaseView {
  constructor() {
    super({
      el: '#svg-preview',
      model: new ImageTracerControls()
    });
    this.render();
  }

  render() {
    var guiFolder = this.gui.addFolder('ImageTracer Controls');
    for (var controlName in this.model.attributes) {
      var callback = function() {
        this.$el.html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(this.createSVG.bind(this), 100);
      };
      if (isNaN(this.model.attributes[controlName])) {
        guiFolder.add(this.model.attributes, controlName)
          .onFinishChange(callback.bind(this));
      }
      else {
        var max = this.model.attributes[controlName] * 2;
        max = (max > 0) ? max : 100;
        guiFolder.add(this.model.attributes, controlName, 0, max)
          .onFinishChange(callback.bind(this));
      }
    }
    this.createSVG();
  }

  // Create an SVG from data and settings, draw to screen.
  createSVG() {  
    var svgStr = ImageTracer.imagedataToSVG(this.getImageDimensions(), this.model.attributes);
    this.$el.html('');
    ImageTracer.appendSVGString( svgStr, 'svg-preview' );
  }
  
  // Duplicates the image programatically so we can get its original dimensions.
  getImageDimensions() {
    var original_image = document.getElementById('original-image');
    var img = document.createElement('img');
    img.src = original_image.src;
    
    // Get the image data from a virtual canvas.
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context.drawImage(img,0,0);
    
    return context.getImageData(0, 0, img.width, img.height);
  }

}
