import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/async-flow.js',
    format: 'umd',
    name: 'asyncFlow'
  },
  plugins: [commonjs()]
};