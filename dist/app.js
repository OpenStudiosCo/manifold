(function (Potrace,$,THREE,$d3g,dat,Backbone,ImageTracer,_) {
  'use strict';

  Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;
  $d3g = $d3g && $d3g.hasOwnProperty('default') ? $d3g['default'] : $d3g;
  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  var ImageTracer__default = 'default' in ImageTracer ? ImageTracer['default'] : ImageTracer;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  /**
    * Base view.
    */

  var gui = new dat.GUI();

  var BaseView = (function (superclass) {
  	function BaseView() {
  		this.gui = gui;
  	}

  	if ( superclass ) BaseView.__proto__ = superclass;
  	BaseView.prototype = Object.create( superclass && superclass.prototype );
  	BaseView.prototype.constructor = BaseView;

  	return BaseView;
  }(Backbone.View));

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
    * Imagetracer Integration models.
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
    * ImageTracer view.
    *
    * Manages all UI elements relating to ImageTracer integration.
    */

  var ImageTracerView = (function (BaseView$$1) {
  	function ImageTracerView() {
  		BaseView$$1.call(this);
  		this.el = '#svg-preview';
  		this.controls = new ImageTracerControls();
  		this.render();
  	}

  	if ( BaseView$$1 ) ImageTracerView.__proto__ = BaseView$$1;
  	ImageTracerView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
  	ImageTracerView.prototype.constructor = ImageTracerView;

  	ImageTracerView.prototype.render = function render () {
  		var this$1 = this;

  		var guiFolder = this.gui.addFolder('imagetracerjs Controls');
  		for (var controlName in this$1.controls.attributes) {
  			var _this = this$1;
  			
  	    var callback = function() {
  	      $(_this.el).html('<div class="ui active centered inline loader"></div>');
  	      // Wait 100ms so the loader can appear.
  	      setTimeout(_this.createSVG.bind(_this), 100);
  	    };
  	    if (isNaN(this$1.controls.attributes[controlName])) {
  	      guiFolder.add(this$1.controls.attributes, controlName)
  	        .onFinishChange(callback);
  	    }
  	    else {
  	      var max = this$1.controls.attributes[controlName] * 2;
  	      max = (max > 0) ? max : 100;
  	      guiFolder.add(this$1.controls.attributes, controlName, 0, max)
  	        .onFinishChange(callback);
  	    }
  	  }
  	  this.createSVG();
  	};

  	// Create an SVG from data and settings, draw to screen.
  	ImageTracerView.prototype.createSVG = function createSVG () {  
  	  var svgStr = ImageTracer__default.imagedataToSVG(this.getImageDimensions(), this.controls.attributes);
  	  $(this.el).html('');
  	  console.log(this);
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
   * Manifold Browser Application
   */
  $(function() {
    new ImageTracerView();

    // Setup Potrace controls and run.
    //init_potrace(gui);
    //potrace();

    // Setup Three.JS controls.
    //init_three(gui);
  });

}(Potrace,jQuery,THREE,$d3g,dat,Backbone,ImageTracer,_));
