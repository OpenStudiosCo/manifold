import ImageTracer from 'ImageTracer';
import BaseControlsView from './BaseControlsView.js';

/**
  * ImageTracer view.
  *
  * Manages all UI elements relating to ImageTracer integration.
  */

export default class ImageTracerControlsView extends BaseControlsView {
  constructor(options) {
    super({
      el: '#imagetracer-preview',
      model: options.model
    });

    this.generateControls('ImageTracer Controls');
    this.createSVG();
  }

  // Create an SVG from data and settings, draw to screen.
  createSVG() {  
    var svgStr = ImageTracer.imagedataToSVG(this.getImageDimensions(), this.model.attributes);
    this.$el.html('');
    ImageTracer.appendSVGString( svgStr, 'imagetracer-preview' );
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
