import $ from 'jQuery';
import THREE from 'THREE';
import BaseView from './BaseView.js';

/**
  * Three Canvas view.
  *
  * Manages a THREE.JS canvas view.
  */

export default class ThreeCanvasView extends BaseView {
  constructor(options) {
    super({
      el: '#model-preview',
      model: options.model
    });

    $('#model-preview-container').draggable({ cancel: "#model-preview" });

    document.getElementById('model-preview').addEventListener( 'mousemove', function(event) {
      this.model.attributes.mouse.x = ( event.offsetX / this.model.attributes.renderer.domElement.clientWidth ) * 2 - 1;
      this.model.attributes.mouse.y = - ( event.offsetY / this.model.attributes.renderer.domElement.clientHeight ) * 2 + 1;
    }.bind(this), false );
  }

  createScene(svg) {
    this.model.attributes.width = this.$el.innerWidth();
    this.model.attributes.height = this.$el.innerHeight();
    this.model.attributes.renderer.setSize( this.model.attributes.width, this.model.attributes.height );
    this.model.clearScene();
    this.model.attributes.camera.position.set( 0, 0, 200 );
    this.model.attributes.camera.lookAt( 0, 0, 0 );
    this.$el.append( this.model.attributes.renderer.domElement );

     // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
    var loader = new THREE.SVGLoader();
    var paths = loader.parse(svg);
    var svgExtruded = this.extrudeSVG({
      paths: paths,
      amount: this.model.attributes.extrudeAmount,
      center: { x: this.model.attributes.width, y: this.model.attributes.height /2 }
    });
    var box = new THREE.Box3().setFromObject( svgExtruded );
    var boundingBoxSize = box.max.sub( box.min );
    var width = boundingBoxSize.x;
    svgExtruded.position.setX((width / 2) + 10);
    this.model.attributes.mesh = svgExtruded;
    this.model.attributes.scene.add( this.model.attributes.mesh );

    // Start the animation loop.
    this.model.animate();
  }

  // Populate a 3D group from an SVG using SVGLoader
  extrudeSVG(svgObject) {
    var paths = svgObject.paths;
    var amount = svgObject.amount;
    var center = svgObject.center;

    var group = new THREE.Group();
    group.scale.multiplyScalar( 0.25 );
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
          amount: amount ,
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

    return group;
  }
}
