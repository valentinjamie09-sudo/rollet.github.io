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
        if (outcome
