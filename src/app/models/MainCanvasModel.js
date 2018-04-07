import $ from 'jQuery';
import fabric from 'fabric';
import BaseModel from './BaseModel.js';
import activeObjectContext from '../../templates/toolbar/active-object-context.pug';
import ColourPickerModel from './main-canvas/ColourPickerModel.js';
import PotraceModel from './main-canvas/PotraceModel.js';
import ThreeCanvasModel from '../models/ThreeCanvasModel.js';
import ThreeCanvasView from '../views/ThreeCanvasView.js';

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
      $('.model-preview').hide();
      $('.active-object-context').remove();
      var $menu = $(activeObjectContext());
      $('#container').append($menu);
      var offsetX = e.target.left + ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);

      // Set the menu to be draggable
      $('.floating.overlay').draggable();

      // Set relevant buttons to active
      if (!e.target._element && !e.target.text && !e.target._objects) {
        $('#btnMake3D').removeClass('disabled');
        $('#btnFillActive').removeClass('disabled');
        this.colourPickerModel.lookupAndSetColour(e.target.fill);
      }

      // Events
      $('#btnFillActive').click(function(e){
        $(this).toggleClass('active');
        $('#fill-tool').toggle();
      });
      $('#btnDeleteActive').click(function(e) {
        var selectedObjects = this.attributes.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          this.attributes.canvas.remove(selectedObjects[i]);  
        }
        this.attributes.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
      $('#btnMake3D:not(.disabled)').click(function(e) {
        var selectedObjects = this.attributes.canvas.getActiveObjects();
        var convertibleObjects = [];
        for (var i = 0; i < selectedObjects.length; i++) {
          if (selectedObjects[i].toSVG) {

            var svgElements = selectedObjects[i].toSVG();

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric.Image($(threeCanvas.el).find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              this.attributes.canvas.add(threeD);
            }.bind(this);
            app.models.threeCanvas.push(new ThreeCanvasModel());
            app.views.threeCanvas.push(
              new ThreeCanvasView({ 
                model: app.models.threeCanvas[app.models.threeCanvas.length-1],
                svg: svgElements,
                width: selectedObjects[i].width * selectedObjects[i].scaleX,
                height: selectedObjects[i].height * selectedObjects[i].scaleY
              })
            );
            create3DObject(app.views.threeCanvas[app.views.threeCanvas.length-1]);
            this.attributes.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
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
        var $el = $(e.target._element).parent();
        var scaledWidth = e.target.width * e.target.scaleX;
        var scaledHeight = e.target.height * e.target.scaleY;
        var offsetX = e.target.left + ((scaledWidth / 2) - ($el.width() / 2));
        var offsetY = e.target.top + ((scaledHeight / 2) - ($el.height() / 2));
        $el.show();
        $el.css('left', offsetX);
        $el.css('top', offsetY);
      }
     
    }.bind(this));

    this.attributes.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
     $('.model-preview').hide();
     $('#fill-tool').hide();
    });

    // TODO: Don't follow if user moved the toolbar.
    this.attributes.canvas.on('object:moving', function(e) {
      var $menu = $('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $('#toolbar').sidebar('is visible') ? $('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > this.attributes.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = this.attributes.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    }.bind(this));

    // Resize 3D canvas if it's that type of element.
    this.attributes.canvas.on('object:scaling', function(e) {
      if (e.target._element) {
        var $container = $(e.target._element).parent();
        if ($container.hasClass('model-preview')) {
          var scaledWidth = e.target.width * e.target.scaleX;
          var scaledHeight = e.target.height * e.target.scaleY;
          $container.css('width', scaledWidth);
          $container.css('height', scaledHeight);
          
          var id = $container.attr('id').replace('model-preview-','');
          app.models.threeCanvas[id].attributes.width = scaledWidth;
          app.models.threeCanvas[id].attributes.height = scaledHeight;
          app.models.threeCanvas[id].resize();
          e.target._resetWidthHeight();
        }
      }
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
