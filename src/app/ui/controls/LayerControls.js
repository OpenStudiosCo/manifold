import $ from 'jQuery';
import BaseControls from './BaseControls.js';
import layersToolItem from '../../../templates/helpers/layers-tool-item.pug';

var app = {};
export default class LayerControls extends BaseControls {
  constructor(appInstance) {
    app = appInstance;
    super();
  }

  ready() {
    this.updateLayers();
  }

  checkActive(object) {
    var selectedObjects = app.fabric.model.canvas.getActiveObjects();
    var active = false;
    selectedObjects.forEach((selected_object) => {
      if (selected_object.id == object.id) {
        active = true;
      }
    });

    return active;
  }

  renderItem(parent, object) {
    var active = app.layers.checkActive(object),
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
        returnHtml += app.layers.renderItem(object.getObjects(), group_object);
      });
      returnHtml += '</div></div>';
    }

    return returnHtml;
  }

  updateLayers() {
    var objects = app.fabric.model.canvas.getObjects();
    var layersHTML = '';
    objects.reverse().forEach(function(object){
      if (object.temporary == false) {
        layersHTML += app.layers.renderItem(app.fabric.model.canvas.getObjects(), object);
      }
    });

    $('#layers').html(layersHTML);

    // Bind events to all the newly added rows.
    objects.forEach(function(object){
      var index = app.fabric.model.canvas.getObjects().indexOf(object);
      $('#layers #item-' + index + ' .description').click(function(){
        app.fabric.model.canvas.setActiveObject(app.fabric.model.canvas.item(index));
      });
      $('#layers #item-' + index + ' .back').click(function(){
        app.fabric.model.canvas.sendBackwards(object);
        app.layers.updateLayers();
      });
      $('#layers #item-' + index + ' .forward').click(function(){
        app.fabric.model.canvas.bringForward(object);
        app.layers.updateLayers();
      });
      $('#layers #item-' + index + ' .display.toggle').click(function(){
        console.log(object);
        console.log($(this));
        if ($(this).find('i.eye.icon').hasClass('slash')) {
          object.visible = true;
        }
        else {
          object.visible = false;          
        }
        app.fabric.model.canvas.renderAll();
        $(this).find('i.eye.icon').toggleClass('slash');
      });
    });
  }
}
