// 「화접지희」 음성 해설 재생과 파형(홈·제작 사례). 파형 값은 실제 음성에서 뽑은 96칸
(()=>{
  const W=[0.56, 0.74, 0.32, 0.67, 0.19, 0.02, 0.06, 0.82, 0.88, 0.96, 0.97, 0.48, 0.02, 0.55, 0.99, 0.95, 0.59, 0.93, 0.55, 0.02, 0.58, 0.7, 0.8, 0.98, 0.35, 0.48, 0.87, 0.83, 0.56, 0.22, 0.01, 0.01, 0.75, 0.64, 0.81, 0.01, 0.18, 0.83, 0.54, 0.07, 0.9, 0.75, 0.01, 0.76, 0.87, 0.48, 0.01, 0.92, 0.93, 0.59, 0.48, 0.01, 0.99, 0.95, 0.92, 0.38, 0.34, 0.01, 0.77, 0.47, 0.93, 0.58, 0.79, 0.55, 0.55, 0.35, 0.18, 0.01, 0.26, 1.0, 0.88, 0.7, 0.55, 0.46, 0.77, 0.37, 0.01, 0.97, 0.82, 0.75, 0.36, 0.59, 0.21, 0.89, 0.58, 0.41, 0.28, 0.01, 0.01, 0.88, 0.49, 0.78, 0.6, 0.67, 0.55, 0.33];
  const mk=el=>{if(!el)return [];el.innerHTML=W.map(v=>`<i style="height:${Math.max(6,v*100)}%"></i>`).join('');return [...el.children]};
  const wave=document.getElementById('wave');
  const bars=[mk(wave),mk(document.getElementById('wave2'))];
  const a=document.getElementById('aud'),btn=document.getElementById('play');
  if(!a||!btn)return;
  const ico=document.getElementById('ico'),tm=document.getElementById('time');
  const f=s=>{s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  const paint=()=>{const d=a.duration||59,k=Math.round(a.currentTime/d*W.length),c=Math.round(a.currentTime);bars.forEach(bs=>bs.forEach((b,i)=>b.classList.toggle('on',i<k)));tm.textContent=f(a.currentTime)+' / '+f(d);if(wave){wave.setAttribute('aria-valuemax',Math.round(d));wave.setAttribute('aria-valuenow',c);wave.setAttribute('aria-valuetext',c+'초')}};
  btn.addEventListener('click',()=>{a.paused?a.play():a.pause()});
  a.addEventListener('play',()=>{const g=window.goatcounter;if(!a.dataset.gc&&g&&g.count){a.dataset.gc=1;g.count({path:'/play/'+a.getAttribute('src').split('/').pop(),title:'음성 재생',event:true})}});
  a.addEventListener('play',()=>{ico.setAttribute('d','M3 1.5h3v11H3zM8 1.5h3v11H8z');btn.setAttribute('aria-pressed','true')});
  a.addEventListener('pause',()=>{ico.setAttribute('d','M3 1.5v11l9.5-5.5z');btn.setAttribute('aria-pressed','false')});
  a.addEventListener('timeupdate',paint);a.addEventListener('loadedmetadata',paint);
  const seek=x=>{if(a.duration){a.currentTime=x;paint()}else{a.preload='metadata';a.addEventListener('loadedmetadata',()=>{a.currentTime=x;paint()},{once:true});a.load()}};
  if(wave){
    wave.addEventListener('click',e=>{const r=wave.getBoundingClientRect(),p=(e.clientX-r.left)/r.width;seek(p*(a.duration||59));if(a.paused)a.play()});
    wave.addEventListener('keydown',e=>{const d={ArrowRight:5,ArrowUp:5,ArrowLeft:-5,ArrowDown:-5,Home:-1e9,End:1e9}[e.key];if(d==null)return;e.preventDefault();const D=a.duration||59;seek(Math.min(D,Math.max(0,a.currentTime+d)))});
  }
})();
