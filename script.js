const numbersOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const colors = {};
const redSet = new Set([32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3]);
numbersOrder.forEach(n => { colors[n] = n===0?'green':(redSet.has(n)?'red':'black'); });

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const center = size/2;
const radius = center - 8;

function drawWheel(){
  ctx.clearRect(0,0,size,size);
  const seg = numbersOrder.length;
  const arc = 2*Math.PI/seg;
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#222';
  for(let i=0;i<seg;i++){
    const start = -Math.PI/2 + i*arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(center,center);
    ctx.arc(center,center,radius,start,end);
    ctx.closePath();
    const n = numbersOrder[i];
    ctx.fillStyle = colors[n]==='green'?'#0aa46a':(colors[n]==='red'?'#b32020':'#0b0b0b');
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(center,center);
    const angle = start + arc/2;
    ctx.rotate(angle);
    ctx.textAlign = 'center';
    ctx.fillStyle = colors[n]==='green'?'#04291f':'#fff';
    ctx.font = 'bold 14px Inter, Arial';
    ctx.fillText(n.toString(), radius - 24, 6);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(center,center,radius+6,0,Math.PI*2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#c58a17';
  ctx.stroke();
}

drawWheel();

const grid = document.getElementById('numbersGrid');
for(let i=0;i<=36;i++){
  const btn = document.createElement('div');
  btn.className='num '+(colors[i]||'black');
  btn.textContent = i;
  btn.dataset.num = i;
  btn.addEventListener('click', ()=> selectNumber(btn));
  grid.appendChild(btn);
}

let selectedNumber = null;
let selectedColor = null;
function selectNumber(el){
  selectedColor=null;
  document.querySelectorAll('.num').forEach(n=>n.style.outline='');
  el.style.outline='3px solid rgba(255,255,255,0.12)';
  selectedNumber = parseInt(el.dataset.num,10);
  document.getElementById('message').textContent = 'Gewählt: Zahl '+selectedNumber;
}

document.getElementById('betRed').addEventListener('click', ()=>{selectedColor='red';selectedNumber=null;document.querySelectorAll('.num').forEach(n=>n.style.outline='');document.getElementById('message').textContent='Gewählt: Rot';});
document.getElementById('betBlack').addEventListener('click', ()=>{selectedColor='black';selectedNumber=null;document.querySelectorAll('.num').forEach(n=>n.style.outline='');document.getElementById('message').textContent='Gewählt: Schwarz';});

let balance = 1000;
const balanceEl = document.getElementById('balance');
function refreshBalance(){balanceEl.textContent = balance;}
refreshBalance();

const spinBtn = document.getElementById('spinBtn');
const betAmountInput = document.getElementById('betAmount');
const resultBox = document.getElementById('resultBox');
let spinning = false;

function getWinningIndexFromAngle(angle){
  const seg = numbersOrder.length;
  const segDeg = 360/seg;
  let a = ((-angle + 90) % 360 + 360) % 360;
  return Math.floor(a/segDeg) % seg;
}

function spin(){
  if(spinning) return;
  const bet = Math.floor(Number(betAmountInput.value)||0);
  if(bet<=0){ resultBox.textContent='Setze einen gültigen Betrag.'; return; }
  if(bet>balance){ resultBox.textContent='Nicht genug Chips.'; return; }
  if(!selectedColor && selectedNumber===null){ resultBox.textContent='Wähle Rot/Schwarz oder eine Zahl.'; return; }
  spinning=true; resultBox.textContent='Dreht...'; balance-=bet; refreshBalance();
  const minTurns=4,maxTurns=7,seg=numbersOrder.length,segDeg=360/seg;
  const targetIndex=Math.floor(Math.random()*seg);
  const targetAngle=-(targetIndex*segDeg+segDeg/2)+(Math.random()*(segDeg-2)-(segDeg-2)/2);
  const turns=(Math.random()*(maxTurns-minTurns)+minTurns);
  const finalAngle=turns*360+targetAngle;
  canvas.style.transition='transform 4s cubic-bezier(.12,.9,.24,1)';
  canvas.style.transform='rotate('+finalAngle+'deg)';
  const ball=document.getElementById('ball');
  ball.style.transition='right 4s cubic-bezier(.12,.9,.24,1)';
  ball.style.right='18px';
  setTimeout(()=>{ball.style.right='46px';},4000);
  setTimeout(()=>{
    canvas.style.transition='';
    const landedIndex=getWinningIndexFromAngle(finalAngle);
    const landedNumber=numbersOrder[landedIndex];
    const landedColor=colors[landedNumber];
    let payout=0,message='';
    if(selectedNumber!==null){
      if(selectedNumber===landedNumber){payout=bet*35;message='Gewonnen! Zahl '+landedNumber+' ('+landedColor+') — Auszahlung: '+payout+' Chips';}
      else{message='Verloren. Gewonnen wurde Zahl '+landedNumber+' ('+landedColor+').';}
    }else if(selectedColor){
      if(selectedColor===landedColor){payout=bet*2;message='Gewonnen! Farbe '+landedColor+' — Auszahlung: '+payout+' Chips';}
      else{message='Verloren. Gewonnen wurde Zahl '+landedNumber+' ('+landedColor+').';}
    }
    balance+=payout;refreshBalance();resultBox.textContent=message;selectedNumber=null;selectedColor=null;document.querySelectorAll('.num').forEach(n=>n.style.outline='');document.getElementById('message').textContent='';const normalized=finalAngle%360;canvas.style.transform='rotate('+normalized+'deg)';spinning=false;},4200);
}

spinBtn.addEventListener('click',spin);
betAmountInput.addEventListener('keydown',(e)=>{if(e.key==='Enter')spin();});
