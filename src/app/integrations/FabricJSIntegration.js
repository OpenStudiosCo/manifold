import fabric from 'fabric';
import BaseIntegration from './BaseIntegration.js';
import ColourPickerControls from '../ui/controls/ColourPickerControls.js';
import FabricJSIntegrationEvents from './FabricJS/Events.js';
import FabricJSIntegrationHelpers from './FabricJS/Helpers.js';

/**
  * Fabric JS Integration.
  */

var app = {};
export default class FabricJSIntegration extends BaseIntegration {
  constructor( appInstance ) {
    app = appInstance;
    super();
    this.el = '#main-canvas';
    this.model = {
      colourPickerModel: new ColourPickerControls( appInstance ),
      canvas: new fabric.Canvas( 'main-canvas', { preserveObjectStacking: true } ),
      attributes: {
        canvas: null,
        transitioning: false
      },
      helpers: new FabricJSIntegrationHelpers( appInstance ),
      events: new FabricJSIntegrationEvents( appInstance )
    };
  }

  ready() {
    app.fabric.model.events.setupEvents();
    app.fabric.model.helpers.updateCanvasSize();

    // Default scene.
    app.fabric.demoAnimating();
  }
  demoAnimating() {

    // var gradient = new fabric.Gradient( {
    //   type: 'linear',
    //   gradientUnits: 'pixels', // or 'percentage'
    //   coords: { x1: 0, y1: 0, x2: 0, y2: 50 },
    //   colorStops: [
    //     { offset: 0, color: '#F00' },
    //     { offset: 1, color: '#000' }
    //   ]
    // } );
    var triangle = new fabric.Triangle( { width: 200, height: 200, fill: 'blue', left: 50, top: -150 } );
    app.fabric.model.helpers.addToCenter( triangle );
  }
  demoDrawing() {
    var circle = new fabric.Circle( { radius: 100, fill: '  green' } );
    app.fabric.model.helpers.addToCenter( circle );
    circle.left -= 75;
    var rect = new fabric.Rect( {
      fill: 'red',
      width: 200,
      height: 200
    } );
    app.fabric.model.helpers.addToCenter( rect );
    rect.left += 75;
  }
  demoTracing() {
    var imgSrc = '/assets/puppies.jpg';
    fabric.Image.fromURL( imgSrc, function ( oImg ) {
      app.fabric.model.helpers.addToCenter( oImg );
      oImg.left -= 7;
      oImg.top += 13;
      app.fabric.model.canvas.setActiveObject( app.fabric.model.canvas.item( 0 ) );
      $( '#btnToggleVector' ).click();
    } );
  }
}
