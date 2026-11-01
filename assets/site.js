// 메뉴: 860px 이하에서 접힘. Esc·바깥 누르기로 닫힘
(()=>{
  const mb=document.getElementById('menuBtn'),nv=document.getElementById('gnb');
  if(!mb||!nv)return;
  const close=()=>{nv.classList.remove('open');mb.setAttribute('aria-expanded','false')};
  mb.addEventListener('click',()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  nv.addEventListener('click',e=>{if(e.target.tagName==='A')close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nv.classList.contains('open')){close();mb.focus()}});
  document.addEventListener('click',e=>{if(!e.target.closest('header'))close()});
})();
// 음성은 한 번에 하나만
document.addEventListener('play',e=>document.querySelectorAll('audio').forEach(x=>x!==e.target&&x.pause()),true);
