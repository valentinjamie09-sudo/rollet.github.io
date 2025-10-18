window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const resultBox = document.getElementById('result');
  const spinBtn = document.getElementById('spin');

  const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const redSet = new Set([32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3]);
  const colors = {};
  numbersOrder.forEach(n => colors[n] = n===0?'green':(redSet.has(n)?'red':'black'));

  let spinning = false;
  let rotation = 0;
  let lastTime = 0;

  function resizeCanvas() {
    const size = Math.min(canvas.parentElement.clientWidth, 420);
    canvas.width = size * 2;
    canvas.height = size * 2;
    drawWheel();
  }

  function drawWheel(){
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    ctx.clearRect(0, 0, size, size);

    const seg = numbersOrder.length;
    const arc = 2 * Math.PI / seg;
    for (let i = 0; i < seg; i++) {
      const start = -Math.PI/2 + i * arc;
      const end = start + arc;
      const num = numbersOrder[i];
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[num] === 'green' ? '#0aa46a' : colors[num] === 'red' ? '#b32020' : '#0b0b0b';
      ctx.fill();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = `${size/40}px Inter`;
      ctx.fillText(num, radius - 40, 6);
      ctx.restore();
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Touch gesture spin ---
  let touchStartY = 0;
  let touchEndY = 0;
  canvas.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  });

  canvas.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 30) {
      const velocity = Math.min(Math.abs(diff) * 5, 3000);
      startSpin(velocity);
    }
  });

  spinBtn.addEventListener('click', () => startSpin(2000));

  function startSpin(speed){
    if (spinning) return;
    spinning = true;
    const spinTo = 360 * 6 + Math.random() * 360;
    const duration = speed;
    const start = performance.now();

    function animate(now){
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      rotation = spinTo * ease;
      canvas.style.transform = `rotate(${rotation}deg)`;
      if(progress < 1){
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const resultDeg = (360 - (rotation % 360)) % 360;
        const index = Math.floor((resultDeg / 360) * numbersOrder.length);
        const resultNum = numbersOrder[index];
        resultBox.innerHTML = `Gefallen ist: <b>${resultNum}</b> (${colors[resultNum]})`;
      }
    }
    requestAnimationFrame(animate);
  }
});
