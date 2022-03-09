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

    this.playing = false;
    this.currentFrame = 0;
    this.frameLimit = 30;
    this.frames = {};
    this.frameElapsed = 0;
    this.frameLength = 50; // ms per frame.

    this.el.innerHTML = timelineTemplate( {
      frameLimit: this.frameLimit
    } );

    this.el
      .querySelectorAll( 'th, td' ).forEach( ( frame_cell ) => {
        frame_cell.addEventListener( 'click', ( event ) => {
          if ( event.target.dataset.framePosition ) {
            let seekerElement = document.getElementById( "seeker" );
                        
            this.selectFrameByElement( seekerElement, event.target )
            let nextKeyframe = 0;
            let thisKeyframe = 0;
            Object.keys(this.frames).forEach((framePosition)=>{
              // This will keep updating until it stops on the break later.
              if ( parseInt(framePosition) <= parseInt(this.currentFrame) ) {
                thisKeyframe = framePosition;
              }
      
              if ( parseInt(framePosition) > parseInt(this.currentFrame) ) {
                nextKeyframe = framePosition;
                return;
              }
            });

            // If we are on the final keyframe, flip the values as the stored keyframe value is the final number.
            if (parseInt(nextKeyframe) < parseInt(thisKeyframe)) {
              nextKeyframe = [thisKeyframe, thisKeyframe = nextKeyframe][0]; // https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
            }
            // Move objects on the canvas.
            app.fabric.model.canvas.getObjects().map( object => {
              
              let props = ['left', 'top'];
              props.forEach( prop => {

                let propChange = this.frames[nextKeyframe][0][prop] - this.frames[thisKeyframe][0][prop];
                let numberOfFrames = nextKeyframe - thisKeyframe;
                let propIteration = propChange * (this.currentFrame / numberOfFrames) ;

                object.set(prop, parseInt(this.frames[thisKeyframe][0][prop] + propIteration, 10)).setCoords();
              });

            });
            app.fabric.model.canvas.requestRenderAll();
            
          }
        } );
      } );

    // Make the DIV element draggable.
    this.setupSeeker( document.getElementById( "seeker" ) );

    // Select the first frame.
    this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="0"]') );

    // Play button.
    $('#timeline #play')
      .on('click', () => {
        // Toggle the icon
        let $icon = $('#timeline #play i');
        if ($icon.hasClass('play')) {
          $icon.removeClass('play');
          $icon.addClass('pause');
          this.playing = performance.now();
        }
        else {
          $icon.addClass('play');
          $icon.removeClass('pause');
          this.playing = false;
        }
      })
    
  }

  // Determines whether or not to execute actions this loop.
  animate (timestamp) {
    if (this.playing) {
      this.frameElapsed += timestamp - this.playing;

      // Check how many keyframes to play after this tween.
      let nextKeyframe = 0;
      let thisKeyframe = 0;
      Object.keys(this.frames).forEach((framePosition)=>{
        // This will keep updating until it stops on the break later.
        if (framePosition <= this.currentFrame ) {
          thisKeyframe = framePosition;
        }

        if (framePosition > this.currentFrame) {
          nextKeyframe = framePosition;
          return;
        }
      });
      console.log(this.currentFrame, nextKeyframe, thisKeyframe);
      // Loop back if no frames left.
      if (nextKeyframe == 0) {
        this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="0"]') );
      }

      // Iterate Frames if enough time has passed
      if (this.frameElapsed >= this.frameLength) {
        this.currentFrame = parseInt(this.currentFrame + 1);
        this.frameElapsed = 0;

        // Modify the timeline UI controls
        let seekerElement = document.getElementById( "seeker" );
        let targetElement = document.querySelector('td[data-frame-position="' + this.currentFrame + '"]');
        let framePosition = targetElement.getBoundingClientRect();
        seekerElement.style.left = ( framePosition.left ) + "px";
        seekerElement.style.width = ( 1 + framePosition.right - framePosition.left ) + "px";

        
        // Move objects on the canvas.
        app.fabric.model.canvas.getObjects().map( object => {
          let props = ['left', 'top'];
          props.forEach( prop => {
            let propChange = this.frames[nextKeyframe][0][prop] - this.frames[thisKeyframe][0][prop];
            let numberOfFrames = nextKeyframe - thisKeyframe;
            let propIteration = propChange * ( this.currentFrame / numberOfFrames);

            object.set(prop, parseInt(this.frames[thisKeyframe][0][prop] + propIteration, 10)).setCoords();
          });

        });

      }
      app.fabric.model.canvas.requestRenderAll();
      this.playing = performance.now();  

    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  ready () {
    // Initialise frame 0
    this.frames[this.currentFrame] = JSON.parse(JSON.stringify(app.fabric.model.canvas.getObjects()))

    // Animation demo
    // 1. Select frame 10
    this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="10"]') );
    app.fabric.model.canvas.getObjects().map( object => {
      object.set('left', parseInt(object.left + 400, 10)).setCoords();
      object.set('top', parseInt(object.top + 200, 10)).setCoords();

      this.frames[this.currentFrame] = JSON.parse(JSON.stringify(app.fabric.model.canvas.getObjects()))
      console.log('Modified frame #' , this.currentFrame);
      console.log(this.frames);
    });

    // Make the 10th frame active
    document.querySelector('td[data-frame-position="10"]').classList.add('active')

    // Handle changes to the canvas.
    app.fabric.model.canvas.on( 'history:append' , (json) => {
      
    });

    this.animate(performance.now());
  }

  addKeyFrame( frameIndex ) {
    console.log( 'Added ', frameIndex );
  }

  selectFrameByElement( seekerElement, targetElement ) {
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
          self.selectFrameByElement( seekerElement, closestElement );
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
