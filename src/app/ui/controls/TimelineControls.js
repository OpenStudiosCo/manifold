import $ from 'jQuery';
import BaseControls from './BaseControls.js';
import timelineTemplate from '../../../templates/footer/timeline.pug';

/**
  * Timeline controls
  */

var app = {};
export default class TimelineControls extends BaseControls {
  constructor( appInstance ) {
    app = appInstance;
    super();

    this.el = document.getElementById( 'timeline' );
    if ( !this.el ) {
      return;
    }
    
    this.frameLimit = 30;

    this.el.innerHTML = timelineTemplate({
      frameLimit: this.frameLimit
    });

    this.el
      .querySelectorAll( 'td.selectable' ).forEach(function( frame_cell ) {
        frame_cell.addEventListener( 'click', function ( e ) {
          alert('hiii');
        } );
      } );
    
  }

}
