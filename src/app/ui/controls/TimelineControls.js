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
    this.frames = [];


    this.el.innerHTML = timelineTemplate({
      frameLimit: this.frameLimit
    });

    // this.el
    //   .querySelectorAll( 'td.selectable' ).forEach(( frame_cell ) => {
    //     frame_cell.addEventListener( 'click', ( event ) => {
    //       event.target.classList.add('active');
    //       this.addKeyFrame( event.target.dataset.framePosition );
    //     } );
    //   } );

    // Make the DIV element draggable:
    setupSeeker(document.getElementById("seeker"));

    function setupSeeker(elmnt) {
      var rect = elmnt.getBoundingClientRect();
      console.log(rect.top, rect.right, rect.bottom, rect.left);


      let originalOffset = elmnt.offsetLeft;
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        //elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        let closestElements = document.elementsFromPoint(elmnt.offsetLeft, rect.top);
        let matched = false;
        closestElements.forEach((closestElement) => {
          if ( closestElement.tagName == 'TH' && closestElement.dataset.framePosition ) {
            let framePosition = closestElement.getBoundingClientRect();
            elmnt.style.left = (framePosition.left) + "px";
            elmnt.style.width = (1 + framePosition.right - framePosition.left) + "px"; 
            matched = true;
            console.log(matched);
          }
        });
        if ( !matched ) {
          elmnt.style.left = originalOffset + "px";
        }
      
      }
    }
  }

  addKeyFrame ( frameIndex ) {
    console.log('Added ', frameIndex);
  }

}
