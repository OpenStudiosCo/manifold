import $ from 'jQuery';
import fabric from 'fabric';

export default class FabricJSIntegrationHelpers {
  // Loads an SVG string and splits up objects so they're loaded in the right position.
  loadSVG(svg, callback) {
    fabric.loadSVGFromString(svg, function(objects){
      // Create a group so we add to center accurately.
      var group = new fabric.Group(objects);
      this.addToCenter(group);

      if (callback) {
        callback(items);
      }
    }.bind(this));
  }

  updateCanvasSize() {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      width -= $('#toolbar').width();  
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    app.fabric.model.canvas.setHeight( height );
    app.fabric.model.canvas.setWidth( width );
  }

  // Add an object to the center of the canvas.
  addToCenter(object) {
    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
    
    object.id = object.type + '-' + Math.floor(Date.now() / 1000);

    app.fabric.model.canvas.add(object);
    app.fabric.model.canvas.moveTo(object, app.fabric.model.canvas.getObjects().length);
    // Update layers tool
    if (app.layers) {
      app.layers.updateLayers();
    }
  }
}