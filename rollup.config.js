import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
  external: [ '$d3g', 'Backbone', 'dat', 'jQuery', 'ImageTracer', 'THREE', 'Potrace' ],
  input: 'src/app.js',
  output: {
  	file: 'dist/app.js',
  	format: 'iife',
    globals: {
      '$d3g': '$d3g',
      Backbone: 'Backbone',
      dat: 'dat',
      jQuery: 'jQuery',
      ImageTracer: 'ImageTracer',
      Potrace: 'Potrace',
      THREE: 'THREE'
    }
  },
  plugins: [
    // uglify(),
    buble()
  ]
};
