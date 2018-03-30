import $ from 'jQuery';
import { init_potrace, potrace } from './integration/potrace.js';
import { init_three } from './integration/three.js';
import { init_ui } from './ui.js';
import ImageTracerView from './views/imagetracer.js';


/**
 * Manifold Browser Application
 */
$(function() {
  new ImageTracerView();

  // Setup Potrace controls and run.
  //init_potrace(gui);
  //potrace();

  // Setup Three.JS controls.
  //init_three(gui);
});
