import Potrace from 'Potrace';
import $ from 'jQuery';

/**
   * Potrace method
   * 
   * Credit - https://github.com/kilobtye/potrace
  **/

var potraceConfig;

// Setup Potrace controls.
export function init_potrace(gui) {
  var potraceControls = gui.addFolder('Potrace Controls');
  potraceConfig = {
    alphamax: 1,
    optcurve: false,
    opttolerance: 0.2,
    turdsize: 2,
    turnpolicy: "minority"
  };
  for (var controlName in potraceConfig) {
    var callback = function() {
      $('#potrace-preview').html('<div class="ui active centered inline loader"></div>');
      // Wait 100ms so the loader can appear.
      setTimeout(potrace, 100);
    };
    // Choose from accepted values
    if (controlName == 'turnpolicy') {
      potraceControls.add(potraceConfig, 'turnpolicy', [ 'black', 'white', 'left', 'right', 'minority', 'majority' ] )
        .onFinishChange(callback);  
    }
    else {
      if (isNaN(potraceConfig[controlName])) {
        potraceControls.add(potraceConfig, controlName)
          .onFinishChange(callback);
      }
      else {
        var max = potraceConfig[controlName] * 2;
        max = (max > 0) ? max : 100;
        potraceControls.add(potraceConfig, controlName, 0, max)
          .onFinishChange(callback);
      }
    }
  }
}
// Setup Potrace controls.
export function potrace() {
  Potrace.clear();
  Potrace.setParameter(potraceConfig);
  Potrace.loadImageFromId('original-image');
  Potrace.process(function(){
    var svgdiv = document.getElementById('potrace-preview');
    svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
  });
}