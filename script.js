const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const ball = document.getElementById("ball");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spinBtn");
const redBtn = document.getElementById("redBtn");
const blackBtn = document.getElementById("blackBtn");
const balanceEl = document.getElementById("balance");
const numberBet = document.getElementById("numberBet");
const betInput = document.getElementById("bet");

let balance = 1000;
let selectedColor = null;

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

// Zeichne das Rad
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

// Farbwahl
redBtn.addEventListener("click", () => {
  selectedColor = "red";
  redBtn.style.opacity = "0.8";
  blackBtn.style.opacity = "1";
});

blackBtn.addEventListener("click", () => {
  selectedColor = "black";
  blackBtn.style.opacity = "0.8";
  redBtn.style.opacity = "1";
});

// Drehen
spinBtn.addEventListener("click", () => {
  const bet = parseInt(betInput.value);
  if (isNaN(bet) || bet <= 0) {
    alert("Bitte einen gültigen Einsatz eingeben!");
    return;
  }
  if (!selectedColor && !numberBet.value) {
    alert("Bitte wähle Rot, Schwarz oder eine Zahl!");
    return;
  }
  if (bet > balance) {
    alert("Nicht genug Chips!");
    return;
  }

  balance -= bet;
  balanceEl.textContent = balance;

  const spinDegrees = 1440 + Math.floor(Math.random() * 360);
  const spinTime = 4000;

  wheel.style.transition = `transform ${spinTime}ms ease-out`;
  wheel.style.transform = `rotate(${spinDegrees}deg)`;

  ball.style.transition = `transform ${spinTime}ms ease-out`;
  ball.style.transform = `rotate(${-spinDegrees * 1.05}deg)`;

  setTimeout(() => {
    const resultIndex = Math.floor(Math.random() * numbers.length);
    const resultNumber = numbers[resultIndex];
    const color = colors[resultIndex];

    let win = 0;
    if (selectedColor && color === selectedColor) win = bet * 2;
    if (numberBet.value && parseInt(numberBet.value) === resultNumber) win = bet * 35;

    balance += win;
    balanceEl.textContent = balance;

    result.innerHTML = `Gefallen ist: <strong style="color:${color}">${resultNumber} (${color})</strong><br>
      ${win > 0 ? `🎉 Gewinn: +${win}` : `💸 Verloren: -${bet}`}`;

    wheel.style.transition = "none";
    wheel.style.transform = `rotate(0deg)`;
    ball.style.transition = "none";
    ball.style.transform = `rotate(0deg)`;
  }, spinTime);
});
