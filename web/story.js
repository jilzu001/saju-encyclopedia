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
