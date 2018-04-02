// External libs
import $ from 'jQuery';
// Models
import ImageTracerControlsModel from './app/models/controls/ImageTracerControlsModel.js';
import MainCanvasModel from './app/models/MainCanvasModel.js';
import ThreeCanvasModel from './app/models/ThreeCanvasModel.js';
// Views
import ImageTracerControlsView from './app/views/controls/ImageTracerControlsView.js';
import MainCanvasView from './app/views/MainCanvasView.js';
import ThreeCanvasView from './app/views/ThreeCanvasView.js';
import AppView from './app/views/AppView.js';

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
