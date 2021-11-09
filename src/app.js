// External libs
import $ from 'jQuery';
// @TODO: update as part of refactor
import FabricJSIntegration from './app/integrations/FabricJSIntegration.js';
import DropEvents from './app/events/DropEvents.js';
import LayerControls from './app/ui/controls/LayerControls.js';
import ToolbarControls from './app/ui/controls/ToolbarControls.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    // Integrations
    this.fabric = new FabricJSIntegration(this);
    this.ThreeCanvasModel = [];
    this.ThreeCanvasView = [];

    // Events
    this.events = {};
    this.events.drop = new DropEvents(this);

    // UI    
    this.layers = new LayerControls(this);
    this.toolbar = new ToolbarControls(this);
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();

  // Run all the ready functions
  for (var classInstance in app) {
    if (app[classInstance].ready) {
      app[classInstance].ready();
    }
  }
});
