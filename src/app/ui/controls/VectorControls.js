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
    this.potrace = new PotraceIntegration(app);
    
    this.selected = $('#vector-tool .method input:checked').val();
    $('#vector-tool .method input').change(() => {
      this.selected = $('#vector-tool .method input:checked').val();
      this.preview(app);
    });
  }

  preview(app) {
    this[this.selected].preview(app);
  }

  create (app, replace = false) {
    // @todo: Expand when other things are set to temporary
    let objects = app.fabric.model.canvas.getObjects();
    objects.forEach((object) => {
      if (object.temporary) {
        object.temporary = false;
      }
    });
    if (replace) {
      var selectedObjects = app.fabric.model.canvas.getActiveObjects();
      app.fabric.model.canvas.remove(selectedObjects[0]);  
    }
  }


}
