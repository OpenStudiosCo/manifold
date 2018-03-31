import BaseModel from './BaseModel.js';
import fabric from 'fabric';

/**
  * Raster To SVG model.
  */

export default class MainCanvasModel extends BaseModel {
  defaults() {
    var attributes = {
      canvas: null
    };
    
    return attributes;
  }

  constructor() {
    super();
    this.attributes.canvas = new fabric.Canvas('main-canvas');
    this.updateCanvasSize();
    var rect = new fabric.Rect({
        top : 100,
        left : 100,
        width : 60,
        height : 70,
        fill : 'red'
    });

    fabric.Image.fromURL('/assets/shapes.png', function(oImg) {
      // scale image down, and flip it, before adding it onto canvas
      oImg
        .set({left: oImg.width, top: oImg.height});
      this.attributes.canvas.add(oImg);
    }.bind(this));

    this.attributes.canvas.add(rect);
  }

  updateCanvasSize() {
    var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.attributes.canvas.setHeight( height )
    this.attributes.canvas.setWidth( width )
  }
}
