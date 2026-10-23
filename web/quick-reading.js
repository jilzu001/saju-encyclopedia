(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./reading-model.js'),require('./calculator.js'),require('./plain-reading.js'));else root.QuickReading=factory(root.ReadingModel,root.SajuCalculator,root.PlainReading)})(typeof globalThis!=='undefined'?globalThis:this,function(R,C,P){
 'use strict';
 // Original short-form copy. These are symbolic readings, not measured traits.
 const voices={
  甲:{name:'내 길을 여는 사람',title:'납득이 돼야,\n끝까지 가는 사람.',tags:['내 기준','뚝심','시작하는 힘'],money:['남들이 좋다 해도,\n내 기준이 먼저.','오래 가져갈 만한지, 내가 이해하는 선택인지부터 살펴보는 쪽.'],work:['“그냥 하자”는 말이\n제일 답답해요.','이유와 목표가 분명하면, 누가 밀지 않아도 끝까지 가는 힘이 생겨요.'],people:['믿을 사람에겐\n쉽게 등을 안 돌려요.','다만 내 원칙이 상대에겐 고집으로 들릴 때도 있어요.']},
  乙:{name:'길을 찾아내는 사람',title:'세게 밀지 않아도,\n결국 길을 찾아요.',tags:['눈치 빠름','유연함','은근한 끈기'],money:['상황이 바뀌면,\n방법도 바꾸는 쪽.','유연하게 맞추는 솜씨. 다 맞춰 주다 내 몫까지 줄이지는 말아요.'],work:['막힌 일보다,\n풀어 갈 틈이 보여요.','사람 사이를 잇고 말 한마디를 바꿔 분위기를 푸는 역할이 편할 수 있어요.'],people:['분위기는 잘 맞추는데,\n내 마음은 누가 맞추죠?','좋은 관계를 오래 지키려면, 가끔은 내 취향부터 말해도 괜찮아요.']},
  丙:{name:'분위기를 데우는 사람',title:'조용히 있어도,\n내 온도는 전해져요.',tags:['솔직함','시작하는 힘','따뜻한 존재감'],money:['마음이 뜨거워질수록,\n결정은 한 박자 뒤에.','신나는 제안일수록 내일도 같은 마음인지 한 번 더 봐요.'],work:['분위기가 식으면,\n내가 먼저 움직여요.','설명하고 보여 주고 시작을 알릴 때 내 장점이 살아나는 그림이에요.'],people:['내가 챙긴 만큼,\n나도 관심받고 싶어요.','밝은 사람도 무심한 반응엔 서운해요. 원하는 반응을 말해도 괜찮아요.']},
  丁:{name:'작은 변화를 읽는 사람',title:'“괜찮아” 그 말투,\n그냥 못 넘기죠.',tags:['섬세함','깊은 집중','조용한 배려'],money:['마음이 쓰이는 것과,\n필요한 건 다른 얘기.','챙겨 주고 싶은 마음이 커질수록, 내 여유도 같이 살펴봐요.'],work:['다들 못 본 차이,\n내 눈에는 보여요.','한 사람, 한 문제에 집중해 완성도를 다듬는 힘이 있어요.'],people:['챙길 땐 조용히,\n서운함도 혼자.','알아주길 기다리기보다, 나도 배려받고 싶다고 한마디 해 봐요.']},
  戊:{name:'든든하게 버티는 사람',title:'다들 흔들릴 때,\n내가 버티는 쪽.',tags:['묵직한 신뢰','쉽게 안 흔들림','조용한 책임감'],money:['편한 선택이라도,\n한번 굳으면 바꾸기 어렵죠.','익숙하다는 이유로 계속 나가는 돈은 없는지 가끔 돌아봐요.'],work:['“누군가 해야지.”\n그러다 내가 맡고 있죠.', '믿고 맡길 수 있다는 말은 좋지만, 끝까지 혼자 짊어질 필요는 없어요.'],people:['믿음직한 사람도,\n기댈 곳이 필요해요.','괜찮다고만 하면 주변은 정말 괜찮은 줄 알아요. 도움을 먼저 청해도 돼요.']},
  己:{name:'빈틈까지 챙기는 사람',title:'작은 빈틈이 보여,\n결국 내가 챙겨요.',tags:['세심한 챙김','현실 감각','조용한 정리'],money:['큰돈보다,\n새는 작은 돈이 보여요.','사람을 챙기는 마음과 내 지출의 경계도 같이 챙겨요.'],work:['다들 끝났다는데,\n나는 뒷정리 중.', '사람과 준비물을 맞춰 일이 실제로 돌아가게 하는 데 눈이 가요.'],people:['남의 사정은 잘 아는데,\n내 사정은 자꾸 뒤로.', '도와주기 전에 오늘 내 여유가 얼마나 남았는지 먼저 물어봐요.']},
  庚:{name:'핵심을 짚는 사람',title:'할 말은 해야,\n마음이 편해져요.',tags:['분명한 기준','결단력','뒤끝 없는 정리'],money:['복잡한 말보다,\n조건부터 분명하게.', '무엇을 얻고 무엇을 맡는지, 한 문장으로 정리되면 판단하기 편해져요.'],work:['돌려 말하는 사이,\n핵심은 이미 보였죠.', '막힌 곳을 잘라 내고 결정을 내릴 때 힘이 나요. 말의 속도만 한 번 늦춰 봐요.'],people:['내겐 솔직한 한마디,\n상대에겐 세게 들릴 때.', '맞는 말 앞에 마음을 알아주는 한마디를 얹으면 훨씬 잘 닿아요.']},
  辛:{name:'작은 차이를 보는 사람',title:'남들은 끝났다는데,\n나는 한 번 더 확인.',tags:['높은 완성도','섬세한 기준','작은 차이의 감각'],money:['작은 조건 하나도,\n그냥 안 넘어가요.', '꼼꼼한 확인이 장점이에요. 이미 충분한 선택까지 끝없이 고치진 말아요.'],work:['보내기 직전에도,\n어긋난 한 줄이 보여요.', '완성도를 높이는 눈. 부족한 한 가지 말고 잘한 한 가지도 같이 찾아봐요.'],people:['아무렇지 않은 척,\n작은 말은 오래 기억.', '상대는 지나간 줄 알아도 내 마음엔 남을 수 있어요. 서운함을 작게 말해 봐요.']},
  壬:{name:'넓게 흐름을 보는 사람',title:'답은 하나인데,\n나는 다른 길도 보여요.',tags:['큰 흐름','넓은 호기심','유연한 시야'],money:['한 가지보다,\n연결될 가능성이 보여요.', '선택지를 넓히는 건 좋아요. 실제로 챙길 수 있는 범위도 함께 정해요.'],work:['눈앞의 일 너머,\n다음 흐름까지 궁금해요.', '정보와 사람을 연결할 때 생각이 커져요. 오늘 끝낼 한 가지도 남겨 둬요.'],people:['얘기는 잘 통하는데,\n내 속은 다 안 꺼내요.', '생각이 많을수록 상대가 모르는 부분도 많아요. 마음 한 조각은 말로 전해 봐요.']},
  癸:{name:'속깊이 스며드는 사람',title:'말은 짧아도,\n생각은 오래 흘러요.',tags:['세밀한 관찰','깊은 생각','조용한 공감'],money:['작은 낌새부터,\n차근차근 확인해요.', '정보를 모으는 힘이 있어요. 확인이 끝났다면 작은 실행으로 이어 가 봐요.'],work:['겉으로 지나친 일,\n나는 속사정이 궁금.', '듣고 살피고 미세한 차이를 읽는 데 집중력이 살아나요.'],people:['눈치는 빠른데,\n정작 내 마음은 숨겨요.', '알아주길 기다리는 마음도 이해해요. 원하는 걸 한마디 꺼내면 관계가 쉬워져요.']}
 };
 function read(data,year){
  const profile=R.chartProfile(data),voice=voices[data.dayStem],annual=R.yearReading(data,year),known=data.pillars.filter(p=>!p.unknown);
  const card=(id,label,title,body,aside,evidence)=>({id,label,title,body,aside,evidence});
  const basis=['내 일간 '+data.dayName+' ('+data.dayStem+')와 일지 '+data.pillars[2].pair[1]+'의 상징을 바탕으로 새로 쓴 짧은 해설입니다.'];
  const visibleGroup=group=>profile.visibleGods.find(g=>R.editorial.gods[g.name].group===group);
  const money=visibleGroup('재성'),work=visibleGroup('관성')||visibleGroup('식상')||visibleGroup('인성')||profile.visibleGods[0];
  const cycle=data.cycles?.decades.find(c=>c.startYear<=annual.year&&c.endYear>=annual.year),cycleGod=cycle?P.god(cycle.god):null;
  const cards=[
   card('self','나다운 모습',voice.title,profile.dayHook,profile.stem.scene,basis),
   card('money','돈과 선택',voice.money[0],voice.money[1],money?R.editorial.gods[money.name].scene:profile.stem.money,[...basis,...(money?[money.position+' '+money.stem+'와 일간의 관계: '+money.name+'.']:['표면의 재성 유무를 재산이나 부의 크기로 판정하지 않았습니다.'])]),
   card('work','일하는 나',voice.work[0],voice.work[1],R.editorial.gods[work.name].scene,[...basis,work.position+' '+work.stem+'와 일간의 관계: '+work.name+'.']),
   card('people','사랑과 관계',voice.people[0],voice.people[1],profile.branch[2]+'도 챙겨 보세요.',basis),
   card('year',annual.year+'년의 나',P.god(annual.god).label,P.god(annual.god).meaning,P.god(annual.god).scene,[annual.year+'년 '+annual.name+' ('+annual.pair+'). 연간과 내 일간의 관계: '+annual.god+'.','입춘부터 다음 입춘 전까지의 연간지를 기준으로 합니다. 실제 사건을 예측한 문장이 아닙니다.']),
   card('flow','긴 인생의 흐름',cycle?cycleGod.hook:data.unknown?'긴 흐름은,\n시간을 알면 이어 볼게요.':!data.cycles?'내 인생의 긴 호흡도\n궁금하다면.':'이 시기는 긴 흐름의\n표시 범위 밖이에요.',cycle?cycleGod.scene:data.unknown?'태어난 시간을 몰라 10년 단위 흐름은 계산하지 않았어요.':!data.cycles?'입력 바꾸기에서 계산에 사용할 성별을 골라 주세요.':'자세한 풀이에서 제공하는 10년 단위 구간을 확인해 주세요.',cycle?cycle.startYear+'~'+cycle.endYear+'년 · '+cycleGod.action:'입력을 채우면 같은 화면에서 이어 볼 수 있어요.',cycle?['대운 '+cycle.name+' ('+cycle.pair+'), 천간과 일간의 관계 '+cycle.god+'.','연 단위 구간입니다. 정확한 교체일과 실제 삶의 전환은 같다고 단정하지 않습니다.']:['시간과 성별을 입력해야 기존 규칙으로 대운을 계산합니다.']),
   card('takeaway','나에게 한마디','잘하는 만큼,\n나도 챙겨 주세요.',profile.stem.friction,profile.stem.action,basis)
  ];
  return {name:voice.name,tags:voice.tags,element:data.dayElement,year:annual.year,cards,partial:data.unknown||data.boundaryUncertain,knownCount:known.length};
 }
 return {read};
});
