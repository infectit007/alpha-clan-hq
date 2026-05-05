// ============================================
// ALPHA CLAN HQ — APP LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== STATE =====
  let currentMode = 'all';
  let currentSort = 'kd';
  let selectedPlayer = null;
  let searchQuery = '';

  // ===== HELPERS =====

  function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000) return n.toLocaleString();
    return n;
  }

  function kdClass(kd) {
    if (kd >= 3) return 'kd-high';
    if (kd >= 2) return 'kd-mid';
    return 'kd-low';
  }

  function getAvatarStyle(idx) {
    const c = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    return `background:${c.bg};color:${c.color};`;
  }

  function getInitials(name) {
    return name.split('_').map(w => w[0]).join('').slice(0, 2);
  }

  function modeBadge(mode) {
    const map = {
      'resurgence': ['mode-badge-resurgence', 'RESURG'],
      'resurgence-caldera': ['mode-badge-resurgence', 'CALDERA'],
      'battle-royale': ['mode-badge-br', 'BR'],
      'plunder': ['mode-badge-plunder', 'PLUNDER'],
      'ranked': ['mode-badge-ranked', 'RANKED'],
    };
    const [cls, label] = map[mode] || ['', mode.toUpperCase()];
    return `<span class="mode-badge ${cls}">${label}</span>`;
  }

  function getPlayerStat(player, field) {
    if (currentMode === 'all') return player[field];
    const modeData = player.modes[currentMode];
    if (!modeData) return 0;
    if (field === 'kd') return modeData.kd;
    if (field === 'kills') return modeData.kills;
    if (field === 'wins') return modeData.wins;
    if (field === 'damage') return modeData.damage;
    if (field === 'matches') return modeData.matches;
    return player[field];
  }

  // ===== ANIMATED COUNTERS =====
  function animateCounter(el, target, isFloat = false) {
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * ease;
      el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Intersection observer for summary bar counters
  const counterEls = document.querySelectorAll('.counter');
  const floatEls   = document.querySelectorAll('.counter-float');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target, el.classList.contains('counter-float'));
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => obs.observe(el));
  floatEls.forEach(el   => obs.observe(el));

  // ===== BUILD STATS TABLE =====

  function buildTable() {
    const body = document.getElementById('statsBody');
    let players = [...(window.ACTIVE_PLAYERS || PLAYERS)];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      players = players.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.displayName && p.displayName.toLowerCase().includes(q)) ||
        (p.activisionId && p.activisionId.toLowerCase().includes(q)) ||
        (p.discord && p.discord.toLowerCase().includes(q))
      );
    }

    // Sort
    players.sort((a, b) => {
      return getPlayerStat(b, currentSort) - getPlayerStat(a, currentSort);
    });

    body.innerHTML = '';

    players.forEach((player, i) => {
      const rank = i + 1;
      const kd = getPlayerStat(player, 'kd');
      const kills = getPlayerStat(player, 'kills');
      const wins = getPlayerStat(player, 'wins');
      const matches = getPlayerStat(player, 'matches');
      const damage = getPlayerStat(player, 'damage');

      const row = document.createElement('tr');
      if (selectedPlayer === player.id) row.classList.add('selected');

      row.innerHTML = `
        <td class="td-rank ${rank <= 3 ? 'top3' : ''}">${rank}</td>
        <td>
          <div class="player-cell">
            <div class="player-avatar" style="${getAvatarStyle(player.avatar)}">
              ${getInitials(player.displayName || player.name)}
            </div>
            <div>
              <div class="player-name">${player.displayName || player.name}</div>
              <div class="player-tag">${player.tag}</div>
            </div>
          </div>
        </td>
        <td><span class="kd-value ${kdClass(kd)}">${kd.toFixed(2)}</span></td>
        <td>${kills.toLocaleString()}</td>
        <td>${wins}</td>
        <td>${matches}</td>
        <td>${fmt(damage)}</td>
        <td>${currentMode === 'all' ? player.gulag + '%' : '—'}</td>
        <td>${currentMode === 'all' ? player.top5 + '%' : '—'}</td>
        <td>${modeBadge(player.bestMode)}</td>
      `;

      row.addEventListener('click', () => togglePlayerBreakdown(player));
      body.appendChild(row);
    });
  }

  // ===== PLAYER BREAKDOWN =====

  function togglePlayerBreakdown(player) {
    const wrap = document.getElementById('modeBreakdown');
    const nameEl = document.getElementById('breakdownName');
    const cardsEl = document.getElementById('breakdownCards');

    if (selectedPlayer === player.id) {
      selectedPlayer = null;
      wrap.style.display = 'none';
      buildTable();
      return;
    }

    selectedPlayer = player.id;
    nameEl.textContent = player.name;

    const MODES = [
      { key: 'resurgence',          label: 'RESURGENCE' },
      { key: 'resurgence-caldera',  label: 'RESURGENCE — CALDERA' },
      { key: 'battle-royale',       label: 'BATTLE ROYALE' },
      { key: 'plunder',             label: 'PLUNDER' },
      { key: 'ranked',              label: 'RANKED' },
    ];

    cardsEl.innerHTML = MODES.map(mode => {
      const d = player.modes[mode.key];
      if (!d) return '';
      const barWidth = Math.min(d.kd / 5 * 100, 100);
      return `
        <div class="breakdown-card">
          <div class="breakdown-mode-name">${mode.label}</div>
          <div class="breakdown-stat">
            <span class="breakdown-stat-label">K/D</span>
            <span class="breakdown-stat-val ${kdClass(d.kd)}">${d.kd.toFixed(2)}</span>
          </div>
          <div class="breakdown-stat">
            <span class="breakdown-stat-label">Kills</span>
            <span class="breakdown-stat-val">${d.kills.toLocaleString()}</span>
          </div>
          <div class="breakdown-stat">
            <span class="breakdown-stat-label">Wins</span>
            <span class="breakdown-stat-val">${d.wins}</span>
          </div>
          <div class="breakdown-stat">
            <span class="breakdown-stat-label">Matches</span>
            <span class="breakdown-stat-val">${d.matches}</span>
          </div>
          <div class="breakdown-stat">
            <span class="breakdown-stat-label">Damage</span>
            <span class="breakdown-stat-val">${fmt(d.damage)}</span>
          </div>
          <div class="breakdown-kd-bar">
            <div class="breakdown-kd-fill" style="width:0%" data-width="${barWidth}%"></div>
          </div>
        </div>
      `;
    }).join('');

    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    buildTable();

    // Animate bars after render
    setTimeout(() => {
      document.querySelectorAll('.breakdown-kd-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 50);
  }

  document.getElementById('breakdownClose').addEventListener('click', () => {
    selectedPlayer = null;
    document.getElementById('modeBreakdown').style.display = 'none';
    buildTable();
  });

  // ===== MODE BUTTONS =====
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      selectedPlayer = null;
      document.getElementById('modeBreakdown').style.display = 'none';
      buildTable();
    });
  });

  // ===== SORT BUTTONS =====
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      buildTable();
    });
  });

  // ===== SEARCH =====
  document.getElementById('playerSearch').addEventListener('input', e => {
    searchQuery = e.target.value;
    buildTable();
  });

  // ===== BUILD MATCHES =====

  function buildMatches() {
    const grid = document.getElementById('matchesGrid');

    grid.innerHTML = RECENT_MATCHES.map(m => {
      const playerDots = m.players.map(idx => {
        const p = PLAYERS[idx];
        return `<div class="match-player-dot" style="${getAvatarStyle(p.avatar)}" title="${p.name}">${getInitials(p.name)}</div>`;
      }).join('');

      return `
        <div class="match-card ${m.result}">
          <div class="match-header">
            <div class="match-mode">${m.mode}</div>
            <div class="match-result result-${m.result}">${m.result.toUpperCase()}</div>
          </div>
          <div class="match-stats">
            <div class="match-stat">
              <span class="match-stat-val">${m.kills}</span>
              <span class="match-stat-label">KILLS</span>
            </div>
            <div class="match-stat">
              <span class="match-stat-val">#${m.placement}</span>
              <span class="match-stat-label">PLACE</span>
            </div>
            <div class="match-stat">
              <span class="match-stat-val">${m.damage.toLocaleString()}</span>
              <span class="match-stat-label">DAMAGE</span>
            </div>
            <div class="match-stat">
              <span class="match-stat-val">${m.duration}</span>
              <span class="match-stat-label">DURATION</span>
            </div>
          </div>
          <div class="match-players">${playerDots}</div>
          <div class="match-footer">
            <span class="match-time">${m.time}</span>
            <button class="match-share" onclick="shareMatch('${m.id}')">⬆ SHARE</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ===== BUILD PERFORMERS =====

  function buildPerformers() {
    const grid = document.getElementById('performersGrid');
    const activePlayers = window.ACTIVE_PLAYERS || PLAYERS;

    // Auto-generate top performers from active players
    const byKD     = [...activePlayers].sort((a,b) => b.kd - a.kd)[0];
    const byKills  = [...activePlayers].sort((a,b) => b.kills - a.kills)[0];
    const byWins   = [...activePlayers].sort((a,b) => b.wins - a.wins)[0];
    const byDamage = [...activePlayers].sort((a,b) => b.damage - a.damage)[0];
    const byGulag  = [...activePlayers].sort((a,b) => b.gulag - a.gulag)[0];

    const performers = [
      { player: byKills,  category: "MOST KILLS",   stat: byKills?.kills?.toLocaleString() || '0',        statLabel: "TOTAL KILLS" },
      { player: byKD,     category: "BEST K/D",     stat: byKD?.kd?.toFixed(2) || '0.00',                 statLabel: "KILL/DEATH RATIO" },
      { player: byWins,   category: "MOST WINS",    stat: byWins?.wins?.toString() || '0',                 statLabel: "WINS THIS SEASON" },
      { player: byDamage, category: "TOP DAMAGE",   stat: byDamage ? fmt(byDamage.damage) : '0',          statLabel: "TOTAL DAMAGE" },
      { player: byGulag,  category: "GULAG KING",   stat: (byGulag?.gulag || 0) + '%',                    statLabel: "GULAG WIN RATE" },
    ].filter(p => p.player);

    grid.innerHTML = performers.map((perf, i) => {
      const player = perf.player;
      return `
        <div class="performer-card ${i === 0 ? 'rank-1' : ''}">
          <div class="performer-rank">// ${perf.category}</div>
          <div class="performer-avatar" style="${getAvatarStyle(player.avatar)}">
            ${getInitials(player.name)}
          </div>
          <div class="performer-name">${player.name}</div>
          <div class="performer-stat-big">${perf.stat}</div>
          <div class="performer-stat-label">${perf.statLabel}</div>
        </div>
      `;
    }).join('');
  }

  // ===== SHARE MATCH =====
  window.shareMatch = function(matchId) {
    const match = RECENT_MATCHES.find(m => m.id === matchId);
    if (!match) return;

    // Post to Discord
    const discordMatch = {
      ...match,
      players: match.players.map(idx => PLAYERS[idx].name),
    };
    postMatchToDiscord(discordMatch);

    // Also copy link
    const url = `${window.location.origin}/matches.html?id=${matchId}`;
    if (navigator.share) {
      navigator.share({ title: 'ALPHA Clan Match', url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Match link copied + posted to Discord!');
      });
    }
  };

  // ===== TOAST =====
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--accent); color: #000;
      font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em;
      padding: 10px 20px; border-radius: 2px; z-index: 9999;
      animation: fadeInUp 0.3s ease both;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ===== STICKY NAV SCROLL EFFECT =====
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 60) {
      nav.style.borderBottomColor = 'rgba(57,255,20,0.15)';
    } else {
      nav.style.borderBottomColor = 'rgba(255,255,255,0.06)';
    }
  });

  // ===== NAV SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== MOBILE NAV =====
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? '' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '60px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(5,6,8,0.97)';
      navLinks.style.padding = '16px';
      navLinks.style.borderBottom = '1px solid rgba(57,255,20,0.15)';
      if (open) navLinks.style.display = 'none';
    });
  }

  // Expose buildTable globally so stats.js can trigger a re-render
  window.buildTableGlobal = buildTable;

  // ===== AUTO-LOAD REAL MEMBERS FROM SUPABASE =====
  // Pulls approved members, merges with placeholders automatically
  // Once real members >= 5, placeholders hide themselves

  const REAL_MEMBER_THRESHOLD = 5; // fake players vanish when this many real ones exist

  async function loadRealMembers() {
    try {
      // Only load if Supabase is available
      if (!window.supabaseClient) return [];

      const { data, error } = await window.supabaseClient
        .from('members')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      // Convert Supabase member records into player objects
      return data.map((m, i) => ({
        id:            'real-' + m.id,
        name:          m.username.toUpperCase(),
        displayName:   m.username,
        tag:           '#' + (m.activision_id.split('#')[1] || '0000'),
        isPlaceholder: false,
        isReal:        true,
        activisionId:  m.activision_id,
        discord:       m.discord,
        platform:      m.platform,
        rank:          m.rank,
        kd: 0, kills: 0, wins: 0, matches: 0,
        damage: 0, gulag: 0, top5: 0,
        bestMode: 'resurgence',
        avatar: i % AVATAR_COLORS.length,
        modes: {
          resurgence:           { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
          'resurgence-caldera': { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
          'battle-royale':      { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
          plunder:              { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
          ranked:               { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
        }
      }));
    } catch (e) {
      return [];
    }
  }

  // ===== INIT =====
  async function init() {
    // Wait for Supabase to be ready if it isn't yet
    if (!window.supabaseClient) {
      await new Promise(resolve => {
        document.addEventListener('supabase-ready', resolve, { once: true });
        // Fallback timeout — proceed without Supabase after 3 seconds
        setTimeout(resolve, 3000);
      });
    }

    // Load real members from Supabase
    const realMembers = await loadRealMembers();

    // Auto-hide placeholders once enough real members exist
    const hideFakes = realMembers.length >= REAL_MEMBER_THRESHOLD;

    // Merge: real members first, placeholders after (or hidden)
    window.ACTIVE_PLAYERS = [
      ...realMembers,
      ...(hideFakes ? [] : PLAYERS.filter(p => p.isPlaceholder !== false)),
    ];

    // Update summary bar with real counts
    if (realMembers.length > 0) {
      const realCounter = document.querySelector('.counter[data-target="24"]');
      if (realCounter) realCounter.dataset.target = realMembers.length;
    }

    buildTable();
    buildMatches();
    buildPerformers();

    // Fetch real stats from tracker.gg for approved members
    if (realMembers.length > 0) {
      setTimeout(() => refreshAllStats(), 500);
    }
  }

  init();

});
