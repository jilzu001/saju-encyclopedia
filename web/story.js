'use strict';
function readingEvidence(lines,sourceIds=[]){
 const details=node('details',null,'reading-evidence');details.append(node('summary','풀이 근거 보기'));
 lines.forEach(line=>details.append(p(line,'notice')));
 if(sourceIds.length){details.append(p('아래는 개념의 배경 자료입니다. 생활 장면과 팁은 새로 쓴 편집 비유입니다.','notice'));for(const id of sourceIds){const s=ReadingModel.sources[id];if(!s)continue;details.append(s.url?link(s.title,s.url):p(s.title,'notice'));}}
 return details;
}
function readingParagraph(label,text){const box=node('div',null,'reading-line');box.append(node('strong',label),p(text));return box;}
function readingGodCard(name,evidence,open=false){
 const g=ReadingModel.editorial.gods[name],box=node('details',null,'reading-god');box.open=open;
 box.append(node('summary',name+' · '+g.theme),node('h3',g.hook),p(g.scene),readingParagraph('살아나는 힘',g.strength),readingParagraph('과하게 쓰면',g.friction),readingParagraph('한 가지 해보기',g.action),readingEvidence(evidence,['original']));return box;
}
function story(data,root){
 const chart=root.firstElementChild,experience=node('section',null,'quick-story');
 let index=0,model=QuickReading.read(data,Math.max(1900,Math.min(2050,new Date().getFullYear())));
 const top=node('div',null,'quick-top'),intro=node('div');intro.append(p('내 사주, 한 장씩','eyebrow'),p(model.name,'quick-name'));
 const edit=button('입력 바꾸기',()=>{document.body.classList.remove('has-reading');$('birth-year').focus();$('saju-form').scrollIntoView({block:'start'});},'quick-edit');top.append(intro,edit);experience.append(top);
 if(model.partial)experience.append(p(data.unknown?'시간은 미상 · 지금 아는 글자로 읽어 드릴게요.':'절기 경계일 · 태어난 시각에 따라 일부 글자가 달라져요.','notice'));
 const topics=node('div',null,'quick-topics');topics.setAttribute('role','group');topics.setAttribute('aria-label','궁금한 이야기 바로 보기');
 const shortLabels=['나','돈','일','관계','올해','흐름','한마디'],topicButtons=shortLabels.map((label,i)=>{const b=button(label,()=>show(i,true));b.setAttribute('aria-label',model.cards[i].label+' 보기');topics.append(b);return b;});experience.append(topics);
 const stage=node('div',null,'quick-stage'),controls=node('div',null,'quick-controls'),previous=button('←',()=>show(index-1,true)),next=button('',()=>show(index===model.cards.length-1?0:index+1,true),'primary');previous.setAttribute('aria-label','이전 이야기');
 controls.append(previous,next);experience.append(stage,controls,p('전통 상징으로 읽는 재미있는 참고 풀이예요. 닮은 장면만 가볍게 챙겨 보세요.','quick-disclosure'));
 const more=node('details',null,'quick-more'),moreBody=node('div');more.append(node('summary','내 여덟 글자 · 자세한 풀이'),moreBody);let built=false;
 more.addEventListener('toggle',()=>{if(more.open&&!built){built=true;moreBody.append(chart);detailedStory(data,moreBody);}});experience.append(more);
 function show(nextIndex,moveFocus=false){
  index=Math.max(0,Math.min(model.cards.length-1,nextIndex));const c=model.cards[index],card=node('article',null,'quick-card quick-'+c.id);card.setAttribute('aria-labelledby','quick-title');
  const meta=node('div',null,'quick-card-meta');meta.append(node('span',c.label),node('span',(index+1)+' / '+model.cards.length));
  const art=node('div',null,'quick-art');art.setAttribute('aria-hidden','true');art.dataset.element=model.element;
  const title=node('h2',c.title);title.id='quick-title';title.tabIndex=-1;card.append(meta,art,title,p(c.body,'quick-body'));
  if(index===0){const tags=node('div',null,'quick-tags');model.tags.forEach(t=>tags.append(node('span',t)));card.append(tags);}
  if(index!==0)card.append(p(c.aside,'quick-aside'));
  if(c.id==='year'){const year=selectField('다른 해도 볼까요?','quick-year',Array.from({length:151},(_,i)=>[String(1900+i),(1900+i)+'년']));year.input.value=String(model.year);year.wrap.classList.add('quick-year');year.input.onchange=()=>{model=QuickReading.read(data,year.input.value);show(index,false);const replacement=$('quick-year');replacement.focus({preventScroll:true});};card.append(year.wrap);}
  if(c.id==='flow'&&!data.cycles)card.append(button('입력 채우러 가기',()=>edit.click(),'quick-edit'));
  const why=readingEvidence(c.evidence,['original']);why.querySelector('summary').textContent='왜 이런 풀이일까?';why.append(link('용어 뜻이 궁금하다면 →','#/encyclopedia'));card.append(why);stage.replaceChildren(card);
  topicButtons.forEach((b,i)=>{b.setAttribute('aria-pressed',i===index);b.setAttribute('aria-label',model.cards[i].label+' 보기');});previous.disabled=index===0;next.textContent=index===model.cards.length-1?'처음으로 ↺':'다음 · '+shortLabels[index+1]+' →';next.setAttribute('aria-label',index===model.cards.length-1?'처음 이야기 다시 보기':'다음 이야기 · '+model.cards[index+1].label);
  if(moveFocus){topics.scrollLeft=topicButtons[index].offsetLeft-topics.offsetLeft-12;title.focus({preventScroll:true});experience.scrollIntoView({block:'start'});}
 }
 let start=null;stage.addEventListener('pointerdown',e=>{start=e.pointerType==='touch'&&!e.target.closest('button,a,select,summary')?{x:e.clientX,y:e.clientY}:null;});stage.addEventListener('pointercancel',()=>start=null);stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>60&&Math.abs(dy)<40)show(index+(dx<0?1:-1),true);});
 stage.addEventListener('keydown',e=>{if(e.target.closest('button,a,select,input,summary'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1),true);}});
 show(0);root.replaceChildren(experience);
}
function detailedStory(data,root){
 const chart=root.firstElementChild,profile=ReadingModel.chartProfile(data),E=ReadingModel.editorial;
 const storyRoot=node('div',null,'story'),chapters=[];
 const intro=node('div',null,'hero');intro.append(p('8장으로 읽는 내 사주','eyebrow'),node('h2',profile.stem.name+' · '+profile.stem.hook),p('닮은 장면은 챙기고, 다른 장면은 내 경험과 비교해 보세요.','notice'));
 const disclosure=node('details');disclosure.append(node('summary','이 풀이를 읽는 방법'),p(ReadingModel.disclosure,'notice'),link('계산 기준과 참고 자료','#/guide'));intro.append(disclosure);storyRoot.append(intro);
 function chapter(title,hook,open=false){const d=node('details',null,'chapter');d.open=open;const summary=node('summary');summary.append(node('span',title,'chapter-title'),node('span',hook,'chapter-hook'));d.append(summary);chapters.push(d);storyRoot.append(d);return d;}
 const one=chapter('01 · 여덟 글자의 첫인상',data.unknown?'시간 미상 · 여섯 글자부터 읽어요.':'내 사주의 네 기둥을 한눈에.',true);chart.querySelector('h2').textContent='사주팔자 · 내 여덟 글자';one.append(chart);
 const two=chapter('02 · 내 사주의 주인공은?',profile.dayHook,true),center=panel(profile.stem.name+' · '+profile.stem.image);
 center.append(node('h3',profile.stem.hook),p(profile.stem.scene));
 const self=node('details');self.append(node('summary','강점과 피곤해지는 순간'),readingParagraph('살아나는 힘',profile.stem.strength),readingParagraph('과하게 쓰면',profile.stem.friction),readingParagraph('한 가지 해보기',profile.stem.action));center.append(self);
 const dayPanel=node('details');dayPanel.append(node('summary','내 일주 '+data.pillars[2].korean+' ('+data.pillars[2].pair+')'),p(profile.dayHook),p(profile.branch[1]+'을 겹쳐 떠올리는 편집 비유입니다.','notice'),p('내가 챙길 것: '+profile.branch[2]));
 const dayTerm=DB.terms.find(t=>t.hanja===data.pillars[2].pair);if(dayTerm)dayPanel.append(termLink(dayTerm,'내 일주 상세 읽기 →'));center.append(dayPanel,readingEvidence(['일주의 천간 '+data.dayStem+' ('+data.dayName+')를 중심으로 읽었습니다.','일지 '+data.pillars[2].pair[1]+' ('+SajuCalculator.korean(data.pillars[2].pair[1])+')를 보조 비유로 연결했습니다.','같은 일간·일주여도 다른 글자와 경험에 따라 다르게 느껴질 수 있습니다.'],['stems','original']));two.append(center);
 const most=profile.dominant.join('·'),max=Math.max(...Object.values(data.counts));
 const three=chapter('03 · 내 사주에 많은 기운은?','표면에서 먼저 보이는 '+most+' · '+max+'개'),elementPanel=panel('숫자 다음엔, 어떤 역할인지.');
 const elementLines={목:'더 배우고 키우고 싶은 방향.',화:'마음을 드러내고 분위기를 움직이는 방향.',토:'흩어진 일을 받아 정리하는 방향.',금:'기준을 세우고 마무리하는 방향.',수:'정보를 모으고 흐름을 읽는 방향.'};
 const ul=node('ul',null,'element-list');for(const [name,count] of Object.entries(data.counts)){const li=node('li'),meter=node('meter');meter.min=0;meter.max=data.unknown?6:8;meter.value=count;meter.setAttribute('aria-label',name+' '+count+'개');li.append(node('span',name),meter,node('span',count+'개'));ul.append(li);}elementPanel.append(ul,p(most+'의 상징: '+profile.dominant.map(e=>elementLines[e]).join(' ')));
 for(const m of profile.missing)elementPanel.append(p(m.name+'은 표면 0개'+(m.hiddenPositions.length?'지만 지장간에서는 '+m.hiddenPositions.join('·')+'에 보입니다.':'. 확인한 지장간에도 없습니다. 능력이나 운의 유무를 정하는 수치는 아니에요.'),'notice'));
 const yinYang=node('details');yinYang.append(node('summary','음 '+data.yinYang.음+'개 · 양 '+data.yinYang.양+'개'),p(data.yinYang.음===data.yinYang.양?'안으로 정리하는 이미지와 밖으로 펼치는 이미지가 같은 수로 놓였습니다.':data.yinYang.음>data.yinYang.양?'음 글자가 더 많습니다. 한 번 안에서 정리하고 꺼내는 이미지로 읽어 보세요.':'양 글자가 더 많습니다. 생각을 밖으로 꺼내며 움직이는 이미지로 읽어 보세요.'),p('고정된 글자 분류를 센 값이며 외향성·성별·성격 점수는 아닙니다.','notice'));elementPanel.append(yinYang,readingEvidence(['표면의 '+(data.unknown?'6':'8')+'글자를 동일한 비중으로 셌습니다.','지장간의 수를 표면 개수에 더하지 않았습니다. 계절·뿌리·기운의 흐름은 다음 장에서 살핍니다.'],['yin','climate']));three.append(elementPanel);
 const visibleNames=[...new Set(profile.visibleGods.map(g=>g.name))];
 const four=chapter('04 · 돈·일·사람, 어떤 관계일까?',visibleNames.join('·')+' · 겉글자의 역할'),life=panel('내 명식에서 읽는 생활 장면');life.append(p('돈, 일, 사람. 궁금한 주제를 눌러 보세요.','notice'));
 for(const group of profile.groups){const section=node('details');section.append(node('summary',group.title+' · 겉글자 '+group.count+'개'),node('h3',group.question));const evidence=group.evidence.length?group.evidence:group.hidden;
   if(group.count)section.append(p(group.evidence.map(g=>g.position+' '+SajuCalculator.korean(g.stem)+' → '+g.name).join(' / '),'meta'));
   else if(group.hidden.length)section.append(p('표면의 비교 천간에는 없고, 지장간에서 '+[...new Set(group.hidden.map(g=>g.name))].join('·')+'이 보입니다.','notice'));
   else section.append(p('이 비교 범위에는 드러나지 않습니다. 해당 능력이나 인연이 없다는 뜻으로 읽지는 않아요.','notice'));
   const names=[...new Set(evidence.map(g=>g.name))];for(const [index,name] of names.entries())section.append(readingGodCard(name,evidence.filter(g=>g.name===name).map(g=>g.position+'의 '+g.stem+' ('+SajuCalculator.korean(g.stem)+')를 일간 '+data.dayStem+'와 비교하면 '+name+'입니다.'),group.count>0&&index===0));
   section.append(p(group.action));life.append(section);
 }life.append(readingEvidence(['겉글자 집계는 일간 자신을 제외한 '+profile.visibleGods.length+'개 천간만 비교했습니다.','지장간의 십성은 별도 표기하며 같은 가중치로 합산하지 않았습니다.','재성은 재산 액수, 관성은 직업 등급, 인성은 지능 점수가 아닙니다.'],['original','engine']));four.append(life);
 const five=chapter('05 · 강한 사주? 균형 잡힌 사주?',profile.season+'의 배경 · 뿌리 '+profile.roots.length+'곳'),balance=panel('계절·뿌리·드러남, 세 가지 단서');
 balance.append(readingParagraph('태어난 계절',profile.season+'의 월지 '+SajuCalculator.korean(data.pillars[1].pair[1])+' ('+data.pillars[1].pair[1]+'). '+profile.seasonNotes[0]),readingParagraph('내가 발 디딘 곳',profile.roots.length?'같은 일간 '+data.dayStem+'이 '+profile.roots.join('·')+'의 지장간에 있습니다.':'같은 일간 글자는 확인한 지장간에 없습니다. 같은 오행의 다른 뿌리까지 없다는 뜻은 아니에요.'));
 const structure=node('details');structure.append(node('summary','격국을 읽는 단서'),p('월지 본기는 '+profile.monthMain.name+' ('+profile.monthMain.stem+'), 일간과의 관계는 '+profile.monthMain.god+'입니다.'),p(profile.monthVisible.length?'이 본기 글자는 '+profile.monthVisible.join('·')+'의 천간에도 드러나 있습니다.':'이 본기 글자는 확인한 천간에는 드러나지 않았습니다.'),p('월령·투간·다른 글자의 작용을 살피는 관찰값입니다. 이것만으로 특정 격국을 확정하지 않습니다.','notice'));balance.append(structure);
 const use=node('details');use.append(node('summary','용신은 무엇을 보고 고를까?'),p('억부는 강약, 조후는 계절의 한난조습, 격국은 구조의 성립을 중심으로 봅니다.'),p('지금 명식의 첫 질문: '+profile.seasonNotes[1]),p('이 화면은 용신·희신을 자동 확정하지 않습니다. 하나의 오행이나 숫자를 최종 판정처럼 제시하지 않아요.','notice'));balance.append(use);
 const bLinks=node('div',null,'actions');['월령','통근','투간','신강','신약','격국','용신'].forEach(n=>bLinks.append(namedLink(n)));balance.append(bLinks,readingEvidence(['계절은 월지로 분류했습니다.','뿌리 '+profile.roots.length+'곳은 지장간에서 일간과 정확히 같은 글자를 찾은 수입니다. 신강 점수가 아닙니다.','본기는 계산 라이브러리의 중심 지장간으로 비교했습니다.'+(data.unknown?' 시간 미상으로 시주는 제외했습니다.':'')],['strength','season','climate']));five.append(balance);
 const six=chapter('06 · 내 운의 타임라인','올해의 관계부터, 10년의 배경까지.');const yearPanel=panel('궁금한 해의 한 장 풀이'),currentYear=Math.max(1900,Math.min(2050,new Date().getFullYear()));
 const yearControl=selectField('어느 해가 궁금하세요?','reading-year',Array.from({length:151},(_,i)=>[String(1900+i),(1900+i)+'년']));yearControl.input.value=String(currentYear);yearPanel.append(yearControl.wrap);const yearResult=node('div');yearPanel.append(yearResult);
 function renderYear(){const yr=ReadingModel.yearReading(data,yearControl.input.value);yearResult.replaceChildren(node('h3',yr.year+'년 · '+yr.name+' ('+yr.pair+')'),p(yr.god+' · '+yr.theme,'badge'),p(yr.hook,'reading-hook'),p(yr.scene),readingParagraph('생각해 볼 한 가지',yr.action));const ev=[yr.year+'년의 천간 '+yr.pair[0]+'를 일간 '+data.dayStem+'와 비교한 십성은 '+yr.god+'입니다.','이 연간지는 해당 연도 입춘부터 다음 입춘 전까지입니다. 1월의 일부는 이전 연간지에 속할 수 있습니다.'];
   if(yr.interactions.length){const ds=node('details');ds.append(node('summary','원국과 만나는 조합 '+yr.interactions.length+'건'));yr.interactions.forEach(r=>ds.append(p(r.positions+' · '+r.name+' '+r.type,'notice')));yearResult.append(ds);}yearResult.append(readingEvidence(ev,['engine','original']));
 }yearControl.input.onchange=renderYear;renderYear();six.append(yearPanel);
 const luck=panel('10년 대운, 배경을 따라 읽기');
 if(!data.cycles)luck.append(p(data.unknown?'시간 미상으로 대운은 계산하지 않았습니다. 위에서 시간을 선택하면 이어서 볼 수 있어요.':'대운을 보려면 위 입력란에서 계산에 사용할 성별을 선택해 주세요.'));
 else {const d=data.cycles;luck.append(p((d.forward?'순행':'역행')+' · 첫 시작 '+d.start,'meta'));for(const cycle of d.decades){const g=E.gods[cycle.god],details=node('details');details.append(node('summary',cycle.startYear+'~'+cycle.endYear+'년 · '+cycle.name+' · '+g.theme),node('h3',g.hook),p(g.scene),p(g.action));const list=node('ul',null,'cycle-list');for(const year of cycle.years){const li=node('li');li.append(node('strong',year.year+'년 · '+year.name),node('span',year.god+' · '+E.gods[year.god].theme,'meta'));list.append(li);}details.append(list,readingEvidence(['대운 천간 '+cycle.pair[0]+'와 일간 '+data.dayStem+'의 관계는 '+cycle.god+'입니다.','목록은 연 단위 구간입니다. 실제 교체 날짜는 첫 대운 시작일을 기준으로 별도 확인해야 합니다.'],['engine']));luck.append(details);}}luck.append(namedLink('대운'));six.append(luck);
 const seven=chapter('07 · 붙을까? 부딪힐까?','내 글자 사이의 조합 '+data.interactions.length+'건'),rel=panel('글자끼리 만났을 때');if(!data.interactions.length)rel.append(p('이 계산 범위에는 표시할 조합이 없습니다. 다른 글자와 계절을 함께 읽어 보세요.'));
 for(const r of data.interactions){const t=DB.terms.find(t=>t.name===r.type),entry=t?ReadingModel.term(t):null,details=node('details');details.append(node('summary',r.name+' · '+r.type),p(r.positions,'meta'));if(entry)details.append(node('h3',entry.hook),p(entry.scene),termLink(t,'관계 설명 더 보기 →'));details.append(readingEvidence(['확인된 글자: '+r.chars+' / 자리: '+r.positions+'.','이 표시는 조합의 존재입니다. 형의 방향·삼형 완성과 합화·실제 사건을 판정하지 않습니다.'],['relations']));rel.append(details);}seven.append(rel);
 const active=data.shinsal.filter(s=>s.positions.length),eight=chapter('08 · 내 사주에 이런 상징도?',active.length?active.map(s=>s.name).join(' · '):'도화·역마·화개·귀인을 가볍게.'),symbols=panel('이름보다, 어떤 장면인지.');
 for(const r of data.shinsal){const t=DB.terms.find(t=>t.name===r.name),entry=ReadingModel.term(t),details=node('details');details.append(node('summary',r.name+' · '+(r.positions.length?r.positions.join('·'):'이 기준에서 미표시')));if(r.positions.length)details.append(node('h3',entry.hook),p(entry.scene));else details.append(p('이 기준에서는 해당 지지가 없습니다. 다른 신살이나 실제 성향의 유무를 뜻하지는 않아요.','notice'),p(entry.hook));details.append(termLink(t,'상징 설명 더 보기 →'),readingEvidence([r.base+' 기준 대상 지지: '+r.korean+' ('+r.target+').','확인한 자리: '+(r.positions.join('·')||'없음')+'.','네 종류만 확인합니다. '+(data.unknown?'시간 미상으로 시주는 제외했습니다.':'다른 신살을 모두 계산한 목록은 아닙니다.')],['relations','original']));symbols.append(details);}symbols.append(link('전체 신살 용어 살펴보기','#/category/'+encodeURIComponent('신살과 귀인'),'button'));eight.append(symbols);
 const toggle=button('모두 펼치기',()=>{const expand=chapters.some(d=>!d.open);chapters.forEach(d=>d.open=expand);toggle.textContent=expand?'모두 접기':'모두 펼치기';});intro.append(toggle);root.replaceChildren(storyRoot);
}
