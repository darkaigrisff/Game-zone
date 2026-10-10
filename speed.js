const player = document.getElementById('playerCar');
const enemy = document.getElementById('enemyCar');
const scoreEl = document.getElementById('score');
const speedText = document.getElementById('speedText');
const result = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const gameArea = document.getElementById('gameArea');
let lane = 1;
let enemyLane = 0;
let enemyY = -120;
let score = 0;
let speed = 1;
let boost = 0;
let running = true;
let last = performance.now();

function setLane(next){
    lane = Math.max(0, Math.min(2, next));
    player.style.left = (20 + lane * 30) + '%';
}
function resetEnemy(){
    enemyLane = Math.floor(Math.random()*3);
    enemyY = -120;
    enemy.style.left = (20 + enemyLane * 30) + '%';
}
function finish(win){
    if(!running)return;
    running=false;
    result.classList.remove('hidden');
    resultTitle.textContent=win?'VICTOIRE':'COURSE TERMINÉE';
    resultMessage.textContent=win?'Tu as dépassé ton rival.':'Ton véhicule a été touché.';
}
function hit(){
    const p=player.getBoundingClientRect(), e=enemy.getBoundingClientRect();
    return p.left<e.right-8&&p.right>e.left+8&&p.top<e.bottom-8&&p.bottom>e.top+8;
}
function frame(now){
    const dt=Math.min(40,now-last); last=now;
    if(running){
        const multiplier=boost>0?1.8:1;
        enemyY += (3+speed)*multiplier*(dt/16);
        enemy.style.top=enemyY+'px';
        if(hit()) finish(false);
        if(enemyY>gameArea.clientHeight+100){
            score++;
            scoreEl.textContent=score;
            speed=Math.min(9,1+Math.floor(score/3));
            speedText.textContent=speed;
            resetEnemy();
            if(score>=15) finish(true);
        }
        if(boost>0) boost-=dt;
    }
    requestAnimationFrame(frame);
}
function restart(){
    lane=1; score=0; speed=1; boost=0; running=true;
    scoreEl.textContent='0'; speedText.textContent='1'; result.classList.add('hidden');
    setLane(1); resetEnemy(); last=performance.now();
}
document.getElementById('leftButton').addEventListener('click',()=>setLane(lane-1));
document.getElementById('rightButton').addEventListener('click',()=>setLane(lane+1));
document.getElementById('boostButton').addEventListener('pointerdown',()=>{boost=1200});
document.getElementById('restartButton').addEventListener('click',restart);
document.getElementById('lobbyButton').addEventListener('click',()=>location.href='home.html');
document.getElementById('backButton').addEventListener('click',()=>location.href='home.html');
setLane(1); resetEnemy(); requestAnimationFrame(frame);
