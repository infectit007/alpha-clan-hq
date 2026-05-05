// ============================================
// ALPHA CLAN — SUPABASE CLIENT
// Replace with your real project credentials
// ============================================

// ⚠️ REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES
// Get them from: supabase.com → your project → Settings → API
const SUPABASE_URL  = 'https://ywqcmrfkguuofhyfbuxb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cWNtcmZrZ3V1b2ZoeWZidXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI3MjgsImV4cCI6MjA5MzQ5ODcyOH0.nFXnFeDeSAOaw0ShQCnU1BJGtO4vAa3AgKMqHyD-fhY';

// Load Supabase from CDN and initialize
(function () {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = function () {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    document.dispatchEvent(new Event('supabase-ready'));
  };
  document.head.appendChild(script);
})();
