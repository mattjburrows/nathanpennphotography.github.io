const _ = require('lodash');
const FileHound = require('filehound');
const fs = require('fs');
const exec = require('child_process').exec;

function getComponentFiles() {
  return FileHound.create()
    .paths('_js/components')
    .ext('html')
    .findSync();
}

function getFileName(file) {
  const filePathParts = file.split('/');
  const fileNameParts = filePathParts[filePathParts.length - 1].split('.');

  return fileNameParts[0];
}

function convertFileName(filename) {
  return _.chain(filename)
    .camelCase()
    .upperFirst()
    .value();
}

function buildFileImports(componentFiles) {
  const componentImports = componentFiles.map((componentFile) => {
    const componentName = convertFileName(getFileName(componentFile));

    return `import ${componentName} from './${componentFile}';`
  });

  return componentImports.join('\n');
}

function buildFileExports(componentFiles) {
  const componentExports = componentFiles.map((componentFile) => {
    return convertFileName(getFileName(componentFile));
  });

  return `export { ${componentExports.join(', ')} }`;
}

function buildTestComponentsFiles() {
  const componentFiles = getComponentFiles();
  const fileImports = buildFileImports(componentFiles);
  const fileExports = buildFileExports(componentFiles);

  fs.writeFileSync('./tmp-components.js', fileImports + '\n\n' + fileExports);
}

buildTestComponentsFiles();
exec('rollup -c rollup.test.config.js');
