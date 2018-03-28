import $ from 'jQuery';
import dat from 'dat';
import { init_imagetracer, imagetracer } from './app/imagetracer.integration.js';
import { init_potrace, potrace } from './app/potrace.integration.js';
import { init_three } from './app/three.integration.js';

/**
 * Manifold Browser Application
 */

$(document).ready(function() {
  var gui = new dat.GUI();

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

  // Setup imagetracer controls and run.
  init_imagetracer(gui);
  imagetracer();

  // Setup Potrace controls and run.
  init_potrace(gui);
  potrace();

  // Setup Three.JS controls.
  init_three(gui);

});
