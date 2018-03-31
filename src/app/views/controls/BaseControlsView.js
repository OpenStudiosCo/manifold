import BaseView from '../BaseView.js';
import loader from '../../../templates/loader.pug';

/**
  * Base Controls view.
  */

//var gui = new dat.GUI();

export default class BaseControlsView extends BaseView {
  constructor(options) {
    super(options);
    this.gui = gui;

    return this;
  }

  generateControls(title) {
    var guiFolder = this.gui.addFolder(title);
    for (var controlName in this.model.attributes) {
      var callback = function() {
        this.$el.html(loader());
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
  }
}
