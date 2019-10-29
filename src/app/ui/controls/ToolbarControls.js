import $ from 'jQuery';
import fabric from 'fabric';
import BaseControls from './BaseControls.js';

export default class ToolbarControls extends BaseControls {
  constructor() {
    this.setupDefaultMenu();

    $('.floating.overlay').draggable();

    $('#add-image').on('click', 'a.item.image', function(e){
      var src = $(e.target).attr('src');
      var callback = function(svg) {
        var callback = function() {
          $('#hideAddImage').click();
        };
        app.fabric.model.helpers.loadSVG(svg, callback);
      };
      app.fabric.model.potrace.createSVG(src, callback);
    });

    $('.ui.dropdown').dropdown();

    $(window).on('resize', () => {
      app.fabric.model.helpers.updateCanvasSize();
    });

    $('#hideAddImage')
      .on('click', function() {
        $('#btnAddImage').find('i.icon').toggleClass('disabled');
        $('#add-image')
          .animate({
           left: '-' + $('#add-image').width() + 'px'
          });
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
          .insertBefore('#add-image .ui.menu .item:last-child');
      });
  }
  
  setupDefaultMenu() {
    // Define slideout position based on corresponding menu item.
    $('#add-image').css('top', function(){
      return $('#btnAddImage').offset().top +(($('#btnAddImage').height() / 2) - ($(this).height() / 2));
    });
    $('#btnAddImage')
      .popup({
        title: 'Trace Image',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('disabled');
        if ($(this).find('i.icon').hasClass('disabled')) {
          $('#add-image')
            .css('left', '0px')
            .show()
            .animate({
              left: '-' + $('#add-image').width() + 'px'
            });
        }
        else {
          $('#add-image')
            .css('left', '-' + $('#add-image').width() + 'px')
            .show()
            .animate({
              left: '0px'
            });
        }
      });

    // TODO: https://codepen.io/shershen08/pen/JGepQv
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
      }.bind(this));

    // Track which overlays we hid so we don't override other settings.
    var overlays_visible = [];
    $('#btnToggleOverlays')
      .popup({
        title: 'Toggle Overlays',
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
    $('#btnToggleVector')
      .popup({
        title: 'Toggle Vector',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('disabled');
        $('#vector-tool').toggle();
      });
    $('#btnToggleLayers')
      .popup({
        title: 'Toggle Layers',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('disabled');
        $('#layers-tool').toggle();
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
        app.fabric.model.helpers.addToCenter(rect);
      }.bind(this));
    $('#btnAddTriangle')
      .popup({
        title: 'Triangle',
        position: 'right center'
      })
      .on('click', function(){
        var triangle = new fabric.Triangle({ width: 100, height: 100, fill: 'blue', left: 50, top: 50 });
        app.fabric.model.helpers.addToCenter(triangle);
      }.bind(this));
  }

  toggleToolbar() {
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
      app.fabric.model.updateCanvasSize();
    }
  }
}