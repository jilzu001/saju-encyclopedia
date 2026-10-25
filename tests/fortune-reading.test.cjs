const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../web/fortune-reading'),C=require('../web/calculator'),{Solar}=require('lunar-javascript');
const birth=C.calculate({year:1979,month:10,day:11,hour:8,gender:'male'});
test('Korean today uses UTC+9 regardless of machine timezone, and month changes clamp dates',()=>{
 assert.deepEqual(F.today(new Date('2026-10-24T16:00:00Z')),{year:2026,month:10,day:25});
 assert.equal(F.normalize({year:2024,month:2,day:31}).day,29);assert.equal(F.normalize({year:2025,month:2,day:31}).day,28);
 assert.throws(()=>F.read(birth,{year:2051}));assert.throws(()=>F.read(birth,{month:13}));
});
test('monthly periods meet at the exact solar term in Korea and do not have gaps',()=>{
 for(const month of [1,2,5,10,12]){
  const segments=F.months(birth,{year:2026,month});assert.equal(segments.length,2);assert.equal(segments[0].end,segments[1].start);
  const start=Solar.fromYmdHms(2026,month,1,0,0,0),expected=start.nextHour(-1).getLunar().getNextJie().getSolar().nextHour(1).toYmdHms();assert.equal(segments[1].start,expected);
  const boundary=segments[1].start,parts=boundary.match(/\d+/g).map(Number),term=Solar.fromYmdHms(...parts);
  assert.equal(F.pairsAt(term.nextHour(-1)).month,segments[0].pair);assert.equal(F.pairsAt(term.nextHour(1)).month,segments[1].pair);assert.notEqual(segments[0].pair,segments[1].pair);
 }
 const r=F.read(birth,{year:2026,month:10,day:25});assert.equal(r.monthSegments[1].start,'2026-10-08 15:29:17');
});
test('daily calendar covers real dates and repeats day pairs after sixty days',()=>{
 const feb=F.read(birth,{year:2024,month:2,day:29});assert.equal(feb.days.length,29);assert.equal(feb.day.pair,feb.days[28].pair);
 for(const date of [[2026,1,1],[2026,2,4],[2026,10,25]]){
  const [year,month,day]=date,r=F.read(birth,{year,month,day}),actual=C.calculate({year,month,day,hour:12});assert.equal(r.day.pair,actual.pillars[2].pair);assert.equal(r.day.god,C.god(birth.dayStem,r.day.pair[0]));
 }
 const first=Solar.fromYmdHms(2026,1,1,12,0,0),later=first.next(60);assert.equal(F.pairsAt(first).day,F.pairsAt(later).day);
});
test('actual birth evidence and spouse branch change explanations even with the same day stem',()=>{
 const other=C.calculate({year:1979,month:10,day:21,hour:8,gender:'male'});assert.equal(other.dayStem,birth.dayStem);
 const a=F.read(birth,{year:2026,month:10,day:25}),b=F.read(other,{year:2026,month:10,day:25});
 assert.notEqual(a.cards.find(c=>c.id==='love').body,b.cards.find(c=>c.id==='love').body);
 for(const c of a.cards.filter(c=>c.id!=='self')){assert.ok(c.sections.length||c.id==='flow');assert.ok(c.evidence.length);assert.ok(!/undefined|NaN/.test(JSON.stringify(c)));}
 assert.ok(a.cards.find(c=>c.id==='money').sections.some(s=>s.title.includes('월급')));
});
test('decade selection uses computed cycles, and unknown time never invents a cycle or children reading',()=>{
 const r=F.read(birth,{year:2026,month:10,day:25});assert.equal(r.cycle.pair,birth.cycles.decades.find(d=>d.startYear<=2026&&d.endYear>=2026).pair);
 const last=birth.cycles.decades.at(-1),selected=F.read(birth,{year:2026,month:10,day:25,decade:last.startYear});assert.equal(selected.cycle.pair,last.pair);assert.match(selected.cards.at(-1).aside,new RegExp(String(last.startYear)));
 const unknown=F.read(C.calculate({year:1979,month:10,day:11,unknown:true}),{year:2026,month:10,day:25});assert.equal(unknown.cycle,null);assert.equal(unknown.cycleList.length,0);assert.match(unknown.cards.find(c=>c.id==='family').sections.map(s=>s.text).join(''),/마지막 칸은 계산하지/);
});
test('selected years and daily dates change actual fortune themes, without invented scores or medical diagnoses',()=>{
 const a=F.read(birth,{year:2026,month:10,day:25}),b=F.read(birth,{year:2027,month:10,day:26});assert.notEqual(a.annual.pair,b.annual.pair);assert.notEqual(a.day.pair,b.day.pair);
 assert.notEqual(a.cards.find(c=>c.id==='year').title,b.cards.find(c=>c.id==='year').title);assert.notEqual(a.cards.find(c=>c.id==='day').title,b.cards.find(c=>c.id==='day').title);
 assert.match(a.cards.find(c=>c.id==='health').body,/병명·수명 예측 대신/);assert.ok(!/운세 점수|성공 확률|당첨 확률/.test(JSON.stringify(a)));
});
