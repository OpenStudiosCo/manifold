import $ from 'jQuery';
import fabric from 'fabric';
import Potrace from 'Potrace';
import BaseModel from './BaseModel.js';
import PotraceModel from './main-canvas/PotraceModel.js';

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
    this.potrace = new PotraceModel();
    this.attributes.canvas = new fabric.Canvas('main-canvas');

    // Setup pan and zoom.
    this.attributes.canvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var pointer = this.attributes.canvas.getPointer(opt.e);
      var zoom = this.attributes.canvas.getZoom();
      zoom = zoom + delta/200;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.attributes.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    }.bind(this));

    // Credit - https://stackoverflow.com/a/24238960
    this.attributes.canvas.on('object:moving', function (e) {
      var obj = e.target;
       // if object is too big ignore
      if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
          return;
      }        
      obj.setCoords();        
      // top-left  corner
      if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
          obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
          obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
          obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
          obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    });
        
    this.updateCanvasSize();
  }

  // Loads an SVG string and splits up objects so they're loaded in the right position.
  loadSVG(svg, callback) {
    fabric.loadSVGFromString(svg, function(objects, options){
      // TODO: Move this out of here
      // Create a group so we add to center accurately.
      var group = new fabric.Group(objects);
      this.addToCenter(group);

      // Ungroup.
      var items = group._objects;
      group._restoreObjectsState();
      this.attributes.canvas.remove(group);
      var paths = [];
      for (var i = 0; i < items.length; i++) {
        this.attributes.canvas.add(items[i]);
      }
      this.attributes.canvas.renderAll();
      if (callback) {
        callback(items);
      }
    }.bind(this));
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

  // Add an object to the center of the canvas.
  addToCenter(object) {
    var canvasWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    object.set({left: (canvasWidth / 2) - (object.width / 2), top: (canvasHeight /2 - object.height / 2)});
    
    this.attributes.canvas.add(object);
  }
}
