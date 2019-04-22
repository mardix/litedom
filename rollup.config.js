/**
 * Rollup config
 *
 * This script config allows us to create a bundle of the library
 * the library is meant to be used at ES module, or <script type="module" src"">
 *
 * intall:
 * > npm install -g rollup
 *
 * run
 * > rollup -c
 */
const terser = require('rollup-plugin-terser');
import banner from 'rollup-plugin-banner';
const pkg = require('./package.json');

const topBanner = `${pkg.pkgName} v${pkg.version}
Copyright ${new Date().getFullYear()} Mardix
Released under the MIT License
${pkg.homepage}
`;

export default {
  input: './src/index.js',
  output: {
    file: './dist/relift-html.esm.js',
    format: 'esm',
  },
  plugins: [terser.terser(), banner(topBanner)],
};
