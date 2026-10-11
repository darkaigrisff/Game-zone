(function(){
  'use strict';
  const games = {
    bloxfruit: {
      name: 'Blox Fruit', category: 'RPG / AVENTURE', image: 'bloxfruit.png', alt: 'Illustration Blox Fruit',
      intro: 'Explore les îles, accepte des quêtes et fais progresser ton personnage dans une aventure RPG créée pour GAME ZONE.',
      description: 'Parcours différentes zones, accomplis des missions, combats des ennemis et développe ton personnage. La progression et les contenus du projet pourront évoluer avec les prochaines mises à jour.',
      facts: ['RPG', 'Exploration', 'Quêtes'], gamePage: 'game.html', slug: 'bloxfruit', available: true
    },
    space: {
      name: 'Space Battle', category: 'ARCADE / ACTION', image: 'space.png', alt: 'Illustration Space Battle',
      intro: 'Pars dans l’espace, combats des ennemis et avance à travers les chapitres dans un jeu d’action rapide.',
      description: 'Affronte les dangers spatiaux, progresse à travers les niveaux et découvre les systèmes de récompenses du projet Space Battle.',
      facts: ['Action', 'Science-fiction', 'Chapitres'], gamePage: 'space.html', slug: 'space', available: true
    },
    speed: {
      name: 'Speed Race', category: 'COURSE / ARCADE', image: '', alt: 'Illustration Speed Race',
      intro: 'Choisis ta voiture, lance une course et tente de finir sur le podium dans Speed Race.',
      description: 'Un jeu de course arcade accessible depuis la bibliothèque GAME ZONE. Les voitures et les courses peuvent être enrichies au fil des versions.',
      facts: ['Course', 'Voitures', 'Arcade'], gamePage: 'speed.html', slug: 'speed', available: true, customArt: true
    }
  };
  const params = new URLSearchParams(location.search);
  const slug = (params.get('jeu') || 'bloxfruit').toLowerCase();
  const game = games[slug];
  const title = document.getElementById('detailTitle');
  const image = document.getElementById('detailImage');
  const artWrap = document.getElementById('detailArtWrap');
  const download = document.getElementById('downloadGameButton');
  if (!game) {
    document.title = 'Jeu introuvable — GAME ZONE';
    title.textContent = 'Jeu introuvable';
    document.getElementById('detailIntro').textContent = 'Ce jeu ne figure pas encore parmi les jeux accessibles. Retourne à la bibliothèque GAME ZONE pour choisir un jeu disponible.';
    document.getElementById('detailStatus').textContent = 'NON DISPONIBLE';
    document.getElementById('detailStatus').classList.add('soon');
    document.getElementById('detailDownloadNote').textContent = 'Aucun téléchargement n’est proposé pour cette entrée.';
    download.href = 'index.html#jeux';
    download.textContent = 'Retour aux jeux';
    image.hidden = true;
    return;
  }
  document.title = game.name + ' — Détails | GAME ZONE';
  title.textContent = game.name;
  document.getElementById('detailCategory').textContent = game.category;
  document.getElementById('detailIntro').textContent = game.intro;
  document.getElementById('detailDescription').textContent = game.description;
  document.getElementById('detailSubheading').textContent = 'Découvre ' + game.name;
  document.getElementById('detailStatus').textContent = 'DISPONIBLE';
  image.alt = game.alt;
  if (game.customArt) { image.hidden = true; artWrap.classList.add('speed-art'); }
  else { image.src = game.image; image.hidden = false; }
  const facts = document.getElementById('detailFacts');
  game.facts.forEach(function(fact){ const chip=document.createElement('span'); chip.textContent=fact; facts.appendChild(chip); });
  download.href = 'download.html?jeu=' + encodeURIComponent(game.slug);
  download.setAttribute('aria-label', 'Télécharger ' + game.name + ' pour Android');
  download.innerHTML = 'Télécharger le jeu <span>↓</span>';
  document.getElementById('detailDownloadNote').textContent = 'Le bouton ouvre le fichier APK disponible pour ' + game.name + ', ou la version navigateur si aucun APK n’est configuré.';
})();
