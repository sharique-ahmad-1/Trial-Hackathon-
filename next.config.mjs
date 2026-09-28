/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kcodussczqgiagwtlrxw.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb2R1c3NjenFnaWFnd3Rscnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjQ2MTUsImV4cCI6MjEwNjE0MDYxNX0.sToCgC08K5yBerB-swq1OeQEhmb6uOwsMZMR5zAkM8s',
  }
};

export default nextConfig;
