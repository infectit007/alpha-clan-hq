// ============================================
// ALPHA CLAN — ADMIN PANEL LOGIC
// ============================================

const RANKS = ['RECRUIT', 'SOLDIER', 'COMMANDER', 'FOUNDER'];
const CAN_APPROVE = ['SOLDIER', 'COMMANDER', 'FOUNDER'];

let currentMember = null;

document.addEventListener('supabase-ready', async () => {

  // Check session
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html'; return;
  }

  // Get member record
  const { data: member } = await window.supabaseClient
    .from('members')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!member || !CAN_APPROVE.includes(member.rank)) {
    document.getElementById('accessDenied').style.display = 'flex';
    return;
  }

  currentMember = member;
  document.getElementById('adminMain').style.display  = 'block';
  document.getElementById('sessionRank').textContent  = member.rank;
  document.getElementById('sessionName').textContent  = member.username;

  // Load all data
  await loadStats();
  await loadPending();
  await loadMembers();
  await loadDenied();

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).style.display = 'block';
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    localStorage.removeItem('alpha_member');
    window.location.href = 'login.html';
  });
});

async function loadStats() {
  const { data } = await window.supabaseClient.from('members').select('status');
  const pending  = data.filter(m => m.status === 'pending').length;
  const approved = data.filter(m => m.status === 'approved').length;
  const denied   = data.filter(m => m.status === 'denied').length;

  document.getElementById('statPending').textContent  = pending;
  document.getElementById('statApproved').textContent = approved;
  document.getElementById('statDenied').textContent   = denied;
  document.getElementById('statTotal').textContent    = approved;
}

async function loadPending() {
  const { data } = await window.supabaseClient
    .from('members')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const container = document.getElementById('pendingCards');
  const empty     = document.getElementById('pendingEmpty');

  if (!data || data.length === 0) {
    empty.style.display = 'flex';
    container.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  container.innerHTML = data.map(m => `
    <div class="recruit-card" id="card-${m.id}">
      <div class="recruit-card-header">
        <div class="recruit-avatar">${getInitials(m.username)}</div>
        <div class="recruit-info">
          <div class="recruit-name">${m.username}</div>
          <div class="recruit-meta">
            <span class="meta-tag">◈ ${m.activision_id}</span>
            <span class="meta-tag">⬡ ${m.discord}</span>
            <span class="meta-tag">⬒ ${m.platform}</span>
          </div>
        </div>
        <div class="recruit-time">${timeAgo(m.created_at)}</div>
      </div>
      ${m.bio ? `<div class="recruit-bio">"${m.bio}"</div>` : ''}
      <div class="recruit-actions">
        <button class="btn-approve" onclick="handleMember('${m.id}', 'approved')">✓ APPROVE</button>
        <button class="btn-deny"    onclick="handleMember('${m.id}', 'denied')">✕ DENY</button>
      </div>
    </div>
  `).join('');
}

async function loadMembers() {
  const { data } = await window.supabaseClient
    .from('members')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  const body = document.getElementById('membersBody');
  if (!data || data.length === 0) {
    body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px;">No approved members yet.</td></tr>';
    return;
  }

  body.innerHTML = data.map(m => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="recruit-avatar small">${getInitials(m.username)}</div>
          <span style="font-weight:600;">${m.username}</span>
        </div>
      </td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);">${m.activision_id}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);">${m.discord}</td>
      <td><span class="meta-tag">${m.platform}</span></td>
      <td><span class="rank-pill rank-${m.rank.toLowerCase()}">${m.rank}</span></td>
      <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">${formatDate(m.created_at)}</td>
      <td>
        ${currentMember.rank === 'FOUNDER' || currentMember.rank === 'COMMANDER' ? `
          <select class="rank-select" onchange="changeRank('${m.id}', this.value)" ${m.rank === 'FOUNDER' ? 'disabled' : ''}>
            ${RANKS.filter(r => r !== 'FOUNDER').map(r =>
              `<option value="${r}" ${m.rank === r ? 'selected' : ''}>${r}</option>`
            ).join('')}
          </select>
        ` : `<span class="rank-pill rank-${m.rank.toLowerCase()}">${m.rank}</span>`}
      </td>
    </tr>
  `).join('');
}

async function loadDenied() {
  const { data } = await window.supabaseClient
    .from('members')
    .select('*')
    .eq('status', 'denied')
    .order('created_at', { ascending: false });

  const container = document.getElementById('deniedCards');
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="admin-empty"><span>✓</span> No denied requests.</div>';
    return;
  }

  container.innerHTML = data.map(m => `
    <div class="recruit-card denied-card" id="card-${m.id}">
      <div class="recruit-card-header">
        <div class="recruit-avatar" style="opacity:0.5;">${getInitials(m.username)}</div>
        <div class="recruit-info">
          <div class="recruit-name" style="color:var(--text-secondary);">${m.username}</div>
          <div class="recruit-meta">
            <span class="meta-tag">◈ ${m.activision_id}</span>
            <span class="meta-tag">⬡ ${m.discord}</span>
          </div>
        </div>
        <div class="recruit-time">${timeAgo(m.created_at)}</div>
      </div>
      <div class="recruit-actions">
        <button class="btn-approve" onclick="handleMember('${m.id}', 'approved')">↩ REINSTATE</button>
      </div>
    </div>
  `).join('');
}

async function handleMember(memberId, status) {
  const { data: memberData } = await window.supabaseClient
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  const { error } = await window.supabaseClient
    .from('members')
    .update({
      status,
      rank: status === 'approved' ? 'RECRUIT' : 'RECRUIT',
      approved_by: currentMember.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', memberId);

  if (!error) {
    // Post to Discord if approved
    if (status === 'approved' && memberData && typeof postMemberApprovedToDiscord !== 'undefined') {
      postMemberApprovedToDiscord(memberData);
    }

    // Animate card out
    const card = document.getElementById('card-' + memberId);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(40px)';
      card.style.transition = 'all 0.3s ease';
      setTimeout(() => card.remove(), 300);
    }
    await loadStats();
    await loadMembers();
    if (status === 'denied') await loadDenied();
  }
}

async function changeRank(memberId, newRank) {
  await window.supabaseClient
    .from('members')
    .update({ rank: newRank })
    .eq('id', memberId);
}

// ===== HELPERS =====
function getInitials(name) {
  return (name || '?').slice(0, 2).toUpperCase();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return days + 'd ago';
  if (hours > 0) return hours + 'h ago';
  return mins + 'm ago';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-CA');
}
