/**
 * Manifold Browser Application
**/
;( function( $, THREE, window, document ) {

  $(document).ready(function() {
    var gui = new dat.GUI();

    $('.js-change-image').click(function(){
      $('#original-image').attr('src', $(this).find('img').attr('src'));
      change();
      changePotrace();
    });
    /**
     * imagetracerjs method
     * 
     * Credit - https://github.com/jankovicsandras/imagetracerjs
    **/
    var controls = ImageTracer.checkoptions();
    controls.numberofcolors = 2;
    controls.strokewidth = 1;
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

    var imagetracerControls = gui.addFolder('imagetracerjs Controls');
    for (var controlName in controls) {
      var callback = function() {
        $('#svg-preview').html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(change, 100);
      };
      if (isNaN(controls[controlName])) {
        imagetracerControls.add(controls, controlName)
          .onFinishChange(callback);
      }
      else {
        var max = controls[controlName] * 2;
        max = (max > 0) ? max : 100;
        imagetracerControls.add(controls, controlName, 0, max)
          .onFinishChange(callback);
      }
    }

    change();

    /**
     * imagetracerjs method
     * 
     * Credit - https://github.com/kilobtye/potrace
    **/
    var potraceControls = gui.addFolder('Potrace Controls');
    var potraceConfig = {
      alphamax: 1,
      optcurve: true,
      opttolerance: 0.2,
      turdsize: 2,
      turnpolicy: "minority"
    };
    var changePotrace = function() {
      Potrace.clear();
      Potrace.setParameter(potraceConfig);
      Potrace.loadImageFromId('original-image');
      Potrace.process(function(){
        var svgdiv = document.getElementById('potrace-preview');
        svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
      });
    };

    for (var controlName in potraceConfig) {
      var callback = function() {
        $('#potrace-preview').html('<div class="ui active centered inline loader"></div>');
        // Wait 100ms so the loader can appear.
        setTimeout(changePotrace, 100);
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
    changePotrace();

    /**
     * Three.JS integration
     *
     * Need feature request - https://github.com/mrdoob/three.js/issues/13478
    **/
    var threeControls = gui.addFolder('THREE.JS Controls');
    $('button.fluid.ui.button').click(function() {
      // Setup the model scene.
      var $container = $('#model-preview');
      var scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xb0b0b0 );
      var width = $container.parent().innerWidth();
      var height = 400;
      window.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 );
      camera.position.set( 0, 0, 200 );
      camera.lookAt( 0, 0, 0 );
      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( width, height );
      $container.html( renderer.domElement );

      var controls = new THREE.OrbitControls( camera, renderer.domElement );
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
      function render() {
        renderer.render( scene, camera );
      }

      // Load the SVG from the svg-preview.
      var loader = new THREE.SVGLoader();
      var paths = loader.parse($('#potrace-preview').html());
      var group = new THREE.Group();
      group.scale.multiplyScalar( 0.1 );
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

      var helper = new THREE.GridHelper( 160, 10 );
      helper.rotation.x = Math.PI / 2;
      scene.add( helper );
      animate();
    });
  });

} )( jQuery, THREE, window, document );