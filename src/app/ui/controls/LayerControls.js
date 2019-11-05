import $ from 'jQuery';
import BaseControls from './BaseControls.js';
import LayersToolItem from '../../../templates/toolbar/layers-tool-item.pug';

export default class LayerControls extends BaseControls {
  ready() {
    this.updateLayers();
  }
  updateLayers() {
    var objects = app.fabric.model.canvas.getObjects();
    var layersHTML = '';
    objects.reverse().forEach(function(object){
      var type,
          // Get index from canvas rather than containing array order.
          index = app.fabric.model.canvas.getObjects().indexOf(object);

      if (object.type){
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

      layersHTML += LayersToolItem({index: index, shape: type});      
    });

    $('#layers').html(layersHTML);

    // Bind events to all the newly added rows.
    objects.forEach(function(object){
      var index = index = app.fabric.model.canvas.getObjects().indexOf(object);
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
    });
  }
}
