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
    this.el = '#svg-preview';
    this.controls = new ImageTracerControls();
    super();
    this.render();
  }

  render() {
    var guiFolder = this.gui.addFolder('ImageTracer Controls');
    for (var controlName in this.controls.attributes) {
      var _this = this;
      
      var callback = function() {
        _this.$el.html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(_this.createSVG.bind(_this), 100);
      };
      if (isNaN(this.controls.attributes[controlName])) {
        guiFolder.add(this.controls.attributes, controlName)
          .onFinishChange(callback);
      }
      else {
        var max = this.controls.attributes[controlName] * 2;
        max = (max > 0) ? max : 100;
        guiFolder.add(this.controls.attributes, controlName, 0, max)
          .onFinishChange(callback);
      }
    }
    this.createSVG();
  }

  // Create an SVG from data and settings, draw to screen.
  createSVG() {  
    var svgStr = ImageTracer.imagedataToSVG(this.getImageDimensions(), this.controls.attributes);
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
