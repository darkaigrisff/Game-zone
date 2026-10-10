(function(){
  'use strict';
  const RELEASES_API='https://api.github.com/repos/darkaigrisff/Game-zone/releases?per_page=20';
  const games={
    bloxfruit:{name:'Blox Fruit',fallback:'game.html',prefixes:['bloxfruit','bloxfruitapk','bloxfruitv','bloxfruitandroid','bloxfruitgame','bloxfruit13','bloxfruitv13','bloxfruitapk']},
    space:{name:'Space Battle',fallback:'space.html',prefixes:['spacebattle','spacebattleapk','spacebattlev','spacebattleandroid']},
    speed:{name:'Speed Race',fallback:'speed.html',prefixes:['speedrace','speedraceapk','speedracev','speedraceandroid']}
  };
  const slug=(new URLSearchParams(location.search).get('jeu')||'bloxfruit').toLowerCase();
  const game=games[slug];
  const title=document.getElementById('downloadTitle');
  const message=document.getElementById('downloadMessage');
  const actions=document.getElementById('downloadActions');
  const back=document.getElementById('backToDetails');
  function button(label,href,primary){const a=document.createElement('a');a.className='btn '+(primary?'btn-primary':'btn-outline');a.href=href;a.textContent=label;actions.appendChild(a);return a;}
  function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
  if(!game){title.textContent='Jeu introuvable';message.textContent='Choisis un jeu dans la bibliothèque GAME ZONE.';button('Retour à la bibliothèque','index.html#jeux',true);return;}
  document.title='Télécharger '+game.name+' — GAME ZONE';
  title.textContent='Télécharger '+game.name;
  back.href='detail.html?jeu='+encodeURIComponent(slug);
  fetch(RELEASES_API,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'})
    .then(function(response){if(!response.ok)throw new Error('API indisponible');return response.json();})
    .then(function(releases){
      let found=null;
      for(const release of releases){
        if(release.draft||release.prerelease)continue;
        for(const asset of (release.assets||[])){
          const name=norm(asset.name);
          if(!name.endsWith('apk'))continue;
          if(game.prefixes.some(function(prefix){return name.startsWith(prefix);}) && asset.browser_download_url){found=asset;break;}
        }
        if(found)break;
      }
      if(found){
        message.textContent='Une version Android de '+game.name+' est publiée. Appuie sur le bouton ci-dessous pour télécharger le fichier APK.';
        const a=button('Télécharger l’APK ('+found.name+')',found.browser_download_url,true);a.target='_blank';a.rel='noopener';
        button('Ouvrir la version navigateur',game.fallback,false);
      }else{
        message.textContent='Aucun fichier APK de '+game.name+' n’est actuellement publié dans les Releases GitHub. Le bouton de téléchargement sera disponible dès qu’un APK y sera ajouté.';
        button('Jouer dans le navigateur',game.fallback,true);
        button('Voir les détails du jeu','detail.html?jeu='+encodeURIComponent(slug),false);
      }
    })
    .catch(function(){
      message.textContent='Impossible de vérifier les APK en ligne pour le moment. Tu peux ouvrir la version navigateur ou réessayer plus tard.';
      button('Jouer dans le navigateur',game.fallback,true);
      button('Réessayer', 'download.html?jeu='+encodeURIComponent(slug), false);
    });
})();
