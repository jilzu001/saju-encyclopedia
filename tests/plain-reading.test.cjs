const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../web/plain-reading.js'),R=require('../web/reading-model.js'),C=require('../web/calculator.js');
const technical=/원국|천간합|육합|삼합|방합|지지충|지장간|십성|일간|투간|통근|신강|신약|용신|편관|정관|식신|정재|편재|겁재|비견|[甲乙丙丁戊己庚辛壬癸]/;
test('the reported annual pairs explain different life topics and retain exact calculation evidence',()=>{
 const d=C.calculate({year:1979,month:10,day:11,hour:8}),yr=R.yearReading(d,2026);assert.equal(yr.interactions.length,2);
 const family=yr.interactions.find(r=>r.type==='육합'&&r.positions==='연주 · 2026년'),self=yr.interactions.find(r=>r.type==='천간합'&&r.positions==='일주 · 2026년');
 const a=P.interaction(d,family,2026),b=P.interaction(d,self,2026);
 assert.match(a.title,/가족·오래된 인연/);assert.match(a.paragraphs.join(''),/함께|가족/);assert.match(a.evidence.join(''),/미오 육합.*未午/);
 assert.match(b.title,/책임/);assert.match(b.paragraphs.join(''),/일터|책임/);assert.match(b.evidence.join(''),/신병 천간합.*辛丙/);assert.match(b.evidence.join(''),/정관/);
 for(const x of [a,b])assert.ok(!technical.test(x.title+x.paragraphs.join('')));
});
test('all ten relation roles have distinct everyday stories without technical labels in the narrative',()=>{
 const entries=Object.keys(R.editorial.gods).map(n=>P.god(n));assert.equal(new Set(entries.map(g=>g.story)).size,10);
 for(const g of entries){assert.ok(g.label.length<40);assert.ok(g.meaning.length>15);assert.ok(g.story.length>30);assert.ok(!technical.test(g.label+g.meaning+g.story));}
});
test('every supported pair and group interaction has a plain story, with evidence separate',()=>{
 const d=C.calculate({year:1991,month:9,day:8,hour:12});
 for(const type of ['천간합','육합','삼합','방합','지지충','형','파','해']){
  const r={type,positions:'연주 · 월주',name:'검사',chars:'未午'},p=P.interaction(d,r);
  assert.ok(p.title&&p.paragraphs.length);assert.ok(!technical.test(p.title+p.paragraphs.join('')),type);assert.ok(p.evidence[0].includes(type));
 }
});
test('pillar and concept explanations use the supplied chart and respect unknown time',()=>{
 const d=C.calculate({year:1991,month:9,day:8,hour:12}),u=C.calculate({year:1991,month:9,day:8,unknown:true});
 for(let i=0;i<4;i++){const p=P.pillar(d,i);assert.ok(p.title&&p.paragraphs.length);assert.ok(!technical.test(p.title+p.paragraphs.join('')));assert.ok(p.evidence[0].includes(d.pillars[i].pair));}
 for(const name of ['일간','십성','지장간']){const p=P.concept(d,name);assert.ok(!technical.test(p.title+p.paragraphs.join('')));for(const i of p.items)assert.ok(!technical.test(i.title+i.paragraphs.join('')));}
 assert.deepEqual(P.pillar(u,3).evidence,[]);assert.match(P.pillar(u,3).paragraphs.join(''),/계산하지/);assert.equal(P.concept(u,'지장간',3).items.length,0);
});
test('all four symbols have life descriptions and keep target and presence evidence intact',()=>{
 const d=C.calculate({year:1991,month:9,day:8,hour:12});for(const s of d.shinsal){const p=P.symbol(s);assert.equal(p.active,s.positions.length>0);assert.equal(p.positions.length,s.positions.length);assert.ok(p.title&&p.text);assert.ok(!technical.test(p.title+p.text));assert.ok(p.evidence[0].includes(s.name));}
});
test('plain explanations remain complete across sixty different days and changing year comparisons',()=>{
 let count=0;for(let i=0;i<60;i++){const t=new Date(Date.UTC(2024,0,1+i)),d=C.calculate({year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate(),hour:12});
  for(const year of [2026,2027])for(const r of R.yearReading(d,year).interactions){const p=P.interaction(d,r,year);assert.ok(p.title&&p.paragraphs.every(Boolean)&&p.evidence.length);assert.ok(!/undefined|NaN/.test(JSON.stringify(p)));count++;}
 }assert.ok(count>100);
});
