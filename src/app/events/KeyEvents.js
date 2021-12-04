import BaseEvents from './BaseEvents.js';

/**
  * Drop Events class.
  */

var app = {};
export default class KeyEvents extends BaseEvents {
  constructor( appInstance ) {
    app = appInstance;
    super();

    document.addEventListener('keyup', ({ keyCode, ctrlKey } = event) => {
      // Check pressed button is Z - Ctrl+Z.
      if (keyCode === 46) {
        // @todo: Remove duplication with code in integrations/FabricJS/Events.js
        var selectedObjects = app.fabric.model.canvas.getActiveObjects();
        for (var i = 0; i < selectedObjects.length; i++) {
          app.fabric.model.canvas.remove(selectedObjects[i]);  
        }
        app.fabric.model.canvas.discardActiveObject();

        // Update layers tool
        if (app.layers) {
          app.layers.updateLayers();
        }
      }
      
      
      // Check Ctrl key is pressed.
      if (!ctrlKey) {
        return
      }           

      // CTRL combos past this line -----------

      // Check pressed button is Z - Ctrl+Z.
      if (keyCode === 90) {
        app.fabric.model.canvas.undo(function() { 
          // @todo: Make a common helper.
          // - https://github.com/alimozdemir/fabric-history
          console.log('post undo');
        });
      }
    
      // Check pressed button is Y - Ctrl+Y.
      if (keyCode === 89) {
        app.fabric.model.canvas.redo(function() { 
          console.log('post redo');
        });
      }
    })
  }

}


