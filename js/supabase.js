// ============================================
// ALPHA CLAN — SUPABASE CLIENT
// ============================================
const SUPABASE_URL  = 'https://ywqcmrfkguuofhyfbuxb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cWNtcmZrZ3V1b2ZoeWZidXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI3MjgsImV4cCI6MjA5MzQ5ODcyOH0.nFXnFeDeSAOaw0ShQCnU1BJGtO4vAa3AgKMqHyD-fhY';

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
document.dispatchEvent(new Event('supabase-ready'));
