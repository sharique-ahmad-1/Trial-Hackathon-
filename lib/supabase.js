// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kcodussczqgiagwtlrxw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb2R1c3NjenFnaWFnd3Rscnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjQ2MTUsImV4cCI6MjEwNjE0MDYxNX0.sToCgC08K5yBerB-swq1OeQEhmb6uOwsMZMR5zAkM8s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
