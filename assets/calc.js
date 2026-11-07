(function(){
  // 금액(2026-11-07 대표 결정, CLAUDE.md 3절). 바꾸면 안내서·가격표·카탈로그·리플렛과 같이 고칠 것
  // 인쇄 금액은 인쇄 업체 단가(2026-11-07 조사)에 20%를 붙인 것 — 고객에게는 업체·마진을 밝히지 않는다
  var TIER=['기본','표준','고급'], BASE=[200000,270000,350000], PER=[5000,10000,10000];
  var PRINT=50000, LEAFQ=[0,0,100,200,300], LEAFP=[0,50000,95000,132000,164000];   // 리플렛: 안 함 · 파일만 · 디자인+인쇄 100/200/300부
  var RUSH=0.5, MAXN=40, KAKAO='https://pf.kakao.com/_XrmWX/chat', MAIL='hello@soritgyeol.com';
  var $=function(id){return document.getElementById(id)};
  var won=function(n){return n.toLocaleString('ko-KR')};
  var pick=function(name){return +document.querySelector('input[name='+name+']:checked').value};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var ymd=function(d){return d.getFullYear()+'. '+(d.getMonth()+1)+'. '+d.getDate()+'.'};
  var last=null;

  function qty(){
    var n=parseInt($('qn').value,10);
    if(isNaN(n)||n<1) n=1;
    return n;
  }
  function daysLeft(){
    var v=$('day').value; if(!v) return null;
    var p=v.split('-'), d=new Date(+p[0],+p[1]-1,+p[2]), t=new Date(); t.setHours(0,0,0,0);
    return Math.round((d-t)/864e5);
  }

  function calc(){
    var raw=qty(), n=Math.min(raw,MAXN), t=pick('tier'), p=pick('pr'), lq=+$('lq').value, lf=lq>0;
    var en=t===2;
    var L=[], prod=0, total=0;
    function line(name,note,q,v,inc){ L.push({name:name,note:note,q:q,v:v,inc:inc}); total+=v; }
    line(TIER[t]+' 등급','작품 20점까지','1',BASE[t]); prod+=BASE[t];
    if(n>20){ var x=(n-20)*PER[t]; line('작품 추가','21점부터 1점당 '+won(PER[t])+'원',(n-20)+'점',x); prod+=x; }
    if(en) line('영어 음성 해설','작품 '+n+'편과 전시 소개 · 고급에 포함','1',0,true);
    var dl=daysLeft(), rush=dl!==null&&dl>=0&&dl<14;
    if(rush) line('급행','전시 '+dl+'일 전 접수 · 제작 금액의 50%','',Math.round(prod*RUSH));
    if(lq===1) line('리플렛','A4 접지 · 디자인 파일','1',LEAFP[1]);
    if(lq>1) line('리플렛','A4 접지 · 디자인과 인쇄, 접어서 배송',LEAFQ[lq]+'부',LEAFP[lq]);
    if(p===1) line('인쇄해서 받기','작품 캡션 '+n+'장(폼보드) · 작가 안내 · 배송','1',PRINT);

    var I=[];
    I.push('전시 소개 음성 해설 1편 (한국어)');
    if(t>=1) I.push('작품 음성 해설 '+n+'편 (한국어, 작품당 1분 이내)');
    if(en) I.push('영어 음성 해설 — 전시 소개와 작품 '+n+'편 (한국어와 같은 내용)');
    I.push('작품 캡션 '+n+'점 (QR)','전시 홈페이지 — 작품마다 한 페이지, 전시가 끝난 뒤 1년까지',
      '전시 인사말 · 작가 약력 · 작가 안내 (인쇄용 PDF)','카톡 공유 카드');
    if(lf) I.push('리플렛 (A4 접지) '+(lq>1?'인쇄 '+LEAFQ[lq]+'부':'디자인 파일'));
    I.push(p===1?'작품 캡션과 작가 안내를 인쇄해서 보내 드림':'인쇄용 PDF 파일로 전달','수정 2회 포함');

    var T=['입금을 확인한 뒤 제작을 시작하고, 시작하기 전에는 전액 돌려 드립니다.',
      '입력하신 내용으로 낸 견적이며, 상담 뒤 확정합니다.'];
    if(rush) T.splice(1,0,'전시까지 2주가 남지 않아 급행 할증(리플렛·인쇄 제외)을 넣었습니다. 할증 여부는 접수일 기준으로 다시 확인합니다.');
    if(raw>MAXN) T.unshift('40점이 넘는 전시는 상담으로 금액을 정합니다. 이 견적은 40점 기준입니다.');
    return {raw:raw,n:n,t:t,p:p,lf:lf,lq:lq,en:en,L:L,I:I,T:T,total:total,rush:rush,dl:dl,
      who:$('who').value.trim(),ttl:$('ttl').value.trim(),day:$('day').value};
  }

  function render(){
    var n=qty(); if(+$('qn').value!==n && $('qn').value!=='') $('qn').value=n;
    $('q').value=Math.min(n,MAXN); $('qm').disabled=n<=1; $('qp').disabled=n>=99;
    $('qwarn').hidden=n<=MAXN;

    var c=last=calc();
    // 고른 값을 단계 제목 옆에(오프린트미 주문 화면 참고, 2026-11-04)
    $('sv2').textContent=c.raw+'점'; $('sv3').textContent=TIER[c.t];
    $('sv4').textContent=c.lq>1?LEAFQ[c.lq]+'부':(c.lq===1?'파일만':'없음');
    $('sv5').textContent=['파일만','인쇄해서 받기'][c.p];
    $('z1').classList.toggle('on',c.raw<=20); $('z2').classList.toggle('on',c.raw>20); $('z2').textContent='21점부터 1점당 '+won(PER[c.t])+'원';
    var et=eta(c); if($('eta').innerHTML!==et) $('eta').innerHTML=et;
    $('m_date').textContent=ymd(new Date());
    $('m_who').textContent=c.who||'—';
    $('m_ttl').textContent=(c.ttl||'—')+(c.day?' · '+ymd(new Date(c.day+'T00:00'))+' 시작':'');
    $('m_kind').textContent='작품 '+c.n+'점 · '+TIER[c.t];
    $('lines').innerHTML=c.L.map(function(l){
      return '<tr><td>'+esc(l.name)+(l.note?'<small>'+esc(l.note)+'</small>':'')+'</td><td class="n">'+esc(l.q)+'</td>'
        +'<td class="m'+(l.inc?' inc':'')+'">'+(l.inc?'포함':won(l.v))+'</td></tr>';
    }).join('');
    $('total').innerHTML=won(c.total)+'<em>원</em>';
    $('bar_t').textContent=won(c.total)+'원';
    $('pay').textContent='접수 때 '+won(c.total)+'원 입금 · 입금 확인 뒤 제작 시작';
    clearTimeout(render.t); render.t=setTimeout(function(){ $('sr_total').textContent='합계 '+won(c.total)+'원'; },700);
    $('incl').innerHTML=c.I.map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
    $('terms').innerHTML=c.T.map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
    var subj='전시 음성 해설 견적 ('+TIER[c.t]+' · 작품 '+c.n+'점)';
    $('b_mail').href='mailto:'+MAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(text(c));
  }

  // 전달 예정일 어림: 접수일 + 열흘(주말 포함). 약속이 아니라 어림이라 「전후」로 씀
  function eta(c){
    var d=new Date(); d.setDate(d.getDate()+10);
    var md=(d.getMonth()+1)+'월 '+d.getDate()+'일';
    var s='오늘 접수하시면 '+md+' 전후에 받으실 수 있습니다. 정확한 일정은 접수 때 정하고, 대본 확인 날짜에 따라 달라집니다.';
    if(c.dl===null) return s;
    if(c.dl<0) return '전시 시작일이 오늘보다 앞입니다. 날짜를 확인해 주세요.';
    if(c.dl===0) return '전시가 오늘 시작합니다. 가능한지 먼저 카카오톡으로 물어봐 주세요.';
    if(c.rush) return '전시까지 '+c.dl+'일 남아 견적서에 급행 할증을 넣었습니다. 가능한 일정은 상담 때 먼저 확인합니다.';
    if(c.dl<21) return '전시까지 '+c.dl+'일 남았습니다. 인쇄 기간까지 생각하면 빠듯하니, 상담 때 일정부터 맞춥니다.';
    return '전시까지 '+c.dl+'일 남았습니다. '+s;
  }

  function link(c){
    var q='#e&n='+c.raw+'&t='+c.t+'&p='+c.p+'&lf='+c.lq
      +(c.who?'&w='+encodeURIComponent(c.who):'')+(c.ttl?'&x='+encodeURIComponent(c.ttl):'')+(c.day?'&d='+c.day:'');
    return 'https://soritgyeol.com/price.html'+q;
  }
  function text(c){
    var s='[소릿결 견적] '+ymd(new Date())+'\n';
    if(c.who) s+='받는 분: '+c.who+'\n';
    s+='전시: '+(c.ttl||'(이름 미정)')+' · 작품 '+c.n+'점'+(c.day?' · '+ymd(new Date(c.day+'T00:00'))+' 시작':'')+'\n\n';
    c.L.forEach(function(l){ s+='- '+l.name+(l.q&&l.q!=='1'?' '+l.q:'')+': '+(l.inc?'포함':won(l.v)+'원')+'\n'; });
    s+='합계: '+won(c.total)+'원\n\n견적 다시 보기: '+link(c);
    return s;
  }

  function load(){
    if(location.hash.indexOf('#e&')!==0) return false;
    var P={}; location.hash.slice(3).split('&').forEach(function(kv){var i=kv.indexOf('=');if(i>0)P[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1))});
    if(P.n) $('qn').value=Math.max(1,Math.min(99,parseInt(P.n,10)||20));
    if(/^[012]$/.test(P.t||'')) $('t'+P.t).checked=true;
    if(/^[01]$/.test(P.p||'')) $('p'+P.p).checked=true;
    if(P.t==='1'&&P.en==='1') $('t2').checked=true;   // 옛 링크(표준+영어)는 고급으로
    if(/^[0-4]$/.test(P.lf||'')) $('lq').value=P.lf;
    if(P.w) $('who').value=P.w.slice(0,40);
    if(P.x) $('ttl').value=P.x.slice(0,60);
    if(/^\d{4}-\d{2}-\d{2}$/.test(P.d||'')) $('day').value=P.d;
    return true;
  }

  $('q').addEventListener('input',function(){ $('qn').value=this.value; render(); });
  $('qn').addEventListener('input',render);
  $('qn').addEventListener('blur',function(){ $('qn').value=qty(); render(); });
  $('qm').addEventListener('click',function(){ $('qn').value=Math.max(1,qty()-1); render(); });
  $('qp').addEventListener('click',function(){ $('qn').value=Math.min(99,qty()+1); render(); });
  $('lq').addEventListener('change',render);
  document.querySelectorAll('input[name=tier],input[name=pr]').forEach(function(el){ el.addEventListener('change',render); });
  ['who','ttl','day'].forEach(function(id){ $(id).addEventListener('input',render); $(id).addEventListener('change',render); });

  // 복사를 먼저 하고, 결과를 이 페이지에 보여 준 뒤 작가가 직접 상담 창을 엽니다(2026-11-01 검토: 창을 먼저 열면 복사가 막히거나 안내를 못 봄)
  $('b_kakao').addEventListener('click',function(){
    var s=text(last);
    var show=function(ok){
      $('copied_t').textContent=ok?'견적을 복사했습니다. 아래 버튼으로 상담 창을 열고, 글 쓰는 칸을 길게 눌러 「붙여넣기」를 누르세요.'
        :'복사가 되지 않았습니다. 상담 창에 작품 수와 등급만 적어 보내 주셔도 같은 견적을 드립니다.';
      $('copied').hidden=false; $('b_open').focus();
    };
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(function(){show(true)},function(){show(fallback(s))});
    else show(fallback(s));
  });
  function fallback(s){
    var ta=document.createElement('textarea'), ok=false; ta.value=s; ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
    try{ ok=document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); return ok;
  }
  $('b_print').addEventListener('click',function(){
    var old=document.title, c=last;
    document.title='소릿결_견적서'+(c.who?'_'+c.who:'')+'_'+new Date().toISOString().slice(0,10);
    window.print(); setTimeout(function(){ document.title=old; },500);
  });

  // 휴대폰: 입력하는 동안 아래에 합계 막대, 견적서가 보이면 숨김
  if('IntersectionObserver' in window){
    var inEst=false, seeQ=false, bar=$('bar');
    var upd=function(){ var on=inEst&&!seeQ; bar.classList.toggle('on',on); document.documentElement.style.scrollPaddingBottom=on?'84px':''; };
    new IntersectionObserver(function(e){ inEst=e[0].isIntersecting; upd(); }).observe(document.querySelector('#est .panel'));
    new IntersectionObserver(function(e){ seeQ=e[0].isIntersecting; upd(); },{threshold:.15}).observe($('quote'));
  }

  // 등급별 음성 견본: 한 번에 하나, 다시 누르면 멈춤
  var da=$('demo_a'), dbs=document.querySelectorAll('.demo .dp');
  dbs.forEach(function(b){ b.addEventListener('click',function(){
    var src=b.getAttribute('data-src');
    if(da.getAttribute('src')===src&&!da.paused){ da.pause(); return; }
    if(da.getAttribute('src')!==src){ da.setAttribute('src',src); da.dataset.gc=''; }
    da.play();
  }); });
  var mark=function(){ dbs.forEach(function(b){ var on=!da.paused&&da.getAttribute('src')===b.getAttribute('data-src');
    b.setAttribute('aria-pressed',on?'true':'false'); b.querySelector('.k').textContent=on?'❚❚':'▶'; }); };
  da.addEventListener('play',function(){ mark(); var g=window.goatcounter;
    if(!da.dataset.gc&&g&&g.count){ da.dataset.gc=1; g.count({path:'/play/est/'+da.getAttribute('src').split('/').pop(),title:'견적 화면 견본 재생',event:true}); } });
  da.addEventListener('pause',mark); da.addEventListener('ended',mark);

  window.addEventListener('hashchange',function(){ if(load()){ render(); $('quote').scrollIntoView(); } });
  var fromLink=load();
  render();
  if(fromLink) $('quote').scrollIntoView();
})();
