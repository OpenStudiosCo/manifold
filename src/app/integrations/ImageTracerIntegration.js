import ImageTracer from 'ImageTracer';
import BaseIntegration from './BaseIntegration.js';

/**
  * ImageTracer view.
  *
  * Manages all UI elements relating to ImageTracer integration.
  */

export default class ImageTracerIntegration extends BaseIntegration {
  constructor(app) {

    this.controls = ImageTracer.checkoptions();
    this.controls.numberofcolors = 16;
    this.controls.strokewidth = 2;
    this.controls.viewbox = true;
    console.log(this.controls);
    
    super();

    $('.imagetracerConfig').on('change', () => {
      this.preview(app);
    });
  }

  preview(app) {
    // Remove other previews
    // @todo: Expand when other things are set to temporary
    let objects = app.fabric.model.canvas.getObjects();
    objects.forEach((object) => {
      if (object.temporary) {
        app.fabric.model.canvas.remove(object);  
      }
    });

    let preset = $('.preset').find(":selected").text().toLowerCase();


    // Potrace.setParameter({
    //   alphamax: $('.alphamax').val(),
    //   optcurve: $('.optcurve').is(":checked"),
    //   opttolerance: $('.opttolerance').val(),
    //   turdsize: $('.turdsize').val(),
    //   turnpolicy: $('.turnpolicy').find(":selected").text().toLowerCase()
    // });

    var selectedObjects = app.fabric.model.canvas.getActiveObjects();
    ImageTracer.imageToSVG(selectedObjects[0]._element.src, function(svg) {
      app.fabric.model.helpers.loadSVG(svg, () => {}, true);
    }, preset != 'default' ? preset : app.vector.imagetracer.controls);
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
