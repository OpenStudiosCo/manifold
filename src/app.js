;( function( $, THREE, window, document ) {

  $(document).ready(function() {
    var controls = ImageTracer.checkoptions();
    controls.colorsampling = 0;
    controls.strokewidth = 5;
    controls.viewbox = true;

    var change = function() {
      // Duplicate the img programatically so we can get its original dimensions.
      var original_image = document.getElementById('original-image');
      var img = document.createElement('img');
      img.src = original_image.src;
      
      // Get the image data from a virtual canvas.
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext('2d');
      context.drawImage(img,0,0);
      var imgData = context.getImageData(0, 0, img.width, img.height);

      // Create an SVG from data and settings, draw to screen.
      var svgStr = ImageTracer.imagedataToSVG(imgData, controls);
      $('#svg-preview').html('');
      ImageTracer.appendSVGString( svgStr, 'svg-preview' );
    };

    var gui = new dat.GUI();
    for (var controlName in controls) {
      var callback = function() {
        $('#svg-preview').html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(change, 100);
      };
      if (isNaN(controls[controlName])) {
        gui.add(controls, controlName)
          .onFinishChange(callback);
      }
      else {
        var max = controls[controlName] * 2;
        max = (max > 0) ? max : 100;
        gui.add(controls, controlName, 0, max)
          .onFinishChange(callback);
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