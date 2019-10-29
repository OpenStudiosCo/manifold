import $ from 'jQuery';
import fabric from 'fabric';
import BaseIntegration from './BaseIntegration.js';
import FabricJSIntegrationExtras from './FabricJSIntegrationExtras.js';

/**
  * Fabric JS Integration.
  */

export default class FabricJSIntegration extends BaseIntegration {
  constructor(options) {
    this.el = '#main-canvas';
    this.model = new FabricJSIntegrationExtras();
    
    $(document).ready(function(){
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
    });
  }
}
