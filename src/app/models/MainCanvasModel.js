import $ from 'jQuery';
import fabric from 'fabric';
import BaseModel from './BaseModel.js';
import activeObjectContext from '../../templates/toolbar/active-object-context.pug';
import ColourPickerModel from './main-canvas/ColourPickerModel.js';
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
    this.colourPickerModel = new ColourPickerModel();
    this.potrace = new PotraceModel();
    this.attributes.canvas = new fabric.Canvas('main-canvas');
    this.updateCanvasSize();
    this.setupEvents();
  }

  setupEvents() {
    // Credit - https://stackoverflow.com/a/24238960
    this.attributes.canvas.on('object:moving', function (e) {
      var obj = e.target;
       // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
          return;
      }        
      obj.setCoords();        
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
          obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
          obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top+obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width > obj.canvas.width){
          obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
          obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    });

    // Create the active object context menu when selecting an object.
    var selectionCallback = function(e) {
      $('.active-object-context').remove();
      var $menu = $(activeObjectContext());
      $('#container').append($menu);
      var offsetX = e.target.left + ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);

      // Set the menu to be draggable
      $('.floating.overlay').draggable();

      // Events
      $('#btnDeleteActive').click(function(e) {
        var selectedObjects = this.attributes.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          this.attributes.canvas.remove(selectedObjects[i]);  
        }
        this.attributes.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
    }.bind(this);

    // Separated for Fabric's On not supporting multiple.
    this.attributes.canvas.on('selection:created', selectionCallback);
    this.attributes.canvas.on('selection:updated', selectionCallback);

    this.attributes.canvas.on('mouse:dblclick', function(e){
      if (e.target && e.target._element) {
        var $el = $('#model-preview');
        var offsetX = e.target.left + ((e.target.width / 2) - ($el.width() / 2));
        var offsetY = e.target.top + ((e.target.height / 2) - ($el.height() / 2));
        $el.show();
        $el.css('left', offsetX);
        $el.css('top', offsetY);
      }
     
    }.bind(this));

    this.attributes.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
     $('#model-preview').hide();
    });

    // TODO: Don't follow if user moved the toolbar.
    this.attributes.canvas.on('object:moving', function(e) {
      var $menu = $('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    });
  }

  // Loads an SVG string and splits up objects so they're loaded in the right position.
  loadSVG(svg, callback) {
    fabric.loadSVGFromString(svg, function(objects){
      // Create a group so we add to center accurately.
      var group = new fabric.Group(objects);
      this.addToCenter(group);

      // Ungroup.
      var items = group._objects;
      group._restoreObjectsState();
      this.attributes.canvas.remove(group);
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
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      width -= $('#toolbar').width();  
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.attributes.canvas.setHeight( height );
    this.attributes.canvas.setWidth( width );
  }

  // Add an object to the center of the canvas.
  addToCenter(object) {
    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
    
    this.attributes.canvas.add(object);
  }
}
