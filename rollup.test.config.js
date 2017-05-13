import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';

export default {
  entry: 'tmp-components.js',
  dest: 'test/unit/_tmp/components.js',
  format: 'cjs',
  plugins: [
    svelte({
      css: false
    }),
    buble()
  ]
}
