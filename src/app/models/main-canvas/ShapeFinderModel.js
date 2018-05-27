import Path from 'paper';
import $ from 'jQuery';
import BaseModel from '../BaseModel.js';

/**
  * Shape Finder model.
  * 
  * Integrates Paper JS Boolean operations.
  */

export default class ShapeFinderModel extends BaseModel {
  flatten(svgData) {
    var svg = {
      header: 'data:image/svg+xml',
      content: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + svgData + '</svg>'
    };
    var canvas = document.createElement('canvas');
    var image = new Image();
    var context = canvas.getContext('2d');
    image.onload = function() {
      context.drawImage(image, 0, 0);
      var horizontalScan = [];
      for (var yPos = 0; yPos < canvas.height; yPos++) {
        var horizontalScanRaw = context.getImageData(0, yPos, canvas.width, 1);
        context.fillStyle = 'blue';
        for (var i = 0; i < horizontalScanRaw.data.length; i+=3) {
          if (horizontalScanRaw.data[i] > 0) {
            context.fillRect((i / 4) % canvas.width, yPos, 1, 1);
            horizontalScan.push((i / 4) % canvas.width);
          }
        }
      }
      console.log(horizontalScan);  
    };
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    image.src = svg.header + ',' + svg.content;
    $('#container').append(canvas);
    console.log(Path);
  }
}
