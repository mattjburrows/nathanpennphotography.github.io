import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: '_js/main.js',
  dest: 'js/main.js',
  format: 'iife',
  plugins: [
    svelte({
      css: false
    }),
    buble()
  ]
}
