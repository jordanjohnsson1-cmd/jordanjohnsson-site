/* Lucide static icons, v0.468.0. See ICON-LICENSE.txt for ISC license. */
(function(){
  var icons = {"track":"<line  x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" />\n  <line  x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" />\n  <circle  cx=\"12\" cy=\"14\" r=\"8\" />\n","stem":"<rect  width=\"16\" height=\"16\" x=\"4\" y=\"4\" rx=\"2\" />\n  <rect  width=\"6\" height=\"6\" x=\"9\" y=\"9\" rx=\"1\" />\n  <path  d=\"M15 2v2\" />\n  <path  d=\"M15 20v2\" />\n  <path  d=\"M2 15h2\" />\n  <path  d=\"M2 9h2\" />\n  <path  d=\"M20 15h2\" />\n  <path  d=\"M20 9h2\" />\n  <path  d=\"M9 2v2\" />\n  <path  d=\"M9 20v2\" />\n","photography":"<path  d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\" />\n  <circle  cx=\"12\" cy=\"13\" r=\"3\" />\n","music":"<circle  cx=\"8\" cy=\"18\" r=\"4\" />\n  <path  d=\"M12 18V2l7 4\" />\n","press":"<path  d=\"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2\" />\n  <path  d=\"M18 14h-8\" />\n  <path  d=\"M15 18h-5\" />\n  <path  d=\"M10 6h8v4h-8V6Z\" />\n"};
  var style=document.createElement('style');
  style.textContent='section h2 .section-icon{display:inline-block;width:.53em;height:.53em;margin-right:.27em;vertical-align:.015em;color:var(--acc);opacity:.85;stroke-width:1.8;flex:none}@media(max-width:600px){section h2 .section-icon{width:.48em;height:.48em;margin-right:.24em}}';
  document.head.appendChild(style);
  Object.keys(icons).forEach(function(id){
    var h=document.querySelector('#'+id+' h2');
    if(!h || h.querySelector('.section-icon'))return;
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','section-icon');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-linecap','round');
    svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.innerHTML=icons[id];
    h.insertBefore(svg,h.firstChild);
  });
})();

/* Photography gallery controls: five-position window, thumb scrubbing, and hold-to-advance. */
(function(){
  var strip=document.getElementById('galstrip'),dots=document.getElementById('galdots');
  if(!strip||!dots)return;
  var photos=[].slice.call(strip.querySelectorAll('.gimg'));
  if(photos.length<2)return;
  dots.replaceChildren();
  dots.setAttribute('aria-hidden','false');
  dots.setAttribute('role','group');
  dots.setAttribute('aria-label','Photography gallery: slide or hold to move through all photos');
  dots.style.touchAction='none';
  var count=Math.min(5,photos.length),buttons=[],index=0,start=0;
  var pressTimer=null,fastTimer=null,pressX=0,ignoreClick=false;
  function stride(){return photos.length>1?photos[1].offsetLeft-photos[0].offsetLeft:strip.clientWidth}
  function clamp(n){return Math.max(0,Math.min(photos.length-1,n))}
  function goto(n,animated){index=clamp(n);strip.scrollTo({left:photos[index].offsetLeft-photos[0].offsetLeft,behavior:animated?'smooth':'instant'});render()}
  function readIndex(){var s=stride();index=s?clamp(Math.round(strip.scrollLeft/s)):0;render()}
  function render(){
    start=Math.max(0,Math.min(photos.length-count,index-Math.floor(count/2)));
    buttons.forEach(function(b,j){var n=start+j;b.classList.toggle('on',n===index);b.setAttribute('aria-label','Photo '+(n+1)+' of '+photos.length);b.setAttribute('aria-current',n===index?'true':'false');b.dataset.index=n});
  }
  function stop(){if(pressTimer)clearTimeout(pressTimer);if(fastTimer)clearInterval(fastTimer);pressTimer=fastTimer=null}
  for(var j=0;j<count;j++){
    var b=document.createElement('button');b.type='button';
    b.addEventListener('click',function(e){if(ignoreClick){e.preventDefault();return}goto(Number(this.dataset.index),true)});
    dots.appendChild(b);buttons.push(b);
  }
  dots.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    stop();ignoreClick=false;pressX=e.clientX;
    try{dots.setPointerCapture(e.pointerId)}catch(_e){}
    pressTimer=setTimeout(function(){
      ignoreClick=true;fastTimer=setInterval(function(){goto((index+1)%photos.length,false)},220);
    },350);
  });
  dots.addEventListener('pointermove',function(e){
    if(!dots.hasPointerCapture(e.pointerId)||Math.abs(e.clientX-pressX)<6)return;
    ignoreClick=true;stop();
    var r=dots.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    goto(Math.round(fraction*(photos.length-1)),false);
  });
  dots.addEventListener('pointerup',function(e){stop();if(ignoreClick)setTimeout(function(){ignoreClick=false},80);try{dots.releasePointerCapture(e.pointerId)}catch(_e){}});
  dots.addEventListener('pointercancel',stop);
  dots.addEventListener('lostpointercapture',stop);
  strip.addEventListener('scroll',function(){requestAnimationFrame(readIndex)},{passive:true});
  window.addEventListener('resize',readIndex);
  render();
})();
