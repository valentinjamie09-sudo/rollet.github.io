const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const ball = document.getElementById("ball");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spinBtn");

const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8,
  23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12,
  35, 3, 26
];

const colors = [
  "green", "red", "black", "red", "black", "red", "black", "red", "black",
  "red", "black", "red", "black", "red", "black", "red", "black", "red",
  "black", "red", "black", "red", "black", "red", "black", "red", "black",
  "red", "black", "red", "black", "red", "black", "red", "black", "red", "black"
];

// Rad zeichnen
function drawWheel() {
  const radius = wheel.width / 2;
  const step = (2 * Math.PI) / numbers.length;

  for (let i = 0; i < numbers.length; i++) {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, i * step, (i + 1) * step);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Zahlen
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(i * step + step / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(numbers[i], radius - 10, 5);
    ctx.restore();
  }
}

drawWheel();

// Drehen-Logik
spinBtn.addEventListener("click", () => {
  const spinTime = 4000;
  const spins = Math.floor(Math.random() * 360 + 720);
  const angle = spins * (Math.PI / 180);

  wheel.style.transition = "transform 4s ease-out";
  wheel.style.transform = `rotate(${spins}deg)`;

  setTimeout(() => {
    const resultIndex = Math.floor(Math.random() * numbers.length);
    const resultNumber = numbers[resultIndex];
    const color = colors[resultIndex];

    result.innerHTML = `Gefallen ist: <strong style="color:${color}">${resultNumber} (${color})</strong>`;

    wheel.style.transition = "none";
    wheel.style.transform = `rotate(0deg)`;
  }, spinTime);
});
