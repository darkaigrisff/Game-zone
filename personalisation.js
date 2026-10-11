"use strict";
(function(){
  const KEY="spaceBattleButtonScale";
  const GAME_KEY="spaceBattleGameControlScale";
  const root=document.documentElement;
  const excluded=".switch, .joystick, .gameControl, [data-game-control], .control, .dpad, .actionButtons, #fireButton, #jumpButton, #moveJoystick";
  function validScale(value){const n=Number(value);return Number.isFinite(n)?Math.min(1.3,Math.max(.75,n)):1;}
  function applyScale(value){const scale=validScale(value);root.style.setProperty("--space-button-scale",String(scale));document.querySelectorAll("button, .btn, .mainButton, .backButton, .chapterCard, .back").forEach(el=>{if(!el.matches(excluded)&&!el.classList.contains("previewButton")){el.style.setProperty("--local-button-scale",String(scale)); el.style.fontSize=(16*scale)+"px"; if(el.classList.contains("btn")||el.classList.contains("mainButton")){el.style.minHeight=(46*scale)+"px";el.style.padding=(12*scale)+"px "+(16*scale)+"px";}}});return scale;}
  const saved=localStorage.getItem(KEY); applyScale(saved===null?1:saved);
  function applyGameScale(value){const n=validScale(value);root.style.setProperty("--game-control-scale",String(n));document.querySelectorAll("#controls .control").forEach(el=>{el.style.setProperty("--game-control-scale",String(n));});return n;}
  const savedGame=localStorage.getItem(GAME_KEY);applyGameScale(savedGame===null?1:savedGame);
  const range=document.getElementById("buttonScale"), label=document.getElementById("scaleLabel"), status=document.getElementById("personalStatus");
  if(range){
    const initial=Math.round(validScale(savedGame===null?1:savedGame)*100);range.value=String(initial);label.textContent=initial+" %";
    range.addEventListener("input",()=>{const n=Number(range.value);label.textContent=n+" %";root.style.setProperty("--game-control-scale",String(n/100));document.querySelectorAll(".previewButton").forEach(el=>el.style.setProperty("--game-control-scale",String(n/100)));});
    document.getElementById("saveScale").addEventListener("click",()=>{localStorage.setItem(GAME_KEY,String(Number(range.value)/100));applyGameScale(Number(range.value)/100);document.querySelectorAll(".previewButton").forEach(el=>el.style.setProperty("--game-control-scale",String(Number(range.value)/100)));status.textContent="Taille des touches de jeu enregistrée.";});
    document.getElementById("resetScale").addEventListener("click",()=>{range.value="100";label.textContent="100 %";localStorage.setItem(GAME_KEY,"1");applyGameScale(1);document.querySelectorAll(".previewButton").forEach(el=>el.style.setProperty("--game-control-scale","1"));status.textContent="Taille des touches réinitialisée à 100 %.";});
  }
})();