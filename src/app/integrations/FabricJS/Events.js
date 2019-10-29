import $ from 'jQuery';
import fabric from 'fabric';
import activeObjectContext from '../../../templates/toolbar/active-object-context.pug';
import ThreeJSIntegration from '../ThreeJSIntegration.js';
import ThreeJSIntegrationExtras from '../ThreeJSIntegrationExtras.js';

export default class FabricJSIntegrationEvents {
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
      $('#btnGroupActive').click(function(e) {
        var activeObject = app.fabric.model.canvas.getActiveObject();
        if (activeObject.type != 'group') {
          activeObject.toGroup();
        }
        else {
          activeObject.toActiveSelection();
        }
        
        app.fabric.model.canvas.discardActiveObject();
        app.fabric.model.canvas.requestRenderAll();

        // Update layers tool
        if (app.layers) {
          app.layers.updateLayers();
        }
      }.bind(this));
      
      $('#btnFillActive:not(.disabled)').click(function(e){
        $(this).toggleClass('active');
        $('#fill-tool').toggle();
      });
      $('#btnDeleteActive').click(function(e) {
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
      }.bind(this));
      $('#btnMake3D:not(.disabled)').click(function(e) {
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();
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

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric.Image(threeCanvas.$el.find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              app.fabric.model.canvas.add(threeD);
            }.bind(this);
            app.ThreeCanvasModel.push(new ThreeJSIntegrationExtras({
              height: obj_height,
              width: obj_width
            }));
            app.ThreeCanvasView.push(
              new ThreeJSIntegration({ 
                model: app.ThreeCanvasModel[app.ThreeCanvasModel.length-1],
                svg: svgElements,
                width: obj_width,
                height: obj_height
              })
            );
            create3DObject(app.ThreeCanvasView[app.ThreeCanvasView.length-1]);
            app.fabric.model.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        app.fabric.model.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
    }.bind(this);

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
     
    }.bind(this));

    app.fabric.model.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
     $('.model-preview').hide();
     $('#fill-tool').hide();
    });

    // TODO: Don't follow if user moved the toolbar.
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
    }.bind(this));

    // Resize 3D canvas if it's that type of element.
    app.fabric.model.canvas.on('object:scaling', function(e) {
      if (e.target._element) {
        var $container = $(e.target._element).parent();
        if ($container.hasClass('model-preview')) {
          var scaledWidth = e.target.width * e.target.scaleX;
          var scaledHeight = e.target.height * e.target.scaleY;
          $container.css('width', scaledWidth);
          $container.css('height', scaledHeight);
          
          var id = $container.attr('id').replace('model-preview-','');
          app.ThreeCanvasModel[id].attributes.width = scaledWidth;
          app.ThreeCanvasModel[id].attributes.height = scaledHeight;
          app.ThreeCanvasModel[id].resize();
          e.target._resetWidthHeight();
        }
      }
    });
  }
}