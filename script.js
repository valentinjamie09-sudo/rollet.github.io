window.addEventListener("DOMContentLoaded", () => {
  const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const colors = {};
  const redSet = new Set([32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3]);
  numbersOrder.forEach(n => { colors[n] = n===0?'green':(redSet.has(n)?'red':'black'); });

  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size/2;
  const radius = center - 8;

  function drawWheel(){
    ctx.clearRect(0,0,size,size);
    const seg = numbersOrder.length;
    const arc = 2*Math.PI/seg;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#222';
    for(let i=0;i<seg;i++){
      const start = -Math.PI/2 + i*arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(center,center);
      ctx.arc(center,center,radius,start,end);
      ctx.closePath();
      const n = numbersOrder[i];
      ctx.fillStyle = colors[n]==='green'?'#0aa46a':(colors[n]==='red'?'#b32020':'#0b0b0b');
      ctx.fill();
      ctx.stroke();

      // Zahlen
      ctx.save();
      ctx.translate(center,center);
      const angle = start + arc/2;
      ctx.rotate(angle);
      ctx.textAlign = 'center';
      ctx.fillStyle = colors[n]==='green'?'#04291f':'#fff';
      ctx.font = 'bold 14px Inter, Arial';
      ctx.fillText(n.toString(), radius - 24, 6);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(center,center,radius+6,0,Math.PI*2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#c58a17';
    ctx.stroke();
  }

  drawWheel();

  // Spin Animation
  const spinBtn = document.getElementById('spin');
  const resultBox = document.getElementById('result');
  const ball = document.getElementById('ball');
  const balanceEl = document.getElementById('balance');
  let balance = 1000;
  let spinning = false;

  spinBtn.addEventListener('click', () => {
    if(spinning) return;
    const bet = parseInt(document.getElementById('bet').value) || 0;
    if(bet <= 0 || bet > balance){ alert('Ungültiger Einsatz!'); return; }
    spinning = true;

    let deg = 0;
    const spinTo = 360 * 8 + Math.floor(Math.random() * 360);
    const duration = 4000;
    const start = performance.now();

    function animate(now){
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      deg = spinTo * ease;
      canvas.style.transform = `rotate(${deg}deg)`;
      if(progress < 1){
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const resultDeg = (360 - (deg % 360)) % 360;
        const index = Math.floor((resultDeg / 360) * numbersOrder.length);
        const resultNum = numbersOrder[index];
        const color = colors[resultNum];
        resultBox.innerHTML = `Gefallen ist: <b>${resultNum}</b> (${color})`;
      }
    }
    requestAnimationFrame(animate);
  });
});
