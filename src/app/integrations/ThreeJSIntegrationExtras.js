import THREE from 'THREE';

/**
  * Three Canvas model.
  */

export default class ThreeJSIntegrationExtras {
  constructor(options) {
    this.attributes = {
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
      extrudeAmount: 40,
      helpers: []
    };
    this.attributes.scene = new THREE.Scene();
    var aspect = this.attributes.width / this.attributes.height;
    this.attributes.camera = new THREE.PerspectiveCamera( 45, aspect, 1, 100000 );
    this.attributes.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.attributes.renderer.setPixelRatio( window.devicePixelRatio );
    this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
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
    this.attributes.helpers.push(gridHelper);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

    var gridHelper2 = new THREE.GridHelper( size, divisions, gridColour, gridColour );
    gridHelper2.position.setX(712.5);
    gridHelper2.position.setZ(-500);
    gridHelper2.rotateX(Math.PI / 2);
    gridHelper2.rotateZ(Math.PI / 4);
    this.attributes.helpers.push(gridHelper2);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

    var axesHelper = new THREE.AxesHelper( 500 );
    axesHelper.rotateY(-Math.PI / 4);
    axesHelper.position.set(0, -100, -350);
    this.attributes.helpers.push(axesHelper);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );
  }

  clearScene() {
    cancelAnimationFrame( this.attributes.animationId );
    this.attributes.scene.children = [];
    this.attributes.mesh = null;
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
  }

  animate() {
    this.attributes.animationId = requestAnimationFrame( this.animate.bind(this) );
    this.render.bind(this)();
  }

  render() {
    this.attributes.controls.update();
    this.attributes.renderer.render( this.attributes.scene, this.attributes.camera );

    //this.attributes.raycaster.setFromCamera( this.attributes.mouse, this.attributes.camera );
    
    // var intersects = this.attributes.raycaster.intersectObjects( this.attributes.mesh.children );
    // if ( intersects.length > 0 ) {
    //   if (this.attributes.highlighter) {
    //     this.attributes.scene.remove( this.attributes.highlighter );
    //   }
    //   this.attributes.highlighter = new THREE.BoxHelper( intersects[0].object, 0xffff00 );
    //   this.attributes.scene.add( this.attributes.highlighter );
    // }

    if (app.models.mainCanvas) {
      app.models.mainCanvas.attributes.canvas.renderAll();      
    }
  }

  resize() {
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
    this.attributes.camera.updateProjectionMatrix();

    this.attributes.camera.position.setZ((this.attributes.width/ this.attributes.height) * this.attributes.extrudeAmount * 8);

    this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
  }
}
