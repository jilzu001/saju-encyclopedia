const {test}=require('node:test'),assert=require('node:assert/strict');
const Q=require('../web/quick-reading.js'),C=require('../web/calculator.js');
test('quick reading is seven short stories with technical evidence kept separate',()=>{
 const d=C.calculate({year:1979,month:9,day:8,hour:3,minute:30}),q=Q.read(d,2026);
 assert.equal(q.cards.length,7);assert.equal(new Set(q.cards.map(c=>c.id)).size,7);assert.equal(q.tags.length,3);
 for(const card of q.cards){assert.ok(card.title.length<=65,card.id);assert.ok(card.body.length<=130,card.id);assert.ok(card.aside.length<=150,card.id);assert.ok(card.evidence.length>0);assert.ok(!/일간|십성|지장간|신강|용신|格|[甲乙丙丁戊己庚辛壬癸]/.test(card.title+card.body+card.aside),card.id);}
 assert.match(q.cards[0].evidence.join(''),/戊/);assert.ok(!JSON.stringify(q).includes('undefined'));
});
test('short stories change with the actual chart and selected year',()=>{
 const a=C.calculate({year:1979,month:9,day:8,hour:3,minute:30}),b=C.calculate({year:2005,month:12,day:23,hour:8,minute:37});
 const qa=Q.read(a,2026),qb=Q.read(b,2026),next=Q.read(a,2027);
 assert.notEqual(qa.name,qb.name);for(const id of ['self','money','work','people'])assert.notEqual(qa.cards.find(c=>c.id===id).title,qb.cards.find(c=>c.id===id).title);
 assert.notEqual(qa.cards[4].title,next.cards[4].title);assert.match(next.cards[4].label,/2027/);assert.match(next.cards[4].evidence.join(''),/丁未/);
});
test('long-term story only uses a computed cycle and handles missing inputs',()=>{
 const known=C.calculate({year:1979,month:9,day:8,hour:3,minute:30,gender:'male'}),q=Q.read(known,2026),active=known.cycles.decades.find(c=>c.startYear<=2026&&c.endYear>=2026);
 assert.ok(q.cards[5].aside.startsWith(active.startYear+'~'+active.endYear));assert.match(q.cards[5].evidence.join(''),new RegExp(active.pair));
 const unknown=Q.read(C.calculate({year:1979,month:9,day:8,unknown:true}),2026);assert.equal(unknown.partial,true);assert.match(unknown.cards[5].body,/계산하지 않았어요/);assert.ok(!unknown.cards[5].evidence.join('').includes('천간과 일간의 관계'));
 const noGender=Q.read(C.calculate({year:1979,month:9,day:8,hour:3}),2026);assert.match(noGender.cards[5].body,/성별/);
});
test('every day in a sixty-day cycle has complete short stories without numeric fortune scores',()=>{
 const names=new Set();for(let i=0;i<60;i++){const dt=new Date(Date.UTC(2024,0,1+i)),d=C.calculate({year:dt.getUTCFullYear(),month:dt.getUTCMonth()+1,day:dt.getUTCDate(),hour:12}),q=Q.read(d,2026);names.add(q.name);assert.equal(q.cards.length,7);assert.ok(q.cards.every(c=>c.title&&c.body&&c.aside));assert.ok(!/undefined|NaN|운세 점수|성공 확률/.test(JSON.stringify(q)));}assert.equal(names.size,10);
});
