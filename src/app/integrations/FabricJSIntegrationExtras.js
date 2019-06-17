import $ from 'jQuery';
import fabric from 'fabric';
import activeObjectContext from '../../templates/toolbar/active-object-context.pug';
import ColourPickerControls from '../ui/controls/ColourPickerControls.js';
import PotraceIntegration from './PotraceIntegration.js';
import ThreeJSIntegration from './ThreeJSIntegration.js';

/**
  * Raster To SVG model.
  */

export default class FabricJSIntegrationExtras {
  defaults() {
    var attributes = {
      canvas: null,
      transitioning: false
    };
    
    return attributes;
  }

  constructor() {
    this.colourPickerModel = new ColourPickerControls();
    this.potrace = new PotraceIntegration();
    this.canvas = new fabric.Canvas('main-canvas');
    this.updateCanvasSize();
    this.setupEvents();
  }

  setupEvents() {
    // Credit - https://stackoverflow.com/a/24238960
    this.canvas.on('object:moving', function (e) {
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

      // Not 3D, not text, not group
      if (!e.target._element && !e.target.text && !e.target._objects) {
        $('#btnMake3D').removeClass('disabled');
      }
      // Not 3D, not group
      if (!e.target._element && !e.target._objects) {
        $('#btnFillActive').removeClass('disabled');
        $('#btnFillActive .icon').css('color', e.target.fill);
        this.colourPickerModel.lookupAndSetColour(e.target.fill);
      }
      // Is group.
      if (e.target._objects) {

        $('#btnGroupActive').removeClass('disabled');
        if (e.target.type == 'activeSelection') {
          $('#btnGroupActive span').html('Group (' + e.target._objects.length + ')');
        }
        else {
          $('#btnGroupActive span').html('Ungroup (' + e.target._objects.length + ')');
        }
      }

      // Events
      $('#btnGroupActive').click(function(e) {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject.type != 'group') {
          activeObject.toGroup();
        }
        else {
          activeObject.toActiveSelection();
        }
        
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
      }.bind(this));
      
      $('#btnFillActive:not(.disabled)').click(function(e){
        $(this).toggleClass('active');
        $('#fill-tool').toggle();
      });
      $('#btnDeleteActive').click(function(e) {
        var selectedObjects = this.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          this.canvas.remove(selectedObjects[i]);  
        }
        this.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
      $('#btnMake3D:not(.disabled)').click(function(e) {
        var selectedObjects = this.canvas.getActiveObjects();
        var convertibleObjects = [];
        for (var i = 0; i < selectedObjects.length; i++) {
          if (selectedObjects[i].toSVG) {
            var obj_width = selectedObjects[i].width * selectedObjects[i].scaleX;
            var obj_height = selectedObjects[i].height * selectedObjects[i].scaleY;

            var svg_start = '<svg xmlns="http://www.w3.org/2000/svg"';//' viewbox="0 0 ';
            svg_start += ' style="fill: ';
            svg_start += selectedObjects[i].fill + '">';

            var svg_end = '</svg>';

            // Hack for matrix transform;
            //var svgElements = svg_start + selectedObjects[i].toSVG().replace(/matrix\(.*\)/,'matrix(1 0 0 1 0 0)') + svg_end;

            var svgElements = svg_start + selectedObjects[i].toSVG() + svg_end;

            console.log(svgElements);

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric.Image($(threeCanvas.el).find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              this.canvas.add(threeD);
            }.bind(this);
            app.models.threeCanvas.push(new ThreeCanvasModel({
              height: obj_height,
              width: obj_width
            }));
            app.views.threeCanvas.push(
              new ThreeCanvasView({ 
                model: app.models.threeCanvas[app.models.threeCanvas.length-1],
                svg: svgElements,
                width: obj_width,
                height: obj_height
              })
            );
            create3DObject(app.views.threeCanvas[app.views.threeCanvas.length-1]);
            this.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        this.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
    }.bind(this);

    // Separated for Fabric's On not supporting multiple.
    this.canvas.on('selection:created', selectionCallback);
    this.canvas.on('selection:updated', selectionCallback);

    this.canvas.on('mouse:dblclick', function(e){
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

    this.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
     $('.model-preview').hide();
     $('#fill-tool').hide();
    });

    // TODO: Don't follow if user moved the toolbar.
    this.canvas.on('object:moving', function(e) {
      var $menu = $('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $('#toolbar').sidebar('is visible') ? $('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > this.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = this.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    }.bind(this));

    // Resize 3D canvas if it's that type of element.
    this.canvas.on('object:scaling', function(e) {
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
      this.canvas.remove(group);
      for (var i = 0; i < items.length; i++) {
        this.canvas.add(items[i]);
      }
      this.canvas.renderAll();
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
    this.canvas.setHeight( height );
    this.canvas.setWidth( width );
  }

  // Add an object to the center of the canvas.
  addToCenter(object) {
    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
    
    this.canvas.add(object);
  }
}
