// ============================================
// ALPHA CLAN — DATA LAYER
// Replace these with real API calls later
// ============================================

const CLAN_DATA = {
  name: "ALPHA",
  season: "S06",
  region: "NA-EAST",
  rank: 42,
  avgKD: 2.64,
  wins: 334,
  members: 8,
  updateStats: function(stats) {
    this.rank = stats.rank || this.rank;
    this.avgKD = stats.avgKD || this.avgKD;
    this.wins = stats.wins || this.wins;
    this.members = stats.members || this.members;
  }
};

// Avatar color palettes per player
const AVATAR_COLORS = [
  { bg: "rgba(57,255,20,0.15)",  color: "#39ff14" },
  { bg: "rgba(59,158,255,0.15)", color: "#3b9eff" },
  { bg: "rgba(255,176,32,0.15)", color: "#ffb020" },
  { bg: "rgba(255,59,59,0.15)",  color: "#ff3b3b" },
  { bg: "rgba(180,60,255,0.15)", color: "#b43cff" },
  { bg: "rgba(0,220,180,0.15)",  color: "#00dcb4" },
  { bg: "rgba(255,100,0,0.15)",  color: "#ff6400" },
  { bg: "rgba(220,220,60,0.15)", color: "#dcdc3c" },
];

// ===== PLAYERS =====
// isPlaceholder: true = fake demo data, will be replaced by real members
const PLAYERS = [
  {
    id: 1, name: "GHOST_ACTUAL", tag: "#4127",
    isPlaceholder: true,
    kd: 3.84, kills: 4820, wins: 94, matches: 312, damage: 1_248_600, gulag: 71, top5: 58,
    bestMode: "resurgence",
    avatar: 0,
    modes: {
      resurgence:         { kd: 4.91, kills: 2240, wins: 62, matches: 148, damage: 612_000 },
      "resurgence-caldera": { kd: 3.22, kills: 940,  wins: 18, matches: 80,  damage: 248_000 },
      "battle-royale":    { kd: 2.44, kills: 1290, wins: 12, matches: 68,  damage: 341_600 },
      plunder:            { kd: 5.10, kills: 280,  wins: 2,  matches: 10,  damage: 42_000  },
      ranked:             { kd: 3.01, kills: 70,   wins: 0,  matches: 6,   damage: 5_000   },
    }
  },
  {
    id: 2, name: "XRAY_SIX", tag: "#9982",
    kd: 3.21, kills: 3910, wins: 76, matches: 298, damage: 988_400, gulag: 67, top5: 52,
    bestMode: "resurgence",
    avatar: 1,
    modes: {
      resurgence:         { kd: 4.10, kills: 1980, wins: 48, matches: 130, damage: 511_000 },
      "resurgence-caldera": { kd: 2.88, kills: 780,  wins: 14, matches: 72,  damage: 196_000 },
      "battle-royale":    { kd: 2.01, kills: 1020, wins: 12, matches: 84,  damage: 244_400 },
      plunder:            { kd: 4.20, kills: 100,  wins: 2,  matches: 10,  damage: 37_000  },
      ranked:             { kd: 2.55, kills: 30,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
  {
    id: 3, name: "NIGHTSTALKER", tag: "#2201",
    kd: 2.97, kills: 3440, wins: 61, matches: 278, damage: 902_200, gulag: 63, top5: 49,
    bestMode: "battle-royale",
    avatar: 3,
    modes: {
      resurgence:         { kd: 2.80, kills: 1420, wins: 30, matches: 120, damage: 372_000 },
      "resurgence-caldera": { kd: 2.50, kills: 660,  wins: 10, matches: 68,  damage: 171_000 },
      "battle-royale":    { kd: 3.60, kills: 1220, wins: 20, matches: 80,  damage: 328_200 },
      plunder:            { kd: 3.90, kills: 120,  wins: 1,  matches: 8,   damage: 31_000  },
      ranked:             { kd: 2.10, kills: 20,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
  {
    id: 4, name: "CIPHER_01", tag: "#7743",
    kd: 2.68, kills: 3120, wins: 55, matches: 261, damage: 812_400, gulag: 59, top5: 44,
    bestMode: "resurgence",
    avatar: 2,
    modes: {
      resurgence:         { kd: 3.40, kills: 1520, wins: 36, matches: 118, damage: 402_000 },
      "resurgence-caldera": { kd: 2.20, kills: 640,  wins: 8,  matches: 64,  damage: 160_000 },
      "battle-royale":    { kd: 1.88, kills: 840,  wins: 10, matches: 71,  damage: 220_400 },
      plunder:            { kd: 4.00, kills: 100,  wins: 1,  matches: 6,   damage: 30_000  },
      ranked:             { kd: 1.90, kills: 20,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
  {
    id: 5, name: "RAZORBACK", tag: "#5519",
    kd: 2.44, kills: 2870, wins: 48, matches: 240, damage: 744_800, gulag: 58, top5: 40,
    bestMode: "resurgence",
    avatar: 4,
    modes: {
      resurgence:         { kd: 3.10, kills: 1380, wins: 30, matches: 110, damage: 364_000 },
      "resurgence-caldera": { kd: 2.00, kills: 560,  wins: 8,  matches: 58,  damage: 142_000 },
      "battle-royale":    { kd: 1.70, kills: 800,  wins: 8,  matches: 62,  damage: 208_800 },
      plunder:            { kd: 3.60, kills: 110,  wins: 2,  matches: 8,   damage: 30_000  },
      ranked:             { kd: 1.60, kills: 20,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
  {
    id: 6, name: "STATIC_FLUX", tag: "#3308",
    kd: 2.19, kills: 2540, wins: 40, matches: 228, damage: 660_200, gulag: 54, top5: 38,
    bestMode: "ranked",
    avatar: 5,
    modes: {
      resurgence:         { kd: 2.40, kills: 1120, wins: 22, matches: 100, damage: 294_000 },
      "resurgence-caldera": { kd: 1.90, kills: 480,  wins: 6,  matches: 52,  damage: 122_000 },
      "battle-royale":    { kd: 1.60, kills: 700,  wins: 8,  matches: 60,  damage: 198_000 },
      plunder:            { kd: 2.80, kills: 180,  wins: 2,  matches: 10,  damage: 46_200  },
      ranked:             { kd: 3.00, kills: 60,   wins: 2,  matches: 6,   damage: 0       },
    }
  },
  {
    id: 7, name: "VORTEX_K", tag: "#6612",
    kd: 1.98, kills: 2310, wins: 36, matches: 220, damage: 601_600, gulag: 52, top5: 35,
    bestMode: "battle-royale",
    avatar: 6,
    modes: {
      resurgence:         { kd: 1.80, kills: 940,  wins: 16, matches: 98,  damage: 248_000 },
      "resurgence-caldera": { kd: 1.70, kills: 440,  wins: 6,  matches: 50,  damage: 112_000 },
      "battle-royale":    { kd: 2.40, kills: 800,  wins: 12, matches: 60,  damage: 211_600 },
      plunder:            { kd: 2.20, kills: 110,  wins: 2,  matches: 10,  damage: 30_000  },
      ranked:             { kd: 1.30, kills: 20,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
  {
    id: 8, name: "WRAITH_9", tag: "#8841",
    kd: 1.82, kills: 2108, wins: 30, matches: 210, damage: 548_200, gulag: 48, top5: 32,
    bestMode: "resurgence-caldera",
    avatar: 7,
    modes: {
      resurgence:         { kd: 1.60, kills: 820,  wins: 12, matches: 88,  damage: 216_000 },
      "resurgence-caldera": { kd: 2.40, kills: 540,  wins: 10, matches: 56,  damage: 140_000 },
      "battle-royale":    { kd: 1.50, kills: 620,  wins: 6,  matches: 54,  damage: 162_200 },
      plunder:            { kd: 2.00, kills: 108,  wins: 2,  matches: 10,  damage: 30_000  },
      ranked:             { kd: 1.10, kills: 20,   wins: 0,  matches: 2,   damage: 0       },
    }
  },
];

// ===== RECENT MATCHES =====
const RECENT_MATCHES = [
  {
    id: "m001",
    mode: "RESURGENCE — VONDEL",
    result: "win",
    placement: 1,
    kills: 22, deaths: 5, assists: 8, damage: 6240,
    duration: "28:44",
    time: "2 hours ago",
    players: [0, 1, 2, 3],
  },
  {
    id: "m002",
    mode: "BATTLE ROYALE — AL MAZRAH",
    result: "win",
    placement: 1,
    kills: 16, deaths: 6, assists: 4, damage: 4820,
    duration: "34:12",
    time: "4 hours ago",
    players: [0, 2, 4, 5],
  },
  {
    id: "m003",
    mode: "RESURGENCE — CALDERA",
    result: "loss",
    placement: 4,
    kills: 14, deaths: 9, assists: 6, damage: 3910,
    duration: "22:18",
    time: "6 hours ago",
    players: [1, 3, 6, 7],
  },
  {
    id: "m004",
    mode: "RESURGENCE — VONDEL",
    result: "win",
    placement: 1,
    kills: 19, deaths: 4, assists: 11, damage: 5510,
    duration: "31:05",
    time: "Yesterday",
    players: [0, 1, 3, 5],
  },
  {
    id: "m005",
    mode: "RANKED — AL MAZRAH",
    result: "loss",
    placement: 6,
    kills: 10, deaths: 8, assists: 3, damage: 2810,
    duration: "40:22",
    time: "Yesterday",
    players: [2, 4, 5, 6],
  },
  {
    id: "m006",
    mode: "PLUNDER — FORTUNE'S KEEP",
    result: "win",
    placement: 1,
    kills: 28, deaths: 12, assists: 9, damage: 7100,
    duration: "25:00",
    time: "2 days ago",
    players: [0, 1, 2, 7],
  },
];

// Top performers this week
const TOP_PERFORMERS = [
  { playerId: 0, category: "MOST KILLS",      stat: "4,820",  statLabel: "TOTAL KILLS" },
  { playerId: 1, category: "BEST K/D",        stat: "3.84",   statLabel: "KILL/DEATH RATIO" },
  { playerId: 3, category: "MOST WINS",       stat: "94",     statLabel: "WINS THIS SEASON" },
  { playerId: 2, category: "TOP DAMAGE",      stat: "1.24M",  statLabel: "TOTAL DAMAGE" },
  { playerId: 4, category: "GULAG KING",      stat: "71%",    statLabel: "GULAG WIN RATE" },
];

// ===== REAL PLAYERS (from Supabase — populated when members register) =====
// When real players are approved, add them here with isPlaceholder: false
// Once you have 5+ real players, set HIDE_PLACEHOLDERS = true
const REAL_PLAYERS = [
  {
    id: 'founder-1',
    name: "INFECTED_MUSH",
    displayName: "Infected Mush 01",
    tag: "#2435421",
    isPlaceholder: false,
    isReal: true,
    activisionId: "Infected Mush 01#2435421",
    discord: "infected_mush",
    platform: "PC",
    kd: 0, kills: 0, wins: 0, matches: 0,
    damage: 0, gulag: 0, top5: 0,
    bestMode: "resurgence",
    avatar: 0,
    modes: {
      resurgence:           { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
      "resurgence-caldera": { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
      "battle-royale":      { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
      plunder:              { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
      ranked:               { kd: 0, kills: 0, wins: 0, matches: 0, damage: 0 },
    }
  },
];

// ===== PRIORITY SYSTEM =====
// Auto-set: true when >= 5 real members exist, false otherwise
// Override manually if needed (set false to always show placeholders)
const HIDE_PLACEHOLDERS = false;

// This is what the app uses — real players first, placeholders after (or hidden)
const ALL_PLAYERS = [
  ...REAL_PLAYERS,
  ...(HIDE_PLACEHOLDERS ? [] : PLAYERS.filter(p => p.isPlaceholder)),
];
