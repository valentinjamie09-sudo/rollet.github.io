window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const resultBox = document.getElementById("result");
  const spinBtn = document.getElementById("spin");

  const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const redSet = new Set([32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3]);
  const colors = {};
  numbersOrder.forEach(n => colors[n] = n === 0 ? "green" : (redSet.has(n) ? "red" : "black"));

  let rotation = 0;
  let spinning = false;

  function resizeCanvas() {
    const size = Math.min(canvas.parentElement.clientWidth, 400);
    const scale = window.devicePixelRatio || 1;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);
    drawWheel(size);
  }

  function drawWheel(size) {
    const center = size / 2;
    const radius = center - 6;
    const seg = numbersOrder.length;
    const arc = 2 * Math.PI / seg;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < seg; i++) {
      const start = -Math.PI / 2 + i * arc;
      const end = start + arc;
      const num = numbersOrder[i];
      const fill = num === 0 ? "#0aa46a" : (colors[num] === "red" ? "#b32020" : "#0b0b0b");

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = num === 0 ? "#003322" : "#fff";
      ctx.font = `bold ${Math.round(size / 26)}px Inter`;
      const textRadius = radius * 0.82;
      ctx.fillText(num.toString(), textRadius, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(center, center, radius * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#c58a17";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center - 10, 10);
    ctx.lineTo(center + 10, 10);
    ctx.lineTo(center, 25);
    ctx.closePath();
    ctx.fillStyle = "#c58a17";
    ctx.fill();
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function getResultFromRotation(rotDeg) {
    const seg = numbersOrder.length;
    const segDeg = 360 / seg;
    let a = ((360 - (rotDeg % 360)) + 90) % 360;
    const idx = Math.floor(a / segDeg) % seg;
    return numbersOrder[idx];
  }

  function animateSpin(spinToDeg, durationMs) {
    if (spinning) return;
    spinning = true;
    const start = performance.now();
    const startRot = rotation;
    const delta = spinToDeg - startRot;

    function step(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - t, 3);
      rotation = startRot + delta * ease;
      canvas.style.transform = `rotate(${rotation}deg)`;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        spinning = false;
        const landed = getResultFromRotation(rotation);
        resultBox.innerHTML = `Gefallen ist: <b>${landed}</b> (${colors[landed]})`;
      }
    }
    requestAnimationFrame(step);
  }

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    const rounds = 6 + Math.floor(Math.random() * 3);
    const extra = Math.random() * 360;
    const target = rotation + rounds * 360 + extra;
    animateSpin(target, 3800);
  });
});
