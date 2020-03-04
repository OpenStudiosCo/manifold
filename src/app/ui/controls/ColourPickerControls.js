import $ from 'jQuery';
import BaseControls from './BaseControls.js';

/**
  * Colour picker model for the main canvas.
  * Credit - https://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
  */

var app = {};
export default class ColourPickerControls extends BaseControls {
  constructor(appInstance) {
    app = appInstance;
    super();
    var el = document.getElementById('colour-picker');
    if (!el) {
      return;
    }

    this.canvas = el.getContext('2d');
    // create an image object and get it’s source
    var img = new Image();
    img.onload = function(){
      this.canvas.drawImage(img,0,0);
    }.bind(this);
    img.src = '/assets/spectrum.jpg';
    this.canvas.scale(0.49, 0.4);

    $('#fill-tool').draggable({ cancel: "#colour-picker, #colour-picker-preview input" });

    var mouseDown = false;
    $('#colour-picker').on('mousedown', function(event){
      mouseDown = true;
      this.pickColour(event);
    }.bind(this));
    $('#colour-picker').on('mousemove', function(event){
      if (mouseDown) {
        this.pickColour(event);
      }
    }.bind(this));
    $('#colour-picker').on('mouseup', function(){
      mouseDown = false;
    });
     
  }

  lookupAndSetColour(colour) {
    var ctx, cvs;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, 1, 1);
    var c = ctx.getImageData(0, 0, 1, 1).data;
    this.setColour(c[0], c[1], c[2]);
  }

  setColour(R,G,B) {
    var rgb = R + ', ' + G + ', ' + B;
    // convert RGB to HEX
    var hex = this.rgbToHex(R,G,B);
    // making the color the value of the input
    $('input#rgb').val(rgb);
    $('input#hex').val('#' + hex);
    $('#colour-picker-preview').css('background-color', '#' + hex);

    if (app.fabric.model.canvas) {
      $('#btnFillActive .icon').css('color', '#' + hex);
      app.fabric.model.canvas.getActiveObject().set("fill", '#' + hex);
      app.fabric.model.canvas.renderAll();
    }
  }

  // http://www.javascripter.net/faq/rgbtohex.htm
  rgbToHex(R,G,B) {
   return this.toHex(R)+this.toHex(G)+this.toHex(B); 
  }

  toHex(m) {
    var n = parseInt(m,10);
    if (isNaN(n)) {
     return "00";
    }
    n = Math.max(0,Math.min(n,255));
    
    return "0123456789ABCDEF".charAt((n-(n%16))/16) + "0123456789ABCDEF".charAt(n%16);
  }

  pickColour(event) {
    // getting user coordinates
    var x = event.offsetX;
    var y = event.offsetY;
    // getting image data and RGB values
    var img_data = this.canvas.getImageData(x, y, 1, 1).data;
    var R = img_data[0];
    var G = img_data[1];
    var B = img_data[2];
    this.setColour(R, G, B);
  }

}
