// --- Roulette data and helpers ----------
const COLORS = {
  0: 'green',
  1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red',
  10: 'black', 11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red',
  19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red',
  28: 'black', 29: 'black', 30: 'red', 31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
};

const PAYOUTS = {
  straight: 35,
  red: 1,
  black: 1,
  even: 1,
  odd: 1,
  low: 1,
  high: 1,
  column: 2,
  dozen: 2
};

// game state
let state = {
  balance: 1000,
  bets: [],
  history: []
};

// DOM Elements
const balanceEl = document.getElementById('balance');
const betTypeEl = document.getElementById('bet-type');
const betValueEl = document.getElementById('bet-value');
const betAmountEl = document.getElementById('bet-amount');
const addBetBtn = document.getElementById('add-bet');
const spinBtn = document.getElementById('spin');
const betListEl = document.getElementById('bet-list');
const betsEmptyEl = document.getElementById('bets-empty');
const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');
const wheelLabel = document.getElementById('wheel-label');
const ballEl = document.getElementById('ball');

function updateBalance() {
  balanceEl.textContent = state.balance.toFixed(2);
}

function log(msg) {
  const d = new Date().toLocaleTimeString();
  logEl.insertAdjacentHTML('afterbegin', `<div>[${d}] ${msg}</div>`);
}

function renderBets() {
  if (state.bets.length === 0) {
    betsEmptyEl.style.display = 'block';
    return;
  }
  betsEmptyEl.style.display = 'none';
  const content = document.createElement('div');
  content.innerHTML = state.bets.map((b, i) =>
    `<div>#${i + 1}: ${b.type}${b.value !== null ? ' ' + b.value : ''} — ${b.amount}€</div>`
  ).join('');
  betListEl.querySelectorAll('div').forEach(n => n.remove());
  const title = document.createElement('strong');
  title.textContent = 'Aktuelle Wetten:';
  betListEl.appendChild(title);
  betListEl.appendChild(content);
}

function secureRandomInt(n) {
  const maxUint32 = 0xffffffff;
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0];
  return Math.floor((rnd / (maxUint32 + 1)) * n);
}

function evaluateBets(outcome) {
  const wins = [], losses = [];
  for (const b of state.bets) {
    let win = false;
    let payout = 0;
    const desc = `${b.type}${b.value !== null ? ' ' + b.value : ''} (${b.amount}€)`;

    switch (b.type) {
      case 'straight':
        if (outcome === b.value) {
          win = true;
          payout = b.amount * (PAYOUTS.straight + 1);
        }
        break;
      case 'red':
        if (COLORS[outcome] === 'red') {
          win = true;
          payout = b.amount * (PAYOUTS.red + 1);
        }
        break;
      case 'black':
        if (COLORS[outcome] === 'black') {
          win = true;
          payout = b.amount * (PAYOUTS.black + 1);
        }
        break;
      case 'even':
        if (outcome !== 0 && outcome % 2 === 0) {
          win = true;
          payout = b.amount * (PAYOUTS.even + 1);
        }
        break;
      case 'odd':
        if (outcome % 2 === 1) {
          win = true;
          payout = b.amount * (PAYOUTS.odd + 1);
        }
        break;
      case 'low':
        if (outcome >= 1 && outcome <= 18) {
          win = true;
          payout = b.amount * (PAYOUTS.low + 1);
        }
        break;
      case 'high':
        if (outcome >= 19 && outcome <= 36) {
          win = true;
          payout = b.amount * (PAYOUTS.high + 1);
        }
        break;
      case 'column':
        if (outcome !== 0) {
          const col = ((outcome - 1) % 3) + 1;
          if (col === b.value) {
            win = true;
            payout = b.amount * (PAYOUTS.column + 1);
          }
        }
        break;
      case 'dozen':
        if (outcome >= 1 && outcome <= 36) {
          const dz = Math.floor((outcome - 1) / 12) + 1;
          if (dz === b.value) {
            win = true;
            payout = b.amount * (PAYOUTS.dozen + 1);
          }
        }
        break;
      default:
        console.warn('Unknown bet type', b.type);
    }

    if (win) wins.push({ description: desc, payout });
    else losses.push({ description: desc, amount: b.amount });
  }
  return { wins, losses };
}

addBetBtn.addEventListener('click', () => {
  const type = betTypeEl.value;
  let valueRaw = betValueEl.value.trim();
  const amount = Number(betAmountEl.value);
  if (!amount || amount <= 0) {
    alert('Ungültiger Einsatz');
    return;
  }
  if (amount > state.balance) {
    alert('Nicht genug Balance');
    return;
  }

  let value;
  if (type === 'straight') {
    value = Number(valueRaw);
    if (!Number.isInteger(value) || value < 0 || value > 36) {
      alert('Bitte Zahl 0–36 angeben');
      return;
    }
  } else if (type === 'column' || type === 'dozen') {
    value = Number(valueRaw);
    if (![1, 2, 3].includes(value)) {
      alert(`${type} muss 1, 2 oder 3 sein`);
      return;
    }
  } else {
    value = null;
  }

  state.bets.push({ type, value, amount });
  state.balance -= amount;
  updateBalance();
  renderBets();
  log(`Wette gesetzt: ${type}${value !== null ? ' ' + value : ''} — ${amount}€`);
});

spinBtn.addEventListener('click', async () => {
  if (state.bets.length === 0) {
    alert('Keine Wetten gesetzt');
    return;
  }

  statusEl.textContent = 'Dreht...';
  spinBtn.disabled = true;
  addBetBtn.disabled = true;
  ballEl.style.display = 'block';
  wheelLabel.textContent = 'Drehen...';

  await new Promise(r => setTimeout(r, 800));

  const outcome = secureRandomInt(37);
  const color = COLORS[outcome];
  wheelLabel.textContent = `Ergebnis: ${outcome} (${color})`;
  ballEl.style.display = 'none';

  const results = evaluateBets(outcome);
  results.wins.forEach(w => {
    state.balance += w.payout;
    log(`Gewinn: ${w.description} -> +${w.payout}€`);
  });
  results.losses.forEach(l => {
    log(`Verloren: ${l.description} -> -${l.amount}€`);
  });

  state.history.unshift({ outcome, color, bets: state.bets.slice(), results });
  state.bets = [];
  renderBets();
  updateBalance();

  statusEl.textContent = 'Bereit';
  spinBtn.disabled = false;
  addBetBtn.disabled = false;
});

// Initial
updateBalance();
renderBets();
log('Roulette bereit. Viel Erfolg!');

// Simple test function
function _runRouletteTests() {
  const savedBets = state.bets, savedBal = state.balance;

  state.bets = [{ type: 'straight', value: 7, amount: 10 }];
  let r = evaluateBets(7);
  console.assert(r.wins.length === 1 && r.wins[0].payout === 10 * 36, "Straight test failed");

  state.bets = [{ type: 'even', amount: 10 }];
  r = evaluateBets(2);
  console.assert(r.wins.length === 1, "Even win failed");

  state.bets = [{ type: 'odd', amount: 10 }];
  r = evaluateBets(2);
  console.assert(r.losses.length === 1, "Odd loss failed");

  state.bets = savedBets;
  state.balance = savedBal;
}
