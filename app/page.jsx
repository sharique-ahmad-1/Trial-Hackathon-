'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Pill, 
  Utensils, 
  Droplets, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  Volume2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [meals, setMeals] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [loading, setLoading] = useState(true);
  const [takingMedId, setTakingMedId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', 'senior_user_1')
        .single();
      if (prof) setProfile(prof);

      // 2. Fetch Medications
      const { data: meds } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', 'senior_user_1')
        .order('schedule_time', { ascending: true });
      if (meds) setMedications(meds);

      // 3. Fetch Today's Meals
      const { data: mealData } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', 'senior_user_1');
      if (mealData) setMeals(mealData);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = async (medId) => {
    setTakingMedId(medId);
    try {
      const { error } = await supabase
        .from('medications')
        .update({ 
          status: 'taken', 
          last_taken_at: new Date().toISOString() 
        })
        .eq('id', medId);

      if (!error) {
        setMedications(prev => 
          prev.map(m => m.id === medId ? { ...m, status: 'taken', last_taken_at: new Date().toISOString() } : m)
        );
      }
    } catch (e) {
      console.error('Failed to mark taken:', e);
    } finally {
      setTakingMedId(null);
    }
  };

  const speak = (msg) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // Calculations
  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const calorieTarget = profile?.daily_calorie_target || 1800;
  const caloriePercent = Math.min(100, Math.round((totalCalories / calorieTarget) * 100));

  const pendingMeds = medications.filter(m => m.status !== 'taken');
  const nextMedicine = pendingMeds[0] || medications[0];

  const pillColorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-950 dark:text-blue-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950 dark:text-amber-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-400 dark:bg-rose-950 dark:text-rose-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-400 dark:bg-purple-950 dark:text-purple-200',
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Friendly Senior Greeting Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-blue-100 font-bold text-sm tracking-wide uppercase">
            <Calendar className="w-4 h-4" />
            <span>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Namaste, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Ramesh'} Ji!
          </h1>
          <p className="text-base sm:text-lg text-blue-50 font-medium">
            Here is your simple health overview for today. All your medicines and meal goals are tracked below.
          </p>

          <button
            onClick={() => speak(`Good day ${profile?.full_name || 'Ramesh Ji'}. You have consumed ${totalCalories} calories out of ${calorieTarget}. You have ${pendingMeds.length} medicines pending for today.`)}
            className="mt-3 px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm flex items-center gap-2 border border-white/30 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Today's Summary Aloud</span>
          </button>
        </div>
      </section>

      {/* TOP ROW: 2 Primary Attention Cards (Medication Alert & Calorie Budget) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Next Medicine Alert */}
        <section className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-3 border-blue-500/40 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
                <Clock className="w-4 h-4" />
                Scheduled Pill Dose
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {pendingMeds.length} pending today
              </span>
            </div>

            {nextMedicine ? (
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${pillColorClasses[nextMedicine.color_tag] || 'bg-blue-100 border-blue-400'}`}>
                    <Pill className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {nextMedicine.name}
                    </h3>
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                      {nextMedicine.dosage} • <span className="text-slate-600 dark:text-slate-300">{nextMedicine.schedule_time}</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      Instructions: {nextMedicine.meal_relation} ({nextMedicine.notes || 'Take with water'})
                    </p>
                  </div>
                </div>

                {nextMedicine.status === 'taken' ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>Dose Completed for Today! Excellent Job.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkTaken(nextMedicine.id)}
                    disabled={takingMedId === nextMedicine.id}
                    className="w-full touch-target py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-lg shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                    <span>{takingMedId === nextMedicine.id ? 'Marking...' : 'I Have Taken This Medicine'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 space-y-1">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">All medicines taken for today!</p>
              </div>
            )}
          </div>

          <Link
            href="/medications"
            className="touch-target pt-2 text-base font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center justify-between border-t border-slate-100 dark:border-slate-800"
          >
            <span>View All Daily Medicines & Times</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Card 2: Diet & Calorie Budget Meter */}
        <section className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-3 border-emerald-500/40 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                <Utensils className="w-4 h-4" />
                Daily Food & Nutrition
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Target: {calorieTarget} kcal
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {totalCalories} <span className="text-base font-bold text-slate-500">kcal eaten</span>
                </span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {Math.max(0, calorieTarget - totalCalories)} kcal left
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Macro Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-bold">Protein</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {meals.reduce((a, m) => a + (m.protein_grams || 0), 0)}g
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-bold">Carbs</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {meals.reduce((a, m) => a + (m.carbs_grams || 0), 0)}g
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-bold">Fiber</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {meals.reduce((a, m) => a + (m.fiber_grams || 0), 0)}g
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/diet"
            className="touch-target pt-2 text-base font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center justify-between border-t border-slate-100 dark:border-slate-800"
          >
            <span>Log a Meal or View Senior Diet Plan</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>

      {/* SECOND ROW: Daily Water Hydration & Emergency Caregiver Quick Tile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hydration Tracker Card */}
        <section className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-500" />
              Daily Water Hydration Tracker
            </h3>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
              {waterGlasses} of 8 Glasses Drunk
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drinking water regularly keeps joints lubricated, stabilizes blood pressure, and helps digestion.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((glassNum) => (
              <button
                key={glassNum}
                onClick={() => setWaterGlasses(glassNum)}
                className={`touch-target px-3.5 py-2.5 rounded-2xl font-black text-sm flex items-center gap-1.5 transition-all ${
                  glassNum <= waterGlasses
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Glass {glassNum}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Caregiver Connection */}
        <section className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              Designated Caregiver
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {profile?.emergency_contact_name || 'Dr. Sunita Sharma'}
            </h4>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Daughter & Primary Care Provider
            </p>
          </div>

          <a
            href={`tel:${profile?.emergency_contact_phone || '+919876543210'}`}
            className="touch-target w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
          >
            <span>Call Caregiver Now</span>
          </a>
        </section>
      </div>
    </div>
  );
}
