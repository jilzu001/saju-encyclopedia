const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
fs.mkdirSync('dist/vendor',{recursive:true});fs.mkdirSync('dist/data',{recursive:true});
for(const f of fs.readdirSync('web'))fs.copyFileSync(path.join('web',f),path.join('dist',f));
fs.copyFileSync('source/saju_terms.json','dist/data/saju_terms.json');
fs.copyFileSync('node_modules/lunar-javascript/lunar.js','dist/vendor/lunar.js');
fs.copyFileSync('node_modules/lunar-javascript/LICENSE','dist/vendor/lunar-LICENSE.txt');
fs.copyFileSync('node_modules/korean-lunar-calendar/dist/korean-lunar-calendar.min.js','dist/vendor/korean-lunar-calendar.js');
fs.copyFileSync('node_modules/korean-lunar-calendar/LICENSE','dist/vendor/korean-lunar-LICENSE.txt');
// Keep phone/in-app browsers from reusing an earlier script after deployment.
const index=fs.readFileSync('dist/index.html','utf8').replace(/(href|src)="\.\/([^"?]+\.(?:css|js))"/g,(_,attribute,asset)=>{
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join('dist',asset))).digest('hex').slice(0,12);
  return `${attribute}="./${asset}?v=${hash}"`;
});
fs.writeFileSync('dist/index.html',index);
fs.writeFileSync('dist/.nojekyll','');
console.log('Build complete: dist/ (relative assets, hash routing)');
