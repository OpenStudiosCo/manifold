;( function( $, THREE, window, document ) {

  $(document).ready(function() {
    var controls = ImageTracer.checkoptions();
    controls.ltres = 0.1;
    controls.qtres = 1;
    controls.strokewidth = 5;
    controls.viewbox = true;

    var change = function() {
      $('#svgcontainer').html('<div class="ui active centered inline loader">Loading</div>');
      ImageTracer.imageToSVG(
        '/demo.jpg',
        function(svgstr) {
          $('#svgcontainer').html('');
          ImageTracer.appendSVGString( svgstr, 'svgcontainer' );
        },
        controls
      );
    };

    var gui = new dat.GUI();
    for (var controlName in controls) {
      if (isNaN(controls[controlName])) {
        gui.add(controls, controlName)
          .onFinishChange(function(){ change(); });
      }
      else {
        var max = controls[controlName] * 2;
        gui.add(controls, controlName, 0, max)
          .onFinishChange(function(){ change(); });
      }
    }

    change();
  });

} )( jQuery, THREE, window, document );