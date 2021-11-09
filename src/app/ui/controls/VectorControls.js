import $ from 'jQuery';
import BaseControls from './BaseControls.js';
import ImageTracerIntegration from '../../integrations/ImageTracerIntegration.js'
import PotraceIntegration from '../../integrations/PotraceIntegration.js';

/**
  * Vector converter controls
  * 
  * Set which framework (Imagetracer|Potrace) and what it's settings are
  */

var app = {};
export default class VectorControls extends BaseControls {
  constructor(appInstance) {
    app = appInstance;
    super();
    var el = document.getElementById('vector-tool');
    if (!el) {
      return;
    }
    this.imagetracer = new ImageTracerIntegration();
    this.potrace = new PotraceIntegration();
  }

  preview(app) {
    this.potrace.preview(app);
  }

  create (app, replace = false) {
    this.potrace.create(app, replace);
  }

}
