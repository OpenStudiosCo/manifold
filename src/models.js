import Integration from './models/integration.js';
import UI from './models/ui.js';

/**
  * Model definitions.
  */

export default class Models {
	constructor() {
		this.integration = new Integration();
		this.ui = new UI();
	}
}
