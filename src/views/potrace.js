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
    this.el = '#potrace-preview';
    this.controls = new PotraceControls();
    super();
    this.render();
  }

  render() {
    var guiFolder = this.gui.addFolder('Potrace Controls');
    for (var controlName in this.controls.attributes) {
      var _this = this;
      
      var callback = function() {
        this.$el.html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(_this.createSVG.bind(_this), 100);
      };
      if (isNaN(this.controls.attributes[controlName])) {
        guiFolder.add(this.controls.attributes, controlName)
          .onFinishChange(callback);
      }
      else {
        var max = this.controls.attributes[controlName] * 2;
        max = (max > 0) ? max : 100;
        guiFolder.add(this.controls.attributes, controlName, 0, max)
          .onFinishChange(callback);
      }
    }
    this.createSVG();
  }

  // Create an SVG from data and settings, draw to screen.
  createSVG() {  
    Potrace.clear();
    Potrace.setParameter(this.controls.attributes);
    Potrace.loadImageFromId('original-image');
    Potrace.process(function(){
      var svgdiv = document.getElementById('potrace-preview');
      svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
    });
  }
  
}
