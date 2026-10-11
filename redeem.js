"use strict";
// Codes cadeau Space Battle fournis par le propriétaire. Le doublon SP-CADEAU-528 n'est conservé qu'une fois.
const VALID_CODES = new Set([
  "SP-CADEAU-569","SP-CADEAU-548","SP-CADEAU-558","SP-CADEAU-528","SP-CADEAU-68",
  "SP-CADEAU-8","SP-CADEAU-69","SP-CADEAU-58","SP-CADEAU-18","SP-CADEAU-48",
  "SP-CADEAU-35","SP-CADEAU-23","SP-CADEAU-589","SP-CADEAU-213","SP-CADEAU-523",
  "SP-CADEAU-247","SP-CADEAU-78","SP-CADEAU-77","SP-CADEAU-24"
]);
const EXPIRES_AT = new Date("2027-06-04T00:00:00"); // Valables jusqu'au 3 juin 2027 inclus.
const REWARD_T = 100; // Montant provisoire, à ajuster si la récompense officielle diffère.
const input=document.getElementById("redeemCode");
const status=document.getElementById("redeemStatus");
function say(message,error=false){status.textContent=message;status.classList.toggle("error",error);}
document.getElementById("redeemButton").addEventListener("click",()=>{
  const code=input.value.trim().toUpperCase().replace(/\s+/g,"");
  if(!code)return say("Entre un code cadeau.",true);
  if(Date.now()>=EXPIRES_AT.getTime())return say("Les codes cadeau ont expiré.",true);
  if(!VALID_CODES.has(code))return say("Code cadeau inconnu. Vérifie les lettres et les chiffres puis réessaie.",true);
  const key="spaceBattleRedeemUsed_"+code;
  if(localStorage.getItem(key)==="1")return say("Ce code a déjà été utilisé sur cet appareil.",true);
  localStorage.setItem(key,"1");
  const old=Math.max(0,Number(localStorage.getItem("spaceBattleFragments"))||0);
  localStorage.setItem("spaceBattleFragments",String(old+REWARD_T));
  say(`Code accepté ! ${REWARD_T} T-Bucks violets ajoutés au solde de cet appareil.`);
  input.value="";
});


// Bouton Redeem : demande à Android d'ouvrir l'application associée au lien de chaîne.
// Si l'ouverture directe n'est pas prise en charge par le générateur APK, le lien officiel reste le recours.
const CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8WipF35fLmwPLR4e0r";
const CHANNEL_INTENT = "intent://channel/0029Vb8WipF35fLmwPLR4e0r#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=https%3A%2F%2Fwhatsapp.com%2Fchannel%2F0029Vb8WipF35fLmwPLR4e0r;end";
const getRedeemCodeButton = document.getElementById("getRedeemCode");
getRedeemCodeButton.addEventListener("click", () => {
  // Essai d'ouverture via Android, sans modifier ni exposer les codes du jeu.
  window.location.href = CHANNEL_INTENT;
  // Certains WebView bloquent les intent:// ; la solution de repli est le lien de chaîne officiel.
  window.setTimeout(() => {
    if (document.visibilityState === "visible") window.location.href = CHANNEL_URL;
  }, 700);
});
