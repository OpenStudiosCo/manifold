import BaseModel from '../BaseModel.js';

/**
  * Potrace model for the main canvas.
  */

export default class PotraceModel extends BaseModel {
  defaults() {
    var settings = {
      alphamax: 1,
      optcurve: false,
      opttolerance: 0.2,
      turdsize: 2,
      turnpolicy: "minority"
    };

    return settings;
  }

  createSVG(src, callback) {
    // Create an SVG from data and settings, draw to screen.
    Potrace.clear();
    Potrace.loadImageFromSrc(src);
    Potrace.process(function() {
      var svg = Potrace.getSVG(1);
      const randomColor = () => '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
      var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
      // normalize should be used to get back absolute segments
      const pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce((acc, seg) => {
        let pathData = seg.type === 'M' ? [] : acc.pop()
        seg.values = seg.values.map(v => Math.round(v * 1000) / 1000)
        pathData.push(seg)
        acc.push(pathData)
        return acc
      }, []);

      pathsDatas.forEach(function(d) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setPathData(d)
        path.setAttribute('fill', randomColor())
        newSVG.appendChild(path)
      });

      callback(newSVG.outerHTML);
    });
  }

}
