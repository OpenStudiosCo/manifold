import $ from 'jQuery';
import ImageTracerView from './views/imagetracer.js';
import PotraceView from './views/potrace.js';
import ThreeView from './views/three.js';

/**
 * Manifold Browser Application
 */
$(function() {
  var itv = new ImageTracerView();
  console.log(itv);

  var ptv = new PotraceView();
  console.log(ptv);

  var ttv = new ThreeView();
  console.log(ttv);
});
