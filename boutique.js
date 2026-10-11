"use strict";
// Codes d'achat existants : montants conservés.
const PURCHASE_CODES = new Map([
  ["SP-ACHAT-468K",100],["SP-ACHAT-666J",200],["SP-ACHAT-767H",300],["SP-ACHAT-967G",400],
  ["SP-ACHAT-777B",500],["SP-ACHAT-367N",600],["SP-ACHAT-437A",700],["SP-ACHAT-767I",800],
  ["SP-ACHAT-987R",900],["SP-ACHAT-497V",1000],["SP-ACHAT-960C",2000],["SP-ACHAT-860T",6000],
  ["SP-ACHAT-760N",4500],["SP-ACHAT-267M",7100],["SP-ACHAT-167L",4799],["SP-ACHAT-67K",7100],
  ["SP-ACHAT-69S",90000],
  // Code provisoire de démonstration pour relier la liste SP-VEF à l'offre 110 T-Bucks.
  // Remplace-le par le code d'achat officiel si tu en as déjà un.
  ["SP-ACHAT-110A",110]
]);
const VERIFICATION_CODES_110 = new Set([
  "SP-VEF-345",
  "SP-VEF-236",
  "SP-VEF-239",
  "SP-VEF-331",
  "SP-VEF-290",
  "SP-VEF-134",
  "SP-VEF-234",
  "SP-VEF-34",
  "SP-VEF-24",
  "SP-VEF-35",
  "SP-VEF-16",
  "SP-VEF-658",
  "SP-VEF-734",
  "SP-VEF-834",
  "SP-VEF-934",
  "SP-VEF-434",
  "SP-VEF-638",
  "SP-VEF-339",
  "SP-VEF-190",
  "SP-VEF-20",
  "SP-VEF-90",
  "SP-VEF-67",
  "SP-VEF-61",
  "SP-VEF-21",
  "SP-VEF-41",
  "SP-VEF-31",
  "SP-VEF-71",
  "SP-VEF-810",
  "SP-VEF-230",
  "SP-VEF-540",
  "SP-VEF-123",
  "SP-VEF-590",
  "SP-VEF-1456",
  "SP-VEF-1468",
  "SP-VEF-2345",
  "SP-VEF-2347",
  "SP-VEF-2349",
  "SP-VEF-2359",
  "SP-VEF-2367",
  "SP-VEF-2574",
  "SP-VEF-2124",
  "SP-VEF-3434",
  "SP-VEF-2671",
  "SP-VEF-2901",
  "SP-VEF-2708",
  "SP-VEF-2716",
  "SP-VEF-2499",
  "SP-VEF-2104",
  "SP-VEF-2989",
  "SP-VEF-3719",
  "SP-VEF-3226",
  "SP-VEF-3275",
  "SP-VEF-3567",
  "SP-VEF-4579",
  "SP-VEF-6789",
  "SP-VEF-7829",
  "SP-VEF-9990",
  "SP-VEF-9901",
  "SP-VEF-9919"
]);
// Pour les codes qui doivent redevenir utilisables après 24 h, ajoute-les ici.
// Aucun code n'a été désigné comme réinitialisable pour l'instant.
const DAILY_RESET_VERIFICATION_CODES = new Set([]);
const VERIFICATION_RESET_MS = 24 * 60 * 60 * 1000;
const AGENT_WHATSAPP = "24102471171";
const input=document.getElementById("purchaseCode");
const status=document.getElementById("purchaseStatus");
const balance=document.getElementById("balanceValue");
const amountSelect=document.getElementById("tBuckAmount");
const shopStatus=document.getElementById("shopStatus");
const verificationPanel=document.getElementById("verificationPanel");
const verificationInput=document.getElementById("verificationCode");
let pendingPurchase=null;
function currentBalance(){return Math.max(0,Number(localStorage.getItem("spaceBattleFragments"))||0);}
function refreshBalance(){if(balance)balance.textContent=currentBalance().toLocaleString("fr-FR")+" T-Bucks";}
function say(message,error=false){status.textContent=message;status.classList.toggle("error",error);}
function contactAgent(item="une demande d'achat Space Battle",price="à confirmer"){
  const message=`Bonjour GAME ZONE, je souhaite obtenir ${item}. Prix affiché : ${price}. Pouvez-vous m'indiquer les étapes pour recevoir un code d'achat ?`;
  const phone=AGENT_WHATSAPP.replace(/\D/g,"");
  const text=encodeURIComponent(message);
  // Essaye d'abord le schéma WhatsApp afin qu'Android ouvre une application installée.
  // Ne fixe pas le package : Android peut résoudre WhatsApp Messenger ou Business.
  const appUrl=`whatsapp://send?phone=${phone}&text=${text}`;
  const webUrl=`https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  try {
    window.location.href=appUrl;
    // Repli vers le lien officiel si le générateur APK ne gère pas le schéma personnalisé.
    setTimeout(()=>{ window.location.href=webUrl; }, 900);
  } catch (e) {
    window.location.href=webUrl;
  }
}
function isVerificationAvailable(code){
  const key="spaceBattleVerificationUsed_"+code;
  const usedAt=Number(localStorage.getItem(key)||0);
  if(!usedAt)return true;
  if(DAILY_RESET_VERIFICATION_CODES.has(code)&&Date.now()-usedAt>=VERIFICATION_RESET_MS){localStorage.removeItem(key);return true;}
  return false;
}
function useVerification(code){localStorage.setItem("spaceBattleVerificationUsed_"+code,String(Date.now()));}
document.getElementById("activateCode").addEventListener("click",()=>{
  const code=input.value.trim().toUpperCase().replace(/\s+/g,"");
  if(!code)return say("Entre d’abord ton code d’achat.",true);
  if(!PURCHASE_CODES.has(code))return say("Code d’achat inconnu. Vérifie les lettres et les chiffres.",true);
  const amount=PURCHASE_CODES.get(code);
  if(amount===110){
    pendingPurchase={code,amount};verificationPanel.hidden=false;
    say("Code d’achat reconnu pour 110 T-Bucks. Entre maintenant un code de vérification SP-VEF.");
    verificationInput.focus();return;
  }
  const usedKey="spaceBattlePurchaseCodeUsed_"+code;
  if(localStorage.getItem(usedKey)==="1")return say("Ce code d’achat a déjà été utilisé sur cet appareil.",true);
  localStorage.setItem("spaceBattleFragments",String(currentBalance()+amount));localStorage.setItem(usedKey,"1");
  refreshBalance();input.value="";say(`Code accepté ! ${amount.toLocaleString("fr-FR")} T-Bucks violets ajoutés à ton solde.`);
});
document.getElementById("confirmPurchase").addEventListener("click",()=>{
  if(!pendingPurchase)return say("Valide d’abord un code d’achat de 110 T-Bucks.",true);
  const verification=verificationInput.value.trim().toUpperCase().replace(/\s+/g,"");
  if(!verification)return say("Entre un code de vérification.",true);
  if(!VERIFICATION_CODES_110.has(verification))return say("Code de vérification invalide pour 110 T-Bucks.",true);
  if(!isVerificationAvailable(verification))return say("Ce code de vérification a déjà été utilisé. Choisis-en un autre.",true);
  // Validation locale de démonstration seulement; ne prouve pas qu'un paiement a été reçu.
  useVerification(verification);localStorage.setItem("spaceBattleFragments",String(currentBalance()+110));
  refreshBalance();say("Vérification acceptée : 110 T-Bucks violets ajoutés au solde local. Pour de vrais paiements, une vérification serveur est nécessaire.");
  input.value="";verificationInput.value="";verificationPanel.hidden=true;pendingPurchase=null;
});
document.getElementById("agentTop").addEventListener("click",event=>{
  event.preventDefault();
  const amount=Number(amountSelect.value)||100;
  contactAgent(`${amount.toLocaleString("fr-FR")} T-Bucks violets`,`${amount.toLocaleString("fr-FR")} T-Bucks`);
});
document.querySelectorAll(".itemContact").forEach(button=>button.addEventListener("click",()=>contactAgent(button.dataset.item,button.dataset.price)));
document.querySelectorAll(".buyWithTBucks").forEach(button=>button.addEventListener("click",()=>{
  const item=button.dataset.item;
  if(currentBalance()<1500){shopStatus.textContent=`Il te faut 1 500 T-Bucks violets pour acheter ${item}. Ton solde actuel est de ${currentBalance().toLocaleString("fr-FR")}.`;shopStatus.classList.add("error");return;}
  const ownedKey="spaceBattleOwned_"+item;
  if(localStorage.getItem(ownedKey)==="1"){shopStatus.textContent=`Tu possèdes déjà ${item}.`;shopStatus.classList.remove("error");return;}
  localStorage.setItem("spaceBattleFragments",String(currentBalance()-1500));localStorage.setItem(ownedKey,"1");refreshBalance();shopStatus.textContent=`Achat réussi ! ${item} a été ajouté à ta collection pour 1 500 T-Bucks violets.`;shopStatus.classList.remove("error");button.textContent="DÉJÀ ACHETÉ";button.disabled=true;
}));
document.querySelectorAll(".buyWithTBucks").forEach(button=>{if(localStorage.getItem("spaceBattleOwned_"+button.dataset.item)==="1"){button.textContent="DÉJÀ ACHETÉ";button.disabled=true;}});
refreshBalance();
