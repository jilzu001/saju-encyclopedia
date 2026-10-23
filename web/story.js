'use strict';
function readingEvidence(lines,sourceIds=[]){
 const details=node('details',null,'reading-evidence');details.append(node('summary','계산 근거 보기'));
 lines.forEach(line=>details.append(p(line,'notice')));
 if(sourceIds.length){details.append(p('아래는 개념의 배경 자료입니다. 생활 장면과 팁은 새로 쓴 편집 비유입니다.','notice'));for(const id of sourceIds){const s=ReadingModel.sources[id];if(!s)continue;details.append(s.url?link(s.title,s.url):p(s.title,'notice'));}}
 return details;
}
function readingParagraph(label,text){const box=node('div',null,'reading-line');box.append(node('strong',label),p(text));return box;}
function readingGodCard(name,evidence,open=false){
 const g=PlainReading.god(name),box=node('details',null,'reading-god');box.open=open;
 box.append(node('summary',g.label),p(g.meaning),p(g.story),readingEvidence([name,...evidence],['original']));return box;
}
function story(data,root){
 const chart=root.firstElementChild,experience=node('section',null,'quick-story');
 let index=0,model=QuickReading.read(data,Math.max(1900,Math.min(2050,new Date().getFullYear())));
 const top=node('div',null,'quick-top'),intro=node('div');intro.append(p('내 사주, 한 장씩','eyebrow'),p(model.name,'quick-name'));
 const edit=button('입력 바꾸기',()=>{document.body.classList.remove('has-reading');$('birth-year').focus();$('saju-form').scrollIntoView({block:'start'});},'quick-edit');top.append(intro,edit);experience.append(top);
 if(model.partial)experience.append(p(data.unknown?'태어난 시간은 모르는 상태로 읽고 있어요.':'태어난 날이 계절을 나누는 경계에 있어요. 시간에 따라 일부 풀이가 달라져요.','notice'));
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
  if(c.id==='year'){card.append(plainYearConnections(data,model.year));const year=selectField('다른 해도 볼까요?','quick-year',Array.from({length:151},(_,i)=>[String(1900+i),(1900+i)+'년']));year.input.value=String(model.year);year.wrap.classList.add('quick-year');year.input.onchange=()=>{model=QuickReading.read(data,year.input.value);show(index,false);const replacement=$('quick-year');replacement.focus({preventScroll:true});};card.append(year.wrap);}
  if(c.id==='flow'&&!data.cycles)card.append(button('입력 채우러 가기',()=>edit.click(),'quick-edit'));
  const why=readingEvidence(c.evidence,['original']);why.querySelector('summary').textContent='계산 근거 보기';why.append(link('용어 뜻이 궁금하다면 →','#/encyclopedia'));card.append(why);stage.replaceChildren(card);
  topicButtons.forEach((b,i)=>{b.setAttribute('aria-pressed',i===index);b.setAttribute('aria-label',model.cards[i].label+' 보기');});previous.disabled=index===0;next.textContent=index===model.cards.length-1?'처음으로 ↺':'다음 · '+shortLabels[index+1]+' →';next.setAttribute('aria-label',index===model.cards.length-1?'처음 이야기 다시 보기':'다음 이야기 · '+model.cards[index+1].label);
  if(moveFocus){topics.scrollLeft=topicButtons[index].offsetLeft-topics.offsetLeft-12;title.focus({preventScroll:true});experience.scrollIntoView({block:'start'});}
 }
 let start=null;stage.addEventListener('pointerdown',e=>{start=e.pointerType==='touch'&&!e.target.closest('button,a,select,summary')?{x:e.clientX,y:e.clientY}:null;});stage.addEventListener('pointercancel',()=>start=null);stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>60&&Math.abs(dy)<40)show(index+(dx<0?1:-1),true);});
 stage.addEventListener('keydown',e=>{if(e.target.closest('button,a,select,input,summary'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1),true);}});
 show(0);root.replaceChildren(experience);
}
