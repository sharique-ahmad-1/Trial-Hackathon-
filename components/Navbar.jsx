'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HeartPulse, 
  Utensils, 
  Pill, 
  User, 
  Sun, 
  Moon, 
  Type, 
  Volume2, 
  PhoneCall, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ onOpenEmergency }) {
  const pathname = usePathname();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(true);

  useEffect(() => {
    // Check initial preferences from localStorage
    const savedContrast = localStorage.getItem('senior_high_contrast') === 'true';
    const savedText = localStorage.getItem('senior_large_text') !== 'false'; // default true
    
    setHighContrast(savedContrast);
    setLargeText(savedText);

    if (savedContrast) document.body.classList.add('high-contrast');
    if (savedText) document.body.classList.add('large-text');
  }, []);

  const toggleContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    localStorage.setItem('senior_high_contrast', String(nextVal));
    if (nextVal) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const toggleTextSize = () => {
    const nextVal = !largeText;
    setLargeText(nextVal);
    localStorage.setItem('senior_large_text', String(nextVal));
    if (nextVal) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  };

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower, clear voice for elderly
      window.speechSynthesis.speak(utterance);
    }
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: HeartPulse, speak: 'Home Dashboard' },
    { href: '/diet', label: 'Diet & Food', icon: Utensils, speak: 'Diet and Calorie Tracker' },
    { href: '/medications', label: 'Medicines', icon: Pill, speak: 'Medication and Pill Schedule' },
    { href: '/profile', label: 'My Health', icon: User, speak: 'My Health Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Accessibility Bar for Elderly Users */}
      <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Easy Senior View Active</span>
          </div>

          <div className="flex items-center gap-2">
            {/* High Contrast Toggle */}
            <button
              onClick={toggleContrast}
              className="touch-target px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:border-blue-600 transition-all"
              title="Toggle High Contrast Mode"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{highContrast ? 'Standard View' : 'High Contrast'}</span>
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={toggleTextSize}
              className="touch-target px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:border-blue-600 transition-all"
              title="Toggle Large Text Mode"
            >
              <Type className="w-4 h-4 text-blue-600" />
              <span>{largeText ? 'Large Font (On)' : 'Normal Font'}</span>
            </button>

            {/* Voice Audio Readout */}
            <button
              onClick={() => speakText("Health and Wellness Tracker. Showing your daily medicine schedule, meals, and emergency contact.")}
              className="touch-target px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-100 transition-all"
              title="Read Page Aloud"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen</span>
            </button>

            {/* Quick Emergency SOS Call Button */}
            <button
              onClick={onOpenEmergency}
              className="touch-target px-3.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 transition-all animate-bounce"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS Emergency</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white group-hover:scale-105 transition-transform">
            <HeartPulse className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              WellTrack <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold uppercase">Senior</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Health, Food & Medicine Companion</p>
          </div>
        </Link>

        {/* Navigation Tabs (Large Touch Targets for Seniors) */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => speakText(link.speak)}
                className={`touch-target px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
