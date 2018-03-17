;( function( $, THREE, window, document ) {

  $(document).ready(function() {
    ImageTracer.imageToSVG(
      '/demo.jpg',
      function(svgstr){ ImageTracer.appendSVGString( svgstr, 'svgcontainer' ); },
      'Posterized2'
    );
  });

} )( jQuery, THREE, window, document );