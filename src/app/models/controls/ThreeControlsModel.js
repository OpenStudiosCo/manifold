import BaseModel from '../BaseModel.js';

/**
  * Three Controls model.
  */

export default class ThreeControlsModel extends BaseModel {
  defaults() {
    var controls = {
      'Example 1': "#ffae23",
      'Example 2': "#ae23ff",
      'Example 3': "#23ffae",
      'Show Helpers': true
    };
    
    return controls;
  }
}
