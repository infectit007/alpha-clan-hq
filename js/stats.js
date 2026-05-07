// ============================================
// ALPHA CLAN — REAL STATS FETCHER
// Pulls live Warzone stats via Vercel proxy
// ============================================

const PROXY_URL = 'https://alpha-clan-proxy-infectit007s-projects.vercel.app';

// Cache stats for 10 minutes to avoid hammering the API
const statsCache = {};
const CACHE_TTL  = 10 * 60 * 1000;

window.fetchPlayerStats = async function(activisionId) {
  // Check cache first
  const cached = statsCache[activisionId];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `${PROXY_URL}/api/stats?activisionId=${encodeURIComponent(activisionId)}`;
    const res  = await fetch(url);

    if (!res.ok) {
      console.warn(`Stats fetch failed for ${activisionId}:`, res.status);
      return null;
    }

    const data = await res.json();

    // Cache it
    statsCache[activisionId] = { data, timestamp: Date.now() };
    return data;

  } catch (err) {
    console.warn(`Stats fetch error for ${activisionId}:`, err.message);
    return null;
  }
};

// Fetch stats for all real members and update ACTIVE_PLAYERS
window.refreshAllStats = async function() {
  if (!window.ACTIVE_PLAYERS) return;

  const realPlayers = window.ACTIVE_PLAYERS.filter(p => p.isReal && p.activisionId);
  if (realPlayers.length === 0) return;

  // Show loading indicator
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const loader = document.createElement('div');
    loader.id = 'stats-loader';
    loader.innerHTML = `<div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);letter-spacing:0.15em;padding:12px 0;">⟳ SYNCING LIVE STATS...</div>`;
    statsSection.insertBefore(loader, statsSection.firstChild);
  }

  // Fetch all in parallel
  const results = await Promise.allSettled(
    realPlayers.map(p => fetchPlayerStats(p.activisionId))
  );

  // Update player objects with real stats
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value) {
      const stats  = result.value;
      const player = realPlayers[i];

      // Update the player object in ACTIVE_PLAYERS
      const idx = window.ACTIVE_PLAYERS.findIndex(p => p.id === player.id);
      if (idx !== -1) {
        window.ACTIVE_PLAYERS[idx] = {
          ...window.ACTIVE_PLAYERS[idx],
          kd:      stats.kd      || 0,
          kills:   stats.kills   || 0,
          wins:    stats.wins    || 0,
          matches: stats.matches || 0,
          damage:  stats.damage  || 0,
          gulag:   stats.gulag   || 0,
          top5:    stats.top5    || 0,
          modes:   stats.modes   || window.ACTIVE_PLAYERS[idx].modes,
          statsLoaded: true,
        };
      }
    }
  });

  // Remove loader
  document.getElementById('stats-loader')?.remove();

  // Rebuild table with real stats
  if (typeof buildTableGlobal === 'function') buildTableGlobal();
};
