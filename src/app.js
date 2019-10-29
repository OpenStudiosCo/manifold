// External libs
import $ from 'jQuery';
// @TODO: update as part of refactor
import FabricJSIntegration from './app/integrations/FabricJSIntegration.js';
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
    this.toolbar = new ToolbarControls();
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;
});
