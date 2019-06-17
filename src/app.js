// External libs
import $ from 'jQuery';
// @TODO: update as part of refactor
import FabricJSIntegration from './app/integrations/FabricJSIntegration.js';

/**
 * Manifold Browser Application
 */
export default class App {
  constructor() {
    this.fabric = new FabricJSIntegration();
  }
}

// Startup using jQuery.ready()
$(() => {
  var app = new App();
  window.app = app;
});
