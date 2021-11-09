import $ from 'jQuery';
import fabric from 'fabric';
import BaseControls from './BaseControls.js';
import addImageItem from '../../../templates/toolbar/add-image__item.pug';

var app = {};
export default class ToolbarControls extends BaseControls {
  constructor(appInstance) {
    app = appInstance;
    super();
    this.setupDefaultMenu();

    $('#add-image').on('click', 'a.ui.image.button img', function(e){
      var src = $(e.target).attr('src');
    
      fabric.Image.fromURL(src, function(img) {
        app.fabric.model.helpers.addToCenter(img);
      });
      
    });

    $(window).on('resize', () => {
      app.fabric.model.helpers.updateCanvasSize();
    });

    $('#btnUploadImage')
      .on('click', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $('#image_input').click();
      });
    $('#image_input')
      .on('change', function(e) {
        window.URL = window.URL || window.webkitURL || window.mozURL;
        var url = URL.createObjectURL(e.currentTarget.files[0]);
        $(addImageItem({ url: url }))
          .insertBefore('#btnUploadImage');
      });
  }
  
  setupDefaultMenu() {
    $('#btnDrawTool')
      .popup({
        title: 'Draw',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('grey');
        $(this).find('i.icon').toggleClass('inverted');
        if ($(this).find('i.icon').hasClass('grey')) {
          app.fabric.model.canvas.isDrawingMode = false;
        }
        if ($(this).find('i.icon').hasClass('inverted')) {
          app.fabric.model.canvas.isDrawingMode = true;
        }
      });

    $('#btnPointTool')
      .popup({
        title: 'Manipulate Shapes',
        position: 'right center'
      });

    // @TODO: https://codepen.io/shershen08/pen/JGepQv
    $('#btnAddText')
      .popup({
        title: 'Text',
        position: 'right center'
      })
      .on('click', function(){
        var textBox = new fabric.Textbox("Sample Text", {
          fontFamily: 'Arial'
        });
        app.fabric.model.helpers.addToCenter(textBox);
      });

    // Track which overlays we hid so we don't override other settings.
    var overlays_visible = [];
    $('#btnToggleOverlays')
      .popup({
        title: 'Toggle All Overlays',
        position: 'right center'
      })
      .on('click', function(){
        if ($(this).find('i.eye.icon').hasClass('slash')) {
          if (overlays_visible.length > 0) {
            $(overlays_visible).each(function(i, overlay){
              $(overlay).show();
            });
            overlays_visible = [];
          }
        }
        else {
          overlays_visible = $('.floating.overlay:visible');
          $('.floating.overlay:visible').hide();
        }
        $(this).find('i.icon').toggleClass('slash');
      });

    $('#btnToggle3DOptions')
      .popup({
        title: 'Toggle 3D Options',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('disabled');
        $('#threeD-tool').toggle();
      });
    $('#btnAddCircle')
      .popup({
        title: 'Circle',
        position: 'right center'
      })
      .on('click', function(){
        var circle = new fabric.Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
        app.fabric.model.helpers.addToCenter(circle);
      });
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
        app.fabric.model.helpers.addToCenter(rect);
      });
    $('#btnAddTriangle')
      .popup({
        title: 'Triangle',
        position: 'right center'
      })
      .on('click', function(){
        var triangle = new fabric.Triangle({ width: 200, height: 200, fill: 'blue', left: 50, top: 50 });
        app.fabric.model.helpers.addToCenter(triangle);
      });
  }

  toggle() {
    if (!app.fabric.model.attributes.transitioning) {
      $("#toolbar")
        .sidebar({
          dimPage: false,
          transition: 'push',
          exclusive: false,
          closable: false,
          onChange: function() {
            app.fabric.model.attributes.transitioning = true;
          },
          onHide: function() {
            app.fabric.model.attributes.transitioning = false;
          },
          onShow: function() {
            app.fabric.model.attributes.transitioning = false;
          }
        })
        .sidebar("toggle");
      app.fabric.model.helpers.updateCanvasSize();
    }
  }
}