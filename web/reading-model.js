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
  function pillarMoment(name){return {연주:'바깥 관계와 익숙한 배경',월주:'일과 역할을 맡는 장면',일주:'가까운 관계와 내 생활',시주:'개인적인 관심과 뒤의 계획'}[name]||name;}
  return {term,catalog,composition,relationNeedsReview,chartProfile,yearReading,pillarMoment,sources:E.sources,editorial:E,disclosure:E.disclosure};
});
