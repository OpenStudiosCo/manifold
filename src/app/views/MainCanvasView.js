import $ from 'jQuery';
import fabric from 'fabric';
import BaseView from './BaseView.js';
import defaultMenu from '../../templates/toolbar/default.pug';
import addShapes from '../../templates/toolbar/add-shapes.pug';

/**
  * MainCanvas view.
  */

export default class MainCanvasView extends BaseView {
  constructor(options) {
    super({
      el: '#main-canvas',
      model: options.model
    });

    // Initial image
    var callback = function(svg) {
      // this.model.loadSVG(svg, callback);
      app.views.threeCanvas.createScene(svg);
      var threeD = new fabric.Image($(app.views.threeCanvas.el).find('canvas')[0]);
      this.model.addToCenter(threeD);
    }.bind(this);
    this.model.potrace.createSVG($('#original-image').attr('src'), callback);

    this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);

    this.setupDefaultMenu();

    $('.ui.fullscreen.special.modal.transition').on('click', 'a.image', function(e){
      var src = $(e.target).attr('src');
      var callback = function(svg) {
        var callback = function() {
          $('.ui.special.modal')
            .modal('hide');
        };
        app.models.mainCanvas.loadSVG(svg, callback);
      };
      app.models.mainCanvas.potrace.createSVG(src, callback);
    });

    $('.ui.dropdown').dropdown();

    $(window).on('resize', () => {
      app.models.mainCanvas.updateCanvasSize();
    });
  }

  setupDefaultMenu() {
    $('#btnAddImage')
      .popup({
        title: 'Add Image',
        position: 'right center'
      })
      .on('click', function(){
        $('.ui.special.modal')
          .modal({ centered: false })
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

    $('#btnToggleOverlays')
      .popup({
        title: 'Toggle Overlays',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.eye.icon').toggleClass('slash');
        $('.floating.overlay').toggle();
      });
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
        var circle = new fabric.Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
        this.model.addToCenter(circle);
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
        this.model.addToCenter(rect);
      }.bind(this));
    $('#btnAddTriangle')
      .popup({
        title: 'Triangle',
        position: 'right center'
      })
      .on('click', function(){
        var triangle = new fabric.Triangle({ width: 100, height: 100, fill: 'blue', left: 50, top: 50 });
        this.model.addToCenter(triangle);
      }.bind(this));
  }

  toggleToolbar() {
    if (!this.model.attributes.transitioning) {
      $("#toolbar")
        .sidebar({
          dimPage: false,
          transition: 'push',
          exclusive: false,
          closable: false,
          onChange: function() {
            app.models.mainCanvas.attributes.transitioning = true;
          },
          onHide: function() {
            app.models.mainCanvas.attributes.transitioning = false;
          },
          onShow: function() {
            app.models.mainCanvas.attributes.transitioning = false;
          }
        })
        .sidebar("toggle");
      this.model.updateCanvasSize();
    }
  }
}
