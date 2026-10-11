(function(){
  'use strict';
  // Liens directs vers les noms de fichiers APK qui fonctionnaient dans l’ancienne version.
  // Les chemins sont relatifs à la racine publiée de GAME ZONE.
  const games={
    bloxfruit:{name:'Blox Fruit',fallback:'game.html',apk:'Blox_fruit_1.apk'},
    space:{name:'Space Battle',fallback:'space.html',apk:'Space%20Battle_1.apk'},
    speed:{name:'Speed Race',fallback:'speed.html',apk:null}
  };
  const slug=(new URLSearchParams(location.search).get('jeu')||'bloxfruit').toLowerCase();
  const game=games[slug];
  const title=document.getElementById('downloadTitle');
  const message=document.getElementById('downloadMessage');
  const actions=document.getElementById('downloadActions');
  const back=document.getElementById('backToDetails');
  function button(label,href,primary){const a=document.createElement('a');a.className='btn '+(primary?'btn-primary':'btn-outline');a.href=href;a.textContent=label;actions.appendChild(a);return a;}
  if(!game){title.textContent='Jeu introuvable';message.textContent='Choisis un jeu dans la bibliothèque GAME ZONE.';button('Retour à la bibliothèque','index.html#jeux',true);return;}
  document.title='Télécharger '+game.name+' — GAME ZONE';
  title.textContent='Télécharger '+game.name;
  back.href='detail.html?jeu='+encodeURIComponent(slug);
  if(game.apk){
    message.textContent='Le fichier APK de '+game.name+' est prêt. Appuie sur le bouton pour lancer le téléchargement.';
    const a=button('Télécharger '+game.name+' (APK)',game.apk,true);
    a.setAttribute('download','');
    button('Ouvrir la version navigateur',game.fallback,false);
  }else{
    message.textContent='Aucun fichier APK Speed Race n’est configuré pour le moment. Tu peux jouer dans le navigateur.';
    button('Jouer dans le navigateur',game.fallback,true);
  }
})();
