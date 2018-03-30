import BaseModel from '../base.js';

/**
  * Three Controls model.
  */

export default class ThreeControls extends BaseModel {
  defaults() {
    var controls = {
      'Example 1': "#ffae23",
      'Example 2': "#ae23ff",
      'Example 3': "#23ffae"
    };
    
    return controls;
  }
}
