(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('lunar-javascript'),require('korean-lunar-calendar'));else root.SajuCalculator=factory({Solar:root.Solar,LunarUtil:root.LunarUtil},root.KoreanLunarCalendar)})(typeof globalThis!=='undefined'?globalThis:this,function(lib,KoreanCalendar){
  'use strict';
  const GAN='甲乙丙丁戊己庚辛壬癸',ZHI='子丑寅卯辰巳午未申酉戌亥';
  const readings={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계',子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해'};
  const gods={'比肩':'비견','劫财':'겁재','食神':'식신','伤官':'상관','偏财':'편재','正财':'정재','七杀':'편관','正官':'정관','偏印':'편인','正印':'정인'};
  const elements={'木':'목','火':'화','土':'토','金':'금','水':'수'};
  function korean(text){return [...text].map(c=>readings[c]||c).join('')}
  function god(day,stem){return gods[lib.LunarUtil.SHI_SHEN[day+stem]]||'추가 검토 중'}
  function element(c){return elements[lib.LunarUtil.WU_XING_GAN[c]||lib.LunarUtil.WU_XING_ZHI[c]]}
  function polarity(c){const index=(GAN.includes(c)?GAN:ZHI).indexOf(c);return index%2===0?'양':'음'}
  function explore(pillars){
    const known=pillars.filter(p=>p.pair),interactions=[];
    const pairRules={형:['子卯','寅巳','巳申','申寅','丑戌','戌未','未丑','辰辰','午午','酉酉','亥亥'],파:['子酉','丑辰','寅亥','卯午','巳申','未戌'],해:['子未','丑午','寅巳','卯辰','申亥','酉戌']};
    for(let i=0;i<known.length;i++)for(let j=i+1;j<known.length;j++){
      const a=known[i],b=known[j],ga=a.pair[0],gb=b.pair[0],za=a.pair[1],zb=b.pair[1];
      const add=(type,chars)=>interactions.push({type,chars,name:korean(chars),positions:a.label+' · '+b.label});
      if(lib.LunarUtil.HE_GAN_5[GAN.indexOf(ga)]===gb)add('천간합',ga+gb);
      if(lib.LunarUtil.HE_ZHI_6[ZHI.indexOf(za)]===zb)add('육합',za+zb);
      if(lib.LunarUtil.CHONG[ZHI.indexOf(za)]===zb)add('지지충',za+zb);
      for(const [type,pairs] of Object.entries(pairRules))if(pairs.some(s=>(s[0]===za&&s[1]===zb)||(s[0]===zb&&s[1]===za)))add(type,za+zb);
    }
    for(const [type,groups] of Object.entries({삼합:['申子辰','寅午戌','巳酉丑','亥卯未'],방합:['寅卯辰','巳午未','申酉戌','亥子丑']}))for(const chars of groups)if([...chars].every(c=>known.some(p=>p.pair[1]===c)))interactions.push({type,chars,name:korean(chars),positions:known.filter(p=>chars.includes(p.pair[1])).map(p=>p.label).join(' · ')});
    const day=pillars[2].pair,group=['申子辰','寅午戌','巳酉丑','亥卯未'].findIndex(s=>s.includes(day[1]));
    const shinsal=[];const noble=Object.entries({'甲戊庚':'丑未','乙己':'子申','丙丁':'亥酉','壬癸':'卯巳','辛':'寅午'}).find(([stems])=>stems.includes(day[0]))[1];
    for(const [name,target] of [['천을귀인',noble],['도화살','酉卯午子'[group]],['역마살','寅申亥巳'[group]],['화개살','辰戌丑未'[group]]]){const positions=known.filter(p=>target.includes(p.pair[1])).map(p=>p.label);shinsal.push({name,target,korean:korean(target),positions,base:name==='천을귀인'?'일간':'일지'})}
    const yinYang={음:0,양:0};known.forEach(p=>[...p.pair].forEach(c=>yinYang[polarity(c)]++));
    return {interactions,shinsal,yinYang};
  }
  function validDate(y,m,d){const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d}
  function calculate(input){
    let {year,month,day,hour=12,minute=0,calendar='solar',leap=false,gender='none',unknown=false,sect=1}=input;
    [year,month,day,hour,minute,sect]=[year,month,day,hour,minute,sect].map(Number);
    if(![year,month,day,hour,minute,sect].every(Number.isInteger)||year<1900||year>2050||hour<0||hour>23||minute<0||minute>59||![1,2].includes(sect)||!['solar','lunar'].includes(calendar)||!['none','male','female'].includes(gender))throw Error('1900~2050년 범위의 올바른 날짜와 시간을 입력해 주세요.');
    const converter=new KoreanCalendar();
    if(calendar==='lunar'){
      if(!converter.setLunarDate(year,month,day,Boolean(leap)))throw Error('존재하지 않는 음력 날짜 또는 윤달입니다. 달력 구분과 윤달을 확인해 주세요.');
      ({year,month,day}=converter.getSolarCalendar());
    }else if(!validDate(year,month,day))throw Error('존재하지 않는 양력 날짜입니다. 월과 일을 확인해 주세요.');
    if(year<1900||year>2050)throw Error('변환한 양력 날짜는 1900~2050년이어야 합니다.');
    if(unknown){hour=12;minute=0}
    const solar=lib.Solar.fromYmdHms(year,month,day,hour,minute,0);
    // Solar terms in lunar-javascript are China standard time (UTC+8).
    // Shift the instant for year/month only; keep Korean civil day/hour.
    const china=solar.nextHour(-1),ec=solar.getLunar().getEightChar(),boundary=china.getLunar().getEightChar();
    ec.setSect(sect);
    const dayStem=ec.getDayGan(),dayIndex=GAN.indexOf(dayStem),branchIndex=Math.floor((hour+1)/2)%12;
    const time=GAN[(dayIndex%5*2+branchIndex)%10]+ZHI[branchIndex];
    const pairs=[boundary.getYear(),boundary.getMonth(),ec.getDay(),unknown?null:time];
    const counts={목:0,화:0,토:0,금:0,수:0};
    const pillars=pairs.map((pair,i)=>{if(!pair)return {label:['연주','월주','일주','시주'][i],unknown:true};for(const c of pair)counts[element(c)]++;
      const hidden=lib.LunarUtil.ZHI_HIDE_GAN[pair[1]];
      return {label:['연주','월주','일주','시주'][i],pair,korean:korean(pair),elements:[element(pair[0]),element(pair[1])],god:i===2?'일간 (나)':god(dayStem,pair[0]),hidden:hidden.map(c=>({stem:c,name:korean(c),god:god(dayStem,c)}))};});
    const seasonalStart=lib.Solar.fromYmdHms(year,month,day,0,0,0).nextHour(-1).getLunar().getEightChar();
    const seasonalEnd=lib.Solar.fromYmdHms(year,month,day,23,59,59).nextHour(-1).getLunar().getEightChar();
    const boundaryUncertain=unknown&&(seasonalStart.getYear()!==seasonalEnd.getYear()||seasonalStart.getMonth()!==seasonalEnd.getMonth());
    let cycles=null;
    if(gender!=='none'&&!unknown){
      const yun=boundary.getYun(gender==='male'?1:0,2);
      cycles={forward:yun.isForward(),start:yun.getStartSolar().nextHour(1).toYmdHms(),startYears:yun.getStartYear(),startMonths:yun.getStartMonth(),startDays:yun.getStartDay(),decades:yun.getDaYun(10).slice(1).map(d=>({startYear:d.getStartYear(),endYear:d.getEndYear(),pair:d.getGanZhi(),name:korean(d.getGanZhi()),god:god(dayStem,d.getGanZhi()[0]),years:d.getLiuNian().map(y=>({year:y.getYear(),pair:y.getGanZhi(),name:korean(y.getGanZhi()),god:god(dayStem,y.getGanZhi()[0])}))}))};
    }
    const currentYear=new Date().getFullYear();
    const annual=Array.from({length:11},(_,i)=>{const y=currentYear-2+i;const pair=lib.Solar.fromYmdHms(y,7,1,12,0,0).getLunar().getEightChar().getYear();return {year:y,pair,name:korean(pair),god:god(dayStem,pair[0])}});
    return {solar:solar.toYmdHms(),pillars,counts,dayStem,dayName:korean(dayStem),dayElement:element(dayStem),cycles,annual,unknown,boundaryUncertain,sect,...explore(pillars)};
  }
  return {calculate,korean,god,element,explore,polarity};
});
