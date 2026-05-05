# [ALPHA] Clan HQ

> Private Warzone clan platform — live stats, social feed, Discord integration.

## 🚀 Live URL
`https://YOUR-USERNAME.github.io/alpha-clan/`

---

## 📁 Project Structure

```
alpha-clan/
├── index.html              ← Homepage + Stats Dashboard (Phase 1 ✅)
├── roster.html             ← Clan roster (Phase 2)
├── matches.html            ← Match history (Phase 2)
├── social.html             ← Clan feed (Phase 3)
├── login.html              ← Auth + registration (Phase 2)
├── css/
│   └── style.css           ← Main stylesheet
├── js/
│   ├── data.js             ← Player/match data (swap for real API)
│   └── app.js              ← App logic
└── .github/
    └── workflows/
        └── deploy.yml      ← Auto-deploy to GitHub Pages
```

---

## ⚡ Deploy to GitHub Pages (5 minutes)

### Step 1 — Create GitHub repo
1. Go to github.com → New repository
2. Name it: `alpha-clan` (or anything you want)
3. Set to **Public** (required for free GitHub Pages)
4. Don't initialize with README

### Step 2 — Push the code
```bash
cd alpha-clan
git init
git add .
git commit -m "Initial deploy: ALPHA Clan HQ Phase 1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/alpha-clan.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. The workflow auto-deploys on every push to `main`

### Step 4 — Visit your site
`https://YOUR-USERNAME.github.io/alpha-clan/`

---

## 🔧 Connecting Real Stats (Phase 1.5)

The site uses placeholder data in `js/data.js`. To connect real Warzone stats:

### Option A — tracker.gg API
```js
// In a Vercel serverless function (api/stats.js):
const res = await fetch(`https://api.tracker.gg/api/v2/warzone/standard/profile/atvi/${activisionId}`, {
  headers: { 'TRN-Api-Key': process.env.TRACKER_API_KEY }
});
const data = await res.json();
```
Get your API key at: https://tracker.gg/developers

### Option B — cod-api (unofficial, no key needed)
```bash
npm install cod-api
```
```js
const Warzone = require('cod-api').Warzone;
const stats = await Warzone.fullData('username#1234', 'battle');
```

---

## 🗃️ Phase 2 — Auth + Database

Recommended stack: **Supabase** (free tier)

1. Create account at supabase.com
2. Create tables: `users`, `clan_members`, `match_log`
3. Use Supabase Auth for registration/login
4. Add your Supabase URL + anon key to environment

---

## 🤖 Phase 3 — Discord Bot

The bot will:
- Post match summaries to a clan channel when a match ends
- Update a #leaderboard channel with weekly stats
- Send win/loss streaks

Tech: `discord.js` hosted on a free Railway or Render instance.

---

## 🎨 Customization

Edit CSS variables in `css/style.css` `:root {}`:
- `--accent` — change from neon green to any color
- `--font-display` — swap Orbitron for another Google Font
- Update clan name, region, and season in `js/data.js` `CLAN_DATA`

---

## 📋 Phases Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Homepage + Stats Dashboard | ✅ Done |
| 1.5 | Real API integration | 🔜 Next |
| 2 | Auth + Profiles + Roster | 📋 Planned |
| 3 | Clan Social Feed | 📋 Planned |
| 4 | Discord Bot + Match Auto-post | 📋 Planned |

---

Built for ALPHA Clan. Not affiliated with Activision or Raven Software.
