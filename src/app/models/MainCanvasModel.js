import $ from 'jQuery';
import TWEEN from 'TWEEN';
import _ from '_';
import defaultMenu from '../../templates/toolbar/default.pug';
import addShapes from '../../templates/toolbar/add-shapes.pug';
import Potrace from 'Potrace';
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
      // Create an SVG from data and settings, draw to screen.
    Potrace.clear();
    Potrace.loadImageFromId('original-image');
    Potrace.process(function(){
      var svg = Potrace.getSVG(1);
      fabric.loadSVGFromString(svg, function(objects, options){
        var obj = fabric.util.groupSVGElements(objects, options);
        console.log(obj.toSVG());
        this.addToCenter(obj);         
      }.bind(this));
    }.bind(this));

  

    this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);

    this.setupDefaultMenu();

    $(window).on('resize', function(){
      this.updateCanvasSize();
    }.bind(this));
  }

  setupDefaultMenu() {
    $('#btnAddImage')
      .popup({
        title: 'Add Image',
        position: 'right center'
      })
      .on('click', function(){
        $('.ui.special.modal')
          .modal({
            centered: false
          })
          .modal('show');
      });

    $('#btnAddShape')
      .popup({
        title: 'Add Shape',
        position: 'right center'
      })
      .on('click', function(){
        $('#toolbar').html(addShapes());
        this.setupAddShapesMenu();
      }.bind(this));
  }

  setupAddShapesMenu() {
    $('#btnBack')
      .popup({
        title: 'Back',
        position: 'right center'
      })
      .on('click', function(){
        $('#toolbar').html(defaultMenu());
        this.setupDefaultMenu();
      }.bind(this));
    $('#btnAddCircle')
      .popup({
        title: 'Circle',
        position: 'right center'
      })
      .on('click', function(){
        var circle = new fabric.Circle({
          radius: 100, fill: 'green', left: 100, top: 100
        });
        this.addToCenter(circle);
      }.bind(this));
    $('#btnAddSquare')
      .popup({
        title: 'Square',
        position: 'right center'
      })
      .on('click', function(){
        var rect = new fabric.Rect({
          left: 100,
          top: 100,
          fill: 'red',
          width: 200,
          height: 200
        });
        this.addToCenter(rect);
      }.bind(this));
    $('#btnAddTriangle')
      .popup({
        title: 'Square',
        position: 'right center'
      })
      .on('click', function(){
        var triangle = new fabric.Triangle({
          width: 100, height: 100, fill: 'blue', left: 50, top: 50
        });
        this.addToCenter(triangle);
      }.bind(this));
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
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    object.set({left: (canvasWidth / 2) - (object.width / 2), top: (canvasHeight / 2) - (object.height / 2)});
    this.attributes.canvas.add(object);
  }
}
