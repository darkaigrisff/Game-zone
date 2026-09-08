const $=s=>document.querySelector(s);
function toast(t){const x=$("#toast");if(!x)return;x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2800)}
const GAME_ZONE_URL="https://gamezone.com";
const SESSION_START_URL=GAME_ZONE_URL+"/api/session/start";
const APK_DOWNLOAD_URL="";
const GAME_SCHEME="gamezone://bloxfruit";
function setName(n){$("#name").textContent=n;$("#avatar").textContent=n.slice(0,2).toUpperCase();$("#status").textContent="Compte GAME ZONE prêt. La liaison sécurisée utilise un jeton temporaire lorsqu'un serveur est connecté.";$("#login").textContent="Modifier";localStorage.setItem("gz_name",n)}
const old=localStorage.getItem("gz_name");if(old)setName(old);
$("#login").onclick=()=>{$("#player").value=localStorage.getItem("gz_name")||"";$("#modal").classList.remove("hidden")};
$("#close").onclick=()=>$("#modal").classList.add("hidden");
$("#ok").onclick=()=>{const n=$("#player").value.trim();if(!n)return toast("Entre un nom de joueur.");setName(n);$("#modal").classList.add("hidden");toast("Bienvenue sur GAME ZONE, "+n+" !")};

async function getTemporaryToken(){
  const player=localStorage.getItem("gz_name")||"";
  try{
    const r=await fetch(SESSION_START_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game:"bloxfruit",player})});
    if(!r.ok)throw new Error("session "+r.status);
    const data=await r.json();
    if(data.token && data.expiresAt){
      sessionStorage.setItem("gz_session_token",data.token);
      sessionStorage.setItem("gz_session_expires",data.expiresAt);
      return data.token;
    }
  }catch(e){
    console.info("Serveur de session non connecté : lancement sans jeton, mode pré-expiration.");
  }
  return "";
}

$("#play").onclick=async e=>{
  e.preventDefault();
  toast("🎮 Ouverture de Blox Fruit…");
  const token=await getTemporaryToken();
  const url=token ? GAME_SCHEME+"?token="+encodeURIComponent(token) : GAME_SCHEME;
  let hidden=false;
  const onVis=()=>{hidden=document.hidden};
  document.addEventListener("visibilitychange",onVis,{once:true});
  window.location.href=url;
  setTimeout(()=>{if(!hidden&&!document.hidden)fallback()},1500);
};

function fallback(){
  const download=$("#downloadApk");
  if(download&&APK_DOWNLOAD_URL){download.href=APK_DOWNLOAD_URL;download.removeAttribute("aria-disabled")}
  $("#downloadModal")?.classList.remove("hidden");
}
$("#closeDownload")?.addEventListener("click",()=>$("#downloadModal")?.classList.add("hidden"));
$("#downloadModal")?.addEventListener("click",e=>{if(e.target===$("#downloadModal"))$("#downloadModal").classList.add("hidden")});

document.querySelectorAll(".disabled").forEach(b=>b.onclick=()=>toast("Cette fonctionnalité sera activée dans une prochaine mise à jour."));

(()=>{const loading=$("#loadingScreen"),fill=$("#loaderFill"),percent=$("#loaderPercent");let p=0;const t=setInterval(()=>{p+=p<70?3:p<92?1:2;if(p>=100){p=100;clearInterval(t);setTimeout(()=>loading?.classList.add("is-hidden"),220)}if(fill)fill.style.width=p+"%";if(percent)percent.textContent=p+"%"},45)})();
