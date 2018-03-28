import ImageTracer from 'ImageTracer';
import $ from 'jQuery';

/**
  * imagetracerjs method
  * 
  * Credit - https://github.com/jankovicsandras/imagetracerjs
  */
var controls;

// Setup imagetracer controls.
export function init_imagetracer(gui) {
  controls = ImageTracer.checkoptions();
  controls.numberofcolors = 2;
  controls.strokewidth = 1;
  controls.viewbox = true;
  var imagetracerControls = gui.addFolder('imagetracerjs Controls');
  for (var controlName in controls) {
    var callback = function() {
      $('#svg-preview').html('<div class="ui active centered inline loader"></div>');
      // Wait 100ms so the loader can appear.
      setTimeout(imagetracer, 100);
    };
    if (isNaN(controls[controlName])) {
      imagetracerControls.add(controls, controlName)
        .onFinishChange(callback);
    }
    else {
      var max = controls[controlName] * 2;
      max = (max > 0) ? max : 100;
      imagetracerControls.add(controls, controlName, 0, max)
        .onFinishChange(callback);
    }
  }
}

export function imagetracer() {
  // Duplicate the img programatically so we can get its original dimensions.
  var original_image = document.getElementById('original-image');
  var img = document.createElement('img');
  img.src = original_image.src;
  
  // Get the image data from a virtual canvas.
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');
  context.drawImage(img,0,0);
  var imgData = context.getImageData(0, 0, img.width, img.height);

  // Create an SVG from data and settings, draw to screen.
  var svgStr = ImageTracer.imagedataToSVG(imgData, controls);
  $('#svg-preview').html('');
  ImageTracer.appendSVGString( svgStr, 'svg-preview' );
}

