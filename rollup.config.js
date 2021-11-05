import buble from 'rollup-plugin-buble';
import pug from 'rollup-plugin-pug';
import { eslint } from "rollup-plugin-eslint";
import uglify from 'rollup-plugin-uglify';

export default {
  external: [ 'jQuery', 'dat', 'fabric', 'ImageTracer', 'Potrace', 'THREE', 'TWEEN' ],
  input: 'src/app.js',
  output: {
    name: 'ManifoldApplication',
  	file: 'dist/app.js',
  	format: 'iife',
    sourcemap: true,
    globals: {
      jQuery: 'jQuery',
      dat: 'dat',
      fabric: 'fabric',
      ImageTracer: 'ImageTracer',
      Potrace: 'Potrace',
      THREE: 'THREE',
      TWEEN: 'TWEEN'
    }
  },
  plugins: [
    // uglify(),
    // eslint({
    //   exclude: ['**/**/*.pug'],
    //   rules: {
    //     'no-bitwise': 'off',
    //     'no-underscore-dangle': 'off'
    //   }
    // }),
    pug(),
    buble()
  ]
};
