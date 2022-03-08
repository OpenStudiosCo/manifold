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

    this.currentFrame = 0;
    this.frameLimit = 30;
    this.frames = {};
    this.animation = false;

    this.el.innerHTML = timelineTemplate( {
      frameLimit: this.frameLimit
    } );

    this.el
      .querySelectorAll( 'th, td' ).forEach( ( frame_cell ) => {
        frame_cell.addEventListener( 'click', ( event ) => {
          if ( event.target.dataset.framePosition ) {
            let seekerElement = document.getElementById( "seeker" );
            this.selectFrame( seekerElement, event.target )
          }
        } );
      } );

    // Make the DIV element draggable.
    this.setupSeeker( document.getElementById( "seeker" ) );

    // Select the first frame.
    this.selectFrame ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="0"]') );
    
  }

  ready () {
    // Initialise frame 0
    this.frames[this.currentFrame] = JSON.parse(JSON.stringify(app.fabric.model.canvas.getObjects()))

    // Animation demo
    // 1. Select frame 10
    this.selectFrame ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="10"]') );
    console.log(this.frames[0][0].left);
    app.fabric.model.canvas.getObjects().map( object => {
      object.set('left', parseInt(object.left + 200, 10)).setCoords();
      object.set('top', parseInt(object.top + 200, 10)).setCoords();

      this.frames[this.currentFrame] = JSON.parse(JSON.stringify(app.fabric.model.canvas.getObjects()))
      console.log('Modified frame #' , this.currentFrame);
      console.log(this.frames);
    });
    console.log(this.currentFrame, this.frames[0][0].left);

    // Make the 10th frame active
    document.querySelector('td[data-frame-position="10"]').classList.add('active')

    // Handle changes to the canvas.
    app.fabric.model.canvas.on( 'history:append' , (json) => {
      
    });
  }

  addKeyFrame( frameIndex ) {
    console.log( 'Added ', frameIndex );
  }

  selectFrame( seekerElement, targetElement ) {
    let framePosition = targetElement.getBoundingClientRect();
    seekerElement.style.left = ( framePosition.left ) + "px";
    seekerElement.style.width = ( 1 + framePosition.right - framePosition.left ) + "px";

    this.currentFrame = targetElement.dataset.framePosition;
  }

  setupSeeker( seekerElement ) {
    let self = this;
    var rect = seekerElement.getBoundingClientRect();

    let initialOffset = 0;
    let initialWidth = 50;

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if ( document.getElementById( seekerElement.id + "header" ) ) {
      // if present, the header is where you move the DIV from:
      document.getElementById( seekerElement.id + "header" ).onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      seekerElement.onmousedown = dragMouseDown;
    }

    function dragMouseDown( e ) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
      seekerElement.classList.add( 'active' );
      initialOffset = seekerElement.offsetLeft;
      initialWidth = seekerElement.offsetWidth;
    }

    function elementDrag( e ) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      //seekerElement.style.top = (seekerElement.offsetTop - pos2) + "px";
      seekerElement.style.left = ( seekerElement.offsetLeft - pos1 ) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      let closestElements = document.elementsFromPoint( seekerElement.offsetLeft, rect.top );
      let matched = false;
      closestElements.forEach( ( closestElement ) => {
        if ( closestElement.tagName == 'TH' && closestElement.dataset.framePosition ) {
          matched = true;
          self.selectFrame( seekerElement, closestElement );
        }
      } );
      if ( !matched ) {

        seekerElement.style.left = initialOffset + "px";
        seekerElement.style.width = initialWidth + "px";
      }

      seekerElement.classList.remove( 'active' );

    }
  }

}
