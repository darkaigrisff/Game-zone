"use strict";
const effects = document.getElementById("effectsToggle");
const motion = document.getElementById("motionToggle");
const status = document.getElementById("settingsStatus");
function setSwitch(button, on) { button.setAttribute("aria-checked", String(on)); }
const savedEffects = localStorage.getItem("spaceOptionsEffects") !== "false";
const savedMotion = localStorage.getItem("spaceOptionsReduceMotion") === "true";
setSwitch(effects, savedEffects); setSwitch(motion, savedMotion);
document.body.classList.toggle("no-effects", !savedEffects);
document.body.classList.toggle("reduce-motion", savedMotion);
effects.addEventListener("click", () => { const on = effects.getAttribute("aria-checked") !== "true"; setSwitch(effects,on); localStorage.setItem("spaceOptionsEffects",String(on)); document.body.classList.toggle("no-effects",!on); status.textContent = "Préférence enregistrée."; });
motion.addEventListener("click", () => { const on = motion.getAttribute("aria-checked") !== "true"; setSwitch(motion,on); localStorage.setItem("spaceOptionsReduceMotion",String(on)); document.body.classList.toggle("reduce-motion",on); status.textContent = "Préférence enregistrée."; });
