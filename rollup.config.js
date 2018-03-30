import buble from 'rollup-plugin-buble';
import pug from 'rollup-plugin-pug';
import uglify from 'rollup-plugin-uglify';

export default {
  external: [ '$d3g', 'Backbone', 'dat', 'jQuery', 'ImageTracer', 'THREE', 'Potrace', '_' ],
  input: 'src/app.js',
  output: {
  	file: 'dist/app.js',
  	format: 'iife',
    sourcemap: true,
    globals: {
      '$d3g': '$d3g',
      Backbone: 'Backbone',
      dat: 'dat',
      jQuery: 'jQuery',
      ImageTracer: 'ImageTracer',
      Potrace: 'Potrace',
      THREE: 'THREE',
      _: '_'
    }
  },
  plugins: [
    // uglify(),
    pug(),
    buble()
  ]
};
