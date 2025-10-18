window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const resultBox = document.getElementById('result');
  const spinBtn = document.getElementById('spin');

  const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const redSet = new Set([32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3]);
  const colors = {};
  numbersOrder.forEach(n => colors[n] = n===0 ? 'green' : (redSet.has(n) ? 'red' : 'black'));

  let spinning = false;
  let rotation = 0;

  // Resize & high-DPI support
  function resizeCanvas() {
    const parent = canvas.parentElement;
    // CSS size (px)
    const cssSize = Math.min(parent.clientWidth, 420);
    // handle very small screens a bit smaller
    const finalCssSize = Math.max(180, cssSize);
    canvas.style.width = finalCssSize + 'px';
    canvas.style.height = finalCssSize + 'px';

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(finalCssSize * ratio);
    canvas.height = Math.round(finalCssSize * ratio);

    // reset transforms for drawing in device pixels
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawWheel();
  }

  // Draw wheel with numbers
  function drawWheel(){
    // use CSS px size for layout inside canvas (ctx scaled already for DPR)
    const cssW = parseFloat(canvas.style.width);
    const size = cssW;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    const seg = numbersOrder.length;
    const arc = 2 * Math.PI / seg;

    // outer ring
    ctx.lineWidth = Math.max(3, size * 0.012);
    ctx.strokeStyle = '#c58a17';
    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < seg; i++) {
      const start = -Math.PI/2 + i * arc;
      const end = start + arc;
      const num = numbersOrder[i];

      // segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();

      // color
      const fill = (num === 0) ? '#0aa46a' : (colors[num] === 'red' ? '#b32020' : '#0b0b0b');
      ctx.fillStyle = fill;
      ctx.fill();

      // segment border
      ctx.strokeStyle = '#222';
      ctx.lineWidth = Math.max(1, size * 0.004);
      ctx.stroke();

      // draw number label on outer arc
      ctx.save();
      ctx.translate(center, center);
      const ang = start + arc / 2;
      ctx.rotate(ang);

      // compute font size relative to canvas
      const fontSize = Math.max(10, Math.round(size / 28)); // tweak for readability
      ctx.font = `bold ${fontSize}px Inter, Arial`;
      ctx.textAlign = 'center';

      // position: near outer rim but inside outer ring
      const textRadius = radius - Math.max(18, size * 0.06);
      // choose contrast color: green -> dark text; otherwise white
      const textColor = (num === 0) ? '#04291f' : '#ffffff';
      ctx.fillStyle = textColor;

      // draw slight shadow/stroke for readability on red/black
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      // draw stroke for contrast
      ctx.strokeText(num.toString(), textRadius, 6);
      ctx.fillText(num.toString(), textRadius, 6);

      ctx.restore();
    }

    // inner center circle
    ctx.beginPath();
    ctx.arc(center, center, radius * 0.14, 0, Math.PI*2);
    ctx.fillStyle = '#c58a17';
    ctx.fill();

    // small center triangle/indicator
    ctx.fillStyle = '#111';
    ctx.beginPath();
    const triSize = Math.max(10, size * 0.04);
    ctx.moveTo(center - triSize/2, center - triSize*0.15);
    ctx.lineTo(center + triSize/2, center - triSize*0.15);
    ctx.lineTo(center, center + triSize*0.45);
    ctx.closePath();
    ctx.fill();
  }

  // initial sizing
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Spin logic (click + touch swipe) ---
  const spinBtnEl = spinBtn;
  const resultEl = resultBox;

  // helper to compute landed number after rotation degrees
  function getResultFromRotation(rotDeg){
    // rotDeg is degrees clockwise applied to wheel via CSS transform.
    // we need to convert to segment index: segments arranged starting at -90deg (top)
    const seg = numbersOrder.length;
    const segDeg = 360 / seg;
    // effective angle from top, normalized
    let a = ((360 - (rotDeg % 360)) + 90) % 360; // turning clockwise moves segments
    const idx = Math.floor(a / segDeg) % seg;
    return numbersOrder[idx];
  }

  function animateSpin(spinToDeg, durationMs){
    if (spinning) return;
    spinning = true;
    const start = performance.now();
    const startRot = rotation;
    const delta = spinToDeg - startRot;

    function step(now){
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic-ish
      rotation = startRot + delta * ease;
      canvas.style.transform = `rotate(${rotation}deg)`;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        spinning = false;
        const landed = getResultFromRotation(rotation);
        resultEl.innerHTML = `Gefallen ist: <b>${landed}</b> (${colors[landed]})`;
      }
    }
    requestAnimationFrame(step);
  }

  // button spin: fixed speed
  spinBtnEl.addEventListener('click', () => {
    if (spinning) return;
    // add a random target rotation
    const rounds = 6 + Math.floor(Math.random() * 3);
    const extra = Math.random() * 360;
    const target = rotation + rounds * 360 + extra;
    animateSpin(target, 3800);
  });

  // touch swipe -> spin with velocity
  let touchStartY = null;
  let touchStartTime = 0;
  canvas.addEventListener('touchstart', (e) => {
    if (spinning) return;
    const t = e.touches[0];
    touchStartY = t.clientY;
    touchStartTime = performance.now();
  }, {passive: true});

  canvas.addEventListener('touchend', (e) => {
    if (spinning || touchStartY === null) return;
    const t = e.changedTouches[0];
    const dy = touchStartY - t.clientY; // swipe up -> positive dy
    const dt = performance.now() - touchStartTime;
    touchStartY = null;

    if (Math.abs(dy) < 10) return; // ignore small taps
    // velocity px per ms
    const vel = dy / Math.max(10, dt);
    // compute spin strength from vel
    const baseRounds = Math.min(Math.abs(vel) * 0.08, 18); // limit rounds
    const extraDeg = Math.random() * 360;
    const direction = vel > 0 ? 1 : -1;
    const target = rotation + direction * (360 * (baseRounds + 4) + extraDeg);
    // duration scale with rounds, min 1500 max 6000
    const duration = Math.min(Math.max(1500, 500 + baseRounds * 200), 6000);
    animateSpin(target, duration);
  }, {passive: true});

  // mouse drag (desktop) -> optional spin by drag
  let mouseDown = false;
  let mouseStartY = 0;
  let mouseStartTime = 0;
  canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseStartY = e.clientY;
    mouseStartTime = performance.now();
  });
  window.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const dy = mouseStartY - e.clientY;
    const dt = performance.now() - mouseStartTime;
    if (Math.abs(dy) < 10) return;
    const vel = dy / Math.max(10, dt);
    const baseRounds = Math.min(Math.abs(vel) * 0.08, 18);
    const extraDeg = Math.random() * 360;
    const direction = vel > 0 ? 1 : -1;
    const target = rotation + direction * (360 * (baseRounds + 4) + extraDeg);
    const duration = Math.min(Math.max(1500, 500 + baseRounds * 200), 6000);
    animateSpin(target, duration);
  });

});
