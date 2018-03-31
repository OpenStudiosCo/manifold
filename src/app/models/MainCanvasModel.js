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

    this.createSVG($('#original-image').attr('src'));

    this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);

    this.setupDefaultMenu();

    $('.ui.fullscreen.special.modal.transition').on('click', 'a.image', function(e){
      var src = $(this).find('img').attr('src');
      app.models.mainCanvas.createSVG(src);
      $('.ui.special.modal')
        .modal('hide');
    });

    $(window).on('resize', function() {
      this.updateCanvasSize();
    }.bind(this));
  }

  createSVG(src) {
    // Create an SVG from data and settings, draw to screen.
    Potrace.clear();
    Potrace.loadImageFromSrc(src);
    Potrace.process(function() {
      var svg = Potrace.getSVG(1);
      const randomColor = () => '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
      var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
      // normalize should be used to get back absolute segments
      const pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce((acc, seg) => {
        let pathData = seg.type === 'M' ? [] : acc.pop()
        seg.values = seg.values.map(v => Math.round(v * 1000) / 1000)
        pathData.push(seg)
        acc.push(pathData)
        return acc
      }, []);

      pathsDatas.forEach(function(d) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setPathData(d)
        path.setAttribute('fill', randomColor())
        newSVG.appendChild(path)
      });
      fabric.loadSVGFromString(newSVG.outerHTML, function(objects, options){
        objects.forEach(function(object) {
          this.addToCenter(object);
        }.bind(this));
      }.bind(this));
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
    if (object.left > 0 || object.top > 0) {
      object.set({left: (canvasWidth / 3.5) + object.left, top: (canvasHeight / 3.5) + object.top});
    }
    else {
      object.set({left: (canvasWidth / 2) - (object.width / 2), top: (canvasHeight / 2) - (object.height / 2)});
    }
    
    this.attributes.canvas.add(object);
  }
}
