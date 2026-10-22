(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('korean-lunar-calendar'));
  else root.BirthOptions=factory(root.KoreanLunarCalendar);
})(typeof globalThis!=='undefined'?globalThis:this,function(KoreanCalendar){
  'use strict';
  function days(year,month,calendar,leap){
    year=Number(year);month=Number(month);
    if(!Number.isInteger(year)||year<1900||year>2050||!Number.isInteger(month)||month<1||month>12)return [];
    if(calendar==='lunar'){
      const converter=new KoreanCalendar();
      return Array.from({length:30},(_,i)=>i+1).filter(day=>converter.setLunarDate(year,month,day,Boolean(leap)));
    }
    return Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>i+1);
  }
  function years(currentYear){
    const start=Math.max(1900,Math.min(2050,Number(currentYear)||new Date().getFullYear()));
    return Array.from({length:start-1899},(_,i)=>start-i).concat(Array.from({length:2050-start},(_,i)=>start+i+1));
  }
  return {days,years};
});
