(function(){
  const links = {
    whatsapp: { web: 'https://wa.me/24102471171', intent: 'intent://send?phone=24102471171#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=https%3A%2F%2Fwa.me%2F24102471171;end' },
    discord: { web: 'https://discord.gg/EdnFkHthk', intent: 'intent://discord.gg/EdnFkHthk#Intent;scheme=https;package=com.discord;S.browser_fallback_url=https%3A%2F%2Fdiscord.gg%2FEdnFkHthk;end' },
    youtube: { web: 'https://www.youtube.com/@Game-zone-io', intent: 'intent://www.youtube.com/@Game-zone-io#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https%3A%2F%2Fwww.youtube.com%2F%40Game-zone-io;end' },
    tiktok: { web: 'https://www.tiktok.com/@game.zone.io', intent: 'intent://www.tiktok.com/@game.zone.io#Intent;scheme=https;package=com.zhiliaoapp.musically;S.browser_fallback_url=https%3A%2F%2Fwww.tiktok.com%2F%40game.zone.io;end' }
  };
  const android = /Android/i.test(navigator.userAgent);
  document.querySelectorAll('[data-social]').forEach(a => {
    const item = links[a.dataset.social];
    if (!item) return;
    const original = a.getAttribute('href') || item.web;
    let webUrl = item.web;
    try {
      const parsed = new URL(original, window.location.href);
      if (a.dataset.social === 'whatsapp' && parsed.searchParams.has('text')) webUrl = parsed.href;
    } catch (_) {}
    let intentUrl = item.intent;
    if (a.dataset.social === 'whatsapp') {
      try {
        const parsed = new URL(webUrl);
        const message = parsed.searchParams.get('text');
        if (message) intentUrl = 'intent://send?phone=24102471171&text=' + encodeURIComponent(message) + '#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=' + encodeURIComponent(webUrl) + ';end';
      } catch (_) {}
    }
    a.href = android ? intentUrl : webUrl;
  });
})();
