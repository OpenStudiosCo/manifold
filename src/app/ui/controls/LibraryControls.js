import $ from 'jQuery';
import BaseControls from './BaseControls.js';

/**
  * Library controls
  */

var app = {};
export default class LibraryControls extends BaseControls {
  constructor(appInstance) {
    app = appInstance;
    super();
    var el = document.getElementById('add-image');
    if (!el) {
      return;
    }

  }

}
