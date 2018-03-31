import BaseControlsView from './BaseControlsView.js';

/**
  * Three Controls view.
  *
  * Manages all UI elements relating to THREE.JS integration.
  */

export default class ThreeControlsView extends BaseControlsView {
  constructor(options) {
    super({ model: options.model });
    var guiFolder = this.gui.addFolder('THREE.JS Controls');
    guiFolder.addColor(this.model.attributes, 'Example 1');
    guiFolder.addColor(this.model.attributes, 'Example 2');
    guiFolder.addColor(this.model.attributes, 'Example 3');
    guiFolder.add(this.model.attributes, 'Show Helpers');
  }
}
