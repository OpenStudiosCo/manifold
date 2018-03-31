import BaseModel from '../BaseModel.js';

/**
  * Potrace Controls model.
  */

export default class PotraceControlsModel extends BaseModel {
  defaults() {
    var controls = {
      alphamax: 1,
      optcurve: false,
      opttolerance: 0.2,
      turdsize: 2,
      turnpolicy: "minority"
    };
    
    return controls;
  }
}
