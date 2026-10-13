/* GAME ZONE account prototype. Local-only demo; real cross-device auth needs a server. */
(function(){
 const ACCOUNTS='gz_demo_accounts_v1', SESSION='gz_demo_session_v1', WALLET='gz_demo_wallet_v1', LINKS='gz_demo_links_v1';
 const $=id=>document.getElementById(id);
 function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch(e){return fallback}}
 function session(){return read(SESSION,null)}
 function wallet(){const s=session();return s?Number(read('gz_wallet_'+s.id,0)):0}
 async function digest(value){try{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return 'demo-'+value}}
 function setStatus(message){const el=$('status');if(el)el.textContent=message}
 function linksFor(s){const all=read(LINKS,{});return s?(all[s.id]||[]):[]}
 function goHome(){window.location.href='home.html'}
 function render(){
  const s=session(), links=linksFor(s);
  const form=$('authForms'), card=$('accountCard');
  if(form&&card){form.style.display=s?'none':'grid';card.style.display=s?'block':'none';if(s){if($('profileName'))$('profileName').textContent=s.pseudo;if($('profileEmail'))$('profileEmail').textContent=s.email;if($('walletAmount'))$('walletAmount').textContent=wallet().toLocaleString('fr-FR')}}
  document.querySelectorAll('[data-gz-pseudo]').forEach(el=>el.textContent=s?s.pseudo:'Invité');
  document.querySelectorAll('[data-gz-wallet]').forEach(el=>el.textContent=wallet().toLocaleString('fr-FR'));
  const header=$('gzHeaderPseudo'), menuName=$('gzMenuPseudo'), email=$('gzMenuEmail'), action=$('gzAccountAction'), logout=$('gzMenuLogout'), button=$('gzProfileButton');
  if(header)header.textContent=s?s.pseudo:'Connexion'; if(menuName)menuName.textContent=s?s.pseudo:'Invité'; if(email)email.textContent=s?s.email:'Connecte-toi pour lier tes jeux';
  if(action){action.textContent=s?'Mon profil':'Se connecter';action.href=s?'compte.html':'login.html'} if(logout)logout.hidden=!s;
  document.querySelectorAll('[data-link-status]').forEach(el=>{const slug=el.dataset.linkStatus;el.textContent=!s?'Connecte-toi pour lier':(links.includes(slug)?'Liée à : '+(slug==='bloxfruit'?'Blox Fruit':'Space Battle'):'Associer mon compte')});
  if(button)button.setAttribute('aria-label',s?'Profil de '+s.pseudo:'Se connecter à GAME ZONE');
 }
 async function register(e){e.preventDefault();const pseudo=$('regPseudo').value.trim(),email=$('regEmail').value.trim().toLowerCase(),pass=$('regPassword').value; if(pseudo.length<3||pass.length<8){setStatus('Le pseudo doit contenir au moins 3 caractères et le mot de passe 8.');return}const list=read(ACCOUNTS,[]);if(list.some(a=>a.email===email)){setStatus('Un compte avec cet e-mail existe déjà sur cet appareil. Connecte-toi plutôt.');return}if(list.some(a=>a.pseudo.toLowerCase()===pseudo.toLowerCase())){setStatus('Ce pseudo est déjà utilisé sur cet appareil. Choisis-en un autre.');return}const account={id:'GZ-'+Math.random().toString(36).slice(2,8).toUpperCase(),pseudo,email,passwordHash:await digest(pass),createdAt:new Date().toISOString()};list.push(account);localStorage.setItem(ACCOUNTS,JSON.stringify(list));localStorage.setItem(SESSION,JSON.stringify({id:account.id,pseudo,email}));localStorage.setItem('gz_wallet_'+account.id,'0');setStatus('Bienvenue '+pseudo+' ! Ouverture de l’accueil…');setTimeout(goHome,650)}
 async function login(e){e.preventDefault();const email=$('loginEmail').value.trim().toLowerCase(),pass=$('loginPassword').value,list=read(ACCOUNTS,[]),hash=await digest(pass),a=list.find(x=>x.email===email&&x.passwordHash===hash);if(!a){setStatus('E-mail ou mot de passe incorrect. Si c’est ton premier accès, crée un compte.');return}localStorage.setItem(SESSION,JSON.stringify({id:a.id,pseudo:a.pseudo,email:a.email}));setStatus('Bienvenue '+a.pseudo+' ! Ouverture de l’accueil…');setTimeout(goHome,650)}
 function logout(){localStorage.removeItem(SESSION);render();if(location.pathname.endsWith('deconnexion.html')){window.location.href='login.html'}else{window.location.href='home.html'}}
 function markGameLinked(){const s=session();if(!s)return;const path=location.pathname.toLowerCase();let slug=null;if(path.endsWith('/game.html')||path.endsWith('game.html'))slug='bloxfruit';if(path.endsWith('/space.html')||path.endsWith('space.html'))slug='space';if(!slug)return;const all=read(LINKS,{}),list=all[s.id]||[];if(!list.includes(slug)){list.push(slug);all[s.id]=list;localStorage.setItem(LINKS,JSON.stringify(all))}render();if(!sessionStorage.getItem('gz_welcome_'+slug)){sessionStorage.setItem('gz_welcome_'+slug,'1');const toast=document.createElement('div');toast.textContent='Bienvenue '+s.pseudo+' !';Object.assign(toast.style,{position:'fixed',zIndex:'999999',top:'14px',left:'50%',transform:'translateX(-50%)',maxWidth:'calc(100vw - 24px)',padding:'14px 20px',borderRadius:'14px',background:'#0b1724',border:'1px solid #55e6dc',boxShadow:'0 12px 36px #0008',color:'#f3f8fb',font:'800 15px system-ui,sans-serif',textAlign:'center'});document.body.appendChild(toast);setTimeout(()=>{toast.style.transition='opacity .35s';toast.style.opacity='0';setTimeout(()=>toast.remove(),400)},3200)}}
 if($('registerForm'))$('registerForm').addEventListener('submit',register);if($('loginForm'))$('loginForm').addEventListener('submit',login);if($('logoutBtn'))$('logoutBtn').addEventListener('click',logout);if($('gzMenuLogout'))$('gzMenuLogout').addEventListener('click',logout);
 const profileButton=$('gzProfileButton');
 function renderLinkManager(){
  const s=session();
  const gate=$('accountMessage');
  if(!document.querySelector('[data-toggle-link]'))return;
  if(!s){if($('profilePseudo'))$('profilePseudo').textContent='Invité';if($('profileEmail'))$('profileEmail').textContent='Connecte-toi pour associer tes jeux.';document.querySelectorAll('[data-toggle-link]').forEach(b=>{b.textContent='Connexion';b.disabled=false});if(gate)gate.textContent='Tu dois te connecter à GAME ZONE avant de lier un jeu.';return}
  if($('profilePseudo'))$('profilePseudo').textContent=s.pseudo;
  if($('profileEmail'))$('profileEmail').textContent=s.email;
  if($('profileAvatar'))$('profileAvatar').textContent=(s.pseudo||'GZ').slice(0,2).toUpperCase();
  const linked=linksFor(s);
  [['bloxfruit','bloxStatus','bloxLinkButton','Blox Fruit'],['space','spaceStatus','spaceLinkButton','Space Battle']].forEach(([slug,statusId,buttonId,label])=>{
   const yes=linked.includes(slug),status=$(statusId),button=$(buttonId);
   if(status){status.textContent=yes?'Compte GAME ZONE associé':'Compte non associé';status.classList.toggle('linked-pill',yes)}
   if(button){button.textContent=yes?'Délier':'Lier';button.disabled=false;button.classList.toggle('btn-primary',!yes)}
  });
  if(gate)gate.textContent='Les associations sont enregistrées sur cet appareil.';
 }
 document.querySelectorAll('[data-toggle-link]').forEach(button=>button.addEventListener('click',()=>{
  const s=session();if(!s){window.location.href='login.html';return}
  const slug=button.dataset.toggleLink,all=read(LINKS,{}),arr=all[s.id]||[];
  if(arr.includes(slug))all[s.id]=arr.filter(x=>x!==slug);else all[s.id]=[...arr,slug];
  localStorage.setItem(LINKS,JSON.stringify(all));renderLinkManager();render();
 }));
 document.querySelectorAll('[data-link-game]').forEach(link=>link.addEventListener('click',e=>{if(!session()){e.preventDefault();window.location.href='login.html';return}}));
 render();renderLinkManager();markGameLinked();window.addEventListener('storage',()=>{render();renderLinkManager()});window.GZAccount={getSession:session,getWallet:wallet,render,logout};
})();
