const $=s=>document.querySelector(s);
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2500)}
function setName(n){$("#name").textContent=n;$("#avatar").textContent=n.slice(0,2).toUpperCase();$("#status").textContent="Compte local prêt. La liaison sécurisée avec les jeux sera ajoutée plus tard.";$("#login").textContent="Modifier";localStorage.setItem("gz_name",n)}
const old=localStorage.getItem("gz_name");if(old)setName(old);
$("#login").onclick=()=>{$("#player").value=old||localStorage.getItem("gz_name")||"";$("#modal").classList.remove("hidden")};
$("#close").onclick=()=>$("#modal").classList.add("hidden");
$("#ok").onclick=()=>{const n=$("#player").value.trim();if(!n)return toast("Entre un nom de joueur.");setName(n);$("#modal").classList.add("hidden");toast("Bienvenue sur GAME ZONE, "+n+" !")};
$("#play").onclick=()=>toast("Le téléchargement de Blox Fruit sera branché ici. La liaison APK sera ajoutée ensuite.");
document.querySelectorAll(".disabled").forEach(b=>b.onclick=()=>toast("Cette page n'est pas encore prête. Le développeur est au courant."));

/* GAME ZONE V2 COMPLETE LOGIC */
(()=>{const loading=document.getElementById('loadingScreen'),fill=document.getElementById('loaderFill'),percent=document.getElementById('loaderPercent');let p=0;
const t=setInterval(()=>{p+=p<70?3:p<92?1:2;if(p>=100){p=100;clearInterval(t);setTimeout(()=>loading?.classList.add('is-hidden'),220)}if(fill)fill.style.width=p+'%';if(percent)percent.textContent=p+'%'},45);
const play=document.getElementById('play'),modal=document.getElementById('downloadModal'),close=document.getElementById('closeDownload'),download=document.getElementById('downloadApk');
const APK_DOWNLOAD_URL='';
function fallback(){if(download&&APK_DOWNLOAD_URL){download.href=APK_DOWNLOAD_URL;download.removeAttribute('aria-disabled')}modal?.classList.remove('hidden')}
close?.addEventListener('click',()=>modal?.classList.add('hidden'));modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
play?.addEventListener('click',e=>{e.preventDefault();let hidden=false;document.addEventListener('visibilitychange',()=>{hidden=document.hidden},{once:true});window.location.href='gamezone://bloxfruit';setTimeout(()=>{if(!hidden&&!document.hidden)fallback()},1400)})
})();
