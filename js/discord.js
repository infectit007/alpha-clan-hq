// ============================================
// ALPHA CLAN — DISCORD WEBHOOK INTEGRATION
// ============================================

const DISCORD = {
  matchResults: 'https://discord.com/api/webhooks/1501032184729829426/_TBCAt693Ryx7BJxRIs9Xh6mf0qp0YfAcp6hc_1cm-WRLlmXS0ID9YkKyhcT1zBTlyt3',
  clanNews:     'https://discord.com/api/webhooks/1501032683571118233/i6XLThdSKLDW9ZEUIXdBXCZtOfj2wjhiqE3dlzpt-niY8cX2m9wPn3UZWVu7vXGae2I7',
  leaderboard:  'https://discord.com/api/webhooks/1501032893953347605/6HFdpwg_Wq1WpuUYVj5yv-LIofQ6RweXr0lbYc6zEJ7IeI2nYcU6vXJhshBL8Ft8m3KF',
};

// ===== CORE SEND FUNCTION =====
async function sendToDiscord(webhookUrl, payload) {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('Discord webhook error:', err);
    return false;
  }
}

// ===== POST MATCH RESULT =====
// Call this after a match is logged
window.postMatchToDiscord = async function(match) {
  const resultColor = match.result === 'win' ? 0x39ff14 : 0xff3b3b;
  const resultEmoji = match.result === 'win' ? '🏆' : '💀';
  const placement   = match.placement === 1 ? '🥇 #1 — VICTORY' : `#${match.placement}`;

  const payload = {
    username: 'ALPHA Match Bot',
    avatar_url: 'https://raw.githubusercontent.com/infectit007/alpha-clan-hq/main/assets/logo.png',
    embeds: [{
      title: `${resultEmoji} ${match.mode}`,
      color: resultColor,
      fields: [
        { name: '📍 Placement', value: placement,                          inline: true },
        { name: '💀 Kills',     value: `${match.kills}`,                   inline: true },
        { name: '🛡️ Deaths',    value: `${match.deaths}`,                  inline: true },
        { name: '💥 Damage',    value: match.damage.toLocaleString(),       inline: true },
        { name: '⏱️ Duration',  value: match.duration,                     inline: true },
        { name: '🎖️ Assists',   value: `${match.assists || 0}`,            inline: true },
        { name: '👥 Squad',     value: match.players.join(', ') || '—',    inline: false },
      ],
      footer: { text: 'ALPHA Clan HQ • alpha-clan-hq.github.io' },
      timestamp: new Date().toISOString(),
    }]
  };

  const ok = await sendToDiscord(DISCORD.matchResults, payload);
  if (ok) showToast('Match posted to #match-results!');
  return ok;
};

// ===== POST MEMBER APPROVED =====
window.postMemberApprovedToDiscord = async function(member) {
  const payload = {
    username: 'ALPHA News Bot',
    embeds: [{
      title: '🆕 NEW OPERATOR CLEARED',
      color: 0x39ff14,
      description: `**${member.username}** has been approved and joined ALPHA Clan.`,
      fields: [
        { name: '◈ Activision ID', value: member.activision_id, inline: true },
        { name: '⬡ Discord',       value: `@${member.discord}`, inline: true },
        { name: '🎮 Platform',      value: member.platform,      inline: true },
        { name: '🎖️ Rank',          value: 'RECRUIT',            inline: true },
      ],
      footer: { text: 'ALPHA Clan HQ' },
      timestamp: new Date().toISOString(),
    }]
  };

  return await sendToDiscord(DISCORD.clanNews, payload);
};

// ===== POST RANK PROMOTION =====
window.postRankPromotionToDiscord = async function(member, newRank) {
  const rankColors = {
    SOLDIER:   0x3b9eff,
    COMMANDER: 0xffb020,
    FOUNDER:   0xff6400,
  };

  const rankEmojis = {
    SOLDIER:   '⚔️',
    COMMANDER: '🎯',
    FOUNDER:   '👑',
  };

  const payload = {
    username: 'ALPHA News Bot',
    embeds: [{
      title: `${rankEmojis[newRank] || '🎖️'} RANK PROMOTION`,
      color: rankColors[newRank] || 0x39ff14,
      description: `**${member.username}** has been promoted to **${newRank}**!`,
      fields: [
        { name: '◈ Activision ID', value: member.activision_id, inline: true },
        { name: '⬡ Discord',       value: `@${member.discord}`, inline: true },
        { name: '🎖️ New Rank',      value: newRank,              inline: true },
      ],
      footer: { text: 'ALPHA Clan HQ' },
      timestamp: new Date().toISOString(),
    }]
  };

  return await sendToDiscord(DISCORD.clanNews, payload);
};

// ===== POST WEEKLY LEADERBOARD =====
window.postLeaderboardToDiscord = async function(players) {
  const top5 = [...players]
    .sort((a, b) => b.kd - a.kd)
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  const leaderboardText = top5.map((p, i) =>
    `${medals[i]} **${p.name}** — K/D: \`${p.kd.toFixed(2)}\` | Kills: \`${p.kills.toLocaleString()}\` | Wins: \`${p.wins}\``
  ).join('\n');

  const payload = {
    username: 'ALPHA Leaderboard',
    embeds: [{
      title: '📊 ALPHA CLAN — WEEKLY LEADERBOARD',
      color: 0xffb020,
      description: leaderboardText,
      fields: [
        { name: '🏆 Clan Avg K/D', value: (players.reduce((s,p) => s + p.kd, 0) / players.length).toFixed(2), inline: true },
        { name: '💀 Total Kills',  value: players.reduce((s,p) => s + p.kills, 0).toLocaleString(),            inline: true },
        { name: '🏅 Total Wins',   value: players.reduce((s,p) => s + p.wins, 0).toString(),                   inline: true },
      ],
      footer: { text: `ALPHA Clan HQ • ${new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` },
      timestamp: new Date().toISOString(),
    }]
  };

  const ok = await sendToDiscord(DISCORD.leaderboard, payload);
  if (ok) showToast('Leaderboard posted to #leaderboard!');
  return ok;
};

// ===== TOAST HELPER (if not already defined) =====
if (typeof showToast === 'undefined') {
  window.showToast = function(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:var(--accent);color:#000;
      font-family:var(--font-mono);font-size:12px;letter-spacing:0.1em;
      padding:10px 20px;border-radius:2px;z-index:9999;
      animation:fadeInUp 0.3s ease both;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };
}
