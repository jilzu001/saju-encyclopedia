(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./reading-model.js'),require('./calculator.js'));else root.PlainReading=factory(root.ReadingModel,root.SajuCalculator)})(typeof globalThis!=='undefined'?globalThis:this,function(R,C){
 'use strict';
 const roles={연주:{name:'태어난 해',area:'가족·오래된 인연',year:'가족이나 오래 알고 지낸 사람들과 함께할 일을 살펴봐요.',example:'가족끼리 맡을 일을 나누거나, 익숙한 사람을 통해 일을 이어 가는 모습으로 생각해 볼 수 있어요.'},월주:{name:'태어난 달',area:'일·사회생활',year:'일터에서 사람들과 어떻게 맞춰 가는지 살펴봐요.',example:'같은 목표로 협력할 때의 호흡이나, 내가 맡을 역할을 생각해 보는 부분이에요.'},일주:{name:'태어난 날',area:'나·가까운 관계',year:'내 선택과 가까운 사람과의 관계를 살펴봐요.',example:'내가 원하는 것과 함께 지내는 사람이 원하는 것을 어떻게 맞출지 떠올려 보세요.'},시주:{name:'태어난 시각',area:'앞으로의 계획',year:'개인적으로 해 보고 싶은 일과 앞으로의 계획을 살펴봐요.',example:'미뤄 둔 계획을 실행할지, 다른 사람과 함께할지를 생각해 보는 부분이에요.'}};
 const gods={
  비견:{label:'내 방식대로 해 보고 싶은 마음',meaning:'누가 정해 주는 대로만 하기보다, 내 생각과 결정권도 지키고 싶은 모습이에요.',story:'같이 하는 건 좋은데, 모든 걸 상대 방식에 맞추자니 답답하죠. “네 생각도 알겠어. 그런데 내 생각은 이래.” 대화를 나누면서도 내 자리는 남겨 두고 싶은 마음이에요.'},
  겁재:{label:'친한 사이에도 내 몫은 필요해요',meaning:'사람들과 힘을 합치고 경쟁하는 모습에서, 내 시간과 몫을 어떻게 나눌지 살펴봐요.',story:'처음엔 “우리 사이에 뭘 따져” 했는데, 나중엔 내가 더 많이 하는 것 같아 서운할 수 있죠. 돈이나 역할 이야기를 미리 꺼내는 게 오히려 관계를 지켜 줄 때가 있어요.'},
  식신:{label:'꾸준히 해 온 일이 내 힘이에요',meaning:'손에 익은 일을 차근차근 해내고, 내 방식으로 결과를 만드는 모습을 떠올려요.',story:'남들 눈에 화려해 보이지 않아도, 내가 꾸준히 해 온 일이 있어요. 처음엔 서툴렀는데 지금은 손이 먼저 움직이는 일. 이 부분은 그런 익숙한 솜씨와 생활의 즐거움을 이야기해요.'},
  상관:{label:'더 나은 방법이 자꾸 보여요',meaning:'익숙한 방식의 불편함을 발견하고, 생각을 말이나 결과물로 꺼내는 모습을 살펴봐요.',story:'다들 그냥 하는데 “이렇게 바꾸면 낫지 않나?”가 먼저 떠오르죠. 그 생각을 비판 한마디로 끝내기보다, 직접 보여 줄 작은 결과로 만들면 훨씬 잘 전해져요.'},
  편재:{label:'사람과 기회가 연결되는 데 눈이 가요',meaning:'새 제안이나 사람을 통해 할 일을 넓히고, 여러 자원을 움직이는 모습을 떠올려요.',story:'사람을 만나다 보면 “이 사람과 저 일을 연결하면 재밌겠다”는 생각이 먼저 들 수 있어요. 정해진 일 하나보다, 여러 가능성을 오가며 기회를 찾는 모습을 떠올리는 부분이에요.'},
  정재:{label:'내가 감당할 수 있어야 마음이 놓여요',meaning:'돈과 시간, 맡은 일을 차근차근 관리하며 안정감을 찾는 모습을 살펴봐요.',story:'크게 벌인다는 말보다 “그래서 얼마가 들고, 언제까지 하면 되지?”가 궁금한 쪽이에요. 남들은 꼼꼼하다고 하지만, 내겐 그걸 알아야 마음 놓고 시작할 수 있는 거죠.'},
  편관:{label:'급한 상황에 먼저 나서는 모습',meaning:'어려운 과제나 압박을 마주했을 때 어떻게 움직이는지 살펴보는 부분이에요.',story:'문제가 터지면 피하기보다 내가 정리하고 싶어질 수 있어요. 늘 비상 모드로 버티면 지치기 쉬우니, 이번 일의 끝과 쉴 시점도 같이 잡아 보세요.'},
  정관:{label:'인정받는 자리와 책임의 무게',meaning:'일터의 역할, 지켜야 할 약속과 규칙, 사람들이 내게 기대하는 책임을 살펴봐요.',story:'“믿고 맡길게”라는 말이 반갑다가도, 어느새 내 일이 많아질 때가 있죠. 인정받는 기쁨을 오래 가져가려면, 맡는 순간 어디까지 할지도 분명히 해 두면 좋아요.'},
  편인:{label:'남들이 넘긴 곳에서 단서가 보여요',meaning:'겉으로 보이는 답보다 속사정과 원리가 궁금해지는 모습을 떠올려요.',story:'다들 답이 나왔다는데 나만 “예외는 없을까?”가 궁금해요. 남들이 넘어간 단서를 오래 붙들다 나만의 관점을 만드는 모습. 빨리 이해하는 것과 깊이 이해하는 것이 다르다는 이야기예요.'},
  정인:{label:'이해하고 나면 마음이 움직여요',meaning:'배우고 도움을 받으며 준비하는 모습, 다른 사람을 보살피는 모습을 살펴봐요.',story:'무작정 하라는 말보다 이유를 들으면 훨씬 마음이 놓이는 쪽이에요. 충분히 배웠다면, 오늘 써 볼 한 가지를 골라 보세요. 준비가 경험으로 바뀌는 시작일 수 있어요.'}
 };
 function god(name){const g=gods[name];if(!g)throw Error('설명이 없는 관계: '+name);return {...g,...{hook:R.editorial.gods[name].hook,scene:R.editorial.gods[name].scene,action:R.editorial.gods[name].action}};}
 function role(label){return roles[label]||{name:label,area:'지금 살펴보는 해'};}
 const relations={
  천간합:{label:'서로 맞춰 가는 부분',text:'혼자 할 때는 내 뜻대로 하면 됐는데, 함께할 사람이 생기면 좋은 점도 신경 쓸 점도 늘어나죠. 서로 마음을 모으는 모습과, 맺어진 약속 때문에 내 뜻만 고집할 수 없는 모습을 함께 이야기해요.'},
  육합:{label:'함께할 일과 관계의 거리',text:'말이 잘 통하니 함께하는 일이 편할 수 있죠. 그런데 가까운 사이일수록 부탁을 거절하기 어렵고, 어느 순간 누가 어디까지 맡는지도 흐려질 수 있어요. 사주에서는 이 관계를 친밀함과 얽힘이라는 두 모습으로 풀어봐요.'},
  삼합:{label:'여럿이 같은 쪽으로 힘을 모으는 모습',text:'각자 움직일 땐 더디던 일도 마음이 한쪽으로 모이면 속도가 붙죠. 여러 사람이 같은 목표를 향하거나, 여러 관심사가 한 일로 모이는 모습으로 풀어봐요.'},
  방합:{label:'비슷한 성향이 한데 모이는 모습',text:'마음 맞는 사람끼리 모이면 “역시 우리 생각은 비슷해” 하며 일이 편해지죠. 비슷한 성향이 한데 모이는 모습이에요. 다만 서로 비슷해서 놓치는 부분은 없는지도 생각해 볼 만해요.'},
  지지충:{label:'서로 원하는 방향이 다른 부분',text:'나는 지금 바꾸고 싶은데 다른 한편에선 익숙한 대로 두고 싶을 수 있어요. 서로 원하는 방향이 달라 하나를 택하면 다른 쪽도 조정해야 하는 모습이에요. 싸움이나 사고의 예고가 아니라, 어떤 선택이 필요한지 돌아보는 이야기로 읽어요.'},
  형:{label:'같은 문제로 마음이 걸리는 부분',text:'큰 사건은 아닌데 비슷한 일로 자꾸 마음이 걸릴 때가 있죠. “왜 매번 이럴까?” 하는 부분을 살펴보는 이야기예요. 당연하다고 여긴 기준을 말로 꺼내 보면, 서로 다르게 생각했던 지점을 찾을 수도 있어요.'},
  파:{label:'맞췄던 약속을 다시 손보는 부분',text:'“난 이렇게 하기로 한 줄 알았는데?” 같은 일을 두고도 서로 다르게 기억할 수 있죠. 이미 정한 약속이나 역할을 조금 손보는 모습으로 읽어요. 작은 확인 한 번이 일을 편하게 만들 때가 있어요.'},
  해:{label:'말하지 않아 생기는 오해',text:'겉으론 괜찮다고 했지만 속에선 다른 생각을 하는 순간이 있어요. 상대도 내 마음을 짐작만 하고 있다면 오해가 길어질 수 있겠죠. 이 부분은 말하지 않은 마음과 서로의 속뜻을 돌아보는 이야기예요.'}
 };
 function interaction(data,r,year=null){
  const base=relations[r.type];if(!base)throw Error('설명이 없는 조합: '+r.type);
  const positions=r.positions.split(' · '),birth=positions.filter(p=>roles[p]),annual=year!==null;
  const evidence=[r.positions+' · '+r.name+' '+r.type+' ('+r.chars+')'];
  let title=base.label,paragraphs=[];
  if(annual){
   const area=[...new Set(birth.map(p=>role(p).area))].join('·');title=birth.length===1?area+' — '+base.label:base.label;
   paragraphs.push(birth.length===1?role(birth[0]).year:year+'년'+'의 흐름을 '+area+'와 연결해 살펴봐요.');
   if(r.type==='천간합'&&birth.includes('일주')){const yr=R.yearReading(data,year),g=god(yr.god);title='올해, '+g.label;paragraphs=[g.meaning,g.story];evidence.push('내 일간 '+data.dayStem+'와 '+year+'년 천간 '+yr.pair[0]+'의 관계: '+yr.god+'.');}
   else {paragraphs.push(base.text);if(birth.length===1&&['천간합','육합','삼합','방합'].includes(r.type))paragraphs.push(role(birth[0]).example);}
  }else{title=birth.map(p=>role(p).area).join(' / ')+' — '+base.label;paragraphs.push(birth.map(p=>role(p).area).join(' / ')+'에 관한 이야기를 함께 살펴봐요.',base.text);}
  return {title,paragraphs,evidence};
 }
 const symbolCopy={
  천을귀인:{title:'도움을 주고받는 인연',text:'혼자 끙끙대던 문제가 누군가의 한마디로 풀리는 순간이 있죠. 사주에서 이 상징은 도움을 주고받는 인연을 떠올려요. 막힌 일이 있다면 경험 있는 사람에게 먼저 물어봐도 좋겠어요.'},
  도화살:{title:'사람들의 관심이 모이는 모습',text:'특별히 눈에 띄려 하지 않아도 말투나 표정이 기억에 남는 사람이 있죠. 이 상징은 그런 관심과 표현의 매력을 떠올려요. 내가 편하게 드러낼 수 있는 매력은 무엇일지 생각해 보세요.'},
  역마살:{title:'익숙한 자리 밖으로 움직이는 모습',text:'익숙한 일도 장소나 방식을 바꾸면 전혀 다르게 느껴질 때가 있어요. 이 상징은 새로운 환경을 만나 시야가 넓어지는 모습을 떠올려요. 꼭 멀리 가야 한다는 뜻은 아니에요.'},
  화개살:{title:'혼자 몰입하는 시간의 힘',text:'누가 시키지 않아도 오래 붙들고 있는 취미나 관심사가 있나요? 이 상징은 혼자 몰입하며 나만의 세계를 깊게 만드는 모습을 떠올려요. 혼자 있는 시간이 곧 외로운 시간은 아니겠죠.'}
 };
 function symbol(s){const c=symbolCopy[s.name];if(!c)throw Error('설명이 없는 상징: '+s.name);return {...c,active:s.positions.length>0,positions:s.positions.map(p=>role(p).name),evidence:[s.name+' · '+s.base+' 기준 '+s.korean+' ('+s.target+'). 해당 자리: '+(s.positions.join('·')||'없음')+'.']};}
 function pillar(data,index){const m=R.pillarReading(data,index),col=data.pillars[index],who=role(col.label);if(m.unknown)return {title:'태어난 시각을 알면 더 볼 수 있어요',paragraphs:['시간을 몰라 이 칸의 글자는 계산하지 않았어요.'],evidence:[]};const g=m.god?god(m.god):null;return {title:who.name+' — '+who.area,paragraphs:[who.year,g?g.story:R.chartProfile(data).dayHook,...(g?[g.meaning,R.editorial.stems[col.pair[0]].scene]:['태어난 날의 윗글자는 다른 글자를 읽을 때 나를 나타내는 기준이에요.',R.editorial.stems[col.pair[0]].scene])],evidence:[m.title,m.composition,m.comparison,m.godMeaning,m.branchScene]};}
 function concept(data,name,index){
  const cols=(Number.isInteger(index)?[data.pillars[index]]:data.pillars).filter(c=>!c.unknown),raw=R.conceptReading(data,name,index);
  if(name==='일간')return {title:'내 사주에서 나를 나타내는 글자',paragraphs:['태어난 날의 두 글자 중 윗글자를 나를 나타내는 기준으로 써요.',R.editorial.stems[data.dayStem].hook,R.editorial.stems[data.dayStem].scene],items:[],evidence:raw.lines};
  const hidden=name==='지장간',items=cols.flatMap(c=>hidden?c.hidden.map(h=>({title:role(c.label).name+'에서 살펴보는 '+god(h.god).label,paragraphs:[god(h.god).meaning,god(h.god).story],evidence:[c.label+' '+c.pair[1]+' 속 '+h.stem+' · '+h.god]})):c.label==='일주'?[{title:'태어난 날의 윗글자는 나 자신',paragraphs:['다른 글자와 비교하는 기준이에요. 나 자신을 다른 사람과의 관계처럼 한 번 더 세지는 않아요.'],evidence:[c.pair[0]+' · 일간']}]:[{title:role(c.label).name+'에서 살펴보는 '+god(c.god).label,paragraphs:[god(c.god).meaning,god(c.god).story],evidence:[c.label+' '+c.pair[0]+' · '+c.god]}]);
  return {title:hidden?'겉으로 보이는 글자 안에도 여러 성향을 담아 봐요':'내가 돈·일·사람을 대하는 모습',paragraphs:[hidden?'각 칸의 아랫글자에는 다른 글자가 들어 있다고 봐요. 그 글자들을 나와 비교해, 겉의 한 글자만 볼 때 놓치는 모습을 더 살펴보는 거예요.':'나를 나타내는 글자와 다른 글자의 관계를 보고, 내 방식·표현·돈·책임·배움 같은 생활 주제로 풀어봅니다.'],items,evidence:[name,...raw.lines]};
 }
 return {god,role,roles,interaction,symbol,pillar,concept};
});
