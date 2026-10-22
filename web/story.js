'use strict';
function story(data,root){
 const original=[...root.children],chart=original[0],elements=original[1],cycles=original[2],annual=original[3];
 const storyRoot=node('div');storyRoot.className='story';
 const intro=node('div',null,'hero');intro.append(p('8장으로 읽는 내 사주','eyebrow'),node('h2','내 사주, 어디가 눈에 띌까?'),p('제목을 눌러 궁금한 것부터 보세요.','notice'));storyRoot.append(intro);
 const chapters=[];
 function chapter(title,hook,open=false){const d=node('details',null,'chapter');d.open=open;const s=node('summary'),heading=node('span',title,'chapter-title');s.append(heading,node('span',hook,'chapter-hook'));d.append(s);chapters.push(d);storyRoot.append(d);return d}
 const one=chapter('01 · 여덟 글자의 첫인상','내 사주를 이루는 네 기둥',true);chart.querySelector('h2').textContent='사주팔자 · 내 여덟 글자';one.append(chart);
 const two=chapter('02 · 내 사주의 주인공은?','일간 '+data.dayName+' · 일주 '+data.pillars[2].korean,true);
 const c=panel(data.dayName+data.dayElement+' ('+data.dayStem+') · 나를 읽는 출발점');
 c.append(p('내 중심 글자는 '+data.dayName+', 태어난 날의 기둥은 '+data.pillars[2].korean+'입니다.'));
 const dt=DB.terms.find(t=>t.hanja===data.dayStem);if(dt)c.append(p(dt.definition),termLink(dt,'내 일간 더 보기 →'));
 const day=DB.terms.find(t=>t.hanja===data.pillars[2].pair);if(day)c.append(p(day.definition),termLink(day,'내 일주 더 보기 →'));
 const links=node('div',null,'actions');['일간','일주'].forEach(n=>links.append(namedLink(n)));c.append(links);two.append(c);
 const ordered=Object.entries(data.counts).sort((a,b)=>b[1]-a[1]),max=ordered[0][1],top=ordered.filter(x=>x[1]===max).map(x=>x[0]).join('·');
 const three=chapter('03 · 내 사주에 많은 기운은?','표면 오행: '+top+' '+max+'개 · 음 '+data.yinYang.음+' / 양 '+data.yinYang.양);
 elements.querySelector('h2').textContent='오행·음양, 숫자로 한눈에';
 const godDetails=[...elements.querySelectorAll('details')];godDetails.forEach(n=>n.remove());
 elements.append(p('음 '+data.yinYang.음+'개 · 양 '+data.yinYang.양+'개. 글자의 기본 분류입니다. 성격 점수는 아닙니다.','notice'));three.append(elements);
 const four=chapter('04 · 돈·일·사람, 어떤 관계일까?','십성은 내 일간과 다른 글자의 관계');
 const gods=panel('내 명식의 십성');gods.append(p('아래에서 궁금한 십성을 눌러 보세요.'));godDetails.forEach(d=>gods.append(d));four.append(gods);
 const five=chapter('05 · 강한 사주? 균형 잡힌 사주?','신강·신약 · 격국 · 용신');
 const balance=panel('개수 다음은 계절과 뿌리');const month=data.pillars[1];const roots=data.pillars.filter(v=>!v.unknown&&v.hidden.some(h=>h.stem===data.dayStem));
 balance.append(p('내 월지는 '+SajuCalculator.korean(month.pair[1])+' ('+month.pair[1]+'). 계절을 읽는 자리입니다.'),p('일간과 같은 지장간: '+(roots.length?roots.map(p=>p.label).join(' · '):'확인된 기둥에 없음')+'.','notice'),p('신강·신약·격국·용신: 자동 판정 미제공. 월령·통근·합화와 학파별 기준을 함께 검토해야 합니다.','notice'));
 const bl=node('div',null,'actions');['신강','신약','월령','통근','격국','용신'].forEach(n=>bl.append(namedLink(n)));balance.append(bl);five.append(balance);
 const six=chapter('06 · 내 운의 타임라인','10년의 대운, 1년의 세운');cycles.querySelector('h2').textContent='대운 · 10년의 흐름';annual.querySelector('h2').textContent='세운 · 1년의 흐름';six.append(cycles,annual);
 const seven=chapter('07 · 붙을까? 부딪힐까?','명식 안에서 찾은 합·충·형·파·해 '+data.interactions.length+'건');
 const rel=panel('글자 사이의 연결 찾기');rel.append(p('쌍과 조합이 맞는지 찾은 결과입니다. 실제 작용·합화·길흉은 별도 판단입니다.','notice'));
 if(!data.interactions.length)rel.append(p('이 계산 범위에서는 해당 조합이 없습니다.'));
 for(const r of data.interactions){const d=node('details');d.append(node('summary',r.name+' · '+r.type),p(r.positions+' / '+r.chars,'meta'));const t=DB.terms.find(t=>t.name===r.type);if(t)d.append(p(t.definition),termLink(t,'이 관계 알아보기 →'));rel.append(d)}
 const rules=node('details');rules.append(node('summary','어떤 기준으로 찾았나요?'),p('천간합·육합·지지충·삼합·방합, 지지 쌍의 형·파·해를 확인합니다. 형은 쌍 기준 후보를 표시하며 삼형 완성 여부와 방향·거리는 판정하지 않습니다. 반합·암합·천간충·합화 성립은 계산하지 않습니다.','notice'));rel.append(rules);seven.append(rel);
 const eight=chapter('08 · 내 사주에 이런 상징도?','도화 · 역마 · 화개 · 천을귀인');const sinsal=panel('신살 · 가볍게 보는 보조 상징');sinsal.append(p('일간·일지를 기준으로 네 가지 전통 조합을 찾습니다.','notice'));for(const r of data.shinsal){const t=DB.terms.find(t=>t.name===r.name),d=node('details');d.append(node('summary',r.name+' · '+(r.positions.length?r.positions.join('·'):'해당 없음')),p(r.base+' 기준 대상 지지 '+r.korean+' ('+r.target+')','meta'));if(t)d.append(p(t.definition),termLink(t,'상징 더 알아보기 →'));sinsal.append(d)}sinsal.append(p('학파마다 기준이 다릅니다. 시간 미상은 시주를 제외한 부분 결과입니다. 신살로 인생의 사건을 단정할 수 없습니다.','notice'),link('전체 신살 용어 살펴보기','#/category/'+encodeURIComponent('신살과 귀인'),'button'));eight.append(sinsal);
 const toggle=button('모두 펼치기',()=>{const expand=chapters.some(d=>!d.open);chapters.forEach(d=>d.open=expand);toggle.textContent=expand?'모두 접기':'모두 펼치기'});intro.append(toggle);root.replaceChildren(storyRoot);
}
