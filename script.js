document.addEventListener("DOMContentLoaded", () => {
  const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const redNumbers = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];

  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const ball = document.getElementById("ball");
  const numberGrid = document.getElementById("number-grid");
  const spinBtn = document.getElementById("spin");
  const resultBox = document.getElementById("result");
  const balanceEl = document.getElementById("balance");
  const betInput = document.getElementById("bet");
  const redBtn = document.getElementById("bet-red");
  const blackBtn = document.getElementById("bet-black");

  let selectedColor = null;
  let selectedNumber = null;
  let balance = 1000;
  let spinning = false;

  const colors = {};
  numbers.forEach(n => {
    colors[n] = n === 0 ? "green" : redNumbers.includes(n) ? "red" : "black";
  });

  // Zahlen-Buttons
  for (let i = 0; i <= 36; i++) {
    const btn = document.createElement("button");
    btn.className = `number-btn ${colors[i]}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      selectedNumber = i;
      selectedColor = null;
      document.querySelectorAll(".number-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    numberGrid.appendChild(btn);
  }

  // Rad zeichnen
  const center = canvas.width / 2;
  const radius = center - 5;
  const arc = 2 * Math.PI / numbers.length;

  function drawWheel() {
    for (let i = 0; i < numbers.length; i++) {
      const start = i * arc;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = colors[numbers[i]];
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "right";
      ctx.fillText(numbers[i], radius - 15, 4);
      ctx.restore();
    }
  }

  drawWheel();

  redBtn.addEventListener("click", () => {
    selectedColor = "red";
    selectedNumber = null;
  });
  blackBtn.addEventListener("click", () => {
    selectedColor = "black";
    selectedNumber = null;
  });

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    const bet = parseInt(betInput.value);
    if (!bet || bet > balance) return alert("Ungültiger Einsatz!");
    if (!selectedColor && selectedNumber === null) return alert("Wähle Rot, Schwarz oder eine Zahl!");

    balance -= bet;
    balanceEl.textContent = balance;
    spinning = true;

    const spinTo = 360 * 6 + Math.floor(Math.random() * 360);
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / 4000, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const deg = spinTo * ease;
      canvas.style.transform = `rotate(${deg}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const resultDeg = (360 - (deg % 360)) % 360;
        const index = Math.floor((resultDeg / 360) * numbers.length);
        const resultNum = numbers[index];
        const resultColor = colors[resultNum];

        let win = 0;
        if (selectedColor && selectedColor === resultColor) win = bet * 2;
        if (selectedNumber === resultNum) win = bet * 35;
        balance += win;
        balanceEl.textContent = balance;

        resultBox.innerHTML = `Gefallen ist: <b style="color:${resultColor}">${resultNum}</b> (${resultColor})<br>
        ${win > 0 ? "🎉 Gewinn: +" + win : "💸 Verloren: -" + bet}`;
      }
    }

    requestAnimationFrame(animate);
  });
});
