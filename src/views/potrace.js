import Potrace from 'Potrace';
import BaseView from './base.js';
import PotraceControls from '../models/controls/potrace.js';

/**
  * Potrace view.
  *
  * Manages all UI elements relating to Potrace integration.
  */

export default class PotraceView extends BaseView {
  constructor() {
    super({
      el: '#potrace-preview',
      model: new PotraceControls()
    });
    this.render();
  }

  render() {
    var guiFolder = this.gui.addFolder('Potrace Controls');
    for (var controlName in this.model.attributes) {
      var callback = function() {
        this.$el.html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(this.createSVG.bind(this), 100);
      };
      if (isNaN(this.model.attributes[controlName])) {
        guiFolder.add(this.model.attributes, controlName)
          .onFinishChange(callback.bind(this));
      }
      else {
        var max = this.model.attributes[controlName] * 2;
        max = (max > 0) ? max : 100;
        guiFolder.add(this.model.attributes, controlName, 0, max)
          .onFinishChange(callback.bind(this));
      }
    }
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
