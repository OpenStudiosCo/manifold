import BaseModel from '../BaseModel.js';

/**
  * Colour picker model for the main canvas.
  * Credit - https://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
  */

export default class ColourPickerModel extends BaseModel {
  defaults() {
    var settings = {
      color: '#FFFFFF'
    };

    return settings;
  }

  constructor() {
    super();
    var canvas = document.getElementById('colour-picker').getContext('2d');
    // create an image object and get it’s source
    var img = new Image();
    img.onload = function(){
      canvas.drawImage(img,0,0);
    };
    img.src = '/assets/spectrum.jpg';
    canvas.scale(0.49, 0.4);

    $('#fill-tool').draggable({ cancel: "#colour-picker, #colour-picker-preview input" });

    $('#colour-picker').on('click drag', function(event){

      // http://www.javascripter.net/faq/rgbtohex.htm
      function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

      function toHex(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
      }

      // getting user coordinates
      var x = event.offsetX;
      var y = event.offsetY;
      // getting image data and RGB values
      var img_data = canvas.getImageData(x, y, 1, 1).data;
      var R = img_data[0];
      var G = img_data[1];
      var B = img_data[2];  var rgb = R + ', ' + G + ', ' + B;
      // convert RGB to HEX
      var hex = rgbToHex(R,G,B);
      // making the color the value of the input
      $('input#rgb').val(rgb);
      $('input#hex').val('#' + hex);
      $('#colour-picker-preview').css('background-color', '#' + hex);
    });
  }

}