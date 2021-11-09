import $ from 'jQuery';
import BaseControls from './BaseControls.js';

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

  }

}
