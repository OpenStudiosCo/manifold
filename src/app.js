// External libs
import $ from 'jQuery';
// @TODO: update as part of refactor
import FabricJSIntegration from './app/integrations/FabricJSIntegration.js';
import LayerControls from './app/ui/controls/LayerControls.js';
import ToolbarControls from './app/ui/controls/ToolbarControls.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    // Integrations
    this.fabric = new FabricJSIntegration();
    this.ThreeCanvasModel = [];
    this.ThreeCanvasView = [];

    // UI    
    this.layers = new LayerControls();
    this.toolbar = new ToolbarControls();
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;

  // Run all the ready functions
  for (var classInstance in app) {
    if (app[classInstance].ready) {
      app[classInstance].ready();
    }
  }
});
