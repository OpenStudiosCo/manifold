import $ from 'jQuery';
import _ from '_';
import BaseModel from './BaseModel.js';
import fabric from 'fabric';

/**
  * Raster To SVG model.
  */

export default class MainCanvasModel extends BaseModel {
  defaults() {
    var attributes = {
      canvas: null,
      transitioning: false
    };
    
    return attributes;
  }

  constructor() {
    super();
    this.attributes.canvas = new fabric.Canvas('main-canvas');
    this.updateCanvasSize();

    // TODO: Move this into app view logic.
    fabric.Image.fromURL('/assets/shapes.png', function(oImg) {
      // scale image down, and flip it, before adding it onto canvas
      this.addToCenter(oImg);
    }.bind(this));

    this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);
    $('#btnAddImage').popup({
      title: 'Add Image',
      variation: 'inverted',
      position: 'right center'
    });
  }

  toggleToolbar() {
    if (!this.attributes.transitioning) {
      $("#toolbar")
        .sidebar({
          dimPage:false,
          onChange: function() {
            app.models.mainCanvas.attributes.transitioning = true;
          },
          onHide : function() {
            app.models.mainCanvas.attributes.transitioning = false;
          },
          onShow : function() {
            app.models.mainCanvas.attributes.transitioning = false;
          }
        })
        .sidebar("toggle");
      this.updateCanvasSize();
    }
  }

  updateCanvasSize() {
    // TODO: Move this into app view logic.
    var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    if ($("#toolbar").sidebar('is visible')) {
      width -= $('#toolbar').width();  
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.attributes.canvas.setHeight( height );
    this.attributes.canvas.setWidth( width );
  }

  addToCenter(object) {
    var canvasWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    canvasWidth -= $('#toolbar').width();
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    object.set({left: (canvasWidth / 2) - (object.width / 2), top: (canvasHeight / 2) - (object.height / 2)});
    this.attributes.canvas.add(object);
  }
}
