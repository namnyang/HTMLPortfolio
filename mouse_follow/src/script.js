let lines = 5,
    wobble = 4,
    colorBase = 300,
    thickness = Math.min(window.innerWidth/3,window.innerHeight/3),
    mousePos = {x:window.innerWidth/2,y:window.innerHeight/2},
    mouseUp = true,
    maxLength = 20, //click + drag to extend the length of the polyline
    pts = [];

for (let i=0; i<lines; i++){  
    let p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    document.getElementById("container").appendChild(p);
    gsap.set(p, {attr:{ id:'s'+i, class:'s',      
      opacity: i/lines + 0.05,
      stroke:'hsl('+(colorBase+i/lines*65)+',100%, 50%)',
      'stroke-width':thickness - i/lines*thickness,
      'stroke-linecap':'round',
      'stroke-linejoin':'round',
      fill: 'none'
    }});
    pts.push( mousePos.x+','+mousePos.y+' ' )
}

window.onmousedown = ()=>{ mouseUp = false; }
window.onmouseup = ()=>{ mouseUp = true; }

window.onmousemove = (e)=>{
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  colorBase++;
  for (let i=0; i<lines; i++) gsap.to('#s'+i, {attr:{stroke:'hsl('+(colorBase+i/lines*65)+',100%, 50%)'}});
}

gsap.ticker.add( ()=>{
  (pts.length<maxLength) ? pts.push( randPt(mousePos.x, mousePos.y, wobble)+' ') :  pts.shift();
  if (mouseUp){
    for (let i=0; i<lines; i++) gsap.to('#s'+i, {duration:i/lines, attr:{points:pts}, ease:Back.easeOut.config(i/lines)} );
    pts.shift();  
  } else {
    for (let i=0; i<lines; i++) gsap.set('#s'+i, {attr:{points:pts}} );
  }
});

randPt = (p1,p2,amt) => gsap.utils.random(p1-amt,p1+amt) + ',' + gsap.utils.random(p2-amt,p2+amt);