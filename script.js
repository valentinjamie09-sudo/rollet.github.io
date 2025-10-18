window.addEventListener("DOMContentLoaded", () => {
  const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const redNumbers = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];
  const colors = {};
  numbersOrder.forEach(n => colors[n] = n === 0 ? 'green' : (redNumbers.includes(n) ? 'red' : 'black'));

  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const ball = document.getElementById('ball');
  const spinBtn = document.getElementById('spin');
  const betInput = document.getElementById('bet');
  const redBtn = document.getElementById('bet-red');
  const blackBtn = document.getElementById('bet-black');
  const resultBox = document.getElementById('result');
  const balanceEl = document.getElementById('balance');
  const numberGrid = document.getElementById('number-grid');

  let selectedColor = null;
  let selectedNumber = null;
  let balance = 1000;
  let spinning = false;

  // 🎯 Zahlen-Buttons generieren
  for (let i = 0; i <= 36; i++) {
    const btn = document.createElement('button');
    btn.className = `number-btn ${colors[i]}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedNumber = i;
      selectedColor = null;
      redBtn.style.opacity = 1;
      blackBtn.style.opacity = 1;
    });
    numberGrid.appendChild(btn);
  }

  const size = canvas.width;
  const center = size / 2;
  const radius = center - 8;
  const arc = 2 * Math.PI / numbersOrder.length;

  function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < numbersOrder.length; i++) {
      const start = -Math.PI / 2 + i * arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      const n = numbersOrder[i];
      ctx.fillStyle = colors[n] === 'green' ? '#0aa46a' : colors[n] === 'red' ? '#b32020' : '#000';
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(n.toString(), radius - 20, 4);
      ctx.restore();
    }
  }

  drawWheel();

  redBtn.addEventListener('click', () => {
    selectedColor = 'red';
    selectedNumber = null;
    redBtn.style.opacity = 0.7;
    blackBtn.style.opacity = 1;
    document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('selected'));
  });

  blackBtn.addEventListener('click', () => {
    selectedColor = 'black';
    selectedNumber = null;
    blackBtn.style.opacity = 0.7;
    redBtn.style.opacity = 1;
    document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('selected'));
  });

  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    const bet = parseInt(betInput.value);
    if (!bet || bet <= 0 || bet > balance) return alert('Ungültiger Einsatz!');
    if (!selectedColor && selectedNumber === null) return alert('Wähle Rot, Schwarz oder eine Zahl!');

    balance -= bet;
    balanceEl.textContent = balance;
    spinning = true;
    resultBox.textContent = "Dreht...";

    const spinTo = 360 * 6 + Math.floor(Math.random() * 360);
    const duration = 4500;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const deg = spinTo * ease;
      canvas.style.transform = `rotate(${deg}deg)`;

      const ballDeg = deg * 1.2;
      const rad = (ballDeg % 360) * (Math.PI / 180);
      const ballX = center + Math.cos(rad - Math.PI / 2) * (radius - 30);
      const ballY = center + Math.sin(rad - Math.PI / 2) * (radius - 30);
      ball.style.left = `${ballX - 8}px`;
      ball.style.top = `${ballY - 8}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const resultDeg = (360 - (deg % 360)) % 360;
        const index = Math.floor((resultDeg / 360) * numbersOrder.length);
        const resultNum = numbersOrder[index];
        const color = colors[resultNum];
        let win = 0;

        if (selectedColor && color === selectedColor) win = bet * 2;
        if (selectedNumber === resultNum) win = bet * 35;

        balance += win;
        balanceEl.textContent = balance;

        resultBox.innerHTML = `
          Gefallen ist: <b style="color:${color}">${resultNum}</b> (${color})<br>
          ${win > 0 ? `🎉 Gewinn: +${win}` : `💸 Verloren: -${bet}`}
        `;
      }
    }

    requestAnimationFrame(animate);
  });
});
