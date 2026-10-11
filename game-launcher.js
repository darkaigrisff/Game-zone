/* GAME ZONE Android launcher
   The browser cannot read Android's installed-app list directly. It tries a
   registered GAME ZONE deep link first, then looks for a matching APK asset in
   the public GitHub Releases API. If no APK exists, it opens the browser game.
*/
(() => {
  'use strict';

  const RELEASES_API = 'https://api.github.com/repos/darkaigrisff/Game-zone/releases?per_page=10';
  const ANDROID = /Android/i.test(navigator.userAgent);
  const games = {
    bloxfruit: {
      name: 'Blox Fruit',
      scheme: 'gamezone://bloxfruit',
      fallback: 'game.html',
      apkNames: ['blox-fruit.apk', 'bloxfruit.apk', 'blox_fruit_1_3.apk']
    },
    space: {
      name: 'Space Battle',
      scheme: 'gamezone://spacebattle',
      fallback: 'space.html',
      apkNames: ['space-battle.apk', 'spacebattle.apk']
    },
    speed: {
      name: 'Speed Race',
      scheme: 'gamezone://speedrace',
      fallback: 'speed.html',
      apkNames: ['speed-race.apk', 'speedrace.apk']
    },
    football: {
      name: 'FOOTBALL LIGUE 2027',
      scheme: 'gamezone://footballligue2027',
      fallback: 'actualites.html',
      apkNames: ['football-ligue-2027.apk', 'football-ligue.apk', 'fl7.apk']
    }
  };

  let statusBox;
  function showStatus(message) {
    if (!statusBox) {
      statusBox = document.createElement('div');
      statusBox.id = 'gzLaunchStatus';
      statusBox.setAttribute('role', 'status');
      statusBox.setAttribute('aria-live', 'polite');
      Object.assign(statusBox.style, {
        position: 'fixed', zIndex: '99999', left: '16px', right: '16px',
        bottom: '18px', maxWidth: '520px', margin: '0 auto', padding: '14px 16px',
        borderRadius: '14px', color: '#f4f7ff', background: '#111a2a',
        border: '1px solid #35445f', boxShadow: '0 12px 35px #0008',
        font: '600 14px/1.45 system-ui, sans-serif'
      });
      document.body.appendChild(statusBox);
    }
    statusBox.textContent = message;
    statusBox.style.display = 'block';
  }

  function normalise(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  }

  async function findReleaseApk(game) {
    const response = await fetch(RELEASES_API, {
      headers: { 'Accept': 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('GitHub releases indisponibles (' + response.status + ')');
    const releases = await response.json();
    const wanted = game.apkNames.map(normalise);
    for (const release of releases) {
      if (release.draft || release.prerelease) continue;
      for (const asset of (release.assets || [])) {
        if (wanted.includes(normalise(asset.name)) && asset.browser_download_url) return asset;
      }
    }
    return null;
  }

  function openBrowserGame(game) {
    window.location.href = game.fallback;
  }

  async function handleLaunch(anchor, game) {
    if (!ANDROID) {
      openBrowserGame(game);
      return;
    }

    let appWasOpened = false;
    const markHidden = () => {
      if (document.hidden) appWasOpened = true;
    };
    document.addEventListener('visibilitychange', markHidden);
    showStatus('Vérification Android : recherche de ' + game.name + ' sur le téléphone…');

    // The app must register this custom URI scheme to be launchable this way.
    try { window.location.href = game.scheme; } catch (_) {}

    await new Promise(resolve => setTimeout(resolve, 1400));
    document.removeEventListener('visibilitychange', markHidden);
    if (appWasOpened || document.hidden) return;

    showStatus('Recherche de la version Android de ' + game.name + ' sur GitHub…');
    try {
      const asset = await findReleaseApk(game);
      if (asset) {
        showStatus('Version trouvée : le téléchargement de ' + game.name + ' commence. Android demandera ensuite de confirmer l’installation.');
        // Trigger a browser-managed download; websites cannot silently install APKs.
        const downloadLink = document.createElement('a');
        downloadLink.href = asset.browser_download_url;
        downloadLink.download = asset.name;
        downloadLink.rel = 'noopener';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        return;
      }
      showStatus('Aucun APK Android de ' + game.name + ' n’est publié dans les versions GitHub. Ouverture du jeu disponible dans le navigateur…');
      setTimeout(() => openBrowserGame(game), 1100);
    } catch (error) {
      showStatus('GitHub ne répond pas pour le moment. Ouverture du jeu dans le navigateur…');
      setTimeout(() => openBrowserGame(game), 1100);
    }
  }

  document.querySelectorAll('[data-game-launch]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const game = games[anchor.dataset.gameLaunch];
      if (!game) return;
      event.preventDefault();
      handleLaunch(anchor, game);
    });
  });

  // Expose the same flow for future cards/buttons without duplicating logic.
  window.GAME_ZONE_LAUNCH = (slug) => {
    const game = games[slug];
    if (game) handleLaunch(null, game);
  };
})();
