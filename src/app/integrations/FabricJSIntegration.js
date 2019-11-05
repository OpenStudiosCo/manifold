import $ from 'jQuery';
import fabric from 'fabric';
import BaseIntegration from './BaseIntegration.js';
import ColourPickerControls from '../ui/controls/ColourPickerControls.js';
import FabricJSIntegrationEvents from './FabricJS/Events.js';
import FabricJSIntegrationHelpers from './FabricJS/Helpers.js';
import PotraceIntegration from './PotraceIntegration.js';
/**
  * Fabric JS Integration.
  */

export default class FabricJSIntegration extends BaseIntegration {
  constructor(options) {
    this.el = '#main-canvas';
    this.model = {
      colourPickerModel: new ColourPickerControls(),
      potrace: new PotraceIntegration(),
      canvas: new fabric.Canvas('main-canvas'),
      attributes: {
        canvas: null,
        transitioning: false
      },
      helpers: new FabricJSIntegrationHelpers(),
      events: new FabricJSIntegrationEvents()
    };
  }

  ready () {
    app.fabric.model.events.setupEvents();
    app.fabric.model.helpers.updateCanvasSize();

    // Default scene.
    var circle = new fabric.Circle({ radius: 100, fill: 'green' });
    app.fabric.model.helpers.addToCenter(circle);
    circle.left -= 75;
    var rect = new fabric.Rect({
      fill: 'red',
      width: 200,
      height: 200
    });
    app.fabric.model.helpers.addToCenter(rect);
    rect.left += 75;
  }
}
