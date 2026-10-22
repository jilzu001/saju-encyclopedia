(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./editorial-data.js'),require('./calculator.js'),require('lunar-javascript'));
  else root.ReadingModel=factory(root.SajuEditorial,root.SajuCalculator,{Solar:root.Solar,LunarUtil:root.LunarUtil});
})(typeof globalThis!=='undefined'?globalThis:this,function(E,C,lib){
  'use strict';
  const GAN='甲乙丙丁戊己庚辛壬癸',ZHI='子丑寅卯辰巳午未申酉戌亥';
  const seasons={寅:'봄',卯:'봄',辰:'봄',巳:'여름',午:'여름',未:'여름',申:'가을',酉:'가을',戌:'가을',亥:'겨울',子:'겨울',丑:'겨울'};
  const seasonNotes={봄:['시작하고 키우는 장면을 먼저 떠올립니다.','계획을 넓히기 전에 마무리할 한 가지도 남겨 보세요.'],여름:['드러내고 움직이는 장면을 먼저 떠올립니다.','속도가 붙을수록 쉼과 확인의 순서도 챙겨 보세요.'],가을:['선택하고 정리하는 장면을 먼저 떠올립니다.','기준을 세우되 바꿀 수 있는 방법도 남겨 보세요.'],겨울:['모으고 준비하는 장면을 먼저 떠올립니다.','혼자 정리한 생각을 작은 행동으로 꺼내 보세요.']};
  function term(t){
    let hook,body,scene,sourceIds=['original'],kind='용어를 쉽게 푼 편집 해설';
    if(GAN.includes(t.hanja)&&t.hanja.length===1){const s=E.stems[t.hanja];hook=s.hook;body=[s.image+'에 빗대어 기억하는 '+s.name+'입니다. '+s.strength,s.friction];scene=s.scene;sourceIds.push('stems');kind='전통 상징의 일상 비유';}
    else if(ZHI.includes(t.hanja)&&t.hanja.length===1){const b=E.branches[t.hanja];hook=b[0]+'을 닮은 한 글자.';body=[b[1]+'으로 기억해 보세요.',b[2]+'을 떠올리는 상징적 비유입니다.'];scene='명식에서 이 글자가 놓인 기둥과 지장간을 함께 읽으면 맥락이 생깁니다.';}
    else if(t.subcategory==='육십갑자'){
      const [gan,zhi]=[...t.hanja],s=E.stems[gan],b=E.branches[zhi],index=lib.LunarUtil.JIA_ZI.indexOf(t.hanja);
      if(!s||!b||index<0)throw Error('Unknown sexagenary term: '+t.id);
      hook=E.dayHooks[index];body=[s.image+'의 '+s.name+'와 '+b[0]+'을 닮은 지지 '+C.korean(zhi)+' ('+zhi+')의 조합입니다.','일상 장면으로 옮기면, '+b[1]+'을 떠올릴 수 있습니다.'];scene=s.scene+' '+s.action;sourceIds.push('stems');kind='두 글자를 엮은 편집 비유';
    }else if(E.gods[t.name]){const g=E.gods[t.name];hook=g.hook;body=[g.scene,g.friction];scene=g.action;kind='십성의 일상 비유';}
    else {const entry=E.notesById[t.id]||E.notes[t.name];if(!entry)throw Error('Missing editorial: '+t.id+' '+t.name);[hook,...body]=entry;scene=body.pop();}
    if(t.category==='격국과 용신')sourceIds.push('strength','season');
    if(['조후','궁통보감'].includes(t.name))sourceIds.push('climate');
    if(t.category==='간지와 오행'&&['음','양','목','화','토','금','수'].includes(t.name)&&!GAN.includes(t.hanja)&&!ZHI.includes(t.hanja))sourceIds.push('yin');
    if(['대운','세운','만세력','절입','절기'].includes(t.name))sourceIds.push('engine');
    if(['간지 관계','신살과 귀인'].includes(t.category))sourceIds.push('relations');
    return {id:t.id,hook,body,scene,sourceIds:[...new Set(sourceIds)],kind,reviewStatus:'편집 해설 · 개별 원전 쪽수 대조 미완료'};
  }
  function catalog(db){return new Map(db.terms.map(t=>[t.id,term(t)]));}
  function composition(t,db){if(t.subcategory!=='육십갑자')return [];return [...t.hanja].map(h=>db.terms.find(v=>v.hanja===h&&v.hanja.length===1));}
  function relationNeedsReview(a,b,type){if(type!=='구성')return false;const pair=a.subcategory==='육십갑자'?a:b.subcategory==='육십갑자'?b:null,part=pair===a?b:a;return Boolean(pair&&part.hanja.length===1&&!pair.hanja.includes(part.hanja));}
  function chartProfile(data){
    const known=data.pillars.filter(p=>!p.unknown),stem=E.stems[data.dayStem],day=data.pillars[2],month=data.pillars[1];
    const dayIndex=lib.LunarUtil.JIA_ZI.indexOf(day.pair),branch=E.branches[day.pair[1]];
    const visibleGods=known.filter(p=>p.label!=='일주').map(p=>({name:p.god,position:p.label,stem:p.pair[0]}));
    const counts=Object.fromEntries(Object.keys(E.gods).map(name=>[name,visibleGods.filter(p=>p.name===name).length]));
    const groups=Object.entries(E.groups).map(([name,g])=>{const evidence=visibleGods.filter(p=>E.gods[p.name]?.group===name),hidden=known.flatMap(p=>p.hidden.filter(h=>E.gods[h.god]?.group===name).map(h=>({name:h.god,position:p.label,stem:h.stem})));return {name,...g,evidence,hidden,count:evidence.length};});
    const dominant=Object.entries(data.counts).filter(([,n])=>n===Math.max(...Object.values(data.counts))).map(([name])=>name);
    const missing=Object.entries(data.counts).filter(([,n])=>n===0).map(([name])=>({name,hiddenPositions:known.filter(p=>p.hidden.some(h=>C.element(h.stem)===name)).map(p=>p.label)}));
    const roots=known.filter(p=>p.hidden.some(h=>h.stem===data.dayStem)).map(p=>p.label);
    const monthMain=month.hidden[0],monthVisible=known.filter(p=>p.pair[0]===monthMain.stem).map(p=>p.label);
    const season=seasons[month.pair[1]];
    return {stem,dayHook:E.dayHooks[dayIndex],branch,visibleGods,counts,groups,dominant,missing,roots,monthMain,monthVisible,season,seasonNotes:seasonNotes[season],partial:data.unknown||data.boundaryUncertain};
  }
  function yearReading(data,year){
    year=Number(year);if(!Number.isInteger(year)||year<1900||year>2050)throw Error('지원하지 않는 연도입니다.');
    const pair=lib.Solar.fromYmdHms(year,7,1,12,0,0).getLunar().getEightChar().getYear(),god=C.god(data.dayStem,pair[0]);
    const interactions=C.explore([...data.pillars,{label:year+'년',pair}]).interactions.filter(r=>r.positions.includes(year+'년'));
    return {year,pair,name:C.korean(pair),god,...E.gods[god],interactions};
  }
  const pillarRoles={연주:['바깥 관계와 익숙한 배경','가족·자라온 환경·바깥 관계를 살피는 자리예요.'],월주:['일과 역할을 맡는 장면','일·사회생활의 역할과 태어난 계절을 살피는 자리예요.'],일주:['가까운 관계와 내 생활','나를 나타내는 윗글자와 가까운 관계를 살피는 아랫글자가 짝을 이룬 자리예요.'],시주:['개인적인 관심과 뒤의 계획','개인적인 관심·계획과 삶의 뒤쪽을 살피는 자리예요.']};
  const godMeanings={비견:'나와 같은 오행·음양. 내 기준과 동료를 떠올리는 관계예요.',겁재:'나와 같은 오행, 다른 음양. 경쟁과 내 몫 나누기를 떠올리는 관계예요.',식신:'내가 기운을 내어 키우는 오행, 같은 음양. 꾸준히 만들고 표현하는 관계예요.',상관:'내가 기운을 내어 키우는 오행, 다른 음양. 새 방식과 솔직한 표현을 떠올리는 관계예요.',편재:'내가 다루고 조절하는 오행, 같은 음양. 기회를 넓히고 자원을 움직이는 관계예요.',정재:'내가 다루고 조절하는 오행, 다른 음양. 돈과 자원을 꾸준히 관리하는 관계예요.',편관:'나를 제어하고 긴장시키는 오행, 같은 음양. 압박과 도전을 다루는 관계예요.',정관:'나를 제어하고 긴장시키는 오행, 다른 음양. 책임과 규칙을 떠올리는 관계예요.',편인:'나에게 기운을 보태는 오행, 같은 음양. 남다른 탐구와 관점을 떠올리는 관계예요.',정인:'나에게 기운을 보태는 오행, 다른 음양. 배움과 돌봄을 떠올리는 관계예요.'};
  function pillarMoment(name){return pillarRoles[name]?.[0]||name;}
  function pillarReading(data,index){
    const col=data.pillars[index];if(!col)throw Error('없는 기둥입니다.');
    const role=pillarRoles[col.label];
    if(col.unknown)return {unknown:true,title:'내 '+col.label+' · 시간 미상',definition:role[1],notice:'태어난 시간을 몰라 시주와 그 안의 십성·지장간을 계산하지 않았어요.'};
    const [gan,zhi]=[...col.pair],stem=E.stems[gan],branch=E.branches[zhi],isDay=index===2;
    return {unknown:false,title:'내 '+col.label+' '+col.korean+' ('+col.pair+')',definition:role[1],context:role[0],pair:col.pair,
      composition:'위 '+C.korean(gan)+' ('+gan+')는 '+stem.name+' · '+stem.image+', 아래 '+C.korean(zhi)+' ('+zhi+')는 '+C.element(zhi)+'에 속하며 '+branch[0]+'에 빗대어요.',
      hook:stem.hook,scene:role[0]+'에 겹쳐 보면, '+stem.scene,
      branchScene:'아랫글자 '+C.korean(zhi)+' ('+zhi+'): '+branch[1]+'.',
      god:isDay?null:col.god,godMeaning:isDay?'일주 윗글자 '+data.dayName+' ('+data.dayStem+')가 나 자신을 뜻하는 일간이에요. 자신과의 관계를 십성으로 한 번 더 세지 않아요.':godMeanings[col.god],
      godHook:isDay?stem.hook:E.gods[col.god].hook,godScene:isDay?stem.scene:E.gods[col.god].scene,
      comparison:isDay?'내 일간은 '+data.dayName+' ('+data.dayStem+'), '+stem.name+'예요.':'내 일간 '+data.dayName+' ('+data.dayStem+')를 기준으로 '+col.label+'의 윗글자 '+C.korean(gan)+' ('+gan+')를 비교하면 '+col.god+'예요.',
      hidden:col.hidden.map(h=>({...h,element:C.element(h.stem),meaning:godMeanings[h.god],theme:E.gods[h.god].theme,scene:E.gods[h.god].scene})),
      notice:'이 자리에서 떠올리는 전통 상징의 비유예요. 한 기둥만으로 실제 가족관계·직업·성격이나 미래를 정하지 않아요.'};
  }
  function conceptReading(data,name,index){
    const known=data.pillars.filter(c=>!c.unknown),selected=Number.isInteger(index)?data.pillars[index]:null;
    if(name==='일간')return {title:'일간 · 나를 나타내는 중심 글자',definition:'태어난 날의 두 글자 중 윗글자예요. 다른 글자와의 관계를 읽을 때 기준으로 삼아요.',lines:['내 일주 '+data.pillars[2].korean+' ('+data.pillars[2].pair+')에서 '+data.dayName+' ('+data.dayStem+')가 일간이에요.',E.stems[data.dayStem].name+' · '+E.stems[data.dayStem].image+'의 상징이에요.'],items:[]};
    if(name==='십성'){const cols=selected?[selected]:known;return {title:'십성 · 나와 다른 글자의 관계',definition:'내 중심 글자인 일간과 다른 글자를 오행·음양으로 비교해 붙이는 열 가지 관계 이름이에요. 성격 점수가 아니에요.',lines:['내 기준은 '+data.dayName+' ('+data.dayStem+')예요. 겉의 윗글자부터 비교하면 다음과 같아요.'],items:cols.filter(c=>!c.unknown).map(c=>({title:c.label+' '+C.korean(c.pair[0])+' ('+c.pair[0]+')'+(c.label==='일주'?' · 일간 (나)':' → '+c.god),text:c.label==='일주'?'비교의 기준인 나 자신이에요. 다른 글자의 십성과 구분해요.':godMeanings[c.god],scene:c.label==='일주'?'':E.gods[c.god].scene}))};}
    if(name==='지장간'){const cols=(selected?[selected]:known).filter(c=>!c.unknown),sample=cols[0]?.hidden[0];return {title:(selected?selected.label+'의 ':'')+'지장간 · 아랫글자 속에 든 기운',definition:'각 기둥의 아랫글자(지지) 안에 들어 있다고 보는 천간이에요. 지장간도 내 일간과 비교해 십성을 붙여요.',lines:[sample?'내 결과의 “'+sample.name+' · '+sample.god+'”는 숨은 글자가 '+sample.name+' ('+sample.stem+')이고, 내 일간과의 관계가 '+sample.god+'라는 뜻이에요. 아래 항목을 누르면 뜻을 볼 수 있어요.':'시간 미상인 시주는 지장간도 계산하지 않았어요.'],items:cols.flatMap(c=>c.hidden.map(h=>({title:c.label+' '+C.korean(c.pair[1])+' ('+c.pair[1]+') 속 '+h.name+' ('+h.stem+') → '+h.god,text:godMeanings[h.god],scene:E.gods[h.god].scene})))};}
    throw Error('없는 설명입니다.');
  }
  return {term,catalog,composition,relationNeedsReview,chartProfile,yearReading,pillarMoment,pillarReading,conceptReading,sources:E.sources,editorial:E,disclosure:E.disclosure};
});
