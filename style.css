const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const balanceEl = document.getElementById("balance");
const resultEl = document.getElementById("result");
const betInput = document.getElementById("bet");

let balance = 1000;
let selectedColor = null;
let selectedNumber = null;

// Nummern-Buttons generieren
const numberGrid = document.getElementById("numberGrid");
for (let i = 0; i <= 36; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.style.backgroundColor = i === 0 ? "green" : (isRed(i) ? "red" : "black");
  btn.style.color = "#fff";
  btn.onclick = () => {
    selectedNumber = i;
    highlightSelectedNumber(i);
  };
  numberGrid.appendChild(btn);
}

function highlightSelectedNumber(num) {
  const buttons = numberGrid.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.border = "none";
    if (parseInt(btn.textContent) === num) {
      btn.style.border = "2px solid yellow";
    }
  });
}

// Farbwahl
document.getElementById("red").onclick = () => selectedColor = "red";
document.getElementById("black").onclick = () => selectedColor = "black";

// Farbe von Zahlen (vereinfacht)
function isRed(num) {
  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  return redNumbers.includes(num);
}

// Dreh-Funktion
spinBtn.onclick = () => {
  const bet = parseInt(betInput.value);
  if (bet > balance || bet <= 0) {
    alert("Ungültiger Einsatz!");
    return;
  }

  // Zufallszahl (0–36)
  const result = Math.floor(Math.random() * 37);
  const angle = 360 * 5 + (result * (360 / 37)); // Rad dreht sich 5x

  // Rad drehen
  wheel.style.transform = `rotate(${angle}deg)`;

  // 4 Sekunden warten (Drehzeit)
  setTimeout(() => {
    balance -= bet;

    let won = false;
    let winnings = 0;

    if (selectedNumber !== null && result === selectedNumber) {
      winnings = bet * 36;
      won = true;
    } else if (selectedColor && (
      (selectedColor === "red" && isRed(result)) ||
      (selectedColor === "black" && !isRed(result) && result !== 0)
    )) {
      winnings = bet * 2;
      won = true;
    }

    if (won) {
      balance += winnings;
      resultEl.textContent = `Gewonnen! Die Zahl war ${result}. Gewinn: ${winnings} Chips`;
    } else {
      resultEl.textContent = `Verloren! Die Zahl war ${result}.`;
    }

    balanceEl.textContent = balance;
  }, 4000);
};
