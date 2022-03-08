var ManifoldApplication = (function ($$1, fabric$1, THREE, ImageTracer, Potrace) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($$1);
  var fabric__default = /*#__PURE__*/_interopDefaultLegacy(fabric$1);
  var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);
  var ImageTracer__default = /*#__PURE__*/_interopDefaultLegacy(ImageTracer);
  var Potrace__default = /*#__PURE__*/_interopDefaultLegacy(Potrace);

  /**
    * Base Integration class.
    */

  var BaseIntegration = function BaseIntegration () {};

  /**
    * Base Controls class.
    */

  var BaseControls = function BaseControls () {};

  /**
    * Colour picker model for the main canvas.
    * Credit - https://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
    */

  var app$a = {};
  var ColourPickerControls = /*@__PURE__*/(function (BaseControls) {
    function ColourPickerControls(appInstance) {
      app$a = appInstance;
      BaseControls.call(this);
      var el = document.getElementById('colour-picker');
      if (!el) {
        return;
      }

      this.canvas = el.getContext('2d');
      // create an image object and get it’s source
      var img = new Image();
      img.onload = function(){
        this.canvas.drawImage(img,0,0);
      }.bind(this);
      img.src = '/assets/spectrum.jpg';
      this.canvas.scale(0.49, 0.4);

      $__default["default"]('#fill-tool').draggable({ cancel: "#colour-picker, #colour-picker-preview input" });

      var mouseDown = false;
      $__default["default"]('#colour-picker').on('mousedown', function(event){
        mouseDown = true;
        this.pickColour(event);
      }.bind(this));
      $__default["default"]('#colour-picker').on('mousemove', function(event){
        if (mouseDown) {
          this.pickColour(event);
        }
      }.bind(this));
      $__default["default"]('#colour-picker').on('mouseup', function(){
        mouseDown = false;
      });
       
    }

    if ( BaseControls ) ColourPickerControls.__proto__ = BaseControls;
    ColourPickerControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    ColourPickerControls.prototype.constructor = ColourPickerControls;

    ColourPickerControls.prototype.lookupAndSetColour = function lookupAndSetColour (colour) {
      var ctx, cvs;
      cvs = document.createElement('canvas');
      cvs.height = 1;
      cvs.width = 1;
      ctx = cvs.getContext('2d');
      ctx.fillStyle = colour;
      ctx.fillRect(0, 0, 1, 1);
      var c = ctx.getImageData(0, 0, 1, 1).data;
      this.setColour(c[0], c[1], c[2]);
    };

    ColourPickerControls.prototype.setColour = function setColour (R,G,B) {
      var rgb = R + ', ' + G + ', ' + B;
      // convert RGB to HEX
      var hex = this.rgbToHex(R,G,B);
      // making the color the value of the input
      $__default["default"]('input#rgb').val(rgb);
      $__default["default"]('input#hex').val('#' + hex);
      $__default["default"]('#colour-picker-preview').css('background-color', '#' + hex);

      if (app$a.fabric.model.canvas) {
        $__default["default"]('#btnFillActive .icon').css('color', '#' + hex);
        app$a.fabric.model.canvas.getActiveObject().set("fill", '#' + hex);
        app$a.fabric.model.canvas.renderAll();
      }
    };

    // http://www.javascripter.net/faq/rgbtohex.htm
    ColourPickerControls.prototype.rgbToHex = function rgbToHex (R,G,B) {
     return this.toHex(R)+this.toHex(G)+this.toHex(B); 
    };

    ColourPickerControls.prototype.toHex = function toHex (m) {
      var n = parseInt(m,10);
      if (isNaN(n)) {
       return "00";
      }
      n = Math.max(0,Math.min(n,255));
      
      return "0123456789ABCDEF".charAt((n-(n%16))/16) + "0123456789ABCDEF".charAt(n%16);
    };

    ColourPickerControls.prototype.pickColour = function pickColour (event) {
      // getting user coordinates
      var x = event.offsetX;
      var y = event.offsetY;
      // getting image data and RGB values
      var img_data = this.canvas.getImageData(x, y, 1, 1).data;
      var R = img_data[0];
      var G = img_data[1];
      var B = img_data[2];
      this.setColour(R, G, B);
    };

    return ColourPickerControls;
  }(BaseControls));

  var pug = (function(exports) {

    var pug_has_own_property = Object.prototype.hasOwnProperty;

    /**
     * Merge two attribute objects giving precedence
     * to values in object `b`. Classes are special-cased
     * allowing for arrays and merging/joining appropriately
     * resulting in a string.
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object} a
     * @api private
     */

    exports.merge = pug_merge;
    function pug_merge(a, b) {
      if (arguments.length === 1) {
        var attrs = a[0];
        for (var i = 1; i < a.length; i++) {
          attrs = pug_merge(attrs, a[i]);
        }
        return attrs;
      }

      for (var key in b) {
        if (key === 'class') {
          var valA = a[key] || [];
          a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
        } else if (key === 'style') {
          var valA = pug_style(a[key]);
          valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
          var valB = pug_style(b[key]);
          valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
          a[key] = valA + valB;
        } else {
          a[key] = b[key];
        }
      }

      return a;
    }
    /**
     * Process array, object, or string as a string of classes delimited by a space.
     *
     * If `val` is an array, all members of it and its subarrays are counted as
     * classes. If `escaping` is an array, then whether or not the item in `val` is
     * escaped depends on the corresponding item in `escaping`. If `escaping` is
     * not an array, no escaping is done.
     *
     * If `val` is an object, all the keys whose value is truthy are counted as
     * classes. No escaping is done.
     *
     * If `val` is a string, it is counted as a class. No escaping is done.
     *
     * @param {(Array.<string>|Object.<string, boolean>|string)} val
     * @param {?Array.<string>} escaping
     * @return {String}
     */
    exports.classes = pug_classes;
    function pug_classes_array(val, escaping) {
      var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
      for (var i = 0; i < val.length; i++) {
        className = pug_classes(val[i]);
        if (!className) { continue; }
        escapeEnabled && escaping[i] && (className = pug_escape(className));
        classString = classString + padding + className;
        padding = ' ';
      }
      return classString;
    }
    function pug_classes_object(val) {
      var classString = '', padding = '';
      for (var key in val) {
        if (key && val[key] && pug_has_own_property.call(val, key)) {
          classString = classString + padding + key;
          padding = ' ';
        }
      }
      return classString;
    }
    function pug_classes(val, escaping) {
      if (Array.isArray(val)) {
        return pug_classes_array(val, escaping);
      } else if (val && typeof val === 'object') {
        return pug_classes_object(val);
      } else {
        return val || '';
      }
    }

    /**
     * Convert object or string to a string of CSS styles delimited by a semicolon.
     *
     * @param {(Object.<string, string>|string)} val
     * @return {String}
     */

    exports.style = pug_style;
    function pug_style(val) {
      if (!val) { return ''; }
      if (typeof val === 'object') {
        var out = '';
        for (var style in val) {
          /* istanbul ignore else */
          if (pug_has_own_property.call(val, style)) {
            out = out + style + ':' + val[style] + ';';
          }
        }
        return out;
      } else {
        return val + '';
      }
    }
    /**
     * Render the given attribute.
     *
     * @param {String} key
     * @param {String} val
     * @param {Boolean} escaped
     * @param {Boolean} terse
     * @return {String}
     */
    exports.attr = pug_attr;
    function pug_attr(key, val, escaped, terse) {
      if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
        return '';
      }
      if (val === true) {
        return ' ' + (terse ? key : key + '="' + key + '"');
      }
      if (typeof val.toJSON === 'function') {
        val = val.toJSON();
      }
      if (typeof val !== 'string') {
        val = JSON.stringify(val);
        if (!escaped && val.indexOf('"') !== -1) {
          return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
        }
      }
      if (escaped) { val = pug_escape(val); }
      return ' ' + key + '="' + val + '"';
    }
    /**
     * Render the given attributes object.
     *
     * @param {Object} obj
     * @param {Object} terse whether to use HTML5 terse boolean attributes
     * @return {String}
     */
    exports.attrs = pug_attrs;
    function pug_attrs(obj, terse){
      var attrs = '';

      for (var key in obj) {
        if (pug_has_own_property.call(obj, key)) {
          var val = obj[key];

          if ('class' === key) {
            val = pug_classes(val);
            attrs = pug_attr(key, val, false, terse) + attrs;
            continue;
          }
          if ('style' === key) {
            val = pug_style(val);
          }
          attrs += pug_attr(key, val, false, terse);
        }
      }

      return attrs;
    }
    /**
     * Escape the given string of `html`.
     *
     * @param {String} html
     * @return {String}
     * @api private
     */

    var pug_match_html = /["&<>]/;
    exports.escape = pug_escape;
    function pug_escape(_html){
      var html = '' + _html;
      var regexResult = pug_match_html.exec(html);
      if (!regexResult) { return _html; }

      var result = '';
      var i, lastIndex, escape;
      for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
        switch (html.charCodeAt(i)) {
          case 34: escape = '&quot;'; break;
          case 38: escape = '&amp;'; break;
          case 60: escape = '&lt;'; break;
          case 62: escape = '&gt;'; break;
          default: continue;
        }
        if (lastIndex !== i) { result += html.substring(lastIndex, i); }
        lastIndex = i + 1;
        result += escape;
      }
      if (lastIndex !== i) { return result + html.substring(lastIndex, i); }
      else { return result; }
    }
    /**
     * Re-throw the given `err` in context to the
     * the pug in `filename` at the given `lineno`.
     *
     * @param {Error} err
     * @param {String} filename
     * @param {String} lineno
     * @param {String} str original source
     * @api private
     */

    exports.rethrow = pug_rethrow;
    function pug_rethrow(err, filename, lineno, str){
      if (!(err instanceof Error)) { throw err; }
      if ((typeof window != 'undefined' || !filename) && !str) {
        err.message += ' on line ' + lineno;
        throw err;
      }
      try {
        str = str || require('fs').readFileSync(filename, 'utf8');
      } catch (ex) {
        pug_rethrow(err, null, lineno);
      }
      var context = 3
        , lines = str.split('\n')
        , start = Math.max(lineno - context, 0)
        , end = Math.min(lines.length, lineno + context);

      // Error context
      var context = lines.slice(start, end).map(function(line, i){
        var curr = i + start + 1;
        return (curr == lineno ? '  > ' : '    ')
          + curr
          + '| '
          + line;
      }).join('\n');

      // Alter exception message
      err.path = filename;
      err.message = (filename || 'Pug') + ':' + lineno
        + '\n' + context + '\n\n' + err.message;
      throw err;
    }
    return exports
  })({});

  function activeObjectContext(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"active-object-context floating overlay\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui mini menu labeled icon pointing\"\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnSaveSVG\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"save icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Save SVG\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnDeleteActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"trash alternate icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Delete\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnGroupActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"object group icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Group (1)\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnMergeActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"object group outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Merge\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnFillActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"tint icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Fill\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"pencil alternate icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Stroke\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnToggleVector\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"paper plane outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Vector\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnMake3D\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"snowflake outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "3D\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function modelPreview(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (id) {
  pug_html = pug_html + "\u003Cdiv" + (" class=\"model-preview\""+" style=\"box-shadow: inset 0 0 5px #ccc;\""+pug.attr("id", id, true, true)) + "\u003E\u003C\u002Fdiv\u003E";
  }.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Three Canvas view.
    *
    * Manages a THREE.JS canvas view.
    */

  var models = 0;

  var ThreeIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function ThreeIntegration(options) {
      BaseIntegration.call(this, options);
      $__default["default"]('#container').append(modelPreview( { id: 'model-preview-' + models } ));
      this.$el = $__default["default"]('#model-preview-' + models);
      this.model = options.model;
      this.$el.css('width', options.width);
      this.$el.css('height', options.height);
      this.model.attributes.width = options.width;
      this.model.attributes.height = options.height;
      this.$el.on( 'mousemove', function(event) {
        this.model.attributes.mouse.x = (( event.offsetX / this.model.attributes.renderer.domElement.clientWidth ) * 2 ) - 1;
        this.model.attributes.mouse.y = - (( event.offsetY / this.model.attributes.renderer.domElement.clientHeight ) * 2 ) + 1;
      }.bind(this));

      this.createScene(options.svg);
      models +=1;
    }

    if ( BaseIntegration ) ThreeIntegration.__proto__ = BaseIntegration;
    ThreeIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    ThreeIntegration.prototype.constructor = ThreeIntegration;

    ThreeIntegration.prototype.createScene = function createScene (svg) {
      
      this.model.attributes.renderer.setSize( this.model.attributes.width, this.model.attributes.height );
      this.model.clearScene();
      
      this.$el.append( this.model.attributes.renderer.domElement );

       // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
      var loader = new THREE__default["default"].SVGLoader();
      var paths = loader.parse(svg).paths;
      var offsetX = (paths[0].currentPath ? paths[0].currentPath.currentPoint.x : 0);
      var offsetY = (paths[0].currentPath ? paths[0].currentPath.currentPoint.y : 0);
      var svgExtruded = this.extrudeSVG({
        paths: paths,
        amount: this.model.attributes.extrudeAmount,
        center: { x: offsetX, y: offsetY }
      });
      var box = new THREE__default["default"].Box3().setFromObject( svgExtruded );

      this.model.attributes.mesh = svgExtruded;
      this.model.attributes.scene.add( this.model.attributes.mesh );
      this.model.attributes.camera.position.set(box.min.x + 100, box.min.y + 100 , - box.max.z * 8);
      this.model.attributes.controls.target = new THREE__default["default"].Vector3( box.min.x + 100, box.min.y + 100 , box.min.z * 4 );
      // Start the animation loop.
      this.model.animate();
    };

    // Populate a 3D group from an SVG using SVGLoader
    ThreeIntegration.prototype.extrudeSVG = function extrudeSVG (svgObject) {
      var paths = svgObject.paths;
      var amount = svgObject.amount;
      var center = svgObject.center;

      var group = new THREE__default["default"].Group();
      for ( var i = 0; i < paths.length; i ++ ) {
        var path = paths[ i ];
        var shapes = path.toShapes( true );
        for ( var j = 0; j < shapes.length; j ++ ) {
          var color = new THREE__default["default"].Color(Math.random() * 0xffffff);
          var material = new THREE__default["default"].MeshBasicMaterial( {
            color: path.color ? path.color : color
          } );
          var simpleShape = shapes[ j ];
          var shape3d = new THREE__default["default"].ExtrudeBufferGeometry( simpleShape, {
            depth: amount ,
            bevelEnabled: false
          } );

          var mesh = new THREE__default["default"].Mesh( shape3d, material );
          mesh.rotation.x = Math.PI;
          mesh.rotation.y = Math.PI;
          mesh.translateZ( - amount - 1 );
          mesh.translateX( - center.x);
          mesh.translateY( - center.y);

          group.add( mesh );
        }
      }

      return group;
    };

    return ThreeIntegration;
  }(BaseIntegration));

  /**
    * Three Canvas model.
    */

  var app$9 = {};
  var ThreeJSIntegrationExtras = function ThreeJSIntegrationExtras(appInstance) {
    app$9 = appInstance;
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
    this.attributes.scene = new THREE__default["default"].Scene();
    var aspect = this.attributes.width / this.attributes.height;
    this.attributes.camera = new THREE__default["default"].PerspectiveCamera( 45, aspect, 1, 100000 );
    this.attributes.renderer = new THREE__default["default"].WebGLRenderer({ alpha: true, antialias: true });
    this.attributes.renderer.setPixelRatio( window.devicePixelRatio );
    this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
    this.attributes.controls = new THREE__default["default"].OrbitControls( this.attributes.camera, this.attributes.renderer.domElement );
    this.attributes.raycaster = new THREE__default["default"].Raycaster();
    this.attributes.mouse = new THREE__default["default"].Vector2();
  };

  // Scene helpers.
  ThreeJSIntegrationExtras.prototype.addHelpers = function addHelpers () {
    var size = 2000;
    var divisions = 100;
    var gridColour = new THREE__default["default"].Color(0xEFEFEF);

    var gridHelper = new THREE__default["default"].GridHelper( size, divisions, gridColour, gridColour );
    gridHelper.position.setX(-712.5);
    gridHelper.position.setZ(-500);
    gridHelper.rotateX(Math.PI / 2);
    gridHelper.rotateZ(-Math.PI / 4);
    this.attributes.helpers.push(gridHelper);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

    var gridHelper2 = new THREE__default["default"].GridHelper( size, divisions, gridColour, gridColour );
    gridHelper2.position.setX(712.5);
    gridHelper2.position.setZ(-500);
    gridHelper2.rotateX(Math.PI / 2);
    gridHelper2.rotateZ(Math.PI / 4);
    this.attributes.helpers.push(gridHelper2);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

    var axesHelper = new THREE__default["default"].AxesHelper( 500 );
    axesHelper.rotateY(-Math.PI / 4);
    axesHelper.position.set(0, -100, -350);
    this.attributes.helpers.push(axesHelper);
    this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );
  };

  ThreeJSIntegrationExtras.prototype.clearScene = function clearScene () {
    cancelAnimationFrame( this.attributes.animationId );
    this.attributes.scene.children = [];
    this.attributes.mesh = null;
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
  };

  ThreeJSIntegrationExtras.prototype.animate = function animate () {
    this.attributes.animationId = requestAnimationFrame( this.animate.bind(this) );
    this.render.bind(this)();
  };

  ThreeJSIntegrationExtras.prototype.render = function render () {
    this.attributes.controls.update();
    this.attributes.renderer.render( this.attributes.scene, this.attributes.camera );

    // this.attributes.raycaster.setFromCamera( this.attributes.mouse, this.attributes.camera );
      
    // var intersects = this.attributes.raycaster.intersectObjects( this.attributes.mesh.children );
    // if ( intersects.length > 0 ) {
    // if (this.attributes.highlighter) {
    //   this.attributes.scene.remove( this.attributes.highlighter );
    // }
    // this.attributes.highlighter = new THREE.BoxHelper( intersects[0].object, 0xffff00 );
    // this.attributes.scene.add( this.attributes.highlighter );
    // }

    if (app$9 && app$9.fabric && app$9.fabric.model.canvas) {
      app$9.fabric.model.canvas.renderAll();
    }
  };

  ThreeJSIntegrationExtras.prototype.resize = function resize () {
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
    this.attributes.camera.updateProjectionMatrix();

    this.attributes.camera.position.setZ((this.attributes.width/ this.attributes.height) * this.attributes.extrudeAmount * 8);

    this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
  };

  var app$8 = {};
  var FabricJSIntegrationEvents = function FabricJSIntegrationEvents(appInstance) {
    app$8 = appInstance;
  };

  FabricJSIntegrationEvents.prototype.setupEvents = function setupEvents () {
    // Credit - https://stackoverflow.com/a/24238960
    app$8.fabric.model.canvas.on('object:moving', function (e) {
      var obj = e.target;
       // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
          return;
      }        
      obj.setCoords();        
      // top-leftcorner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
          obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
          obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top+obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width > obj.canvas.width){
          obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
          obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    });

    // Hide previous active context windows
    var clearOverlays = function() { 
      $__default["default"]('.model-preview').hide();
      $__default["default"]('#vector-tool').hide();
      $__default["default"]('.active-object-context').remove();
      $__default["default"]('#fill-tool').hide();

      // Remove any objects added to the canvas by tools, i.e. previews
      var objects = app$8.fabric.model.canvas.getObjects();
      objects.forEach(function (object) {
        if (object.temporary) {
          app$8.fabric.model.canvas.remove(object);  
        }
      });
    };
    // Create the active object context menu when selecting an object.
    var selectionCallback = function(e) {
      clearOverlays();

      var target = e.selected.shift();

      var $menu = $__default["default"](activeObjectContext());
      $__default["default"]('#container').append($menu);
      var offsetX = target.left + ((target.width / 2) - ($menu.width() / 2));
      var offsetY = target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);

      // Set the menu to be draggable
      $__default["default"]('.floating.overlay').draggable();

      switch(target.type) {
        case 'image':
          $__default["default"]('#btnToggleVector').removeClass('disabled');
          break;
      }

      // Not 3D, not text, not group
      if (!target._element && !target.text && !target._objects) {
        $__default["default"]('#btnMake3D').removeClass('disabled');
      }
      // Not 3D, not group
      if (!target._element && !target._objects) {
        $__default["default"]('#btnFillActive').removeClass('disabled');
        $__default["default"]('#btnFillActive .icon').css('color', target.fill);
        app$8.fabric.model.colourPickerModel.lookupAndSetColour(target.fill);
      }
      // Is group.
      if (target._objects) {

        $__default["default"]('#btnGroupActive').removeClass('disabled');
        if (target.type == 'activeSelection') {
          $__default["default"]('#btnGroupActive span').html('Group (' + target._objects.length + ')');
        }
        else {
          $__default["default"]('#btnGroupActive span').html('Ungroup (' + target._objects.length + ')');
        }
      }

      // Events
      $__default["default"]('#btnGroupActive').click(function() {
        var activeObject = app$8.fabric.model.canvas.getActiveObject();
        if (activeObject.type == 'group') {
          activeObject.toActiveSelection();
        }
        else {
          activeObject.toGroup();
        }
          
        app$8.fabric.model.canvas.discardActiveObject();
        app$8.fabric.model.canvas.requestRenderAll();

        // Update layers tool
        if (app$8.layers) {
          app$8.layers.updateLayers();
        }
      });
        
      $__default["default"]('#btnFillActive:not(.disabled)').click(function(){
        $__default["default"](this).toggleClass('active');
        $__default["default"]('#fill-tool').toggle();
      });
      $__default["default"]('#btnDeleteActive').click(function() {
        var selectedObjects = app$8.fabric.model.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          app$8.fabric.model.canvas.remove(selectedObjects[i]);  
        }
        app$8.fabric.model.canvas.discardActiveObject();
        $__default["default"]('.active-object-context').remove();
        // Update layers tool
        if (app$8.layers) {
          app$8.layers.updateLayers();
        }
      });
      $__default["default"]('#btnSaveSVG').click(function() {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([app$8.fabric.model.canvas.toSVG()], {type: "text/plain"}));
        a.download = prompt("Please enter a filename", "Manifold-Download.svg");
        if (a.download != 'null') {
          if (a.download.indexOf('.svg') < 0) {
            a.download += '.svg';
          }
          a.click();
        }
      });
      $__default["default"]('#btnToggleVector:not(.disabled)')
        .popup({
          title: 'Toggle Vector Controls',
          position: 'right center'
        })
        .on('click', function (e) {
          $__default["default"]('#vector-tool').toggle();
          app$8.vector.preview(app$8);
        });
      // @todo: Move these vector tool event handlers somewhere better
      $__default["default"]('#btnCreateVector').on('click', function () {
        app$8.vector.create(app$8);
      });
      $__default["default"]('#btnReplaceVector').on('click', function () {
        app$8.vector.create(app$8, true);
      });
      $__default["default"]('#btnMake3D:not(.disabled)').click(function() {
        var selectedObjects = app$8.fabric.model.canvas.getActiveObjects();

        for (var i = 0; i < selectedObjects.length; i++) {
          if (selectedObjects[i].toSVG) {
            var obj_width = selectedObjects[i].width * selectedObjects[i].scaleX;
            var obj_height = selectedObjects[i].height * selectedObjects[i].scaleY;

            // Start SVG document.
            // Removed: ' viewbox="0 0 ';
            var svg_start = '<svg xmlns="http://www.w3.org/2000/svg"';
            svg_start += ' style="fill: ';
            svg_start += selectedObjects[i].fill + '">';

            var svg_end = '</svg>';

            // Hack for matrix transform;
            // var svgElements = svg_start + selectedObjects[i].toSVG().replace(/matrix\(.*\)/,'matrix(1 0 0 1 0 0)') + svg_end;

            var svgElements = svg_start + selectedObjects[i].toSVG() + svg_end;

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric__default["default"].Image(threeCanvas.$el.find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              app$8.fabric.model.canvas.add(threeD);
            };
            app$8.ThreeCanvasModel.push(new ThreeJSIntegrationExtras({
              height: obj_height,
              width: obj_width
            }));
            var ThreeFabricObject = new ThreeIntegration({ 
              model: app$8.ThreeCanvasModel[app$8.ThreeCanvasModel.length-1],
              svg: svgElements,
              width: obj_width,
              height: obj_height
            });
            app$8.ThreeCanvasView.push( ThreeFabricObject );
            create3DObject(app$8.ThreeCanvasView[app$8.ThreeCanvasView.length-1]);
            app$8.fabric.model.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        app$8.fabric.model.canvas.discardActiveObject();
        $__default["default"]('.active-object-context').remove();
      });
      app$8.layers.updateLayers();
    };

    // Separated for Fabric's On not supporting multiple.
    app$8.fabric.model.canvas.on('selection:created', selectionCallback);
    app$8.fabric.model.canvas.on('selection:updated', selectionCallback);

    app$8.fabric.model.canvas.on('mouse:dblclick', function(e){
      e.selected.shift();
      if (e.target && e.target._element) {
        var $el = $__default["default"](e.target._element).parent();
        var scaledWidth = e.target.width * e.target.scaleX;
        var scaledHeight = e.target.height * e.target.scaleY;
        var offsetX = e.target.left + ((scaledWidth / 2) - ($el.width() / 2));
        var offsetY = e.target.top + ((scaledHeight / 2) - ($el.height() / 2));
        $el.show();
        $el.css('left', offsetX);
        $el.css('top', offsetY);
      }
    });

    app$8.fabric.model.canvas.on('selection:cleared', function(){
      clearOverlays();

      if (app$8.layers) {
        app$8.layers.updateLayers();
      }
    });

    // @TODO: Don't follow if user moved the toolbar.
    app$8.fabric.model.canvas.on('object:moving', function(e) {
      var $menu = $__default["default"]('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $__default["default"]('#toolbar').sidebar('is visible') ? $__default["default"]('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > app$8.fabric.model.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = app$8.fabric.model.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    });

    // Update 3D canvas if it's that type of element.
    app$8.fabric.model.canvas.on('object:modified', function(e) {
      if (e.target._element) {
        app$8.fabric.model.events.updateModelPreviewViewPort(e.target);
      }
    });
  };

  FabricJSIntegrationEvents.prototype.updateModelPreviewViewPort = function updateModelPreviewViewPort (target) {
    var $container = $__default["default"](target._element).parent();
    if ($container.hasClass('model-preview')) {
      var scaledWidth = target.width * target.scaleX;
      var scaledHeight = target.height * target.scaleY;
      var rotateY = target.get('angle');
      $container.css('width', scaledWidth);
      $container.css('height', scaledHeight);
      $container.css('transform', 'rotateZ(' + rotateY + 'deg)');

      var id = $container.attr('id').replace('model-preview-','');
      app$8.ThreeCanvasModel[id].attributes.width = scaledWidth;
      app$8.ThreeCanvasModel[id].attributes.height = scaledHeight;
      app$8.ThreeCanvasModel[id].resize();
        
      target._resetWidthHeight();
    }
  };

  var app$7 = {};
  var FabricJSIntegrationHelpers = function FabricJSIntegrationHelpers(appInstance) {
    app$7 = appInstance;
  };

  // Loads an SVG string and splits up objects so they're loaded in the right position.
  FabricJSIntegrationHelpers.prototype.loadSVG = function loadSVG (svg, callbackFn, temporary) {
      if ( temporary === void 0 ) temporary = false;

    fabric__default["default"].loadSVGFromString(svg, function(objects){
      // Create a group so we add to center accurately.
      var group = new fabric__default["default"].Group(objects);
      objects.forEach(function (object, index) {
        object.id = object.type + '-' + Math.floor(Date.now() / 1000) + index;    
      });
      if (temporary) {
        // Remove other previews
        // @todo: Expand when other things are set to temporary
        var existing_objects = app$7.fabric.model.canvas.getObjects();
        existing_objects.forEach(function (object) {
          if (object.temporary) {
            app$7.fabric.model.canvas.remove(object);  
          }
        });
      }
        
      this.addToCenter(group, temporary);

      if (callbackFn) {
        callbackFn(group);
      }
    }.bind(this));
  };

  FabricJSIntegrationHelpers.prototype.updateCanvasSize = function updateCanvasSize () {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($__default["default"]("#toolbar").sidebar('is visible')) {
      $__default["default"]('.canvas-container').css('marginLeft', ($__default["default"]('#toolbar').width()*1.5) + 'px');
      width -= $__default["default"]('#toolbar').width();
    }
    if ($__default["default"]("#details").sidebar('is visible')) {
      width -= $__default["default"]('#details').width();
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    app$7.fabric.model.canvas.setHeight( height );
    app$7.fabric.model.canvas.setWidth( width );
  };

  // Add an object to the center of the canvas.
  FabricJSIntegrationHelpers.prototype.addToCenter = function addToCenter (object, temporary) {
      if ( temporary === void 0 ) temporary = false;

    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($__default["default"]("#toolbar").sidebar('is visible')) {
      $__default["default"]('.canvas-container').css('marginLeft', ($__default["default"]('#toolbar').width()*1.5) + 'px');
      canvasWidth -= $__default["default"]('#toolbar').width();
    }
    if ($__default["default"]("#details").sidebar('is visible')) {
      canvasWidth -= $__default["default"]('#details').width();
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if (object.width > canvasWidth || object.height > canvasHeight) {
      object.scaleToWidth(app$7.fabric.model.canvas.getWidth() / 2);
      object.set({ left: (canvasWidth / 2) - (object.width * object.scaleX / 2), top: ((canvasHeight /2) - (object.height * object.scaleY / 2)) });
    }
    else {
      object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
    }
      
    object.id = object.type + '-' + Math.floor(Date.now() / 1000);
    object.temporary = temporary;

    app$7.fabric.model.canvas.add(object);
    app$7.fabric.model.canvas.moveTo(object, app$7.fabric.model.canvas.getObjects().length);
    // Update layers tool
    if (app$7.layers) {
      app$7.layers.updateLayers();
    }
  };

  /**
    * Fabric JS Integration.
    */

  var app$6 = {};
  var FabricJSIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function FabricJSIntegration( appInstance ) {
      app$6 = appInstance;
      BaseIntegration.call(this);
      this.el = '#main-canvas';
      this.model = {
        colourPickerModel: new ColourPickerControls( appInstance ),
        canvas: new fabric__default["default"].Canvas( 'main-canvas', { preserveObjectStacking: true } ),
        attributes: {
          canvas: null,
          transitioning: false
        },
        helpers: new FabricJSIntegrationHelpers( appInstance ),
        events: new FabricJSIntegrationEvents( appInstance )
      };
    }

    if ( BaseIntegration ) FabricJSIntegration.__proto__ = BaseIntegration;
    FabricJSIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    FabricJSIntegration.prototype.constructor = FabricJSIntegration;

    FabricJSIntegration.prototype.ready = function ready () {
      app$6.fabric.model.events.setupEvents();
      app$6.fabric.model.helpers.updateCanvasSize();

      // Default scene.
      app$6.fabric.demoAnimating();
    };
    FabricJSIntegration.prototype.demoAnimating = function demoAnimating () {

      // var gradient = new fabric.Gradient( {
      //   type: 'linear',
      //   gradientUnits: 'pixels', // or 'percentage'
      //   coords: { x1: 0, y1: 0, x2: 0, y2: 50 },
      //   colorStops: [
      //     { offset: 0, color: '#F00' },
      //     { offset: 1, color: '#000' }
      //   ]
      // } );
      var triangle = new fabric__default["default"].Triangle( { width: 200, height: 200, fill: 'blue', left: 50, top: -150 } );
      app$6.fabric.model.helpers.addToCenter( triangle );
    };
    FabricJSIntegration.prototype.demoDrawing = function demoDrawing () {
      var circle = new fabric__default["default"].Circle( { radius: 100, fill: '  green' } );
      app$6.fabric.model.helpers.addToCenter( circle );
      circle.left -= 75;
      var rect = new fabric__default["default"].Rect( {
        fill: 'red',
        width: 200,
        height: 200
      } );
      app$6.fabric.model.helpers.addToCenter( rect );
      rect.left += 75;
    };
    FabricJSIntegration.prototype.demoTracing = function demoTracing () {
      var imgSrc = '/assets/puppies.jpg';
      fabric__default["default"].Image.fromURL( imgSrc, function ( oImg ) {
        app$6.fabric.model.helpers.addToCenter( oImg );
        oImg.left -= 7;
        oImg.top += 13;
        app$6.fabric.model.canvas.setActiveObject( app$6.fabric.model.canvas.item( 0 ) );
        $( '#btnToggleVector' ).click();
      } );
    };

    return FabricJSIntegration;
  }(BaseIntegration));

  // External libs

  /**
    * Fomantic Integration
    */

  var FomanticIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function FomanticIntegration() {   
      BaseIntegration.call(this);
    }

    if ( BaseIntegration ) FomanticIntegration.__proto__ = BaseIntegration;
    FomanticIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    FomanticIntegration.prototype.constructor = FomanticIntegration;

    FomanticIntegration.prototype.ready = function ready () {  
      $__default["default"]('.ui.accordion').accordion({
        exclusive: false
      });
      $__default["default"]('.ui.dropdown').dropdown();
      $__default["default"]('.floating.overlay').draggable();
    };

    return FomanticIntegration;
  }(BaseIntegration));

  /**
    * Base Events class.
    */

   var BaseEvents = function BaseEvents () {};

  function addLibraryItem(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (url) {
  pug_html = pug_html + "\u003Cdiv class=\"ui card\"\u003E";
  pug_html = pug_html + "\u003Ca class=\"image\" href=\"#\"\u003E";
  pug_html = pug_html + "\u003Cimg" + (pug.attr("src", url, true, true)) + "\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
  }.call(this,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  var DropEvents = /*@__PURE__*/(function (BaseEvents) {
    function DropEvents( appInstance ) {
      BaseEvents.call(this);

      window.addEventListener("drop", this.handleDrop);
    }

    if ( BaseEvents ) DropEvents.__proto__ = BaseEvents;
    DropEvents.prototype = Object.create( BaseEvents && BaseEvents.prototype );
    DropEvents.prototype.constructor = DropEvents;

    DropEvents.prototype.handleDrop = function handleDrop ( event ) {
      console.log('File(s) dropped');

      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();

      var completeDrop = function (file) {
        window.URL = window.URL || window.webkitURL || window.mozURL;
        var url = URL.createObjectURL(file);
        console.log(url);
        $__default["default"](addLibraryItem({ url: url }))
          .insertBefore('#btnUploadImage');
      };

      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            completeDrop(event.dataTransfer.items[i].getAsFile());
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          completeDrop(event.dataTransfer.files[i]);
        }
      }
    };

    return DropEvents;
  }(BaseEvents));

  /**
    * Drop Events class.
    */

  var app$5 = {};
  var KeyEvents = /*@__PURE__*/(function (BaseEvents) {
    function KeyEvents( appInstance ) {
      app$5 = appInstance;
      BaseEvents.call(this);
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.keyCode === 65) {
            event.preventDefault();

            // Has to fire here because it is being preventDefaulted to block regular select all behaviour
            app$5.fabric.model.canvas.discardActiveObject();
            var sel = new fabric.ActiveSelection(app$5.fabric.model.canvas.getObjects(), {
              canvas: app$5.fabric.model.canvas,
            });
            app$5.fabric.model.canvas.setActiveObject(sel);
            app$5.fabric.model.canvas.requestRenderAll();
        }   
    });

      document.addEventListener('keyup', function (ref) {
        if ( ref === void 0 ) ref = event;
        var keyCode = ref.keyCode;
        var ctrlKey = ref.ctrlKey;

        // Check pressed button is Z - Ctrl+Z.
        if (keyCode === 46) {
          // @todo: Remove duplication with code in integrations/FabricJS/Events.js
          var selectedObjects = app$5.fabric.model.canvas.getActiveObjects();
          for (var i = 0; i < selectedObjects.length; i++) {
            app$5.fabric.model.canvas.remove(selectedObjects[i]);  
          }
          app$5.fabric.model.canvas.discardActiveObject();

          // Update layers tool
          if (app$5.layers) {
            app$5.layers.updateLayers();
          }
        }
        
        
        // Check Ctrl key is pressed.
        if (!ctrlKey) {
          return
        }           

        // CTRL combos past this line -----------

        // Check pressed button is Z - Ctrl+Z.
        if (keyCode === 90) {
          app$5.fabric.model.canvas.undo(function() { 
            // @todo: Make a common helper.
            // - https://github.com/alimozdemir/fabric-history
            console.log('post undo');
          });
        }
      
        // Check pressed button is Y - Ctrl+Y.
        if (keyCode === 89) {
          app$5.fabric.model.canvas.redo(function() { 
            console.log('post redo');
          });
        }

      });
    }

    if ( BaseEvents ) KeyEvents.__proto__ = BaseEvents;
    KeyEvents.prototype = Object.create( BaseEvents && BaseEvents.prototype );
    KeyEvents.prototype.constructor = KeyEvents;

    return KeyEvents;
  }(BaseEvents));

  function addLayer(locals) {var pug_html = "", pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (active, index, shape) {
  pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes(["item",(active ? 'ui label' : '')], [false,true]), false, true)+pug.attr("id", 'item-' + index, true, true)) + "\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"right floated content\"\u003E";
  pug_html = pug_html + "\u003Ca class=\"back\" title=\"Back\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icon sort amount down\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"forward\" title=\"Forward\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icon sort amount up\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"display toggle\" title=\"Hide\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icon eye\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"description\"\u003E";
  pug_html = pug_html + "\u003Ci" + (pug.attr("class", pug.classes(['icon ' + shape], [true]), false, true)) + "\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + (pug.escape(null == (pug_interp = shape) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
  }.call(this,"active" in locals_for_with?locals_for_with.active:typeof active!=="undefined"?active:undefined,"index" in locals_for_with?locals_for_with.index:typeof index!=="undefined"?index:undefined,"shape" in locals_for_with?locals_for_with.shape:typeof shape!=="undefined"?shape:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  var app$4 = {};
  var LayerControls = /*@__PURE__*/(function (BaseControls) {
    function LayerControls(appInstance) {
      app$4 = appInstance;
      BaseControls.call(this);
    }

    if ( BaseControls ) LayerControls.__proto__ = BaseControls;
    LayerControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    LayerControls.prototype.constructor = LayerControls;

    LayerControls.prototype.ready = function ready () {
      this.updateLayers();
    };

    LayerControls.prototype.checkActive = function checkActive (object) {
      var selectedObjects = app$4.fabric.model.canvas.getActiveObjects();
      var active = false;
      selectedObjects.forEach(function (selected_object) {
        if (selected_object.id == object.id) {
          active = true;
        }
      });

      return active;
    };

    LayerControls.prototype.renderItem = function renderItem (parent, object) {
      var active = app$4.layers.checkActive(object),
          // Get index from canvas rather than containing array order.    
          index = parent.indexOf(object),
          returnHtml = '',
          type;

      if (object.type) {
        if (object.type == 'rect') {
          type = 'square';
        }
        else {
          type = object.type;
        }
      }
      else {
        type = 'Unknown';
      }
      returnHtml += addLayer( { index: index, shape: type, active: active } );
      // Render sub items if a group.
      if (object.type && object.type == 'group' && object.temporary == false) {
        returnHtml += '<div class="item"><div class="list">';
        var objects = object.getObjects();
        objects.reverse().forEach(function(group_object){
          returnHtml += app$4.layers.renderItem(object.getObjects(), group_object);
        });
        returnHtml += '</div></div>';
      }

      return returnHtml;
    };

    LayerControls.prototype.updateLayers = function updateLayers () {
      var objects = app$4.fabric.model.canvas.getObjects();
      var layersHTML = '';
      objects.reverse().forEach(function(object){
        if (object.temporary == false) {
          layersHTML += app$4.layers.renderItem(app$4.fabric.model.canvas.getObjects(), object);
        }
      });

      $__default["default"]('#layers').html(layersHTML);

      // Bind events to all the newly added rows.
      objects.forEach(function(object){
        var index = app$4.fabric.model.canvas.getObjects().indexOf(object);
        $__default["default"]('#layers #item-' + index + ' .description').click(function(){
          app$4.fabric.model.canvas.setActiveObject(app$4.fabric.model.canvas.item(index));
        });
        $__default["default"]('#layers #item-' + index + ' .back').click(function(){
          app$4.fabric.model.canvas.sendBackwards(object);
          app$4.layers.updateLayers();
        });
        $__default["default"]('#layers #item-' + index + ' .forward').click(function(){
          app$4.fabric.model.canvas.bringForward(object);
          app$4.layers.updateLayers();
        });
        $__default["default"]('#layers #item-' + index + ' .display.toggle').click(function(){
          console.log(object);
          console.log($__default["default"](this));
          if ($__default["default"](this).find('i.eye.icon').hasClass('slash')) {
            object.visible = true;
          }
          else {
            object.visible = false;          
          }
          app$4.fabric.model.canvas.renderAll();
          $__default["default"](this).find('i.eye.icon').toggleClass('slash');
        });
      });
    };

    return LayerControls;
  }(BaseControls));

  /**
    * Library controls
    */

  var app$3 = {};
  var LibraryControls = /*@__PURE__*/(function (BaseControls) {
    function LibraryControls( appInstance ) {
      app$3 = appInstance;
      BaseControls.call(this);
      var el = document.getElementById( 'library' );
      if ( !el ) {
        return;
      }
      $__default["default"]( '#btnUploadImage' )
        .on( 'click', function ( e ) {
          e.stopImmediatePropagation();
          e.preventDefault();
          $__default["default"]( '#image_input' ).click();
        } );
      $__default["default"]( '#image_input' )
        .on( 'change', function ( e ) {
          window.URL = window.URL || window.webkitURL || window.mozURL;
          var url = URL.createObjectURL( e.currentTarget.files[ 0 ] );
          $__default["default"]( addLibraryItem( { url: url } ) )
            .insertBefore( '#btnUploadImage' );
        } );
      $__default["default"]( '#library' ).on( 'click', 'a', function ( e ) {
        var src = $__default["default"]( e.target ).attr( 'src' );

        fabric.Image.fromURL( src, function ( img ) {
          app$3.fabric.model.helpers.addToCenter( img );
        } );

      } );

    }

    if ( BaseControls ) LibraryControls.__proto__ = BaseControls;
    LibraryControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    LibraryControls.prototype.constructor = LibraryControls;

    return LibraryControls;
  }(BaseControls));

  function timelineTemplate(locals) {var pug_html = "", pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (active, frameLimit) {
  pug_html = pug_html + "\u003Cdiv id=\"seeker\"\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ctable class=\"ui inverted structured celled compact small table\" id=\"timeline\"\u003E";
  pug_html = pug_html + "\u003Cthead\u003E";
  var n = 0;
  pug_html = pug_html + "\u003Ctr\u003E";
  pug_html = pug_html + "\u003Cth style=\"display: flex; justify-content: space-evenly;\"\u003E";
  pug_html = pug_html + "&nbsp;\u003C\u002Fth\u003E";
  while (n < frameLimit) {
  pug_html = pug_html + "\u003Cth" + (" style=\"text-align: center;\""+pug.attr("data-frame-position", n, true, true)) + "\u003E";
  pug_html = pug_html + (pug.escape(null == (pug_interp = n++) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
  }
  pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E";
  pug_html = pug_html + "\u003Ctbody\u003E";
  n = 0;
  pug_html = pug_html + "\u003Ctr\u003E";
  pug_html = pug_html + "\u003Ctd style=\"display: flex; justify-content: space-evenly;\"\u003E";
  pug_html = pug_html + "\u003Cbutton class=\"ui compact mini icon button\"\u003E";
  pug_html = pug_html + "1x\u003C\u002Fbutton\u003E";
  pug_html = pug_html + "\u003Cbutton class=\"ui compact mini icon button\" id=\"rewind\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icon fast backward\"\u003E\u003C\u002Fi\u003E\u003C\u002Fbutton\u003E";
  pug_html = pug_html + "\u003Cbutton class=\"ui compact mini icon button\" id=\"play\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icon play\"\u003E\u003C\u002Fi\u003E\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E";
  while (n < frameLimit) {
  active = n == 0 ? ' active' : '';
  pug_html = pug_html + "\u003Ctd" + (pug.attr("class", pug.classes(["selectable",active], [false,true]), false, true)+pug.attr("data-frame-position", n, true, true)) + "\u003E";
  pug_html = pug_html + "&nbsp;\u003C\u002Ftd\u003E";
  n++;
  }
  pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";}.call(this,"active" in locals_for_with?locals_for_with.active:typeof active!=="undefined"?active:undefined,"frameLimit" in locals_for_with?locals_for_with.frameLimit:typeof frameLimit!=="undefined"?frameLimit:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Timeline controls
    */

  var app$2 = {};
  var TimelineControls = /*@__PURE__*/(function (BaseControls) {
    function TimelineControls( appInstance ) {
      var this$1$1 = this;

      app$2 = appInstance;
      BaseControls.call(this);

      this.el = document.getElementById( 'timeline' );
      if ( !this.el ) {
        return;
      }

      this.playing = false;
      this.currentFrame = 0;
      this.frameLimit = 30;
      this.frames = {};
      this.frameElapsed = 0;
      this.frameLength = 50; // ms per frame.

      this.el.innerHTML = timelineTemplate( {
        frameLimit: this.frameLimit
      } );

      this.el
        .querySelectorAll( 'th, td' ).forEach( function ( frame_cell ) {
          frame_cell.addEventListener( 'click', function ( event ) {
            if ( event.target.dataset.framePosition ) {
              var seekerElement = document.getElementById( "seeker" );
              this$1$1.selectFrameByElement( seekerElement, event.target );
            }
          } );
        } );

      // Make the DIV element draggable.
      this.setupSeeker( document.getElementById( "seeker" ) );

      // Select the first frame.
      this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="0"]') );

      // Play button.
      $('#timeline #play')
        .on('click', function () {
          // Toggle the icon
          var $icon = $('#timeline #play i');
          if ($icon.hasClass('play')) {
            $icon.removeClass('play');
            $icon.addClass('pause');
            this$1$1.playing = performance.now();
          }
          else {
            $icon.addClass('play');
            $icon.removeClass('pause');
            this$1$1.playing = false;
          }
        });
      
    }

    if ( BaseControls ) TimelineControls.__proto__ = BaseControls;
    TimelineControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    TimelineControls.prototype.constructor = TimelineControls;

    TimelineControls.prototype.animate = function animate (timestamp) {
      var this$1$1 = this;

      if (this.playing) {
        this.frameElapsed += timestamp - this.playing;
        if (this.frameElapsed >= this.frameLength) {
          this.currentFrame = parseInt(this.currentFrame + 1);
          var seekerElement = document.getElementById( "seeker" );
          var targetElement = document.querySelector('td[data-frame-position="' + this.currentFrame + '"]');
          var framePosition = targetElement.getBoundingClientRect();
          seekerElement.style.left = ( framePosition.left ) + "px";
          seekerElement.style.width = ( 1 + framePosition.right - framePosition.left ) + "px";
      
          this.frameElapsed = 0;
        }

        // Check how many keyframes to play after this tween.
        var keyframesLeft = 0;
        Object.keys(this.frames).forEach(function (framePosition){
          if (framePosition > this$1$1.currentFrame) {
            keyframesLeft++;
          }
        });
        // Loop back if not frames left.
        if (keyframesLeft == 0) {
          this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="0"]') );
        }

        this.playing = performance.now();  

      }

      window.requestAnimationFrame(this.animate.bind(this));
    };

    TimelineControls.prototype.ready = function ready () {
      var this$1$1 = this;

      // Initialise frame 0
      this.frames[this.currentFrame] = JSON.parse(JSON.stringify(app$2.fabric.model.canvas.getObjects()));

      // Animation demo
      // 1. Select frame 10
      this.selectFrameByElement ( document.getElementById( "seeker" ) , document.querySelector('[data-frame-position="10"]') );
      app$2.fabric.model.canvas.getObjects().map( function (object) {
        object.set('left', parseInt(object.left + 200, 10)).setCoords();
        object.set('top', parseInt(object.top + 200, 10)).setCoords();

        this$1$1.frames[this$1$1.currentFrame] = JSON.parse(JSON.stringify(app$2.fabric.model.canvas.getObjects()));
        console.log('Modified frame #' , this$1$1.currentFrame);
        console.log(this$1$1.frames);
      });

      // Make the 10th frame active
      document.querySelector('td[data-frame-position="10"]').classList.add('active');

      // Handle changes to the canvas.
      app$2.fabric.model.canvas.on( 'history:append' , function (json) {
        
      });

      this.animate();
    };

    TimelineControls.prototype.addKeyFrame = function addKeyFrame ( frameIndex ) {
      console.log( 'Added ', frameIndex );
    };

    TimelineControls.prototype.selectFrameByElement = function selectFrameByElement ( seekerElement, targetElement ) {
      var framePosition = targetElement.getBoundingClientRect();
      seekerElement.style.left = ( framePosition.left ) + "px";
      seekerElement.style.width = ( 1 + framePosition.right - framePosition.left ) + "px";

      this.currentFrame = targetElement.dataset.framePosition;
    };

    TimelineControls.prototype.setupSeeker = function setupSeeker ( seekerElement ) {
      var self = this;
      var rect = seekerElement.getBoundingClientRect();

      var initialOffset = 0;
      var initialWidth = 50;

      var pos1 = 0, pos3 = 0, pos4 = 0;
      if ( document.getElementById( seekerElement.id + "header" ) ) {
        // if present, the header is where you move the DIV from:
        document.getElementById( seekerElement.id + "header" ).onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        seekerElement.onmousedown = dragMouseDown;
      }

      function dragMouseDown( e ) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        seekerElement.classList.add( 'active' );
        initialOffset = seekerElement.offsetLeft;
        initialWidth = seekerElement.offsetWidth;
      }

      function elementDrag( e ) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        //seekerElement.style.top = (seekerElement.offsetTop - pos2) + "px";
        seekerElement.style.left = ( seekerElement.offsetLeft - pos1 ) + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        var closestElements = document.elementsFromPoint( seekerElement.offsetLeft, rect.top );
        var matched = false;
        closestElements.forEach( function ( closestElement ) {
          if ( closestElement.tagName == 'TH' && closestElement.dataset.framePosition ) {
            matched = true;
            self.selectFrameByElement( seekerElement, closestElement );
          }
        } );
        if ( !matched ) {

          seekerElement.style.left = initialOffset + "px";
          seekerElement.style.width = initialWidth + "px";
        }

        seekerElement.classList.remove( 'active' );

      }
    };

    return TimelineControls;
  }(BaseControls));

  var app$1 = {};
  var ToolbarControls = /*@__PURE__*/(function (BaseControls) {
    function ToolbarControls(appInstance) {
      app$1 = appInstance;
      BaseControls.call(this);
      this.setupDefaultMenu();

      $__default["default"](window).on('resize', function () {
        app$1.fabric.model.helpers.updateCanvasSize();
      });
     
    }

    if ( BaseControls ) ToolbarControls.__proto__ = BaseControls;
    ToolbarControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    ToolbarControls.prototype.constructor = ToolbarControls;
    
    ToolbarControls.prototype.setupDefaultMenu = function setupDefaultMenu () {
      $__default["default"]('#btnRedo')
      .popup({
        title: 'Redo',
        position: 'right center'
      })
      .on('click', function(){
        app$1.fabric.model.canvas.redo(function() { 
          console.log('post redo');
        });
      });
      $__default["default"]('#btnUndo')
      .popup({
        title: 'Undo',
        position: 'right center'
      })
      .on('click', function(){
        app$1.fabric.model.canvas.undo(function() { 
          console.log('post undo');
        });
        
        
      });
      $__default["default"]('#btnDrawTool')
        .popup({
          title: 'Draw',
          position: 'right center'
        })
        .on('click', function(){
          $__default["default"](this).find('i.icon').toggleClass('grey');
          $__default["default"](this).find('i.icon').toggleClass('inverted');
          if ($__default["default"](this).find('i.icon').hasClass('grey')) {
            app$1.fabric.model.canvas.isDrawingMode = false;
          }
          if ($__default["default"](this).find('i.icon').hasClass('inverted')) {
            app$1.fabric.model.canvas.isDrawingMode = true;
          }
        });

      // @TODO: https://codepen.io/shershen08/pen/JGepQv
      $__default["default"]('#btnAddText')
        .popup({
          title: 'Text',
          position: 'right center'
        })
        .on('click', function(){
          var textBox = new fabric__default["default"].Textbox("Sample Text", {
            fontFamily: 'Arial'
          });
          app$1.fabric.model.helpers.addToCenter(textBox);
        });

      // Track which overlays we hid so we don't override other settings.
      var overlays_visible = [];
      $__default["default"]('#btnToggleOverlays')
        .popup({
          title: 'Toggle All Overlays',
          position: 'right center'
        })
        .on('click', function(){
          if ($__default["default"](this).find('i.eye.icon').hasClass('slash')) {
            if (overlays_visible.length > 0) {
              $__default["default"](overlays_visible).each(function(i, overlay){
                $__default["default"](overlay).show();
              });
              overlays_visible = [];
            }
          }
          else {
            overlays_visible = $__default["default"]('.floating.overlay:visible');
            $__default["default"]('.floating.overlay:visible').hide();
          }
          $__default["default"](this).find('i.icon').toggleClass('slash');
        });

      $__default["default"]('#btnToggle3DOptions')
        .popup({
          title: 'Toggle 3D Options',
          position: 'right center'
        })
        .on('click', function(){
          $__default["default"](this).find('i.icon').toggleClass('disabled');
          $__default["default"]('#threeD-tool').toggle();
        });
      $__default["default"]('#btnAddCircle')
        .popup({
          title: 'Circle',
          position: 'right center'
        })
        .on('click', function(){
          var circle = new fabric__default["default"].Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
          app$1.fabric.model.helpers.addToCenter(circle);
        });
      $__default["default"]('#btnAddSquare')
        .popup({
          title: 'Square',
          position: 'right center'
        })
        .on('click', function(){
          var rect = new fabric__default["default"].Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 200
          });
          app$1.fabric.model.helpers.addToCenter(rect);
        });
      $__default["default"]('#btnAddTriangle')
        .popup({
          title: 'Triangle',
          position: 'right center'
        })
        .on('click', function(){
          var triangle = new fabric__default["default"].Triangle({ width: 200, height: 200, fill: 'blue', left: 50, top: 50 });
          app$1.fabric.model.helpers.addToCenter(triangle);
        });
    };

    ToolbarControls.prototype.toggle = function toggle () {
      if (!app$1.fabric.model.attributes.transitioning) {
        $__default["default"]("#toolbar")
          .sidebar({
            dimPage: false,
            transition: 'push',
            exclusive: false,
            closable: false,
            onChange: function() {
              app$1.fabric.model.attributes.transitioning = true;
            },
            onHide: function() {
              app$1.fabric.model.attributes.transitioning = false;
            },
            onShow: function() {
              app$1.fabric.model.attributes.transitioning = false;
            }
          })
          .sidebar("toggle");
        app$1.fabric.model.helpers.updateCanvasSize();
      }
    };

    return ToolbarControls;
  }(BaseControls));

  /**
    * ImageTracer view.
    *
    * Manages all UI elements relating to ImageTracer integration.
    */

  var ImageTracerIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function ImageTracerIntegration(app) {
      var this$1$1 = this;


      this.controls = ImageTracer__default["default"].checkoptions();
      this.controls.numberofcolors = 16;
      this.controls.strokewidth = 2;
      this.controls.viewbox = true;
      console.log(this.controls);
      
      BaseIntegration.call(this);

      $('.imagetracerConfig').on('change', function () {
        console.log('hiii');
        this$1$1.preview(app);
      });

      $('.imagetracer.controls .ui.slider.colours').slider({
        min: 2,
        max: 16,
        start: 4,
        step: 2,
        onChange: function () { this$1$1.preview(app); }
      });
      // $('.imagetracer.controls .ui.slider.mincolorratio').slider({
      //   min: 0,
      //   max: 800,
      //   start: 0,
      //   step: 100,
      //   onChange: () => { this.preview(app) }
      // });
    }

    if ( BaseIntegration ) ImageTracerIntegration.__proto__ = BaseIntegration;
    ImageTracerIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    ImageTracerIntegration.prototype.constructor = ImageTracerIntegration;

    ImageTracerIntegration.prototype.preview = function preview (app) {
      var preset = $('.preset').find(":selected").text().toLowerCase();
      app.vector.imagetracer.controls.numberofcolors = $('.ui.slider.colours').slider('get value');
      app.vector.imagetracer.controls.mincolorratio = $('.mincolorratio').val();
      app.vector.imagetracer.controls.colorquantcycles = $('.colorquantcycles').val();
      app.vector.imagetracer.controls.ltres = $('.ltres').val();
      app.vector.imagetracer.controls.qtres = $('.qtres').val();
      app.vector.imagetracer.controls.pathomit = $('.pathomit').val();
      app.vector.imagetracer.controls.rightangleenhance =  $('.rightangleenhance').is(":checked");
      app.vector.imagetracer.controls.layering =  $('.layering').is(":checked");
      app.vector.imagetracer.controls.blurradius =  $('.blurradius').val();
      app.vector.imagetracer.controls.blurdelta =  $('.blurdelta').val();
      // Potrace.setParameter({
      //   alphamax: $('.alphamax').val(),
      //   optcurve: $('.optcurve').is(":checked"),
      //   opttolerance: $('.opttolerance').val(),
      //   turdsize: $('.turdsize').val(),
      //   turnpolicy: $('.turnpolicy').find(":selected").text().toLowerCase()
      // });

      var selectedObjects = app.fabric.model.canvas.getActiveObjects();
      ImageTracer__default["default"].imageToSVG(selectedObjects[0]._element.src, function(svg) {
        app.fabric.model.helpers.loadSVG(svg, function () {}, true);
      }, preset != 'default' ? preset : app.vector.imagetracer.controls);
    };
   
    // Duplicates the image programatically so we can get its original dimensions.
    ImageTracerIntegration.prototype.getImageDimensions = function getImageDimensions () {
      var original_image = document.getElementById('original-image');
      var img = document.createElement('img');
      img.src = original_image.src;
      
      // Get the image data from a virtual canvas.
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext('2d');
      context.drawImage(img,0,0);
      
      return context.getImageData(0, 0, img.width, img.height);
    };

    return ImageTracerIntegration;
  }(BaseIntegration));

  /**
    * Potrace model for the main canvas.
    */

  var PotraceIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function PotraceIntegration(app) {
      var this$1$1 = this;

      BaseIntegration.call(this);
      // *     parameters:
      // *        turnpolicy ("black" / "white" / "left" / "right" / "minority" / "majority")
      // *          how to resolve ambiguities in path decomposition. (default: "minority")       
      // *        turdsize
      // *          suppress speckles of up to this size (default: 2)
      // *        optcurve (true / false)
      // *          turn on/off curve optimization (default: true)
      // *        alphamax
      // *          corner threshold parameter (default: 1)
      // *        opttolerance 
      // *          curve optimization tolerance (default: 0.2)
      Potrace__default["default"].setParameter({
        alphamax: 1,
        optcurve: false,
        opttolerance: 0.2,
        turdsize: 100,
        turnpolicy: "black"
      });

      $__default["default"]('.potraceConfig').on('change', function () {
        this$1$1.preview(app);
      });
    }

    if ( BaseIntegration ) PotraceIntegration.__proto__ = BaseIntegration;
    PotraceIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    PotraceIntegration.prototype.constructor = PotraceIntegration;

    PotraceIntegration.prototype.createSVG = function createSVG (src, callbackFn) {
      // Create an SVG from data and settings, draw to screen.
      Potrace__default["default"].clear();
      Potrace__default["default"].loadImageFromSrc(src);
      Potrace__default["default"].process(function() {
        var svg = Potrace__default["default"].getSVG(1);
        var randomColor = function () { return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6); };
        var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        // normalize should be used to get back absolute segments
        var pathsDatas = $__default["default"](svg).find('path')[0].getPathData({ normalize: true }).reduce(function (acc, seg) {
          var pathData = seg.type === 'M' ? [] : acc.pop();
          seg.values = seg.values.map(function (v) { return Math.round(v * 1000) / 1000; });
          pathData.push(seg);
          acc.push(pathData); 
          
          return acc;
        }, []);

        pathsDatas.forEach(function(d) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setPathData(d);
          path.setAttribute('fill', randomColor());
          newSVG.appendChild(path);
        });

        callbackFn(newSVG.outerHTML);
      });
    };

    PotraceIntegration.prototype.preview = function preview (app) {
      Potrace__default["default"].setParameter({
        alphamax: $__default["default"]('.alphamax').val(),
        optcurve: $__default["default"]('.optcurve').is(":checked"),
        opttolerance: $__default["default"]('.opttolerance').val(),
        turdsize: $__default["default"]('.turdsize').val(),
        turnpolicy: $__default["default"]('.turnpolicy').find(":selected").text().toLowerCase()
      });

      var selectedObjects = app.fabric.model.canvas.getActiveObjects();
      app.vector.potrace.createSVG(selectedObjects[0]._element.src, function(svg) {
        app.fabric.model.helpers.loadSVG(svg, function () {}, true);
      });
    };

    return PotraceIntegration;
  }(BaseIntegration));

  /**
    * Vector converter controls
    * 
    * Set which framework (Imagetracer|Potrace) and what it's settings are
    */

  var app = {};
  var VectorControls = /*@__PURE__*/(function (BaseControls) {
    function VectorControls( appInstance ) {
      var this$1$1 = this;

      app = appInstance;
      BaseControls.call(this);
      var el = document.getElementById( 'vector-tool' );
      if ( !el ) {
        return;
      }
      this.imagetracer = new ImageTracerIntegration( app );
      this.potrace = new PotraceIntegration( app );

      this.updateSelection();

      $__default["default"]( '#vector-tool .method input' ).change( function () {
        this$1$1.updateSelection();
        this$1$1.preview( app );
      } );
    }

    if ( BaseControls ) VectorControls.__proto__ = BaseControls;
    VectorControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    VectorControls.prototype.constructor = VectorControls;

    VectorControls.prototype.updateSelection = function updateSelection () {
      this.selected = $__default["default"]( '#vector-tool .method input:checked' ).val();
      $__default["default"]( '#vector-tool .controls:not(.' + this.selected + ')' ).slideUp();
      $__default["default"]( '#vector-tool .controls.' + this.selected ).slideDown();
    };

    VectorControls.prototype.preview = function preview ( app ) {
      this[ this.selected ].preview( app );
    };

    VectorControls.prototype.create = function create ( app, replace ) {
      if ( replace === void 0 ) replace = false;

      // @todo: Expand when other things are set to temporary
      var objects = app.fabric.model.canvas.getObjects();
      objects.forEach( function ( object ) {
        if ( object.temporary ) {
          object.temporary = false;
        }
      } );
      if ( replace ) {
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();
        app.fabric.model.canvas.remove( selectedObjects[ 0 ] );
      }
    };

    return VectorControls;
  }(BaseControls));

  // External libs

  /**
   * Manifold Browser Application
   */
  var App = function App() {
    // Integrations
    this.fabric = new FabricJSIntegration(this);
    this.fomantic = new FomanticIntegration(this);
    this.ThreeCanvasModel = [];
    this.ThreeCanvasView = [];

    // Events
    this.events = {};
    this.events.drop = new DropEvents(this);
    this.events.key = new KeyEvents(this);

    // UI    
    this.layers = new LayerControls(this);
    this.library = new LibraryControls(this);
    this.timeline = new TimelineControls(this);
    this.toolbar = new ToolbarControls(this);
    this.vector = new VectorControls(this);
  };

  // Startup using jQuery.ready()
  $__default["default"](function () {
    var app = new App();

    // Run all the ready functions
    for (var classInstance in app) {
      if (app[classInstance].ready) {
        app[classInstance].ready();
      }
    }
  });

  return App;

})(jQuery, fabric, THREE, ImageTracer, Potrace);
//# sourceMappingURL=app.js.map
