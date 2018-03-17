;( function( $, THREE, window, document ) {

  $(document).ready(function() {
    var controls = ImageTracer.checkoptions();
    controls.colorsampling = 0;
    controls.strokewidth = 5;
    controls.viewbox = true;

    var change = function() {
      $('#svg-preview').html('<div class="ui active centered inline loader">Loading</div>');
      ImageTracer.imageToSVG(
        '/demo.jpg',
        function(svgstr) {
          $('#svg-preview').html('');
          ImageTracer.appendSVGString( svgstr, 'svg-preview' );
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

    $('button.fluid.ui.button').click(function() {
      var $container = $('#model-preview');
      var scene = new THREE.Scene();
      var width = $container.parent().innerWidth();
      var height = 400;
      window.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 );
      camera.position.set( 20, 20, 20 );
      camera.lookAt( 0, 0, 0 );
      var renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize( width, height );
      $container.html( renderer.domElement );

      var loader = new THREE.SVGLoader();
      var paths = loader.parse($('#svg-preview').html());
      var group = new THREE.Group();
      group.scale.multiplyScalar( 10.1 );
      group.scale.y *= -1;
      for ( var i = 0; i < paths.length; i ++ ) {
        var path = paths[ i ];
        var material = new THREE.MeshBasicMaterial( {
          color: Math.random() * 0xffffff,
          polygonOffset: true,
          polygonOffsetUnits: - i
        } );
        var shapes = path.toShapes( true );
        for ( var j = 0; j < shapes.length; j ++ ) {
          var shape = shapes[ j ];
          var geometry = new THREE.ShapeBufferGeometry( shape );
          var mesh = new THREE.Mesh( geometry, material );
          group.add( mesh );
        }
      }
      scene.add( group );
      var box = new THREE.BoxHelper( group, 0xffff00 );
      scene.add( box );

      var axesHelper = new THREE.AxesHelper( 5 );
      scene.add( axesHelper );

      var controls = new THREE.OrbitControls( camera, renderer.domElement );
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
      function render() {
        renderer.render( scene, camera );
      }
      animate();
    });
  });

} )( jQuery, THREE, window, document );