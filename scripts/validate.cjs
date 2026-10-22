const fs=require('node:fs'); const assert=require('node:assert/strict');const crypto=require('node:crypto');
const baseline=JSON.parse(fs.readFileSync('source-baseline.json','utf8'));
for(const [file,sha] of Object.entries(baseline))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),sha,`Original file changed: ${file}`);
const file=process.argv[2]||'source/saju_terms.json';
const db=JSON.parse(fs.readFileSync(file,'utf8'));
const original=JSON.parse(fs.readFileSync('source/saju_terms.json','utf8'));
assert.ok(db.terms.length>=245);assert.ok(db.relations.length>=150);assert.ok(db.rules.length>=8);
for(const key of ['terms','rules']){const ids=db[key].map(t=>t.id);assert.equal(new Set(ids).size,ids.length,`${key}: duplicate ID`)}
const ids=new Set(db.terms.map(t=>t.id));
for(const r of db.relations){assert.equal(r.length,3);assert.ok(ids.has(r[0])&&ids.has(r[1]),`Broken relation: ${r}`)}
for(const key of ['terms','relations','rules','sources'])for(const item of original[key])assert.ok(db[key].some(v=>JSON.stringify(v)===JSON.stringify(item)),`Original ${key} changed`);
console.log(JSON.stringify({terms:db.terms.length,relations:db.relations.length,rules:db.rules.length,sources:db.sources.length,duplicateIds:0,missingTargets:0,originalPreserved:true},null,2));
