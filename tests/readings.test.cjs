const {test}=require('node:test'),assert=require('node:assert/strict');
const R=require('../web/reading-model.js'),C=require('../web/calculator.js'),db=require('../source/saju_terms.json');
test('245 preserved IDs each have complete original editorial content',()=>{
 const entries=R.catalog(db);assert.equal(entries.size,245);assert.equal(new Set([...entries.values()].map(e=>e.hook)).size,245);
 for(const t of db.terms){const e=entries.get(t.id);assert.equal(e.id,t.id);assert.ok(typeof e.hook==='string'&&e.hook.length>=8&&e.hook.length<=90,t.id);assert.ok(e.body.length&&e.body.every(p=>typeof p==='string'&&p.length>=12),t.id);assert.ok(e.scene.length>=8,t.id);assert.ok(e.sourceIds.length&&e.sourceIds.every(id=>R.sources[id]),t.id);assert.ok(!/undefined|추가 설명은 검토 중/.test(JSON.stringify(e)),t.id);assert.match(e.reviewStatus,/미완료/)}
});
test('same-named stem, branch and twelve-stage terms keep distinct meanings',()=>{
 const es=R.catalog(db);assert.notEqual(es.get('T0033').hook,es.get('T0044').hook);assert.match(es.get('T0109').body.join(''),/음과 짝/);assert.match(es.get('T0201').body.join(''),/십이운성/);assert.ok(es.get('T0109').sourceIds.includes('yin'));assert.ok(!es.get('T0201').sourceIds.includes('yin'));
});
test('all sixty day-pillar readings map to their exact pair',()=>{
 assert.equal(R.editorial.dayHooks.length,60);for(const t of db.terms.filter(t=>t.subcategory==='육십갑자'))assert.ok(R.term(t).body.join('').includes(t.name[0]),t.id);
});
test('profiles depend on actual chart, and never count the day master as its own visible god',()=>{
 const a=C.calculate({year:1990,month:1,day:1,hour:12}),b=C.calculate({year:2005,month:12,day:23,hour:8,minute:37});const pa=R.chartProfile(a),pb=R.chartProfile(b);assert.notEqual(pa.stem.hook,pb.stem.hook);assert.equal(pa.visibleGods.length,3);assert.ok(pa.visibleGods.every(g=>g.position!=='일주'));assert.equal(pa.groups.reduce((s,g)=>s+g.count,0),3);assert.deepEqual(pa.dominant,['화']);assert.ok(pa.missing.some(m=>m.name==='금'&&m.hiddenPositions.includes('연주')));
});
test('unknown time is a partial reading with only two visible comparison stems',()=>{const p=R.chartProfile(C.calculate({year:1990,month:1,day:1,unknown:true}));assert.equal(p.partial,true);assert.equal(p.visibleGods.length,2);assert.ok(!p.roots.includes('시주'))});
test('selected year has the correct sexagenary pair, god and only new year interactions',()=>{const d=C.calculate({year:1990,month:1,day:1,hour:12});const y=R.yearReading(d,2026);assert.equal(y.pair,'丙午');assert.equal(y.god,'비견');assert.ok(y.interactions.every(r=>r.positions.includes('2026년')));assert.ok(y.interactions.some(r=>r.type==='지지충'));assert.throws(()=>R.yearReading(d,2051));assert.throws(()=>R.yearReading(d,'bad'))});
test('source links are explicit references and do not claim verified original pages',()=>{for(const s of Object.values(R.sources)){if(s.url)assert.match(s.url,/^https:\/\//);assert.ok(s.note&&s.kind)}assert.match(R.disclosure,/참고 해설/)});
test('original five Xin/Shen link errors are flagged while all 150 original relations are retained',()=>{const by=new Map(db.terms.map(t=>[t.id,t]));const flagged=db.relations.filter(([a,b,type])=>R.relationNeedsReview(by.get(a),by.get(b),type));assert.equal(flagged.length,5);assert.equal(db.relations.length,150);for(const [id] of flagged){const parts=R.composition(by.get(id),db);assert.equal(parts[1].hanja,'申');assert.equal(parts[1].id,'T0044');}for(const t of db.terms.filter(t=>t.subcategory==='육십갑자'))assert.equal(R.composition(t,db).map(t=>t.hanja).join(''),t.hanja)});
test('a complete sixty-day cycle always produces a complete reading for every day pillar',()=>{const seen=new Set();for(let i=0;i<60;i++){const date=new Date(Date.UTC(2024,0,1+i));const chart=C.calculate({year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate(),hour:12});seen.add(chart.pillars[2].pair);const profile=R.chartProfile(chart),year=R.yearReading(chart,2026);assert.ok(profile.dayHook&&profile.stem.scene&&profile.branch[0]);assert.ok(profile.monthMain.god);assert.equal(profile.groups.reduce((n,g)=>n+g.count,0),3);assert.ok(year.hook&&year.action);assert.ok(!JSON.stringify({profile,year}).includes('undefined'));}assert.equal(seen.size,60)});

test('clicked pillars use their own position and compare the actual stem with the day master',()=>{
 const d=C.calculate({year:1979,month:9,day:8,hour:3,minute:30});
 assert.deepEqual(d.pillars.map(p=>p.pair),['己未','壬申','戊寅','甲寅']);
 const year=R.pillarReading(d,0),month=R.pillarReading(d,1),day=R.pillarReading(d,2),time=R.pillarReading(d,3);
 assert.match(year.title,/연주 기미/);assert.match(year.comparison,/무 \(戊\).*기 \(己\).*겁재/);assert.equal(year.god,'겁재');
 assert.match(month.definition,/일·사회생활/);assert.equal(month.god,'편재');assert.match(month.composition,/임 \(壬\)/);
 assert.equal(day.god,null);assert.match(day.comparison,/무 \(戊\)/);assert.equal(time.god,'편관');
 assert.equal(new Set([year,month,day,time].map(p=>p.context)).size,4);
});
test('plain-language concepts identify the actual day master and exact hidden stems',()=>{
 const d=C.calculate({year:1979,month:9,day:8,hour:3,minute:30});
 assert.match(R.conceptReading(d,'일간').lines.join(''),/무인 \(戊寅\).*무 \(戊\)/);
 const gods=R.conceptReading(d,'십성');assert.equal(gods.items.length,4);assert.match(gods.items[2].text,/나 자신/);
 const hidden=R.conceptReading(d,'지장간',0);assert.equal(hidden.items.length,3);
 assert.deepEqual(hidden.items.map(x=>x.title),['연주 미 (未) 속 기 (己) → 겁재','연주 미 (未) 속 정 (丁) → 정인','연주 미 (未) 속 을 (乙) → 정관']);
 assert.match(R.conceptReading(d,'십성',1).items[0].title,/월주 임 \(壬\) → 편재/);
});
test('personal explanations change with the chart and never invent an unknown hour',()=>{
 const a=C.calculate({year:1979,month:9,day:8,hour:3,minute:30}),b=C.calculate({year:2005,month:12,day:23,hour:8,minute:37}),u=C.calculate({year:1979,month:9,day:8,unknown:true});
 assert.notEqual(R.conceptReading(a,'일간').lines[0],R.conceptReading(b,'일간').lines[0]);
 assert.equal(R.pillarReading(u,3).unknown,true);assert.ok(!R.pillarReading(u,3).pair);assert.equal(R.conceptReading(u,'지장간',3).items.length,0);
 assert.equal(R.conceptReading(u,'십성').items.length,3);assert.ok(R.conceptReading(u,'지장간').items.every(i=>!i.title.startsWith('시주')));
 for(const d of [a,b,u])for(const name of ['일간','십성','지장간'])assert.ok(!JSON.stringify(R.conceptReading(d,name)).includes('undefined'));
});
