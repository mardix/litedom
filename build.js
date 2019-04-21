const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('uglify-js');
const gzipSize = require('gzip-size');
const fs = require('fs');
const pkg = require('./package.json');

const comment = `/**
* ${pkg.pkgName} v${pkg.version}
* Copyright ${new Date().getFullYear()} Mardix
* Released under the MIT License
* ${pkg.homepage}
* -----
* https://github.com/sindresorhus/on-change
* 
*/\r\n`;

async function build() {
  const bundle = await rollup.rollup({
    input: `./src/index.js`,
    plugins: [babel()],
    onwarn: warning => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        console.warn(`Rollup [Warn]: ${warning}`);
      }
    },
  });

  let { output } = await bundle.generate({
    name: pkg.name,
    format: 'esm',
  });

  output = output[0].code;

  const developmentCode = comment + output;
  const productionCode =
    comment +
    uglify.minify(output, {
      output: {
        ascii_only: true,
      },
    }).code;

  const c = uglify.minify(output);

  console.log('C', c);
  fs.writeFileSync(`./dist/${pkg.name}.js`, developmentCode);
  fs.writeFileSync(`./dist/${pkg.name}.min.js`, productionCode);

  console.log(`development -> ` + developmentCode.length / 1000 + 'kb');
  console.log(`production -> ` + productionCode.length / 1000 + 'kb');
  console.log('');
  console.log(`development (gzipped) -> ` + gzipSize.sync(developmentCode) / 1000 + 'kb');
  console.log(`production (gzipped) -> ` + gzipSize.sync(productionCode) / 1000 + 'kb');
  console.log('');
}

build();
