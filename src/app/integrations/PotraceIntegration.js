import $ from 'jQuery';
import Potrace from 'Potrace';
import BaseIntegration from './BaseIntegration.js';

/**
  * Potrace model for the main canvas.
  */

export default class PotraceIntegration extends BaseIntegration {
  constructor(app) {
    super();
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
    Potrace.setParameter({
      alphamax: 1,
      optcurve: false,
      opttolerance: 0.2,
      turdsize: 100,
      turnpolicy: "black"
    });

    $('.potraceConfig').on('change', () => {
      this.preview(app);
    });
  }

  createSVG(src, callbackFn) {
    // Create an SVG from data and settings, draw to screen.
    Potrace.clear();
    Potrace.loadImageFromSrc(src);
    Potrace.process(function() {
      var svg = Potrace.getSVG(1);
      const randomColor = () => '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
      var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
      // normalize should be used to get back absolute segments
      const pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce((acc, seg) => {
        const pathData = seg.type === 'M' ? [] : acc.pop();
        seg.values = seg.values.map((v) => Math.round(v * 1000) / 1000);
        pathData.push(seg);
        acc.push(pathData); 
        
        return acc;
      }, []);

      pathsDatas.forEach(function(d) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setPathData(d);
        path.setAttribute('fill', randomColor());
        newSVG.appendChild(path);
      });

      callbackFn(newSVG.outerHTML);
    });
  }

  preview(app) {
    // Remove other previews
    // @todo: Expand when other things are set to temporary
    let objects = app.fabric.model.canvas.getObjects();
    objects.forEach((object) => {
      if (object.temporary) {
        app.fabric.model.canvas.remove(object);  
      }
    });

    Potrace.setParameter({
      alphamax: $('.alphamax').val(),
      optcurve: $('.optcurve').is(":checked"),
      opttolerance: $('.opttolerance').val(),
      turdsize: $('.turdsize').val(),
      turnpolicy: $('.turnpolicy').find(":selected").text().toLowerCase()
    });

    var selectedObjects = app.fabric.model.canvas.getActiveObjects();
    app.vector.potrace.createSVG(selectedObjects[0]._element.src, function(svg) {
      app.fabric.model.helpers.loadSVG(svg, () => {}, true);
    });
  }

  create (app, replace = false) {
    // @todo: Expand when other things are set to temporary
    let objects = app.fabric.model.canvas.getObjects();
    objects.forEach((object) => {
      if (object.temporary) {
        object.temporary = false;
      }
    });
    if (replace) {
      var selectedObjects = app.fabric.model.canvas.getActiveObjects();
      app.fabric.model.canvas.remove(selectedObjects[0]);  
    }
  }

}
