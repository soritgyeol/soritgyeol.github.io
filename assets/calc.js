(function(){
  // 옛 site/index.html에서 그대로 옮김(2026-11-01). 금액(2026-10-30 대표 결정, CLAUDE.md 3절). 바꾸면 안내서·가격표·카탈로그와 같이 고칠 것
  var TIER=['기본','표준','고급'], BASE=[200000,270000,390000], PER=[5000,10000,10000];
  var EN=60000, RUSH=0.5, MAXN=40, KAKAO='https://pf.kakao.com/_XrmWX/chat', MAIL='ysa2co@gmail.com';
  var $=function(id){return document.getElementById(id)};
  var won=function(n){return n.toLocaleString('ko-KR')};
  var pick=function(name){return +document.querySelector('input[name='+name+']:checked').value};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var ymd=function(d){return d.getFullYear()+'. '+(d.getMonth()+1)+'. '+d.getDate()+'.'};
  var enWant=false, last=null;

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
    var raw=qty(), n=Math.min(raw,MAXN), t=pick('tier'), p=pick('pr'), k=pick('kind');
    var en=(t===2)||(t===1&&enWant);
    var L=[], prod=0, total=0;
    function line(name,note,q,v,inc){ L.push({name:name,note:note,q:q,v:v,inc:inc}); total+=v; }
    line(TIER[t]+' 패키지','작품 20점까지','1',BASE[t]); prod+=BASE[t];
    if(n>20){ var x=(n-20)*PER[t]; line('작품 추가','21점부터 1점당 '+won(PER[t])+'원',(n-20)+'점',x); prod+=x; }
    if(t===1&&en){ line('영어 음성 해설','작품 '+n+'편과 전시 소개','1',EN); prod+=EN; }
    if(t===2) line('영어 음성 해설','작품 '+n+'편과 전시 소개 · 고급에 포함','1',0,true);
    var dl=daysLeft(), rush=dl!==null&&dl>=0&&dl<14;
    if(rush) line('급행 진행','전시 '+dl+'일 전 접수 · 제작 금액의 50%','',Math.round(prod*RUSH));
    if(p===1) line('인쇄 대행','인쇄 실비 별도','1',40000);
    if(p===2) line('현장 세팅','폼보드 재단과 설치 · 수도권 · 인쇄 실비 별도','1',200000);

    var I=['작품 캡션 '+n+'점 (QR)','전시 홈페이지 — 작품마다 한 페이지',
      '전시 인사말 (A2 또는 A3)', k===1?'참여 작가 목록':'작가 약력 · 작가 안내 (A4)',
      '카톡 공유 카드','전시 소개 음성 1편'];
    if(t>=1) I.push('작품 음성 해설 '+n+'편 (작품당 300자 이내, 약 1분)');
    if(en) I.push('영어 음성 해설 '+n+'편과 전시 소개');
    if(t===2) I.push('리플렛 디자인 (3단 접지)');
    I.push('수정 2회차, 음성 다시 만들기 1회 포함');

    var T=[p===0?'인쇄는 직접 맡기시며 인쇄비는 별도입니다(20점 기준 어림잡아 5만~7만 원).'
                :'인쇄 실비는 인쇄소 견적을 받아 별도로 알려 드립니다.',
      '사업자등록 전이라 부가세가 붙지 않고, 세금계산서와 현금영수증은 발행되지 않습니다.',
      '수정은 3회차부터 회차당 30,000원입니다.',
      '입력하신 내용 기준의 견적이며, 상담 후 확정합니다.'];
    if(rush) T.splice(3,0,'전시까지 2주가 남지 않아 급행 할증을 넣었습니다. 접수일 기준으로 다시 확인합니다.');
    if(raw>MAXN) T.unshift('40점이 넘는 전시는 상담으로 금액을 정합니다. 이 견적은 40점 기준입니다.');
    return {raw:raw,n:n,t:t,p:p,k:k,en:en,L:L,I:I,T:T,total:total,rush:rush,dl:dl,
      who:$('who').value.trim(),ttl:$('ttl').value.trim(),day:$('day').value};
  }

  function render(){
    var n=qty(); if(+$('qn').value!==n && $('qn').value!=='') $('qn').value=n;
    $('q').value=Math.min(n,MAXN); $('qm').disabled=n<=1; $('qp').disabled=n>=99;
    $('qwarn').hidden=n<=MAXN;
    var t=pick('tier'), en=$('i_en'), o=$('o_en');
    o.classList.remove('locked','fixed'); $('en_v').classList.remove('inc');
    if(t===0){ en.disabled=true; en.checked=false; o.classList.add('locked');
      $('en_i').textContent='작품 음성 해설이 없는 등급'; $('en_v').textContent='—'; }
    else if(t===2){ en.disabled=true; en.checked=true; o.classList.add('fixed');
      $('en_i').textContent='고급에 포함'; $('en_v').textContent='포함'; $('en_v').classList.add('inc'); }
    else { en.disabled=false; en.checked=enWant;
      $('en_i').textContent='작품 전부와 전시 소개를 영어로'; $('en_v').textContent=won(EN); }
    var k=pick('kind'); $('who_l').textContent=k===1?'주최 · 단체 이름':'작가 이름';
    $('who').placeholder=k===1?'예: ○○민화협회':'예: 홍길동';

    var c=last=calc();
    $('m_date').textContent=ymd(new Date());
    $('m_who').textContent=c.who||'—';
    $('m_ttl').textContent=(c.ttl||'—')+(c.day?' · '+ymd(new Date(c.day+'T00:00'))+' 시작':'');
    $('m_kind').textContent=(c.k===1?'단체전':'개인전')+' · 작품 '+c.n+'점 · '+TIER[c.t];
    $('lines').innerHTML=c.L.map(function(l){
      return '<tr><td>'+esc(l.name)+(l.note?'<small>'+esc(l.note)+'</small>':'')+'</td><td class="n">'+esc(l.q)+'</td>'
        +'<td class="m'+(l.inc?' inc':'')+'">'+(l.inc?'포함':won(l.v))+'</td></tr>';
    }).join('');
    $('total').innerHTML=won(c.total)+'<em>원</em>';
    $('bar_t').textContent=won(c.total)+'원';
    var half=Math.round(c.total/2);
    $('pay').textContent='접수 때 '+won(half)+'원 · 파일 전달 때 '+won(c.total-half)+'원';
    clearTimeout(render.t); render.t=setTimeout(function(){ $('sr_total').textContent='합계 '+won(c.total)+'원'; },700);
    $('incl').innerHTML=c.I.map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
    $('terms').innerHTML=c.T.map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
    var subj='전시 지원 견적 ('+(c.k===1?'단체전':'개인전')+' · '+TIER[c.t]+' · 작품 '+c.n+'점)';
    $('b_mail').href='mailto:'+MAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(text(c));
  }

  function link(c){
    var q='#e&n='+c.raw+'&t='+c.t+'&en='+(c.t===1&&c.en?1:0)+'&p='+c.p+'&k='+c.k
      +(c.who?'&w='+encodeURIComponent(c.who):'')+(c.ttl?'&x='+encodeURIComponent(c.ttl):'')+(c.day?'&d='+c.day:'');
    return 'https://soritgyeol.github.io/price.html'+q;
  }
  function text(c){
    var s='[소릿결 견적] '+ymd(new Date())+'\n';
    if(c.who) s+='받는 분: '+c.who+'\n';
    s+='전시: '+(c.ttl||'(이름 미정)')+' · '+(c.k===1?'단체전':'개인전')+' · 작품 '+c.n+'점'+(c.day?' · '+ymd(new Date(c.day+'T00:00'))+' 시작':'')+'\n\n';
    c.L.forEach(function(l){ s+='- '+l.name+(l.q&&l.q!=='1'?' '+l.q:'')+': '+(l.inc?'포함':won(l.v)+'원')+'\n'; });
    s+='합계: '+won(c.total)+'원 (인쇄 실비 별도, 부가세 없음)\n\n견적 다시 보기: '+link(c);
    return s;
  }

  function load(){
    if(location.hash.indexOf('#e&')!==0) return false;
    var P={}; location.hash.slice(3).split('&').forEach(function(kv){var i=kv.indexOf('=');if(i>0)P[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1))});
    if(P.n) $('qn').value=Math.max(1,Math.min(99,parseInt(P.n,10)||20));
    if(/^[012]$/.test(P.t||'')) $('t'+P.t).checked=true;
    if(/^[012]$/.test(P.p||'')) $('p'+P.p).checked=true;
    if(/^[01]$/.test(P.k||'')) document.querySelector('input[name=kind][value="'+P.k+'"]').checked=true;
    enWant=P.en==='1';
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
  $('i_en').addEventListener('change',function(){ if(!this.disabled) enWant=this.checked; render(); });
  document.querySelectorAll('input[name=tier],input[name=pr],input[name=kind]').forEach(function(el){ el.addEventListener('change',render); });
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

  window.addEventListener('hashchange',function(){ if(load()){ render(); $('quote').scrollIntoView(); } });
  var fromLink=load();
  render();
  if(fromLink) $('quote').scrollIntoView();
})();
