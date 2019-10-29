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
    objects.forEach(function(object){
      if (object.type){
        if (object.type == 'rect') object.type = 'square';
        layersHTML += LayersToolItem({shape: object.type});
      }
      else {
        layersHTML += LayersToolItem({shape: 'Unknown'});
      }
    });
    console.log(objects);
    $('#layers').html(layersHTML);
  }
}
