var ManifoldApplication = (function ($, fabric, Potrace, THREE) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  fabric = fabric && fabric.hasOwnProperty('default') ? fabric['default'] : fabric;
  Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
  THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;

  /**
    * Base Integration class.
    */

  var BaseIntegration = function BaseIntegration () {};

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
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"paper plane outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "Vector\u003C\u002Fspan\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnMake3D\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"snowflake outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Cspan\u003E";
  pug_html = pug_html + "3D\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Base Controls class.
    */

  var BaseControls = function BaseControls () {};

  /**
    * Colour picker model for the main canvas.
    * Credit - https://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
    */

  var ColourPickerControls = /*@__PURE__*/(function (BaseControls) {
    function ColourPickerControls() {
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

      $('#fill-tool').draggable({ cancel: "#colour-picker, #colour-picker-preview input" });

      var mouseDown = false;
      $('#colour-picker').on('mousedown', function(event){
        mouseDown = true;
        this.pickColour(event);
      }.bind(this));
      $('#colour-picker').on('mousemove', function(event){
        if (mouseDown) {
          this.pickColour(event);
        }
      }.bind(this));
      $('#colour-picker').on('mouseup', function(){
        mouseDown = false;
      });
       
    }

    if ( BaseControls ) ColourPickerControls.__proto__ = BaseControls;
    ColourPickerControls.prototype = Object.create( BaseControls && BaseControls.prototype );
    ColourPickerControls.prototype.constructor = ColourPickerControls;

    ColourPickerControls.prototype.lookupAndSetColour = function lookupAndSetColour (colour) {
      var cvs, ctx;
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
      $('input#rgb').val(rgb);
      $('input#hex').val('#' + hex);
      $('#colour-picker-preview').css('background-color', '#' + hex);

      if (app.models.mainCanvas.attributes.canvas) {
        $('#btnFillActive .icon').css('color', '#' + hex);
        app.models.mainCanvas.canvas.getActiveObject().set("fill", '#' + hex);
        app.models.mainCanvas.canvas.renderAll();
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

  /**
    * Potrace model for the main canvas.
    */

  var PotraceIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function PotraceIntegration () {
      BaseIntegration.apply(this, arguments);
    }

    if ( BaseIntegration ) PotraceIntegration.__proto__ = BaseIntegration;
    PotraceIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    PotraceIntegration.prototype.constructor = PotraceIntegration;

    PotraceIntegration.prototype.defaults = function defaults () {
      var settings = {
        alphamax: 1,
        optcurve: false,
        opttolerance: 0.2,
        turdsize: 2,
        turnpolicy: "minority"
      };

      return settings;
    };

    PotraceIntegration.prototype.createSVG = function createSVG (src, callback) {
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
          
          return acc;
        }, []);

        pathsDatas.forEach(function(d) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setPathData(d);
          path.setAttribute('fill', randomColor());
          newSVG.appendChild(path);
        });

        callback(newSVG.outerHTML);
      });
    };

    return PotraceIntegration;
  }(BaseIntegration));

  /**
    * Raster To SVG model.
    */

  var FabricJSIntegrationExtras = function FabricJSIntegrationExtras() {
    this.colourPickerModel = new ColourPickerControls();
    this.potrace = new PotraceIntegration();
    this.canvas = new fabric.Canvas('main-canvas');
    this.attributes = {
      canvas: null,
      transitioning: false
    };
    this.updateCanvasSize();
    this.setupEvents();
  };

  FabricJSIntegrationExtras.prototype.setupEvents = function setupEvents () {
    // Credit - https://stackoverflow.com/a/24238960
    this.canvas.on('object:moving', function (e) {
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

    // Create the active object context menu when selecting an object.
    var selectionCallback = function(e) {
      $('.model-preview').hide();
      $('.active-object-context').remove();
      var $menu = $(activeObjectContext());
      $('#container').append($menu);
      var offsetX = e.target.left + ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);

      // Set the menu to be draggable
      $('.floating.overlay').draggable();

      // Not 3D, not text, not group
      if (!e.target._element && !e.target.text && !e.target._objects) {
        $('#btnMake3D').removeClass('disabled');
      }
      // Not 3D, not group
      if (!e.target._element && !e.target._objects) {
        $('#btnFillActive').removeClass('disabled');
        $('#btnFillActive .icon').css('color', e.target.fill);
        this.colourPickerModel.lookupAndSetColour(e.target.fill);
      }
      // Is group.
      if (e.target._objects) {

        $('#btnGroupActive').removeClass('disabled');
        if (e.target.type == 'activeSelection') {
          $('#btnGroupActive span').html('Group (' + e.target._objects.length + ')');
        }
        else {
          $('#btnGroupActive span').html('Ungroup (' + e.target._objects.length + ')');
        }
      }

      // Events
      $('#btnGroupActive').click(function(e) {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject.type != 'group') {
          activeObject.toGroup();
        }
        else {
          activeObject.toActiveSelection();
        }
          
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
      }.bind(this));
        
      $('#btnFillActive:not(.disabled)').click(function(e){
        $(this).toggleClass('active');
        $('#fill-tool').toggle();
      });
      $('#btnDeleteActive').click(function(e) {
        var selectedObjects = this.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          this.canvas.remove(selectedObjects[i]);  
        }
        this.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
      $('#btnMake3D:not(.disabled)').click(function(e) {
        var selectedObjects = this.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          if (selectedObjects[i].toSVG) {
            var obj_width = selectedObjects[i].width * selectedObjects[i].scaleX;
            var obj_height = selectedObjects[i].height * selectedObjects[i].scaleY;

            var svg_start = '<svg xmlns="http://www.w3.org/2000/svg"';//' viewbox="0 0 ';
            svg_start += ' style="fill: ';
            svg_start += selectedObjects[i].fill + '">';

            var svg_end = '</svg>';

            // Hack for matrix transform;
            //var svgElements = svg_start + selectedObjects[i].toSVG().replace(/matrix\(.*\)/,'matrix(1 0 0 1 0 0)') + svg_end;

            var svgElements = svg_start + selectedObjects[i].toSVG() + svg_end;

            console.log(svgElements);

            var create3DObject = function(threeCanvas) {
              var threeD = new fabric.Image($(threeCanvas.el).find('canvas')[0]);
              threeD.left = selectedObjects[i].left;
              threeD.top = selectedObjects[i].top;
              this.canvas.add(threeD);
            }.bind(this);
            app.models.threeCanvas.push(new ThreeCanvasModel({
              height: obj_height,
              width: obj_width
            }));
            app.views.threeCanvas.push(
              new ThreeCanvasView({ 
                model: app.models.threeCanvas[app.models.threeCanvas.length-1],
                svg: svgElements,
                width: obj_width,
                height: obj_height
              })
            );
            create3DObject(app.views.threeCanvas[app.views.threeCanvas.length-1]);
            this.canvas.remove(selectedObjects[i]);
          }
          else {
            console.log('not convertible!');
          }
        }
        this.canvas.discardActiveObject();
        $('.active-object-context').remove();
      }.bind(this));
    }.bind(this);

    // Separated for Fabric's On not supporting multiple.
    this.canvas.on('selection:created', selectionCallback);
    this.canvas.on('selection:updated', selectionCallback);

    this.canvas.on('mouse:dblclick', function(e){
      if (e.target && e.target._element) {
        var $el = $(e.target._element).parent();
        var scaledWidth = e.target.width * e.target.scaleX;
        var scaledHeight = e.target.height * e.target.scaleY;
        var offsetX = e.target.left + ((scaledWidth / 2) - ($el.width() / 2));
        var offsetY = e.target.top + ((scaledHeight / 2) - ($el.height() / 2));
        $el.show();
        $el.css('left', offsetX);
        $el.css('top', offsetY);
      }
       
    }.bind(this));

    this.canvas.on('selection:cleared', function(){
      $('.active-object-context').remove();
     $('.model-preview').hide();
     $('#fill-tool').hide();
    });

    // TODO: Don't follow if user moved the toolbar.
    this.canvas.on('object:moving', function(e) {
      var $menu = $('.active-object-context');
      var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
      var offsetY = e.target.top - ($menu.height()) - 50;
      var toolbarWidth = $('#toolbar').sidebar('is visible') ? $('#toolbar').width(): 0;
      if (offsetX < toolbarWidth) {
        offsetX = 0;
      }
      if (offsetX > this.canvas.width - toolbarWidth - $menu.width()) {
        offsetX = this.canvas.width - $menu.width(); 
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      $menu.css('left', offsetX);
      $menu.css('top', offsetY);
    }.bind(this));

    // Resize 3D canvas if it's that type of element.
    this.canvas.on('object:scaling', function(e) {
      if (e.target._element) {
        var $container = $(e.target._element).parent();
        if ($container.hasClass('model-preview')) {
          var scaledWidth = e.target.width * e.target.scaleX;
          var scaledHeight = e.target.height * e.target.scaleY;
          $container.css('width', scaledWidth);
          $container.css('height', scaledHeight);
            
          var id = $container.attr('id').replace('model-preview-','');
          app.models.threeCanvas[id].attributes.width = scaledWidth;
          app.models.threeCanvas[id].attributes.height = scaledHeight;
          app.models.threeCanvas[id].resize();
          e.target._resetWidthHeight();
        }
      }
    });
  };

  // Loads an SVG string and splits up objects so they're loaded in the right position.
  FabricJSIntegrationExtras.prototype.loadSVG = function loadSVG (svg, callback) {
    fabric.loadSVGFromString(svg, function(objects){
      // Create a group so we add to center accurately.
      var group = new fabric.Group(objects);
      this.addToCenter(group);

      // Ungroup.
      var items = group._objects;
      group._restoreObjectsState();
      this.canvas.remove(group);
      for (var i = 0; i < items.length; i++) {
        this.canvas.add(items[i]);
      }
      this.canvas.renderAll();
      if (callback) {
        callback(items);
      }
    }.bind(this));
  };

  FabricJSIntegrationExtras.prototype.updateCanvasSize = function updateCanvasSize () {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      width -= $('#toolbar').width();  
    }
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.canvas.setHeight( height );
    this.canvas.setWidth( width );
  };

  // Add an object to the center of the canvas.
  FabricJSIntegrationExtras.prototype.addToCenter = function addToCenter (object) {
    var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if ($("#toolbar").sidebar('is visible')) {
      canvasWidth -= $('#toolbar').width();  
    }
    var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
    object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
      
    this.canvas.add(object);
  };

  function addImageItem(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  ;var locals_for_with = (locals || {});(function (url) {
  pug_html = pug_html + "\u003Ca class=\"item image\"\u003E";
  pug_html = pug_html + "\u003Cimg" + (" class=\"ui fluid image small\""+pug.attr("src", url, true, true)) + "\u003E\u003C\u002Fa\u003E";
  }.call(this,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * MainCanvas view.
    */

  var FabricJSIntegration = /*@__PURE__*/(function (BaseIntegration) {
    function FabricJSIntegration(options) {
      var this$1 = this;

      this.el = '#main-canvas';
      this.model = new FabricJSIntegrationExtras();

      var circle = new fabric.Circle({ radius: 100, fill: 'green' });
      this.model.addToCenter(circle);
      circle.left -= 75;
      var rect = new fabric.Rect({
        fill: 'red',
        width: 200,
        height: 200
      });
      this.model.addToCenter(rect);
      rect.left += 75;

      this.setupDefaultMenu();

      $('.floating.overlay').draggable();

      $('#add-image').on('click', 'a.item.image', function(e){
        var src = $(e.target).attr('src');
        var callback = function(svg) {
          var callback = function() {
            $('#hideAddImage').click();
          };
          this.model.loadSVG(svg, callback);
        };
        this.model.potrace.createSVG(src, callback);
      });

      $('.ui.dropdown').dropdown();

      $(window).on('resize', function () {
        this$1.model.updateCanvasSize();
      });

      $('#hideAddImage')
        .on('click', function() {
          $('#btnAddImage').find('i.icon').toggleClass('disabled');
          $('#add-image')
            .animate({
             left: '-' + $('#add-image').width() + 'px'
            });
        });
      $('#btnUploadImage')
        .on('click', function(e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          $('#image_input').click();
        });
      $('#image_input')
        .on('change', function(e) {
          window.URL = window.URL || window.webkitURL || window.mozURL;
          var url = URL.createObjectURL(e.currentTarget.files[0]);
          $(addImageItem({ url: url }))
            .insertBefore('#add-image .ui.menu .item:last-child');
        });
    }

    if ( BaseIntegration ) FabricJSIntegration.__proto__ = BaseIntegration;
    FabricJSIntegration.prototype = Object.create( BaseIntegration && BaseIntegration.prototype );
    FabricJSIntegration.prototype.constructor = FabricJSIntegration;

    FabricJSIntegration.prototype.setupDefaultMenu = function setupDefaultMenu () {
      // Define slideout position based on corresponding menu item.
      $('#add-image').css('top', function(){
        return $('#btnAddImage').offset().top +(($('#btnAddImage').height() / 2) - ($(this).height() / 2));
      });
      $('#btnAddImage')
        .popup({
          title: 'Trace Image',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          if ($(this).find('i.icon').hasClass('disabled')) {
            $('#add-image')
              .css('left', '0px')
              .show()
              .animate({
                left: '-' + $('#add-image').width() + 'px'
              });
          }
          else {
            $('#add-image')
              .css('left', '-' + $('#add-image').width() + 'px')
              .show()
              .animate({
                left: '0px'
              });
          }
        });

      // TODO: https://codepen.io/shershen08/pen/JGepQv
      $('#btnAddText')
        .popup({
          title: 'Text',
          position: 'right center'
        })
        .on('click', function(){
          var textBox = new fabric.Textbox("Sample Text", {
            fontFamily: 'Arial'
          });
          this.model.addToCenter(textBox);
        }.bind(this));

      // Track which overlays we hid so we don't override other settings.
      var overlays_visible = [];
      $('#btnToggleOverlays')
        .popup({
          title: 'Toggle Overlays',
          position: 'right center'
        })
        .on('click', function(){
          if ($(this).find('i.eye.icon').hasClass('slash')) {
            if (overlays_visible.length > 0) {
              $(overlays_visible).each(function(i, overlay){
                $(overlay).show();
              });
              overlays_visible = [];
            }
          }
          else {
            overlays_visible = $('.floating.overlay:visible');
            $('.floating.overlay:visible').hide();
          }
          $(this).find('i.icon').toggleClass('slash');
        });
      $('#btnToggleVector')
        .popup({
          title: 'Toggle Vector',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#vector-tool').toggle();
        });
      $('#btnToggleLayers')
        .popup({
          title: 'Toggle Layers',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#layers-tool').toggle();
        });
      $('#btnToggle3DOptions')
        .popup({
          title: 'Toggle 3D Options',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#threeD-tool').toggle();
        });
      $('#btnAddCircle')
        .popup({
          title: 'Circle',
          position: 'right center'
        })
        .on('click', function(){
          var circle = new fabric.Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
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
          title: 'Triangle',
          position: 'right center'
        })
        .on('click', function(){
          var triangle = new fabric.Triangle({ width: 100, height: 100, fill: 'blue', left: 50, top: 50 });
          this.model.addToCenter(triangle);
        }.bind(this));
    };

    FabricJSIntegration.prototype.toggleToolbar = function toggleToolbar () {
      if (!app.fabric.model.attributes.transitioning) {
        $("#toolbar")
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
        app.fabric.model.updateCanvasSize();
      }
    };

    return FabricJSIntegration;
  }(BaseIntegration));

  // External libs

  /**
   * Manifold Browser Application
   */
  var App = function App() {
    this.fabric = new FabricJSIntegration();
  };

  // Startup using jQuery.ready()
  $(function () {
    var app = new App();
    window.app = app;
  });

  return App;

}(jQuery, fabric, Potrace, THREE));
//# sourceMappingURL=app.js.map
