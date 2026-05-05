-- ============================================
-- ALPHA CLAN HQ — SUPABASE DATABASE SCHEMA
-- Run this in: Supabase → SQL Editor → New query
-- ============================================

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL,
  activision_id TEXT NOT NULL UNIQUE,
  discord       TEXT NOT NULL,
  platform      TEXT DEFAULT 'PC',
  bio           TEXT,
  rank          TEXT DEFAULT 'RECRUIT' CHECK (rank IN ('RECRUIT','SOLDIER','COMMANDER','FOUNDER')),
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  approved_by   UUID REFERENCES members(id),
  approved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Social feed posts
CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id   UUID REFERENCES members(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image_url   TEXT,
  match_id    TEXT,
  likes       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Match log
CREATE TABLE IF NOT EXISTS match_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id    TEXT UNIQUE NOT NULL,
  mode        TEXT NOT NULL,
  result      TEXT CHECK (result IN ('win','loss')),
  placement   INT,
  kills       INT,
  deaths      INT,
  damage      INT,
  duration    TEXT,
  players     UUID[],
  posted_to_discord BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_log ENABLE ROW LEVEL SECURITY;

-- Members: anyone can INSERT (register), approved members can read
CREATE POLICY "Anyone can register" ON members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Approved members can view roster" ON members
  FOR SELECT USING (
    status = 'approved' OR
    auth.uid() = user_id
  );

CREATE POLICY "Soldiers+ can update member status" ON members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
      AND m.rank IN ('SOLDIER','COMMANDER','FOUNDER')
      AND m.status = 'approved'
    )
  );

-- Posts: approved members only
CREATE POLICY "Approved members can post" ON posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
      AND m.status = 'approved'
    )
  );

CREATE POLICY "Approved members can read posts" ON posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
      AND m.status = 'approved'
    )
  );

-- Match log: all approved can read
CREATE POLICY "Approved members can view matches" ON match_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
      AND m.status = 'approved'
    )
  );

-- ============================================
-- FOUNDER ACCOUNT SETUP
-- Run AFTER creating your account via register.html
-- Replace 'YOUR_USER_ID' with your actual UUID from auth.users
-- ============================================

-- UPDATE members
--   SET rank = 'FOUNDER', status = 'approved'
--   WHERE activision_id = 'YourActivisionID#1234';
