import $ from 'jQuery';
import THREE from 'THREE';
import $d3g from '$d3g';
import BaseView from './base.js';
import ThreeControls from '../models/controls/three.js';

/**
  * Potrace view.
  *
  * Manages all UI elements relating to Potrace integration.
  */

export default class ThreeView extends BaseView {
  constructor() {
    super({
      el: '#model-preview',
      model: new ThreeControls()
    });
    this.render();
  }

  render() {
    var guiFolder = this.gui.addFolder('THREE.JS Controls');
    guiFolder.addColor(this.model.attributes, 'Example 1');
    guiFolder.addColor(this.model.attributes, 'Example 2');
    guiFolder.addColor(this.model.attributes, 'Example 3');
  }

  createScene() {
    var scene = new THREE.Scene();
    var width = this.$el.parent().innerWidth();
    var height = 400;
    var camera = new THREE.PerspectiveCamera( 50, width / height, 1, 100000 );
    camera.position.set( 0, 0, 400 );
    camera.lookAt( 0, 0, 0 );
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    this.$el.html( renderer.domElement );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    function animate() {
      requestAnimationFrame( animate );
      render();
    }
    function render() {
      controls.update();
      renderer.render( scene, camera );
    }

    var extrudeAmount = 40;
    // Load the potrace SVG using d3-threeD.
    var group = new THREE.Group();
    scene.add( group );
    this.addGeoObject(group, {
      paths: [$('#potrace-preview path').attr('d') + " Z"],
      amounts: [ extrudeAmount ],
      center: { x: width, y: height /2 }
    });
    group.scale.multiplyScalar(0.25);
    group.position.setX(150);

     // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
    var loader = new THREE.SVGLoader();
    var paths = loader.parse($('#svg-preview').html());
    var group2 = new THREE.Group();
    group2.scale.multiplyScalar( 0.25 );
    for ( var i = 0; i < paths.length; i ++ ) {
      var path = paths[ i ];
      var shapes = path.toShapes( true );
      for ( var j = 0; j < shapes.length; j ++ ) {
        var color = new THREE.Color(Math.random() * 0xffffff);
        var material = new THREE.MeshLambertMaterial( {
          color: color,
          emissive: color
        } );
        var simpleShape = shapes[ j ];
        var shape3d = new THREE.ExtrudeBufferGeometry( simpleShape, {
          amount: extrudeAmount * (Math.random() * 10),
          bevelEnabled: false
        } );

        var center = { x: width, y: height /2 };

        var mesh = new THREE.Mesh( shape3d, material );
        mesh.rotation.x = Math.PI;
        mesh.translateZ( - extrudeAmount - 1 );
        mesh.translateX( - center.x );
        mesh.translateY( - center.y );

        group2.add( mesh );
      }
    }
    group2.position.setX(-125);
    scene.add( group2 );

    var size = 2000;
    var divisions = 100;
    var gridColour = new THREE.Color(0xEFEFEF);

    var gridHelper = new THREE.GridHelper( size, divisions, gridColour, gridColour );
    gridHelper.position.setX(-712.5);
    gridHelper.position.setZ(-500);
    gridHelper.rotateX(Math.PI / 2);
    gridHelper.rotateZ(-Math.PI / 4);
    scene.add( gridHelper );

    var gridHelper2 = new THREE.GridHelper( size, divisions, gridColour, gridColour );
    gridHelper2.position.setX(712.5);
    gridHelper2.position.setZ(-500);
    gridHelper2.rotateX(Math.PI / 2);
    gridHelper2.rotateZ(Math.PI / 4);
    scene.add( gridHelper2 );

    var axesHelper = new THREE.AxesHelper( 500 );
    axesHelper.rotateY(-Math.PI / 4);
    axesHelper.position.set(0, -100, -350);
    scene.add( axesHelper );

    animate();
  }
  
  // Adds an object from an SVG.
  addGeoObject( group, svgObject ) {
    var paths = svgObject.paths;
    var amounts = svgObject.amounts;
    var center = svgObject.center;

    for ( var i = 0; i < paths.length; i ++ ) {
      var path = $d3g.transformSVGPath( paths[ i ] );       
      var amount = amounts[ i ];
      var simpleShapes = path.toShapes( true );

      for ( var j = 0; j < simpleShapes.length; j ++ ) {
        var color = new THREE.Color(Math.random() * 0xffffff);
        var material = new THREE.MeshLambertMaterial( {
          color: color,
          emissive: color
        } );
        var simpleShape = simpleShapes[ j ];
        var shape3d = new THREE.ExtrudeBufferGeometry( simpleShape, {
          amount: amount * (Math.random() * 10),
          bevelEnabled: false
        } );

        var mesh = new THREE.Mesh( shape3d, material );
        mesh.rotation.x = Math.PI;
        mesh.translateZ( - amount - 1 );
        mesh.translateX( - center.x );
        mesh.translateY( - center.y );

        group.add( mesh );

      }

    }
  }
}
