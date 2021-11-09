var ManifoldApplication = (function ($$1, fabric, THREE, Potrace) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($$1);
  var fabric__default = /*#__PURE__*/_interopDefaultLegacy(fabric);
  var THREE__default = /*#__PURE__*/_interopDefaultLegacy(THREE);
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

  var app$6 = {};
  var ColourPickerControls = /*@__PURE__*/(function (BaseControls) {
    function ColourPickerControls(appInstance) {
      app$6 = appInstance;
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

      if (app$6.fabric.model.canvas) {
        $__default["default"]('#btnFillActive .icon').css('color', '#' + hex);
        app$6.fabric.model.canvas.getActiveObject().set("fill", '#' + hex);
        app$6.fabric.model.canvas.renderAll();
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

  var app$5 = {};
  var ThreeJSIntegrationExtras = function ThreeJSIntegrationExtras(appInstance) {
    app$5 = appInstance;
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

    if (app$5 && app$5.fabric && app$5.fabric.model.canvas) {
      app$5.fabric.model.canvas.renderAll();
    }
  };

  ThreeJSIntegrationExtras.prototype.resize = function resize () {
    this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
    this.attributes.camera.updateProjectionMatrix();

    this.attributes.camera.position.setZ((this.attributes.width/ this.attributes.height) * this.attributes.extrudeAmount * 8);

    this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
  };

  var app$4 = {};
  var FabricJSIntegrationEvents = function FabricJSIntegrationEvents(appInstance) {
    app$4 = appInstance;
  };

  FabricJSIntegrationEvents.prototype.setupEvents = function setupEvents () {
    // Credit - https://stackoverflow.com/a/24238960
    app$4.fabric.model.canvas.on('object:moving', function (e) {
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

    $__default["default"]('.potraceConfig').on('change', function () {
      app$4.fabric.model.potrace.preview(app$4);
    });

    // Hide previous active context windows
    var clearOverlays = function() { 
      $__default["default"]('.model-preview').hide();
      $__default["default"]('#vector-tool').hide();
      $__default["default"]('.active-object-context').remove();
      $__default["default"]('#fill-tool').hide();

      // Remove any objects added to the canvas by tools, i.e. previews
      var objects = app$4.fabric.model.canvas.getObjects();
      objects.forEach(function (object) {
        if (object.temporary) {
          app$4.fabric.model.canvas.remove(object);  
        }
      });
    };
    // Create the active object context menu when selecting an object.
    var selectionCallback = function(e) {
      clearOverlays();

      var $menu = $__default["default"](activeObjectContext());
      $__default["default"]('#container').append($menu);
      var offsetX = e.target.left + ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);

      // Set the menu to be draggable
      $__default["default"]('.floating.overlay').draggable();

      switch(e.target.type) {
        case 'image':
          $__default["default"]('#btnToggleVector').removeClass('disabled');
          break;
      }

      // Not 3D, not text, not group
      if (!e.target._element && !e.target.text && !e.target._objects) {
        $__default["default"]('#btnMake3D').removeClass('disabled');
      }
      // Not 3D, not group
      if (!e.target._element && !e.target._objects) {
        $__default["default"]('#btnFillActive').removeClass('disabled');
        $__default["default"]('#btnFillActive .icon').css('color', e.target.fill);
        app$4.fabric.model.colourPickerModel.lookupAndSetColour(e.target.fill);
      }
      // Is group.
      if (e.target._objects) {

        $__default["default"]('#btnGroupActive').removeClass('disabled');
        if (e.target.type == 'activeSelection') {
          $__default["default"]('#btnGroupActive span').html('Group (' + e.target._objects.length + ')');
        }
        else {
          $__default["default"]('#btnGroupActive span').html('Ungroup (' + e.target._objects.length + ')');
        }
      }

      // Events
      $__default["default"]('#btnGroupActive').click(function() {
        var activeObject = app$4.fabric.model.canvas.getActiveObject();
        if (activeObject.type == 'group') {
          activeObject.toActiveSelection();
        }
        else {
          activeObject.toGroup();
        }
          
        app$4.fabric.model.canvas.discardActiveObject();
        app$4.fabric.model.canvas.requestRenderAll();

        // Update layers tool
        if (app$4.layers) {
          app$4.layers.updateLayers();
        }
      });
        
      $__default["default"]('#btnFillActive:not(.disabled)').click(function(){
        $__default["default"](this).toggleClass('active');
        $__default["default"]('#fill-tool').toggle();
      });
      $__default["default"]('#btnDeleteActive').click(function() {
        var selectedObjects = app$4.fabric.model.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          app$4.fabric.model.canvas.remove(selectedObjects[i]);  
        }
        app$4.fabric.model.canvas.discardActiveObject();
        $__default["default"]('.active-object-context').remove();
        // Update layers tool
        if (app$4.layers) {
          app$4.layers.updateLayers();
        }
      });
      $__default["default"]('#btnSaveSVG').click(function() {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([app$4.fabric.model.canvas.toSVG()], {type: "text/plain"}));
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
          app$4.fabric.model.potrace.preview(app$4);
        });
      // @todo: Move these vector tool event handlers somewhere better
      $__default["default"]('#btnCreateVector').on('click', function () {
        app$4.fabric.model.potrace.create(app$4);
      });
      $__default["default"]('#btnReplaceVector').on('click', function () {
        app$4.fabric.model.potrace.create(app$4, true);
      });
      $__default["default"]('#btnMake3D:not(.disabled)').click(function() {
        var selectedObjects = app$4.fabric.model.canvas.getActiveObjects();

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
              app$4.fabric.model.canvas.add(threeD);
            };
            app$4.ThreeCanvasModel.push(new ThreeJSIntegrationExtras({
              height: obj_height,
              width: obj_width
            }));
            var ThreeFabricObject = new ThreeIntegration({ 
              model: app$4.ThreeCanvasModel[app$4.ThreeCanvasModel.length-1],
              svg: svgElements,
              width: obj_width,
              height: obj_height
            });
            app$4.ThreeCanvasView.push( ThreeFabricObject );
            create3DObject(app$4.ThreeCanvasView[app$4.ThreeCanvasView.length-1]);
            app$4.fabric.model.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        app$4.fabric.model.canvas.discardActiveObject();
        $__default["default"]('.active-object-context').remove();
      });
      app$4.layers.updateLayers();
    };

    // Separated for Fabric's On not supporting multiple.
    app$4.fabric.model.canvas.on('selection:created', selectionCallback);
    app$4.fabric.model.canvas.on('selection:updated', selectionCallback);

    app$4.fabric.model.canvas.on('mouse:dblclick', function(e){
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

    app$4.fabric.model.canvas.on('selection:cleared', function(){
      clearOverlays();

      if (app$4.layers) {
        app$4.layers.updateLayers();
      }
    });

    // @TODO: Don't follow if user moved the toolbar.
    app$4.fabric.model.canvas.on('object:moving', function(e) {
      var $menu = $__default["default"]('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $__default["default"]('#toolbar').sidebar('is visible') ? $__default["default"]('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > app$4.fabric.model.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = app$4.fabric.model.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    });

    // Update 3D canvas if it's that type of element.
    app$4.fabric.model.canvas.on('object:modified', function(e) {
      if (e.target._element) {
        app$4.fabric.model.events.updateModelPreviewViewPort(e.target);
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
      app$4.ThreeCanvasModel[id].attributes.width = scaledWidth;
      app$4.ThreeCanvasModel[id].attributes.height = scaledHeight;
      app$4.ThreeCanvasModel[id].resize();
        
      target._resetWidthHeight();
    }
  };

  var app$3 = {};
  var FabricJSIntegrationHelpers = function FabricJSIntegrationHelpers(appInstance) {
    app$3 = appInstance;
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
    app$3.fabric.model.canvas.setHeight( height );
    app$3.fabric.model.canvas.setWidth( width );
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
      
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
      
    object.id = object.type + '-' + Math.floor(Date.now() / 1000);
    object.temporary = temporary;

    app$3.fabric.model.canvas.add(object);
    app$3.fabric.model.canvas.moveTo(object, app$3.fabric.model.canvas.getObjects().length);
    // Update layers tool
    if (app$3.layers) {
      app$3.layers.updateLayers();
    }
  };

  /**
    * Potrace model for the main canvas.
    */

  var PotraceIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function PotraceIntegration() {
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
      // Remove other previews
      // @todo: Expand when other things are set to temporary
      var objects = app.fabric.model.canvas.getObjects();
      objects.forEach(function (object) {
        if (object.temporary) {
          app.fabric.model.canvas.remove(object);  
        }
      });

      Potrace__default["default"].setParameter({
        alphamax: $__default["default"]('.alphamax').val(),
        optcurve: $__default["default"]('.optcurve').is(":checked"),
        opttolerance: $__default["default"]('.opttolerance').val(),
        turdsize: $__default["default"]('.turdsize').val(),
        turnpolicy: $__default["default"]('.turnpolicy').find(":selected").text().toLowerCase()
      });

      var selectedObjects = app.fabric.model.canvas.getActiveObjects();
      app.fabric.model.potrace.createSVG(selectedObjects[0]._element.src, function(svg) {
        app.fabric.model.helpers.loadSVG(svg, function () {}, true);
      });
    };

    PotraceIntegration.prototype.create = function create (app, replace) {
      if ( replace === void 0 ) replace = false;

      // @todo: Expand when other things are set to temporary
      var objects = app.fabric.model.canvas.getObjects();
      objects.forEach(function (object) {
        if (object.temporary) {
          object.temporary = false;
        }
      });
      if (replace) {
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();
        app.fabric.model.canvas.remove(selectedObjects[0]);  
      }
    };

    return PotraceIntegration;
  }(BaseIntegration));

  /**
    * Fabric JS Integration.
    */

  var app$2 = {};
  var FabricJSIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function FabricJSIntegration(appInstance) {
      app$2 = appInstance;
      BaseIntegration.call(this);
      this.el = '#main-canvas';
      this.model = {
        colourPickerModel: new ColourPickerControls(appInstance),
        potrace: new PotraceIntegration(),
        canvas: new fabric__default["default"].Canvas('main-canvas', { preserveObjectStacking: true }),
        attributes: {
          canvas: null,
          transitioning: false
        },
        helpers: new FabricJSIntegrationHelpers(appInstance),
        events: new FabricJSIntegrationEvents(appInstance)
      };
    }

    if ( BaseIntegration ) FabricJSIntegration.__proto__ = BaseIntegration;
    FabricJSIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    FabricJSIntegration.prototype.constructor = FabricJSIntegration;

    FabricJSIntegration.prototype.ready = function ready () {
      app$2.fabric.model.events.setupEvents();
      app$2.fabric.model.helpers.updateCanvasSize();
      
      // Default scene.
      var imgSrc = '/assets/demo2.jpg';
      fabric__default["default"].Image.fromURL(imgSrc, function(oImg) {
        app$2.fabric.model.helpers.addToCenter(oImg);
        oImg.left -= 7;
        oImg.top += 13;
        app$2.fabric.model.canvas.setActiveObject(app$2.fabric.model.canvas.item(0));
        $('#btnToggleVector').click();
      });

      // var circle = new fabric.Circle({ radius: 100, fill: '  green' });
      // app.fabric.model.helpers.addToCenter(circle);
      // circle.left -= 75;
      // var rect = new fabric.Rect({
      //   fill: 'red',
      //   width: 200,
      //   height: 200
      // });
      // app.fabric.model.helpers.addToCenter(rect);
      // rect.left += 75;
    };

    return FabricJSIntegration;
  }(BaseIntegration));

  /**
    * Base Events class.
    */

   var BaseEvents = function BaseEvents () {};

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

      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile();
            window.URL = window.URL || window.webkitURL || window.mozURL;
            var url = URL.createObjectURL(file);
            console.log(url);
            //- $(addImageItem({ url: url }))
            //-   .insertBefore('#add-image .ui.menu .item:last-child');
            console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        }
      }
    };

    return DropEvents;
  }(BaseEvents));

  function layersToolItem(locals) {var pug_html = "", pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
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

  var app$1 = {};
  var LayerControls = /*@__PURE__*/(function (BaseControls) {
    function LayerControls(appInstance) {
      app$1 = appInstance;
      BaseControls.call(this);
    }

    if ( BaseControls ) LayerControls.__proto__ = BaseControls;
    LayerControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    LayerControls.prototype.constructor = LayerControls;

    LayerControls.prototype.ready = function ready () {
      this.updateLayers();
    };

    LayerControls.prototype.checkActive = function checkActive (object) {
      var selectedObjects = app$1.fabric.model.canvas.getActiveObjects();
      var active = false;
      selectedObjects.forEach(function (selected_object) {
        if (selected_object.id == object.id) {
          active = true;
        }
      });

      return active;
    };

    LayerControls.prototype.renderItem = function renderItem (parent, object) {
      var active = app$1.layers.checkActive(object),
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
      returnHtml += layersToolItem( { index: index, shape: type, active: active } );
      // Render sub items if a group.
      if (object.type && object.type == 'group' && object.temporary == false) {
        returnHtml += '<div class="item"><div class="list">';
        var objects = object.getObjects();
        objects.reverse().forEach(function(group_object){
          returnHtml += app$1.layers.renderItem(object.getObjects(), group_object);
        });
        returnHtml += '</div></div>';
      }

      return returnHtml;
    };

    LayerControls.prototype.updateLayers = function updateLayers () {
      var objects = app$1.fabric.model.canvas.getObjects();
      var layersHTML = '';
      objects.reverse().forEach(function(object){
        if (object.temporary == false) {
          layersHTML += app$1.layers.renderItem(app$1.fabric.model.canvas.getObjects(), object);
        }
      });

      $__default["default"]('#layers').html(layersHTML);

      // Bind events to all the newly added rows.
      objects.forEach(function(object){
        var index = app$1.fabric.model.canvas.getObjects().indexOf(object);
        $__default["default"]('#layers #item-' + index + ' .description').click(function(){
          app$1.fabric.model.canvas.setActiveObject(app$1.fabric.model.canvas.item(index));
        });
        $__default["default"]('#layers #item-' + index + ' .back').click(function(){
          app$1.fabric.model.canvas.sendBackwards(object);
          app$1.layers.updateLayers();
        });
        $__default["default"]('#layers #item-' + index + ' .forward').click(function(){
          app$1.fabric.model.canvas.bringForward(object);
          app$1.layers.updateLayers();
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
          app$1.fabric.model.canvas.renderAll();
          $__default["default"](this).find('i.eye.icon').toggleClass('slash');
        });
      });
    };

    return LayerControls;
  }(BaseControls));

  function addImageItem(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (url) {
  pug_html = pug_html + "\u003Ca class=\"item image\"\u003E";
  pug_html = pug_html + "\u003Cimg" + (" class=\"ui fluid image small\""+pug.attr("src", url, true, true)) + "\u003E\u003C\u002Fa\u003E";
  }.call(this,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  var app = {};
  var ToolbarControls = /*@__PURE__*/(function (BaseControls) {
    function ToolbarControls(appInstance) {
      app = appInstance;
      BaseControls.call(this);
      this.setupDefaultMenu();

      $__default["default"]('.floating.overlay').draggable();

      $__default["default"]('#add-image').on('click', 'a.item.image', function(e){
        var src = $__default["default"](e.target).attr('src');
        if ($__default["default"]('#btnTraceImage').find('i.icon').hasClass('disabled')) {
          fabric__default["default"].Image.fromURL(src, function(img) {
            app.fabric.model.helpers.addToCenter(img);
          });
        }
        else {
          app.fabric.model.potrace.createSVG(src, function(svg) {
            var hideAddImageFn = function() {
              $__default["default"]('#hideAddImage').click();
            };
            app.fabric.model.helpers.loadSVG(svg, hideAddImageFn);
          });        
        }
      });

      $__default["default"]('.ui.accordion').accordion({
        exclusive: false
      });
      $__default["default"]('.ui.dropdown').dropdown();

      $__default["default"](window).on('resize', function () {
        app.fabric.model.helpers.updateCanvasSize();
      });

      $__default["default"]('#hideAddImage')
        .on('click', function() {
          $__default["default"]('#btnAddImage').find('i.icon').toggleClass('disabled');
          $__default["default"]('#add-image')
            .animate({
             left: '-' + $__default["default"]('#add-image').width() + 'px'
            });
        });
      $__default["default"]('#btnUploadImage')
        .on('click', function(e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          $__default["default"]('#image_input').click();
        });
      $__default["default"]('#image_input')
        .on('change', function(e) {
          window.URL = window.URL || window.webkitURL || window.mozURL;
          var url = URL.createObjectURL(e.currentTarget.files[0]);
          $__default["default"](addImageItem({ url: url }))
            .insertBefore('#add-image .ui.menu .item:last-child');
        });
    }

    if ( BaseControls ) ToolbarControls.__proto__ = BaseControls;
    ToolbarControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    ToolbarControls.prototype.constructor = ToolbarControls;
    
    ToolbarControls.prototype.setupDefaultMenu = function setupDefaultMenu () {
      // Define slideout position based on corresponding menu item.
      $__default["default"]('#add-image').css('top', function(){
        return $__default["default"]('#btnAddImage').offset().top +(($__default["default"]('#btnAddImage').height() / 2) - ($__default["default"](this).height() / 2));
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
            app.fabric.model.canvas.isDrawingMode = false;
          }
          if ($__default["default"](this).find('i.icon').hasClass('inverted')) {
            app.fabric.model.canvas.isDrawingMode = true;
          }
        });

      $__default["default"]('#btnPointTool')
        .popup({
          title: 'Manipulate Shapes',
          position: 'right center'
        });

        $__default["default"]('#btnTraceImage')
        .popup({
          title: 'Trace Image',
          position: 'right center'
        })
        .on('click', function(){
          $__default["default"]('#btnAddImage').find('i.icon').addClass('disabled');
          $__default["default"](this).find('i.icon').toggleClass('disabled');
          if ($__default["default"](this).find('i.icon').hasClass('disabled')) {
            $__default["default"]('#add-image')
              .css('left', '0px')
              .show()
              .animate({
                left: '-' + $__default["default"]('#add-image').width() + 'px'
              });
          }
          else {
            $__default["default"]('#add-image')
              .css('left', '-' + $__default["default"]('#add-image').width() + 'px')
              .show()
              .animate({
                left: '0px'
              });
          }
        });

        $__default["default"]('#btnAddImage')
        .popup({
          title: 'Add Image',
          position: 'right center'
        })
        .on('click', function(){
          $__default["default"]('#btnTraceImage').find('i.icon').addClass('disabled');
          $__default["default"](this).find('i.icon').toggleClass('disabled');
          if ($__default["default"](this).find('i.icon').hasClass('disabled')) {
            $__default["default"]('#add-image')
              .css('left', '0px')
              .show()
              .animate({
                left: '-' + $__default["default"]('#add-image').width() + 'px'
              });
          }
          else {
            $__default["default"]('#add-image')
              .css('left', '-' + $__default["default"]('#add-image').width() + 'px')
              .show()
              .animate({
                left: '0px'
              });
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
          app.fabric.model.helpers.addToCenter(textBox);
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
      $__default["default"]('#btnToggleLayers')
        .popup({
          title: 'Toggle Layer Controls',
          position: 'right center'
        })
        .on('click', function(){
          $__default["default"](this).find('i.icon').toggleClass('disabled');
          $__default["default"]('#layers-tool').toggle();
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
          app.fabric.model.helpers.addToCenter(circle);
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
          app.fabric.model.helpers.addToCenter(rect);
        });
      $__default["default"]('#btnAddTriangle')
        .popup({
          title: 'Triangle',
          position: 'right center'
        })
        .on('click', function(){
          var triangle = new fabric__default["default"].Triangle({ width: 200, height: 200, fill: 'blue', left: 50, top: 50 });
          app.fabric.model.helpers.addToCenter(triangle);
        });
    };

    ToolbarControls.prototype.toggle = function toggle () {
      if (!app.fabric.model.attributes.transitioning) {
        $__default["default"]("#toolbar")
          .sidebar({
            dimPage: false,
            transition: 'push',
            exclusive: false,
            closable: false,
            onChange: function() {
              app.fabric.model.attributes.transitioning = true;
            },
            onHide: function() {
              app.fabric.model.attributes.transitioning = false;
            },
            onShow: function() {
              app.fabric.model.attributes.transitioning = false;
            }
          })
          .sidebar("toggle");
        app.fabric.model.helpers.updateCanvasSize();
      }
    };

    return ToolbarControls;
  }(BaseControls));

  // External libs

  /**
   * Manifold Browser Application
   */
  var App = function App() {
    // Integrations
    this.fabric = new FabricJSIntegration(this);
    this.ThreeCanvasModel = [];
    this.ThreeCanvasView = [];

    // Events
    this.events = {};
    this.events.drop = new DropEvents(this);

    // UI    
    this.layers = new LayerControls(this);
    this.toolbar = new ToolbarControls(this);
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

})(jQuery, fabric, THREE, Potrace);
//# sourceMappingURL=app.js.map
