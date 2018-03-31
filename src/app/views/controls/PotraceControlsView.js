import Potrace from 'Potrace';
import BaseControlsView from './BaseControlsView.js';

/**
  * Potrace view.
  *
  * Manages all UI elements relating to Potrace integration.
  */

export default class PotraceControlsView extends BaseControlsView {
  constructor(options) {
    super({
      el: '#potrace-preview',
      model: options.model
    });
    this.generateControls('Potrace Controls');
    this.createSVG();
  }

  // Create an SVG from data and settings, draw to screen.
  createSVG() {  
    Potrace.clear();
    Potrace.setParameter(this.model.attributes);
    Potrace.loadImageFromId('original-image');
    Potrace.process(function(){
      var svgdiv = document.getElementById('potrace-preview');
      svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
    });
  }
  
}
