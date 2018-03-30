import $ from 'jQuery';
import ImageTracerView from './views/imagetracer.js';
import PotraceView from './views/potrace.js';
import ThreeView from './views/three.js';
import AppUI from './views/ui.js';

/**
 * Manifold Browser Application
 */
$(() => {
  var imageTracerView = new ImageTracerView();
  console.log(imageTracerView);

  var potraceView = new PotraceView();
  console.log(potraceView);

  var threeView = new ThreeView();
  console.log(threeView);

  var appUI = new AppUI(imageTracerView, potraceView, threeView);
  console.log(appUI);
});
