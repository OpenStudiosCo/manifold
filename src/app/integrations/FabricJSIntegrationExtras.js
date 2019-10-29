import $ from 'jQuery';
import fabric from 'fabric';
import ColourPickerControls from '../ui/controls/ColourPickerControls.js';
import FabricJSIntegrationEvents from './FabricJS/Events.js';
import FabricJSIntegrationHelpers from './FabricJS/Helpers.js';
import PotraceIntegration from './PotraceIntegration.js';

/**
  * Raster To SVG model.
  */

export default class FabricJSIntegrationExtras {
  constructor() {
    this.colourPickerModel = new ColourPickerControls();
    this.potrace = new PotraceIntegration();
    this.canvas = new fabric.Canvas('main-canvas');
    this.attributes = {
      canvas: null,
      transitioning: false
    };
    this.helpers = new FabricJSIntegrationHelpers(); 
    this.events = new FabricJSIntegrationEvents();
  }
}
