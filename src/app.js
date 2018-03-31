// External libs
import $ from 'jQuery';
// Models
import ImageTracerControlsModel from './app/models/controls/ImageTracerControlsModel.js';
import PotraceControlsModel from './app/models/controls/PotraceControlsModel.js';
import ThreeControlsModel from './app/models/controls/ThreeControlsModel.js';
import MainCanvasModel from './app/models/MainCanvasModel.js';
import ThreeCanvasModel from './app/models/ThreeCanvasModel.js';
// Views
import ImageTracerControlsView from './app/views/controls/ImageTracerControlsView.js';
import PotraceControlsView from './app/views/controls/PotraceControlsView.js';
import ThreeControlsView from './app/views/controls/ThreeControlsView.js';
import ThreeCanvasView from './app/views/ThreeCanvasView.js';
import AppView from './app/views/AppView.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    this.models = {
      controls: {
        imagetracer: new ImageTracerControlsModel(),
        potrace: new PotraceControlsModel(),
        three: new ThreeControlsModel()
      },
      mainCanvas: new MainCanvasModel(),
      threeCanvas: new ThreeCanvasModel()
    };
    // this.views = {
    //   controls: {
    //     imagetracer: new ImageTracerControlsView({ model: this.models.controls.imagetracer }),
    //     potrace: new PotraceControlsView({ model: this.models.controls.potrace }),
    //     three: new ThreeControlsView({ model: this.models.controls.three })
    //   },
    //   threeCanvas: new ThreeCanvasView({ model: this.models.threeCanvas })
    // };
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;
});
