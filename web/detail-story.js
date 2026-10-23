'use strict';
function plainInteraction(data,r,year=null){
 const m=PlainReading.interaction(data,r,year),d=node('details',null,'plain-reading');d.append(node('summary',m.title));m.paragraphs.forEach(text=>d.append(p(text)));d.append(readingEvidence(m.evidence,['relations']));return d;
}
function plainYearConnections(data,year){
 const y=ReadingModel.yearReading(data,year),d=node('details',null,'year-connections');
 d.append(node('summary',y.year+'년과 내 사주는 어디서 맞물릴까?'),p('태어날 때의 내 사주와 '+y.year+'년을 나타내는 글자를 비교했어요. 다른 사람과의 궁합을 보여 주는 부분은 아니에요.'));
 if(y.interactions.length){d.append(p('아래 '+y.interactions.length+'가지 주제로 풀어볼 수 있어요. 궁금한 이야기를 눌러 보세요.','notice'));y.interactions.forEach(r=>d.append(plainInteraction(data,r,y.year)));}
 else d.append(p('이 비교 규칙에서는 별도로 설명할 관계가 나오지 않았어요. 앞의 올해 이야기는 계속 볼 수 있어요. 좋고 나쁜 해를 가르는 표시가 아니에요.'));
 return d;
}
function detailedStory(data,root){
 const chart=root.firstElementChild,profile=ReadingModel.chartProfile(data),E=ReadingModel.editorial,storyRoot=node('div',null,'story'),chapters=[];
 storyRoot.append(p('더 궁금한 이야기를 골라 보세요. 계산에 쓰인 이름과 글자는 각 이야기의 ‘계산 근거’에 담아 두었어요.','notice'));
 function chapter(title,hook){const d=node('details',null,'chapter'),summary=node('summary');summary.append(node('span',title,'chapter-title'),node('span',hook,'chapter-hook'));d.append(summary);chapters.push(d);storyRoot.append(d);return d;}
 const one=chapter('01 · 태어난 네 칸에는 무슨 뜻이 있을까?','내 사주를 만든 글자와 각 칸의 이야기');chart.querySelector('h2').textContent='내 사주를 만든 네 칸';one.append(chart);
 const two=chapter('02 · 나는 어떤 사람으로 읽힐까?',profile.stem.hook),center=panel(profile.dayHook);
 center.append(p(profile.stem.scene),p(profile.stem.friction));
 const day=node('details');day.append(node('summary','가까운 관계와 일상에서는?'),p(profile.branch[1]+'을 떠올려 볼 수 있어요.'),p(profile.branch[2]+'도 생각해 보세요.'));
 const evidence=readingEvidence(['일간 '+data.dayStem+' ('+data.dayName+'), 일주 '+data.pillars[2].pair+'.',profile.stem.strength,profile.stem.action],['stems']);const dayTerm=DB.terms.find(t=>t.hanja===data.pillars[2].pair);if(dayTerm)evidence.append(termLink(dayTerm,'이 글자의 용어 설명'));center.append(day,evidence);two.append(center);
 const elementText={목:['새로 배우고 키우는 모습','시작할 일을 찾고 더 넓혀 가는 장면을 떠올려요.'],화:['생각과 마음을 드러내는 모습','내 생각을 표현하거나 분위기를 움직이는 장면을 떠올려요.'],토:['흩어진 일을 받아 정리하는 모습','사람과 일 사이에서 중심을 잡고 정리하는 장면을 떠올려요.'],금:['기준을 세우고 마무리하는 모습','무엇을 남기고 끝낼지 판단하며 완성하는 장면을 떠올려요.'],수:['정보를 모으고 흐름을 읽는 모습','바로 움직이기 전에 듣고 살피며 준비하는 장면을 떠올려요.']};
 const three=chapter('03 · 내게 먼저 보이는 성향은?',profile.dominant.map(e=>elementText[e][0]).join(' · ')),elements=panel('내 글자에서 먼저 눈에 띄는 모습');profile.dominant.forEach(e=>elements.append(node('h3',elementText[e][0]),p(elementText[e][1])));
 const counts=readingEvidence(['목·화·토·금·수 순서의 글자 수: '+Object.values(data.counts).join(' / ')+'.','겉의 '+(data.unknown?6:8)+'글자를 같은 비중으로 센 결과입니다. 성격 점수나 강약 판정은 아닙니다.','음 '+data.yinYang.음+'개, 양 '+data.yinYang.양+'개.'],['yin']);
 const ul=node('ul',null,'element-list');for(const [name,count] of Object.entries(data.counts)){const li=node('li'),meter=node('meter');meter.min=0;meter.max=data.unknown?6:8;meter.value=count;meter.setAttribute('aria-label',name+' '+count+'개');li.append(node('span',name),meter,node('span',count+'개'));ul.append(li);}counts.append(ul);profile.missing.forEach(m=>counts.append(p(m.name+' 표면 0개. 지장간에서 확인한 자리: '+(m.hiddenPositions.join('·')||'없음')+'.','notice')));elements.append(p('글자가 더 많이 보인다는 이유만으로 이 모습만 있다고 정하지는 않아요. 다른 글자와 태어난 계절도 함께 봅니다.','notice'),counts);three.append(elements);
 const four=chapter('04 · 돈·일·사람을 대할 때는?', '궁금한 생활 이야기를 골라 보세요'),life=panel('내가 생활 속에서 보이는 모습');
 for(const group of profile.groups){const d=node('details');d.append(node('summary',group.title),p(group.question));const items=group.evidence.length?group.evidence:group.hidden,names=[...new Set(items.map(v=>v.name))];
  if(!names.length)d.append(p('이번 비교에서는 별도로 강조할 표시가 없어요. 그 능력이나 인연이 없다는 뜻은 아니에요.'));
  names.forEach(name=>d.append(readingGodCard(name,items.filter(g=>g.name===name).map(g=>g.position+' '+g.stem+' → '+g.name),false)));
  d.append(readingEvidence([group.evidence.length?'겉의 비교 천간에서 확인했습니다.':'지장간의 보조 관계를 살폈습니다.','일간 자신은 비교 대상에서 제외합니다.'],['original']));life.append(d);
 }four.append(life);
 const five=chapter('05 · 같은 성향도 환경에 따라 다르게 보여요','태어난 계절과 다른 글자가 더해 주는 배경'),balance=panel(profile.season+'에 태어난 배경을 함께 봐요');
 balance.append(p(profile.seasonNotes[0]),p('같은 성향도 주변의 도움을 받느냐, 혼자 감당하느냐에 따라 다르게 드러날 수 있죠. 사주에서는 계절과 다른 칸의 글자를 함께 보며 그런 배경을 살펴요.'));
 const boundary=node('details');boundary.append(node('summary','내게 부족한 것은 무엇일까요?'),p('글자 몇 개만 세어서 “이것이 부족하니 반드시 보충해야 한다”고 정하기는 어려워요. 이 화면은 살펴볼 단서까지 보여 주며, 최종 답 하나를 고르지는 않습니다.'));
 balance.append(boundary,readingEvidence(['월지 '+data.pillars[1].pair[1]+', 계절 '+profile.season+'.','일간과 같은 지장간이 있는 자리: '+(profile.roots.join('·')||'없음')+'.','월지 본기 '+profile.monthMain.stem+' · '+profile.monthMain.god+'. 같은 천간이 드러난 자리: '+(profile.monthVisible.join('·')||'없음')+'.','통근·투간의 관찰값이며 신강·신약·격국·용신은 최종 판정하지 않습니다.'],['strength','season','climate']));five.append(balance);
 const six=chapter('06 · 궁금한 해에는 어떤 이야기를 볼까?','한 해의 관심사와 긴 시간의 흐름'),yearPanel=panel('어느 해의 내가 궁금하세요?'),yearControl=selectField('궁금한 연도','reading-year',Array.from({length:151},(_,i)=>[String(1900+i),(1900+i)+'년']));yearControl.input.value=String(Math.max(1900,Math.min(2050,new Date().getFullYear())));const yearResult=node('div');yearPanel.append(yearControl.wrap,yearResult);
 function showYear(){const y=ReadingModel.yearReading(data,yearControl.input.value),g=PlainReading.god(y.god);yearResult.replaceChildren(node('h3',y.year+'년 · '+g.label),p(g.meaning),p(g.story),plainYearConnections(data,y.year),readingEvidence([y.year+'년 '+y.name+' ('+y.pair+'), 천간과 일간의 관계 '+y.god+'.','해당 연간지는 입춘부터 다음 입춘 전까지입니다.'],['engine']));}
 yearControl.input.onchange=showYear;showYear();six.append(yearPanel);
 const luck=panel('10년 단위로 이어서 읽어 보면');if(!data.cycles)luck.append(p(data.unknown?'태어난 시간을 몰라 긴 흐름은 계산하지 않았어요. 입력 바꾸기에서 시간을 채우면 이어 볼 수 있어요.':'긴 흐름도 보려면 입력 바꾸기에서 계산에 사용할 성별을 골라 주세요.'));
 else data.cycles.decades.forEach((cycle,i)=>{const g=PlainReading.god(cycle.god),d=node('details');d.append(node('summary',cycle.startYear+'~'+cycle.endYear+'년 · '+g.label),p(g.story));
  const years=node('details');years.append(node('summary','이 기간의 한 해를 골라 보기'));const choose=selectField('살펴볼 연도','cycle-year-'+i,cycle.years.map(y=>[String(y.year),y.year+'년'])),answer=node('div');function show(){const y=cycle.years.find(y=>String(y.year)===choose.input.value),yg=PlainReading.god(y.god);answer.replaceChildren(node('h3',y.year+'년 · '+yg.label),p(yg.story),readingEvidence([y.name+' ('+y.pair+') · '+y.god],['engine']));}choose.input.onchange=show;show();years.append(choose.wrap,answer);d.append(years,readingEvidence([cycle.name+' ('+cycle.pair+') · '+cycle.god+'.','첫 대운 시작 '+data.cycles.start+' · '+(data.cycles.forward?'순행':'역행')+'.','연 단위 구간입니다. 실제 교체 날짜와 사건 발생을 뜻하지 않습니다.'],['engine']));luck.append(d);});six.append(luck);
 const seven=chapter('07 · 잘 맞는 부분과 엇갈리는 부분','내 안에서 어떤 생활 주제를 함께 볼까?'),rel=panel('내 사주의 글자끼리 비교했어요');rel.append(p('다른 사람과의 궁합이 아니라, 내 사주 안의 여러 부분을 함께 읽는 이야기예요.','notice'));if(data.interactions.length)data.interactions.forEach(r=>rel.append(plainInteraction(data,r)));else rel.append(p('이번 비교에서는 별도로 설명할 관계가 나오지 않았어요. 이 표시만으로 삶이 편하거나 어렵다고 정하지는 않아요.'));seven.append(rel);
 const eight=chapter('08 · 내 사주에 덧붙여 보는 이야기','관심·이동·몰입·도움에 관한 상징'),symbols=panel('이름보다 어떤 모습인지 읽어 보세요'),active=data.shinsal.filter(s=>s.positions.length);
 if(!active.length)symbols.append(p('네 가지 보조 상징에서는 따로 강조할 표시가 없어요. 앞의 내 성향과 생활 이야기를 중심으로 읽어 보세요.'));
 active.forEach(s=>{const m=PlainReading.symbol(s),d=node('details');d.append(node('summary',m.title),p(m.text),readingEvidence(m.evidence,['relations']));symbols.append(d);});symbols.append(readingEvidence(data.shinsal.flatMap(s=>PlainReading.symbol(s).evidence),['relations']));eight.append(symbols);
 root.replaceChildren(storyRoot);
}
