// External libs
import $ from 'jQuery';
// Models
import ImageTracerControls from './models/controls/imagetracer.js';
import PotraceControls from './models/controls/potrace.js';
import ThreeControls from './models/controls/three.js';
// Views
import ImageTracerView from './views/imagetracer.js';
import PotraceView from './views/potrace.js';
import ThreeView from './views/three.js';
import AppUI from './views/ui.js';

/**
 * Manifold Browser Application
 */
$(() => {
  var imageTracerView = new ImageTracerView({ model: new ImageTracerControls() });

  var potraceView = new PotraceView({ model: new PotraceControls() });

  var threeView = new ThreeView({ model: new ThreeControls() });

  var appUI = new AppUI(imageTracerView, potraceView, threeView);
  console.log(appUI);
});
