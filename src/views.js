import ImageTracerView from './views/imagetracer.js';
import UI from './views/ui.js';

/**
  * View definitions.
  */

export default class Views {
	constructor() {
		this.imagetracer = new ImageTracerView();
		this.ui = new UI();
	}
}
