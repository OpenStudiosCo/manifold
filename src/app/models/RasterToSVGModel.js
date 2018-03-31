import BaseModel from './BaseModel.js';

/**
  * Raster To SVG model.
  */

export default class RasterToSVGModel extends BaseModel {
  defaults() {
    var attributes = {
      conversion_methods: [ 'imagetracer', 'potrace' ],
      active_method: 'potrace',
      canvas: null
    };
    
    return attributes;
  }

  constructor() {
    this.attributes.canvas = document.createElement('canvas');
  }
}
