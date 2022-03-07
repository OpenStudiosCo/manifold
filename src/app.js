// External libs
import $ from 'jQuery';
// @TODO: update as part of refactor
import FabricJSIntegration from './app/integrations/FabricJSIntegration.js';
import FomanticIntegration from './app/integrations/FomanticIntegration.js';
import DropEvents from './app/events/DropEvents.js';
import KeyEvents from './app/events/KeyEvents.js';
import LayerControls from './app/ui/controls/LayerControls.js';
import LibraryControls from './app/ui/controls/LibraryControls.js';
import TimelineControls from './app/ui/controls/TimelineControls.js';
import ToolbarControls from './app/ui/controls/ToolbarControls.js';
import VectorControls from './app/ui/controls/VectorControls.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    // Integrations
    this.fabric = new FabricJSIntegration(this);
    this.fomantic = new FomanticIntegration(this);
    this.ThreeCanvasModel = [];
    this.ThreeCanvasView = [];

    // Events
    this.events = {};
    this.events.drop = new DropEvents(this);
    this.events.key = new KeyEvents(this);

    // UI    
    this.layers = new LayerControls(this);
    this.library = new LibraryControls(this);
    this.timeline = new TimelineControls(this);
    this.toolbar = new ToolbarControls(this);
    this.vector = new VectorControls(this);
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
