import $ from 'jQuery';
import { init_imagetracer, imagetracer } from './integration/imagetracer.js';
import { init_potrace, potrace } from './integration/potrace.js';
import { init_three } from './integration/three.js';
import { init_ui } from './ui.js';

/**
 * Manifold Browser Application
 */
$(function() {
  // Setup UI.
  var gui = init_ui();

  // Setup imagetracer controls and run.
  init_imagetracer(gui);
  imagetracer();

  // Setup Potrace controls and run.
  init_potrace(gui);
  potrace();

  // Setup Three.JS controls.
  init_three(gui);
});
