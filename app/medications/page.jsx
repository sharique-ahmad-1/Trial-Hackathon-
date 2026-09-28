'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Volume2, 
  Trash2, 
  Sparkles,
  Calendar,
  BellRing,
  HelpCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add Med Form
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (500mg)');
  const [time, setTime] = useState('08:00 AM');
  const [mealRelation, setMealRelation] = useState('After Food');
  const [colorTag, setColorTag] = useState('blue');
  const [notes, setNotes] = useState('Take with warm water');

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', 'senior_user_1')
        .order('schedule_time', { ascending: true });

      if (data) setMedications(data);
    } catch (err) {
      console.error('Failed to load meds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (med) => {
    const nextStatus = med.status === 'taken' ? 'pending' : 'taken';
    const timestamp = nextStatus === 'taken' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('medications')
        .update({ status: nextStatus, last_taken_at: timestamp })
        .eq('id', med.id);

      if (!error) {
        setMedications(prev => 
          prev.map(m => m.id === med.id ? { ...m, status: nextStatus, last_taken_at: timestamp } : m)
        );
      }
    } catch (e) {
      console.error('Update failed:', e);
    }
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([{
          user_id: 'senior_user_1',
          name,
          dosage,
          schedule_time: time,
          meal_relation: mealRelation,
          color_tag: colorTag,
          status: 'pending',
          notes
        }])
        .select()
        .single();

      if (data) {
        setMedications([...medications, data]);
        setShowAddModal(false);
        setName('');
      }
    } catch (err) {
      alert('Error adding medication: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this medicine?')) return;
    try {
      await supabase.from('medications').delete().eq('id', id);
      setMedications(medications.filter(m => m.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
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

  const colorConfig = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-400' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-400' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-400' },
    green: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-400' },
  };

  const pendingCount = medications.filter(m => m.status !== 'taken').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Pill className="w-8 h-8 text-blue-600" />
            Medication & Pill Schedule
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Clear visual pill cards, dose reminders, and one-tap taken confirmation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="touch-target px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Senior Summary Alert Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-3 border-blue-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <BellRing className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {pendingCount === 0 ? 'All Medicines Complete for Today! 🎉' : `${pendingCount} Medicine Dose(s) Remaining`}
            </h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Taking your medicines on time helps keep your blood pressure and energy balanced.
            </p>
          </div>
        </div>

        <button
          onClick={() => speak(`You have ${pendingCount} medicines left to take today. First one is ${medications.find(m => m.status !== 'taken')?.name || 'none'}`)}
          className="touch-target px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-2 hover:bg-slate-200"
        >
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>Hear Dose Schedule</span>
        </button>
      </div>

      {/* Medication Cards List */}
      <div className="space-y-4">
        {medications.map((med) => {
          const cfg = colorConfig[med.color_tag] || colorConfig.blue;
          const isTaken = med.status === 'taken';

          return (
            <div
              key={med.id}
              className={`p-6 rounded-3xl border-3 shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                isTaken
                  ? 'bg-slate-50 dark:bg-slate-900/60 border-emerald-400/60 opacity-90'
                  : 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-xl'
              }`}
            >
              {/* Pill Visual & Details */}
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                  <Pill className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {med.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                      {med.color_tag} pill
                    </span>
                  </div>

                  <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {med.dosage} • <span className="text-slate-800 dark:text-slate-200 font-black">{med.schedule_time}</span>
                  </p>

                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    🕒 Timing: {med.meal_relation} {med.notes && `• Note: ${med.notes}`}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => speak(`Medicine: ${med.name}. Dosage: ${med.dosage}. Scheduled for: ${med.schedule_time}, ${med.meal_relation}.`)}
                  className="touch-target p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  title="Listen to medicine instructions"
                >
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </button>

                <button
                  onClick={() => handleToggleStatus(med)}
                  className={`touch-target px-6 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    isTaken
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                  <span>{isTaken ? 'Taken (Tap to undo)' : 'Mark as Taken'}</span>
                </button>

                <button
                  onClick={() => handleDelete(med.id)}
                  className="touch-target p-3 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  title="Remove medicine"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-3 border-blue-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Add New Medicine</h3>
            
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name & Strength
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Paracetamol"
                  className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage Quantity
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet"
                    className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 08:30 AM"
                    className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Meal Timing
                  </label>
                  <select
                    value={mealRelation}
                    onChange={(e) => setMealRelation(e.target.value)}
                    className="w-full touch-target px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
                  >
                    <option>After Food</option>
                    <option>Before Food</option>
                    <option>With Water</option>
                    <option>At Bedtime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pill Visual Color
                  </label>
                  <select
                    value={colorTag}
                    onChange={(e) => setColorTag(e.target.value)}
                    className="w-full touch-target px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
                  >
                    <option value="blue">Blue</option>
                    <option value="amber">Amber / Yellow</option>
                    <option value="rose">Red / Pink</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Helpful Notes / Doctor Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Do not crush, drink full glass of water"
                  className="w-full touch-target px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-medium text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="touch-target px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-md"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
