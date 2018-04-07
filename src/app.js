// External libs
import $ from 'jQuery';
// Models
import MainCanvasModel from './app/models/MainCanvasModel.js';
import ThreeCanvasModel from './app/models/ThreeCanvasModel.js';
// Views
import MainCanvasView from './app/views/MainCanvasView.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    this.models = {
      mainCanvas: new MainCanvasModel(),
      threeCanvas: []
    };
    this.views = {
      mainCanvas: new MainCanvasView({ model: this.models.mainCanvas }),
      threeCanvas: []
    };
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;
});
