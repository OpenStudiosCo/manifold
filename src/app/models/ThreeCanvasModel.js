import BaseModel from './BaseModel.js';
import THREE from 'THREE';

/**
  * Three Canvas model.
  */

export default class ThreeCanvasModel extends BaseModel {
  defaults() {
    var attributes = {
      animationId: null,
      renderer: null,
      scene: null,
      width: 400,
      height: 400,
      camera: null,
      controls: null,
      mesh: null,
      raycaster: null,
      highlighter: null,
      mouse: null,
      extrudeAmount: 40
    };
    
    return attributes;
  }

  constructor(options) {
    super(options);
    this.attributes.scene = new THREE.Scene();
    this.attributes.camera = new THREE.PerspectiveCamera( 50, this.attributes.width / this.attributes.height, 1, 100000 );
    this.attributes.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.attributes.renderer.setPixelRatio( window.devicePixelRatio );
    this.attributes.controls = new THREE.OrbitControls( this.attributes.camera, this.attributes.renderer.domElement );
    this.attributes.raycaster = new THREE.Raycaster();
    this.attributes.mouse = new THREE.Vector2();
  }

  // Scene helpers.
  addHelpers() {
    var size = 2000;
    var divisions = 100;
    var gridColour = new THREE.Color(0xEFEFEF);

    var gridHelper = new THREE.GridHelper( size, divisions, gridColour, gridColour );
    gridHelper.position.setX(-712.5);
    gridHelper.position.setZ(-500);
    gridHelper.rotateX(Math.PI / 2);
    gridHelper.rotateZ(-Math.PI / 4);
    this.attributes.scene.add( gridHelper );

    var gridHelper2 = new THREE.GridHelper( size, divisions, gridColour, gridColour );
    gridHelper2.position.setX(712.5);
    gridHelper2.position.setZ(-500);
    gridHelper2.rotateX(Math.PI / 2);
    gridHelper2.rotateZ(Math.PI / 4);
    this.attributes.scene.add( gridHelper2 );

    var axesHelper = new THREE.AxesHelper( 500 );
    axesHelper.rotateY(-Math.PI / 4);
    axesHelper.position.set(0, -100, -350);
    this.attributes.scene.add( axesHelper );
  }

  clearScene() {
    cancelAnimationFrame( this.attributes.animationId );
    this.attributes.scene.children = [];
    this.attributes.mesh = null;
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
    if (app && app.models.controls.three.attributes['Show Helpers']) {
      this.addHelpers();
    }
  }

  animate() {
    this.attributes.animationId = requestAnimationFrame( this.animate.bind(this) );
    this.render.bind(this)();
  }

  render() {
    this.attributes.controls.update();
    this.attributes.renderer.render( this.attributes.scene, this.attributes.camera );

    this.attributes.raycaster.setFromCamera( this.attributes.mouse, this.attributes.camera );
    
    var intersects = this.attributes.raycaster.intersectObjects( this.attributes.mesh.children );
    if ( intersects.length > 0 ) {
      if (this.attributes.highlighter) {
        this.attributes.scene.remove( this.attributes.highlighter );
      }
      this.attributes.highlighter = new THREE.BoxHelper( intersects[0].object, 0xffff00 );
      this.attributes.scene.add( this.attributes.highlighter );
    }
  }
}
