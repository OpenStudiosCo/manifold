import BaseModel from '../BaseModel.js';
import { checkoptions } from 'ImageTracer';

/**
  * Imagetracer Controls model.
  */

export default class ImageTracerControlsModel extends BaseModel {
  defaults() {
    var controls = checkoptions();
    controls.numberofcolors = 2;
    controls.strokewidth = 1;
    controls.viewbox = true;

    return controls;
  }

}
