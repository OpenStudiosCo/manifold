import paper from 'paper';
import $ from 'jQuery';
import BaseModel from '../BaseModel.js';

/**
  * Shape Finder model.
  * 
  * Integrates Paper JS Boolean operations.
  */

export default class ShapeFinderModel extends BaseModel {
  constructor(){
    super();
    var canvas = document.getElementById('main-canvas');
    paper.setup(canvas);
  }

  flatten(svgElements) {
    var canvas = document.createElement('canvas');
    paper.setup(canvas);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + svgElements + '</svg>';
    var paths = paper.project.importSVG(svg);
    console.log(paths);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    $('#container').append(canvas);
  }
}
