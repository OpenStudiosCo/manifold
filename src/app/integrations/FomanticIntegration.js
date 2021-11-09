// External libs
import $ from 'jQuery';
import BaseIntegration from './BaseIntegration.js';

/**
  * Fomantic Integration
  */

export default class FomanticIntegration extends BaseIntegration {
  constructor() {   
    super();
  }

  ready() {  
    $('.ui.accordion').accordion({
      exclusive: false
    });
    $('.ui.dropdown').dropdown();
    $('.floating.overlay').draggable();
  }

}
