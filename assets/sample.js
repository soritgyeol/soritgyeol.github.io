// 사례 카드의 음성 견본: 브라우저 기본 재생기 대신 첫 화면과 같은 재생 버튼 + 진행 막대
(()=>{
  const f=s=>{s=Math.round(s||0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  document.querySelectorAll('.sample').forEach(box=>{
    const a=box.querySelector('audio'),p=box.querySelector('p');if(!a||!p)return;
    const len=(p.querySelector('small')||{}).textContent||'';
    const name=p.firstChild.textContent.trim().replace(/ 듣기$/,'');
    a.removeAttribute('controls');a.hidden=true;
    const b=document.createElement('button');b.type='button';b.className='play';b.setAttribute('aria-pressed','false');
    b.innerHTML='<span class="k"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9.5-5.5z"/></svg></span><span class="t"></span>';
    const t=b.querySelector('.t');t.textContent=name+' 듣기';b.setAttribute('aria-label',name+' 듣기');const sm=document.createElement('small');sm.setAttribute('aria-hidden','true');sm.textContent='0:00 / '+(len.match(/\d+/)?'0:'+len.match(/\d+/)[0].padStart(2,'0'):'');t.appendChild(sm);
    const bar=document.createElement('div');bar.className='pbar';bar.innerHTML='<i></i>';bar.setAttribute('aria-hidden','true');
    p.replaceWith(b);box.insertBefore(bar,a);
    const ico=b.querySelector('path'),fill=bar.firstChild;
    b.addEventListener('click',()=>{a.paused?a.play():a.pause()});
    a.addEventListener('play',()=>{ico.setAttribute('d','M3 1.5h3v11H3zM8 1.5h3v11H8z');b.setAttribute('aria-pressed','true');const g=window.goatcounter;if(!a.dataset.gc&&g&&g.count){a.dataset.gc=1;g.count({path:'/play/'+a.getAttribute('src').split('/').pop(),title:'음성 재생',event:true})}});
    a.addEventListener('pause',()=>{ico.setAttribute('d','M3 1.5v11l9.5-5.5z');b.setAttribute('aria-pressed','false')});
    a.addEventListener('timeupdate',()=>{fill.style.width=(a.currentTime/(a.duration||1)*100)+'%';sm.textContent=f(a.currentTime)+' / '+f(a.duration)});
    bar.addEventListener('click',e=>{const r=bar.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;const go=()=>{a.currentTime=x*a.duration};if(a.duration)go();else{a.addEventListener('loadedmetadata',go,{once:true});a.load()}if(a.paused)a.play()});
  });
})();
