import Backbone from 'Backbone';
import dat from 'dat';

/**
  * Base view.
  */

var gui = new dat.GUI();

export default class BaseView extends Backbone.View {
	constructor(options) {
		this.gui = gui;
    super(options);
	}
}
