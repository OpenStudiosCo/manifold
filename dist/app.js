(function (Backbone,ImageTracer,dat,Potrace,$,THREE,$d3g) {
  'use strict';

  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  var ImageTracer__default = 'default' in ImageTracer ? ImageTracer['default'] : ImageTracer;
  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;
  $d3g = $d3g && $d3g.hasOwnProperty('default') ? $d3g['default'] : $d3g;

  /**
    * Base model.
    */

  var BaseModel = (function (superclass) {
    function BaseModel () {
      superclass.apply(this, arguments);
    }if ( superclass ) BaseModel.__proto__ = superclass;
    BaseModel.prototype = Object.create( superclass && superclass.prototype );
    BaseModel.prototype.constructor = BaseModel;

    

    return BaseModel;
  }(Backbone.Model));

  /**
    * Imagetracer Controls model.
    */

  var ImageTracerControls = (function (BaseModel$$1) {
    function ImageTracerControls () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) ImageTracerControls.__proto__ = BaseModel$$1;
    ImageTracerControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ImageTracerControls.prototype.constructor = ImageTracerControls;

    ImageTracerControls.prototype.defaults = function defaults () {
      var controls = ImageTracer.checkoptions();
      controls.numberofcolors = 2;
      controls.strokewidth = 1;
      controls.viewbox = true;

      return controls;
    };

    return ImageTracerControls;
  }(BaseModel));

  /**
    * Potrace Controls model.
    */

  var PotraceControls = (function (BaseModel$$1) {
    function PotraceControls () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) PotraceControls.__proto__ = BaseModel$$1;
    PotraceControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    PotraceControls.prototype.constructor = PotraceControls;

    PotraceControls.prototype.defaults = function defaults () {
      var controls = {
        alphamax: 1,
        optcurve: false,
        opttolerance: 0.2,
        turdsize: 2,
        turnpolicy: "minority"
      };
      
      return controls;
    };

    return PotraceControls;
  }(BaseModel));

  /**
    * Three Controls model.
    */

  var ThreeControls = (function (BaseModel$$1) {
    function ThreeControls () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) ThreeControls.__proto__ = BaseModel$$1;
    ThreeControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ThreeControls.prototype.constructor = ThreeControls;

    ThreeControls.prototype.defaults = function defaults () {
      var controls = {
        'Example 1': "#ffae23",
        'Example 2': "#ae23ff",
        'Example 3': "#23ffae"
      };
      
      return controls;
    };

    return ThreeControls;
  }(BaseModel));

  var pug = (function(exports){

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

  function loader(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"ui active centered inline loader\"\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Base view.
    */

  var gui = new dat.GUI();

  var BaseView = (function (superclass) {
    function BaseView(options) {
      superclass.call(this, options);
      this.gui = gui;

      return this;
  	}

    if ( superclass ) BaseView.__proto__ = superclass;
    BaseView.prototype = Object.create( superclass && superclass.prototype );
    BaseView.prototype.constructor = BaseView;

    BaseView.prototype.generateControls = function generateControls (title) {
      var this$1 = this;

      var guiFolder = this.gui.addFolder(title);
      for (var controlName in this$1.model.attributes) {
        var callback = function() {
          this.$el.html(loader());
          // Wait 100ms so the loader can appear.
          setTimeout(this.createSVG.bind(this), 100);
        };
        if (isNaN(this$1.model.attributes[controlName])) {
          guiFolder.add(this$1.model.attributes, controlName)
            .onFinishChange(callback.bind(this$1));
        }
        else {
          var max = this$1.model.attributes[controlName] * 2;
          max = (max > 0) ? max : 100;
          guiFolder.add(this$1.model.attributes, controlName, 0, max)
            .onFinishChange(callback.bind(this$1));
        }
      }
    };

    return BaseView;
  }(Backbone.View));

  /**
    * ImageTracer view.
    *
    * Manages all UI elements relating to ImageTracer integration.
    */

  var ImageTracerView = (function (BaseView$$1) {
    function ImageTracerView(options) {
      BaseView$$1.call(this, {
        el: '#svg-preview',
        model: options.model
      });

      this.generateControls('ImageTracer Controls');
      this.createSVG();
    }

    if ( BaseView$$1 ) ImageTracerView.__proto__ = BaseView$$1;
    ImageTracerView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    ImageTracerView.prototype.constructor = ImageTracerView;

    // Create an SVG from data and settings, draw to screen.
    ImageTracerView.prototype.createSVG = function createSVG () {  
      var svgStr = ImageTracer__default.imagedataToSVG(this.getImageDimensions(), this.model.attributes);
      this.$el.html('');
      ImageTracer__default.appendSVGString( svgStr, 'svg-preview' );
    };
    
    // Duplicates the image programatically so we can get its original dimensions.
    ImageTracerView.prototype.getImageDimensions = function getImageDimensions () {
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

    return ImageTracerView;
  }(BaseView));

  /**
    * Potrace view.
    *
    * Manages all UI elements relating to Potrace integration.
    */

  var PotraceView = (function (BaseView$$1) {
    function PotraceView(options) {
      BaseView$$1.call(this, {
        el: '#potrace-preview',
        model: options.model
      });
      this.generateControls('Potrace Controls');
      this.createSVG();
    }

    if ( BaseView$$1 ) PotraceView.__proto__ = BaseView$$1;
    PotraceView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    PotraceView.prototype.constructor = PotraceView;

    // Create an SVG from data and settings, draw to screen.
    PotraceView.prototype.createSVG = function createSVG () {  
      Potrace.clear();
      Potrace.setParameter(this.model.attributes);
      Potrace.loadImageFromId('original-image');
      Potrace.process(function(){
        var svgdiv = document.getElementById('potrace-preview');
        svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
      });
    };

    return PotraceView;
  }(BaseView));

  /**
    * Potrace view.
    *
    * Manages all UI elements relating to Potrace integration.
    */

  var ThreeView = (function (BaseView$$1) {
    function ThreeView(options) {
      BaseView$$1.call(this, {
        el: '#model-preview',
        model: options.model
      });
      var guiFolder = this.gui.addFolder('THREE.JS Controls');
      guiFolder.addColor(this.model.attributes, 'Example 1');
      guiFolder.addColor(this.model.attributes, 'Example 2');
      guiFolder.addColor(this.model.attributes, 'Example 3');
    }

    if ( BaseView$$1 ) ThreeView.__proto__ = BaseView$$1;
    ThreeView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    ThreeView.prototype.constructor = ThreeView;

    ThreeView.prototype.createScene = function createScene () {
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
    };
    
    // Adds an object from an SVG.
    ThreeView.prototype.addGeoObject = function addGeoObject ( group, svgObject ) {
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
    };

    return ThreeView;
  }(BaseView));

  function imageContainer(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  var locals_for_with = (locals || {});(function (url) {
  pug_html = pug_html + "\u003Cdiv class=\"item\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui white compact button js-change-image\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui fluid image mini\"\u003E";
  pug_html = pug_html + "\u003Cimg" + (pug.attr("src", url, true, true)) + "\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
  }.call(this,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Application UI.
    *
    * Manages all UI elements for the core application.
    */

  var AppUI = (function (BaseView$$1) {
    function AppUI(imageTracerView, potraceView, threeView) {
      BaseView$$1.call(this, {
        el: '#container',
        events: {
          'click #image_select': 'launchFileBrowser',
          'change #image_input': 'processFile',
          'click .js-change-image': 'changeImage',
          'click #btnRender': 'render3D'
        }  
      });
      this.views = {
        imagetracer: imageTracerView,
        potrace: potraceView,
        three: threeView
      };
    }

    if ( BaseView$$1 ) AppUI.__proto__ = BaseView$$1;
    AppUI.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    AppUI.prototype.constructor = AppUI;

    AppUI.prototype.launchFileBrowser = function launchFileBrowser (e) {
      $('#image_input').click();
      e.preventDefault();
    };

    AppUI.prototype.processFile = function processFile (e) {
      window.URL = window.URL || window.webkitURL || window.mozURL;
      var url = URL.createObjectURL(e.currentTarget.files[0]);
      $(imageContainer({url: url}))
        .insertBefore('.ui.inverted.top.fixed.menu .item:last-child');
    };

    AppUI.prototype.changeImage = function changeImage (e) {
      $('#original-image').attr('src', $(e.currentTarget).find('img').attr('src'));
      $('#svg-preview, #potrace-preview').html(loader());
      var callback = function(){
        this.views.imagetracer.createSVG();
        this.views.potrace.createSVG();
      };
      setTimeout(callback.bind(this), 100);
    };

    AppUI.prototype.render3D = function render3D () {
      this.views.three.$el.html(loader());
      setTimeout(this.views.three.createScene.bind(this.views.three), 100);
    };

    return AppUI;
  }(BaseView));

  // External libs

  /**
   * Manifold Browser Application
   */
  $(function () {
    var imageTracerView = new ImageTracerView({
      model: new ImageTracerControls()
    });

    var potraceView = new PotraceView({
      model: new PotraceControls()
    });

    var threeView = new ThreeView({
      model: new ThreeControls()
    });

    var appUI = new AppUI(imageTracerView, potraceView, threeView);
    console.log(appUI);
  });

}(Backbone,ImageTracer,dat,Potrace,jQuery,THREE,$d3g));
//# sourceMappingURL=app.js.map
