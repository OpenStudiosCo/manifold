// External libs
import $ from 'jQuery';
// Models
import MainCanvasModel from './app/models/MainCanvasModel.js';
import ThreeCanvasModel from './app/models/ThreeCanvasModel.js';
// Views
import MainCanvasView from './app/views/MainCanvasView.js';
import ThreeCanvasView from './app/views/ThreeCanvasView.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    this.models = {
      mainCanvas: new MainCanvasModel(),
      threeCanvas: new ThreeCanvasModel()
    };
    this.views = {
      mainCanvas: new MainCanvasView({ model: this.models.mainCanvas }),
      threeCanvas: new ThreeCanvasView({ model: this.models.threeCanvas })      
    };
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;
});
