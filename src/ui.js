import dat from 'dat';
import $ from 'jQuery';
import { imagetracer } from './integration/imagetracer.js';
import { potrace } from './integration/potrace.js';

export function init_ui() {  

  $('#image_select').click(function(e){
    $('#image_input').click();
    e.preventDefault();
  });

  window.URL = window.URL || window.webkitURL || window.mozURL;
  $('#image_input').change(function(){
    var url = URL.createObjectURL(this.files[0]);
    $('<div class="item"><div class="ui white compact button js-change-image"><div class="ui fluid image mini"><img src="' + url + '" /></div></div></div>')
      .insertBefore('.ui.inverted.top.fixed.menu .item:last-child');
  });

  $('.ui.inverted.top.fixed.menu').on('click', '.js-change-image', function(){
    $('#original-image').attr('src', $(this).find('img').attr('src'));
    $('#svg-preview, #potrace-preview').html('<div class="ui active centered inline loader"></div>');
    var callback = function(){
      imagetracer();
      potrace();
    };
    setTimeout(callback, 100);
  });

  return new dat.GUI();
}