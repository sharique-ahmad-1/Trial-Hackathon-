'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Mail, Lock, LogIn, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Account created! Please check your email or proceed directly.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Authentication error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // 1-Click bypass for instant evaluator testing
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
          <HeartPulse className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {isLogin ? 'Sign In to WellTrack' : 'Create New Account'}
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Senior-friendly health, medication & nutrition tracker
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold border-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-400' 
            : 'bg-rose-50 text-rose-800 border-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* 1-Click Evaluator Testing Button */}
      <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-400 space-y-2 text-center">
        <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
          ⚡ Hackathon Evaluator Quick Access:
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full touch-target py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Continue as Ramesh Sharma (Age 68)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or with Supabase Auth</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleAuth} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. senior@example.com"
              className="w-full touch-target pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full touch-target pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full touch-target py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Register Account'}</span>
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </form>
    </div>
  );
}
