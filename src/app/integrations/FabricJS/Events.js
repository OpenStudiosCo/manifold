import $ from 'jQuery';
import fabric from 'fabric';
import activeObjectContext from '../../../templates/toolbar/active-object-context.pug';
import ThreeJSIntegration from '../ThreeJSIntegration.js';
import ThreeJSIntegrationExtras from '../ThreeJSIntegrationExtras.js';

var app = {};
export default class FabricJSIntegrationEvents {
  constructor(appInstance) {
    app = appInstance;
  }

  setupEvents() {
    // Credit - https://stackoverflow.com/a/24238960
    app.fabric.model.canvas.on('object:moving', function (e) {
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
        app.fabric.model.colourPickerModel.lookupAndSetColour(e.target.fill);
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
      $('#btnGroupActive').click(function() {
        var activeObject = app.fabric.model.canvas.getActiveObject();
        if (activeObject.type == 'group') {
          activeObject.toActiveSelection();
        }
        else {
          activeObject.toGroup();
        }
        
        app.fabric.model.canvas.discardActiveObject();
        app.fabric.model.canvas.requestRenderAll();

        // Update layers tool
        if (app.layers) {
          app.layers.updateLayers();
        }
      });
      
      $('#btnFillActive:not(.disabled)').click(function(){
        $(this).toggleClass('active');
        $('#fill-tool').toggle();
      });
      $('#btnDeleteActive').click(function() {
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          app.fabric.model.canvas.remove(selectedObjects[i]);  
        }
        app.fabric.model.canvas.discardActiveObject();
        $('.active-object-context').remove();
        // Update layers tool
        if (app.layers) {
          app.layers.updateLayers();
        }
      });
      $('#btnSaveSVG').click(function() {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([app.fabric.model.canvas.toSVG()], {type: "text/plain"}));
        a.download = prompt("Please enter a filename", "Manifold-Download.svg");
        if (a.download != 'null') {
          if (a.download.indexOf('.svg') < 0) {
            a.download += '.svg';
          }
          a.click();
        }
        
        // let w = window.open('')
        // w.document.write()
        // return 'data:image/svg+xml;utf8,' + encodeURIComponent(app.fabric.model.canvas.toSVG())
      });
      $('#btnMake3D:not(.disabled)').click(function() {
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();

        for (var i = 0; i < selectedObjects.length; i++) {
          if (selectedObjects[i].toSVG) {
            var obj_width = selectedObjects[i].width * selectedObjects[i].scaleX;
            var obj_height = selectedObjects[i].height * selectedObjects[i].scaleY;

            // Start SVG document.
            // Removed: ' viewbox="0 0 ';
            var svg_start = '<svg xmlns="http://www.w3.org/2000/svg"';
            svg_start += ' style="fill: ';
            svg_start += selectedObjects[i].fill + '">';

            var svg_end = '</svg>';

            // Hack for matrix transform;
            // var svgElements = svg_start + selectedObjects[i].toSVG().replace(/matrix\(.*\)/,'matrix(1 0 0 1 0 0)') + svg_end;

            var svgElements = svg_start + selectedObjects[i].toSVG() + svg_end;

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric.Image(threeCanvas.$el.find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              app.fabric.model.canvas.add(threeD);
            };
            app.ThreeCanvasModel.push(new ThreeJSIntegrationExtras({
              height: obj_height,
              width: obj_width
            }));
            var ThreeFabricObject = new ThreeJSIntegration({ 
              model: app.ThreeCanvasModel[app.ThreeCanvasModel.length-1],
              svg: svgElements,
              width: obj_width,
              height: obj_height
            });
            app.ThreeCanvasView.push( ThreeFabricObject );
            create3DObject(app.ThreeCanvasView[app.ThreeCanvasView.length-1]);
            app.fabric.model.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        app.fabric.model.canvas.discardActiveObject();
        $('.active-object-context').remove();
      });
      app.layers.updateLayers();
    };

    // Separated for Fabric's On not supporting multiple.
    app.fabric.model.canvas.on('selection:created', selectionCallback);
    app.fabric.model.canvas.on('selection:updated', selectionCallback);

    app.fabric.model.canvas.on('mouse:dblclick', function(e){
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
     
    });

    app.fabric.model.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
      $('.model-preview').hide();
      $('#fill-tool').hide();
      if (app.layers) {
        app.layers.updateLayers();
      }
    });

    // @TODO: Don't follow if user moved the toolbar.
    app.fabric.model.canvas.on('object:moving', function(e) {
      var $menu = $('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $('#toolbar').sidebar('is visible') ? $('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > app.fabric.model.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = app.fabric.model.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    });

    // Update 3D canvas if it's that type of element.
    app.fabric.model.canvas.on('object:modified', function(e) {
      if (e.target._element) {
        app.fabric.model.events.updateModelPreviewViewPort(e.target);
      }
    });
  }

  updateModelPreviewViewPort(target) {
    var $container = $(target._element).parent();
    if ($container.hasClass('model-preview')) {
      var scaledWidth = target.width * target.scaleX;
      var scaledHeight = target.height * target.scaleY;
      var rotateY = target.get('angle');
      $container.css('width', scaledWidth);
      $container.css('height', scaledHeight);
      $container.css('transform', 'rotateZ(' + rotateY + 'deg)');

      var id = $container.attr('id').replace('model-preview-','');
      app.ThreeCanvasModel[id].attributes.width = scaledWidth;
      app.ThreeCanvasModel[id].attributes.height = scaledHeight;
      app.ThreeCanvasModel[id].resize();
      
      target._resetWidthHeight();
    }
  }
}