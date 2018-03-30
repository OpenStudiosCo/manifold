import Potrace from 'Potrace';
import BaseView from './base.js';

/**
  * Potrace view.
  *
  * Manages all UI elements relating to Potrace integration.
  */

export default class PotraceView extends BaseView {
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
