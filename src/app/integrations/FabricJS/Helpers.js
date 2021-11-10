import $ from 'jQuery';
import fabric from 'fabric';

var app = {};
export default class FabricJSIntegrationHelpers {
  constructor(appInstance) {
    app = appInstance;
  }

  // Loads an SVG string and splits up objects so they're loaded in the right position.
  loadSVG(svg, callbackFn, temporary = false) {
    fabric.loadSVGFromString(svg, function(objects){
      // Create a group so we add to center accurately.
      var group = new fabric.Group(objects);
      objects.forEach((object, index) => {
        object.id = object.type + '-' + Math.floor(Date.now() / 1000) + index;    
      });
      if (temporary) {
        // Remove other previews
        // @todo: Expand when other things are set to temporary
        let existing_objects = app.fabric.model.canvas.getObjects();
        existing_objects.forEach((object) => {
          if (object.temporary) {
            app.fabric.model.canvas.remove(object);  
          }
        });
      }
      
      this.addToCenter(group, temporary);

      if (callbackFn) {
        callbackFn(group);
      }
    }.bind(this));
  }

  updateCanvasSize() {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      $('.canvas-container').css('marginLeft', ($('#toolbar').width()*1.5) + 'px');
      width -= $('#toolbar').width();
    }
    if ($("#details").sidebar('is visible')) {
      width -= $('#details').width();
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    app.fabric.model.canvas.setHeight( height );
    app.fabric.model.canvas.setWidth( width );
  }

  // Add an object to the center of the canvas.
  addToCenter(object, temporary = false) {
    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      $('.canvas-container').css('marginLeft', ($('#toolbar').width()*1.5) + 'px');
      canvasWidth -= $('#toolbar').width();
    }
    if ($("#details").sidebar('is visible')) {
      canvasWidth -= $('#details').width();
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
    
    object.id = object.type + '-' + Math.floor(Date.now() / 1000);
    object.temporary = temporary;

    app.fabric.model.canvas.add(object);
    app.fabric.model.canvas.moveTo(object, app.fabric.model.canvas.getObjects().length);
    // Update layers tool
    if (app.layers) {
      app.layers.updateLayers();
    }
  }
}