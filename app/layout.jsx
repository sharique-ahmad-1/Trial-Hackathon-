'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EmergencyModal from '../components/EmergencyModal';
import { supabase } from '../lib/supabase';
import './globals.css';

export default function RootLayout({ children }) {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', 'senior_user_1')
          .single();

        if (data) setProfile(data);
      } catch (err) {
        console.error('Failed to load profile in layout:', err);
      }
    }
    loadProfile();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>WellTrack Senior - Health, Food & Medicine Companion</title>
        <meta name="description" content="Accessible, mobile-friendly Health & Wellness Tracker designed for seniors, caregivers, and families." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />
        
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <EmergencyModal 
          isOpen={emergencyOpen} 
          onClose={() => setEmergencyOpen(false)} 
          profile={profile} 
        />

        <footer className="border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">
              WellTrack Senior • Designed for Accessibility, Clarity & Peace of Mind
            </p>
            <p className="text-xs">
              Directly connected to Supabase Cloud Database & Vercel Production Stack
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
