import $ from 'jQuery';
import THREE from 'THREE';
import BaseView from './BaseView.js';
import modelPreview from '../../templates/toolbar/model-preview.pug';

/**
  * Three Canvas view.
  *
  * Manages a THREE.JS canvas view.
  */

var models = 0;

export default class ThreeCanvasView extends BaseView {
  constructor(options) {
    $('#container').append(modelPreview({id: 'model-preview-' + models}));
    super({
      el: '#model-preview-' + models,
      model: options.model
    });
    this.$el.css('width', options.width);
    this.$el.css('height', options.height);
    this.model.attributes.width = options.width;
    this.model.attributes.height = options.height;
    this.$el.on( 'mousemove', function(event) {
      this.model.attributes.mouse.x = (( event.offsetX / this.model.attributes.renderer.domElement.clientWidth ) * 2 ) - 1;
      this.model.attributes.mouse.y = - (( event.offsetY / this.model.attributes.renderer.domElement.clientHeight ) * 2 ) + 1;
    }.bind(this));

    this.createScene(options.svg);
    models++;
  }

  createScene(svg) {
    
    this.model.attributes.renderer.setSize( this.model.attributes.width, this.model.attributes.height );
    this.model.clearScene();
    this.model.attributes.camera.position.set( 0, 0, (this.model.attributes.width / this.model.attributes.height) * 42.5 );
    this.model.attributes.camera.lookAt( 0, 0, 0 );
    this.$el.append( this.model.attributes.renderer.domElement );

     // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
    var loader = new THREE.SVGLoader();
    var paths = loader.parse(svg);
    var svgExtruded = this.extrudeSVG({
      paths: paths,
      amount: this.model.attributes.extrudeAmount,
      center: { x: this.model.attributes.width /2, y: this.model.attributes.height /2 }
    });
    var box = new THREE.Box3().setFromObject( svgExtruded );
    var boundingBoxSize = box.max.sub( box.min );
    var width = boundingBoxSize.x;
    var height = -boundingBoxSize.y;
    svgExtruded.position.setX((width / 2));
    svgExtruded.position.setY((height / 2));
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
        var material = new THREE.MeshBasicMaterial( {
          color: path.color ? path.color : color
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
