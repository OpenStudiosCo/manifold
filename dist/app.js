var ManifoldApplication = (function (Backbone,ImageTracer,$,fabric,Potrace,THREE,dat) {
  'use strict';

  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  var ImageTracer__default = 'default' in ImageTracer ? ImageTracer['default'] : ImageTracer;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  fabric = fabric && fabric.hasOwnProperty('default') ? fabric['default'] : fabric;
  Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
  THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;
  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;

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

  var ImageTracerControlsModel = (function (BaseModel$$1) {
    function ImageTracerControlsModel () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) ImageTracerControlsModel.__proto__ = BaseModel$$1;
    ImageTracerControlsModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ImageTracerControlsModel.prototype.constructor = ImageTracerControlsModel;

    ImageTracerControlsModel.prototype.defaults = function defaults () {
      var controls = ImageTracer.checkoptions();
      controls.numberofcolors = 2;
      controls.strokewidth = 1;
      controls.viewbox = true;

      return controls;
    };

    return ImageTracerControlsModel;
  }(BaseModel));

  /**
    * Potrace Controls model.
    */

  var PotraceControlsModel = (function (BaseModel$$1) {
    function PotraceControlsModel () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) PotraceControlsModel.__proto__ = BaseModel$$1;
    PotraceControlsModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    PotraceControlsModel.prototype.constructor = PotraceControlsModel;

    PotraceControlsModel.prototype.defaults = function defaults () {
      var controls = {
        alphamax: 1,
        optcurve: false,
        opttolerance: 0.2,
        turdsize: 2,
        turnpolicy: "minority"
      };
      
      return controls;
    };

    return PotraceControlsModel;
  }(BaseModel));

  /**
    * Three Controls model.
    */

  var ThreeControlsModel = (function (BaseModel$$1) {
    function ThreeControlsModel () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) ThreeControlsModel.__proto__ = BaseModel$$1;
    ThreeControlsModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ThreeControlsModel.prototype.constructor = ThreeControlsModel;

    ThreeControlsModel.prototype.defaults = function defaults () {
      var controls = {
        'Example 1': "#ffae23",
        'Example 2': "#ae23ff",
        'Example 3': "#23ffae",
        'Show Helpers': true
      };
      
      return controls;
    };

    return ThreeControlsModel;
  }(BaseModel));

  /**
    * Raster To SVG model.
    */

  var MainCanvasModel = (function (BaseModel$$1) {
    function MainCanvasModel() {
      BaseModel$$1.call(this);
      this.attributes.canvas = new fabric.Canvas('main-canvas');

      // Setup pan and zoom.
      this.attributes.canvas.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var pointer = this.attributes.canvas.getPointer(opt.e);
        var zoom = this.attributes.canvas.getZoom();
        zoom = zoom + delta/200;
        if (zoom > 20) { zoom = 20; }
        if (zoom < 0.01) { zoom = 0.01; }
        this.attributes.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }.bind(this));

      // Credit - https://stackoverflow.com/a/24238960
      this.attributes.canvas.on('object:moving', function (e) {
        var obj = e.target;
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
      });
          
      this.updateCanvasSize();
    }

    if ( BaseModel$$1 ) MainCanvasModel.__proto__ = BaseModel$$1;
    MainCanvasModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    MainCanvasModel.prototype.constructor = MainCanvasModel;

    MainCanvasModel.prototype.defaults = function defaults () {
      var attributes = {
        canvas: null,
        transitioning: false
      };
      
      return attributes;
    };

    MainCanvasModel.prototype.createSVG = function createSVG (src) {
      // Create an SVG from data and settings, draw to screen.
      Potrace.clear();
      Potrace.loadImageFromSrc(src);
      Potrace.process(function() {
        var svg = Potrace.getSVG(1);
        var randomColor = function () { return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6); };
        var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        // normalize should be used to get back absolute segments
        var pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce(function (acc, seg) {
          var pathData = seg.type === 'M' ? [] : acc.pop();
          seg.values = seg.values.map(function (v) { return Math.round(v * 1000) / 1000; });
          pathData.push(seg);
          acc.push(pathData);
          return acc
        }, []);

        pathsDatas.forEach(function(d) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setPathData(d);
          path.setAttribute('fill', randomColor());
          newSVG.appendChild(path);
        });
        fabric.loadSVGFromString(newSVG.outerHTML, function(objects, options){
          var this$1 = this;

          // Create a group so we add to center accurately.
          var group = new fabric.Group(objects);
          this.addToCenter(group);

          // Ungroup.
          var items = group._objects;
          group._restoreObjectsState();
          this.attributes.canvas.remove(group);
          for (var i = 0; i < items.length; i++) {
            this$1.attributes.canvas.add(items[i]);
          }
          this.attributes.canvas.renderAll();
        }.bind(this));
      }.bind(this));
    };

    MainCanvasModel.prototype.updateCanvasSize = function updateCanvasSize () {
      // TODO: Move this into app view logic.
      var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
      if ($("#toolbar").sidebar('is visible')) {
        width -= $('#toolbar').width();  
      }
      var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      this.attributes.canvas.setHeight( height );
      this.attributes.canvas.setWidth( width );
    };
    MainCanvasModel.prototype.addToCenter = function addToCenter (object) {
      var canvasWidth  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
      if ($("#toolbar").sidebar('is visible')) {
        canvasWidth -= $('#toolbar').width();  
      }
      var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      object.set({left: (canvasWidth / 2) - (object.width / 2), top: (canvasHeight /2 - object.height / 2)});
      
      this.attributes.canvas.add(object);
    };

    return MainCanvasModel;
  }(BaseModel));

  /**
    * Three Canvas model.
    */

  var ThreeCanvasModel = (function (BaseModel$$1) {
    function ThreeCanvasModel(options) {
      BaseModel$$1.call(this, options);
      this.attributes.scene = new THREE.Scene();
      this.attributes.camera = new THREE.PerspectiveCamera( 50, this.attributes.width / this.attributes.height, 1, 100000 );
      this.attributes.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.attributes.renderer.setPixelRatio( window.devicePixelRatio );
      this.attributes.controls = new THREE.OrbitControls( this.attributes.camera, this.attributes.renderer.domElement );
      this.attributes.raycaster = new THREE.Raycaster();
      this.attributes.mouse = new THREE.Vector2();
    }

    if ( BaseModel$$1 ) ThreeCanvasModel.__proto__ = BaseModel$$1;
    ThreeCanvasModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ThreeCanvasModel.prototype.constructor = ThreeCanvasModel;

    // Scene helpers.
    ThreeCanvasModel.prototype.defaults = function defaults () {
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
    };

    ThreeCanvasModel.prototype.addHelpers = function addHelpers () {
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
    };

    ThreeCanvasModel.prototype.clearScene = function clearScene () {
      cancelAnimationFrame( this.attributes.animationId );
      this.attributes.scene.children = [];
      this.attributes.mesh = null;
      this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
      if (app && app.models.controls.three.attributes['Show Helpers']) {
        this.addHelpers();
      }
    };

    ThreeCanvasModel.prototype.animate = function animate () {
      this.attributes.animationId = requestAnimationFrame( this.animate.bind(this) );
      this.render.bind(this)();
    };

    ThreeCanvasModel.prototype.render = function render () {
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
    };

    return ThreeCanvasModel;
  }(BaseModel));

  /**
    * Base view.
    */

  var BaseView = (function (superclass) {
    function BaseView () {
      superclass.apply(this, arguments);
    }if ( superclass ) BaseView.__proto__ = superclass;
    BaseView.prototype = Object.create( superclass && superclass.prototype );
    BaseView.prototype.constructor = BaseView;

    

    return BaseView;
  }(Backbone.View));

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
    * Base Controls view.
    */

  //var gui = new dat.GUI();

  var BaseControlsView = (function (BaseView$$1) {
    function BaseControlsView(options) {
      BaseView$$1.call(this, options);
      this.gui = gui;

      return this;
    }

    if ( BaseView$$1 ) BaseControlsView.__proto__ = BaseView$$1;
    BaseControlsView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    BaseControlsView.prototype.constructor = BaseControlsView;

    BaseControlsView.prototype.generateControls = function generateControls (title) {
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

    return BaseControlsView;
  }(BaseView));

  /**
    * ImageTracer view.
    *
    * Manages all UI elements relating to ImageTracer integration.
    */

  var ImageTracerControlsView = (function (BaseControlsView$$1) {
    function ImageTracerControlsView(options) {
      BaseControlsView$$1.call(this, {
        el: '#imagetracer-preview',
        model: options.model
      });

      this.generateControls('ImageTracer Controls');
    }

    if ( BaseControlsView$$1 ) ImageTracerControlsView.__proto__ = BaseControlsView$$1;
    ImageTracerControlsView.prototype = Object.create( BaseControlsView$$1 && BaseControlsView$$1.prototype );
    ImageTracerControlsView.prototype.constructor = ImageTracerControlsView;

    // Create an SVG from data and settings, draw to screen.
    ImageTracerControlsView.prototype.createSVG = function createSVG () {  
      var svgStr = ImageTracer__default.imagedataToSVG(this.getImageDimensions(), this.model.attributes);
      this.$el.html('');
      ImageTracer__default.appendSVGString( svgStr, 'imagetracer-preview' );
    };
    
    // Duplicates the image programatically so we can get its original dimensions.
    ImageTracerControlsView.prototype.getImageDimensions = function getImageDimensions () {
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

    return ImageTracerControlsView;
  }(BaseControlsView));

  /**
    * Potrace view.
    *
    * Manages all UI elements relating to Potrace integration.
    */

  var PotraceControlsView = (function (BaseControlsView$$1) {
    function PotraceControlsView(options) {
      BaseControlsView$$1.call(this, {
        el: '#potrace-preview',
        model: options.model
      });
      this.generateControls('Potrace Controls');
    }

    if ( BaseControlsView$$1 ) PotraceControlsView.__proto__ = BaseControlsView$$1;
    PotraceControlsView.prototype = Object.create( BaseControlsView$$1 && BaseControlsView$$1.prototype );
    PotraceControlsView.prototype.constructor = PotraceControlsView;

    // Create an SVG from data and settings, draw to screen.
    PotraceControlsView.prototype.createSVG = function createSVG () {  
      Potrace.clear();
      Potrace.setParameter(this.model.attributes);
      Potrace.loadImageFromId('original-image');
      Potrace.process(function(){
        var svgdiv = document.getElementById('potrace-preview');
        svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
      });
    };

    return PotraceControlsView;
  }(BaseControlsView));

  /**
    * Three Controls view.
    *
    * Manages all UI elements relating to THREE.JS integration.
    */

  var ThreeControlsView = (function (BaseControlsView$$1) {
    function ThreeControlsView(options) {
      BaseControlsView$$1.call(this, { model: options.model });
      var guiFolder = this.gui.addFolder('THREE.JS Controls');
      guiFolder.addColor(this.model.attributes, 'Example 1');
      guiFolder.addColor(this.model.attributes, 'Example 2');
      guiFolder.addColor(this.model.attributes, 'Example 3');
      guiFolder.add(this.model.attributes, 'Show Helpers');
    }

    if ( BaseControlsView$$1 ) ThreeControlsView.__proto__ = BaseControlsView$$1;
    ThreeControlsView.prototype = Object.create( BaseControlsView$$1 && BaseControlsView$$1.prototype );
    ThreeControlsView.prototype.constructor = ThreeControlsView;

    return ThreeControlsView;
  }(BaseControlsView));

  function defaultMenu(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddImage\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large icons\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"image icon inverted\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner plus icon green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddShape\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large icons\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"chart pie icon inverted\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner plus icon green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function addShapes(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnBack\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large arrow left icon inverted\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"item\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"menu\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui horizontal divider inverted\"\u003E";
  pug_html = pug_html + "Shapes\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddCircle\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"circle icon large green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddSquare\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"square icon large red\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddTriangle\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"play icon large blue\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * MainCanvas view.
    */

  var MainCanvasView = (function (BaseView$$1) {
    function MainCanvasView(options) {
      BaseView$$1.call(this, {
        el: '#main-canvas',
        model: options.model
      });

      // Initial image
      this.model.createSVG($('#original-image').attr('src'));

      this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);

      this.setupDefaultMenu();

      $('.ui.fullscreen.special.modal.transition').on('click', 'a.image', function(e){
        var src = $(this).find('img').attr('src');
        app.models.mainCanvas.createSVG(src);
        $('.ui.special.modal')
          .modal('hide');
      });

      $('.ui.dropdown').dropdown();

      $(window).on('resize', function () {
        app.models.mainCanvas.updateCanvasSize();
      });
    }

    if ( BaseView$$1 ) MainCanvasView.__proto__ = BaseView$$1;
    MainCanvasView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    MainCanvasView.prototype.constructor = MainCanvasView;

    MainCanvasView.prototype.setupDefaultMenu = function setupDefaultMenu () {
      $('#btnAddImage')
        .popup({
          title: 'Add Image',
          position: 'right center'
        })
        .on('click', function(){
          $('.ui.special.modal')
            .modal({
              centered: false
            })
            .modal('show');
        });

      $('#btnAddShape')
        .popup({
          title: 'Add Shape',
          position: 'right center'
        })
        .on('click', function(){
          $('#toolbar').html(addShapes());
          this.setupAddShapesMenu();
        }.bind(this));
    };

    MainCanvasView.prototype.setupAddShapesMenu = function setupAddShapesMenu () {
      $('#btnBack')
        .popup({
          title: 'Back',
          position: 'right center'
        })
        .on('click', function(){
          $('#toolbar').html(defaultMenu());
          this.setupDefaultMenu();
        }.bind(this));
      $('#btnAddCircle')
        .popup({
          title: 'Circle',
          position: 'right center'
        })
        .on('click', function(){
          var circle = new fabric.Circle({
            radius: 100, fill: 'green', left: 100, top: 100
          });
          this.model.addToCenter(circle);
        }.bind(this));
      $('#btnAddSquare')
        .popup({
          title: 'Square',
          position: 'right center'
        })
        .on('click', function(){
          var rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 200
          });
          this.model.addToCenter(rect);
        }.bind(this));
      $('#btnAddTriangle')
        .popup({
          title: 'Square',
          position: 'right center'
        })
        .on('click', function(){
          var triangle = new fabric.Triangle({
            width: 100, height: 100, fill: 'blue', left: 50, top: 50
          });
          this.model.addToCenter(triangle);
        }.bind(this));
    };

    MainCanvasView.prototype.toggleToolbar = function toggleToolbar () {
      if (!this.model.attributes.transitioning) {
        $("#toolbar")
          .sidebar({
            dimPage:false,
            transition: 'push',
            exclusive: false,
            closable: false,
            onChange: function() {
              app.models.mainCanvas.attributes.transitioning = true;
            },
            onHide : function() {
              app.models.mainCanvas.attributes.transitioning = false;
            },
            onShow : function() {
              app.models.mainCanvas.attributes.transitioning = false;
            }
          })
          .sidebar("toggle");
        this.model.updateCanvasSize();
      }
    };

    return MainCanvasView;
  }(BaseView));

  /**
    * Three Canvas view.
    *
    * Manages a THREE.JS canvas view.
    */

  var ThreeCanvasView = (function (BaseView$$1) {
    function ThreeCanvasView(options) {
      BaseView$$1.call(this, {
        el: '#model-preview',
        model: options.model
      });

      document.getElementById('model-preview').addEventListener( 'mousemove', function(event) {
        this.model.attributes.mouse.x = ( event.offsetX / this.model.attributes.renderer.domElement.clientWidth ) * 2 - 1;
        this.model.attributes.mouse.y = - ( event.offsetY / this.model.attributes.renderer.domElement.clientHeight ) * 2 + 1;
      }.bind(this), false );
    }

    if ( BaseView$$1 ) ThreeCanvasView.__proto__ = BaseView$$1;
    ThreeCanvasView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    ThreeCanvasView.prototype.constructor = ThreeCanvasView;

    ThreeCanvasView.prototype.createScene = function createScene () {
      this.model.clearScene();
      this.model.attributes.width = this.$el.parent().innerWidth();
      this.model.attributes.camera.position.set( 0, 0, 400 );
      this.model.attributes.camera.lookAt( 0, 0, 0 );
      this.model.attributes.renderer.setSize( this.model.attributes.width, this.model.attributes.height );
      this.$el.html( this.model.attributes.renderer.domElement );

       // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
      var loader = new THREE.SVGLoader();
      var paths = loader.parse($('#potrace-preview').html());
      var svg = this.extrudeSVG({
        paths: paths,
        amount: this.model.attributes.extrudeAmount,
        center: { x: this.model.attributes.width, y: this.model.attributes.height /2 }
      });
      var box = new THREE.Box3().setFromObject( svg );
      var boundingBoxSize = box.max.sub( box.min );
      var width = boundingBoxSize.x;
      svg.position.setX(width / 2);
      this.model.attributes.mesh = svg;
      this.model.attributes.scene.add( this.model.attributes.mesh );

      // Start the animation loop.
      this.model.animate();
    };

    // Populate a 3D group from an SVG using SVGLoader
    ThreeCanvasView.prototype.extrudeSVG = function extrudeSVG (svgObject) {
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
    };

    return ThreeCanvasView;
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

  var AppView = (function (BaseView$$1) {
    function AppView(app) {
      BaseView$$1.call(this, {
        el: '#container',
        events: {
          'click #image_select': 'launchFileBrowser',
          'change #image_input': 'processFile',
          'click .js-change-image': 'changeImage',
          'click #btnRender': 'render3D'
        }  
      });
      this.models = {};
      this.views = {
        imagetracer: app.views.controls.imagetracer,
        potrace: app.views.controls.potrace,
        three: app.views.controls.three,
        threeCanvas: app.views.threeCanvas
      };
    }

    if ( BaseView$$1 ) AppView.__proto__ = BaseView$$1;
    AppView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    AppView.prototype.constructor = AppView;

    AppView.prototype.launchFileBrowser = function launchFileBrowser (e) {
      $('#image_input').click();
      e.preventDefault();
    };

    AppView.prototype.processFile = function processFile (e) {
      window.URL = window.URL || window.webkitURL || window.mozURL;
      var url = URL.createObjectURL(e.currentTarget.files[0]);
      $(imageContainer({ url: url }))
        .insertBefore('.ui.inverted.top.fixed.menu .item:last-child');
    };

    AppView.prototype.changeImage = function changeImage (e) {
      $('#original-image').attr('src', $(e.currentTarget).find('img').attr('src'));
      $('#imagetracer-preview, #potrace-preview').html(loader());
      var callback = function(){
        this.views.imagetracer.createSVG();
        this.views.potrace.createSVG();
      };
      setTimeout(callback.bind(this), 100);
    };

    AppView.prototype.render3D = function render3D () {
      this.views.threeCanvas.$el.html(loader());
      setTimeout(this.views.threeCanvas.createScene.bind(this.views.threeCanvas), 100);
    };

    return AppView;
  }(BaseView));

  // External libs

  /**
   * Manifold Browser Application
   */
  var App = function App() {
    this.models = {
      // controls: {
      // imagetracer: new ImageTracerControlsModel(),
      // potrace: new PotraceControlsModel(),
      // three: new ThreeControlsModel()
      // },
      mainCanvas: new MainCanvasModel()
      //threeCanvas: new ThreeCanvasModel()
    };
    this.views = {
      mainCanvas: new MainCanvasView({model: this.models.mainCanvas})
    // controls: {
    //   imagetracer: new ImageTracerControlsView({ model: this.models.controls.imagetracer }),
    //   potrace: new PotraceControlsView({ model: this.models.controls.potrace }),
    //   three: new ThreeControlsView({ model: this.models.controls.three })
    // },
    // threeCanvas: new ThreeCanvasView({ model: this.models.threeCanvas })
    };
  };

  // Startup using jQuery.ready()
  $(function () {
    var app = new App();
    window.app = app;
  });

  return App;

}(Backbone,ImageTracer,jQuery,fabric,Potrace,THREE,dat));
//# sourceMappingURL=app.js.map
