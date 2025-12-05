const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const outputFile = path.join(__dirname, 'src', 'assetsList.js'); 

function getAllFiles(dir, baseDir = dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllFiles(fullPath, baseDir));
    } else {
      // Ruta relativa desde /public
      files.push('/assets/' + path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  });
  return files;
}

const assets = getAllFiles(assetsDir);

const jsContent = `export const assets = ${JSON.stringify(assets, null, 2)};\n`;

fs.writeFileSync(outputFile, jsContent);

console.log(`Archivo generado: ${outputFile}`);