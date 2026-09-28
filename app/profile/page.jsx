'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  ShieldAlert, 
  PhoneCall, 
  Save, 
  CheckCircle2, 
  Volume2, 
  Activity, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(68);
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [conditions, setConditions] = useState('Hypertension, Mild Arthritis');
  const [allergies, setAllergies] = useState('Penicillin');
  const [calorieTarget, setCalorieTarget] = useState(1800);
  const [emergencyName, setEmergencyName] = useState('Dr. Sunita Sharma (Daughter)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', 'senior_user_1')
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setAge(data.age || 68);
        setBloodGroup(data.blood_group || 'B+');
        setConditions((data.medical_conditions || []).join(', '));
        setAllergies((data.allergies || []).join(', '));
        setCalorieTarget(data.daily_calorie_target || 1800);
        setEmergencyName(data.emergency_contact_name || '');
        setEmergencyPhone(data.emergency_contact_phone || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);

    const conditionsArray = conditions.split(',').map(s => s.trim()).filter(Boolean);
    const allergiesArray = allergies.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          age: parseInt(age) || 68,
          blood_group: bloodGroup,
          medical_conditions: conditionsArray,
          allergies: allergiesArray,
          daily_calorie_target: parseInt(calorieTarget) || 1800,
          emergency_contact_name: emergencyName,
          emergency_contact_phone: emergencyPhone
        })
        .eq('user_id', 'senior_user_1');

      if (!error) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      alert('Error updating profile: ' + err.message);
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            My Health Profile & Caregiver Details
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Personal health metrics, chronic conditions, and emergency contacts.
          </p>
        </div>

        <button
          onClick={() => speak(`Patient Profile for ${fullName}. Age ${age}. Blood Group ${bloodGroup}. Known conditions include ${conditions}. Primary emergency contact is ${emergencyName}.`)}
          className="touch-target px-4 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800 font-bold text-sm flex items-center gap-2 hover:bg-blue-100"
        >
          <Volume2 className="w-5 h-5 text-blue-600" />
          <span>Read Profile Aloud</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <span>Profile changes saved successfully to your health record!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Senior Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Activity className="w-5 h-5 text-blue-600" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
              >
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Medical Conditions & Allergies */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Heart className="w-5 h-5 text-rose-500" />
            Medical Conditions & Known Allergies
          </h3>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Active Medical Conditions (comma-separated)
            </label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Hypertension, Type 2 Diabetes, Arthritis"
              className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 mt-1">Used by AI to calibrate personalized meal recommendations.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Drug or Food Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Sulfa Drugs"
              className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
            />
            <p className="text-xs text-rose-500 font-medium mt-1">Critical for emergency paramedic reference.</p>
          </div>
        </div>

        {/* Section 3: Caregiver & Emergency Contacts */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <PhoneCall className="w-5 h-5 text-amber-500" />
            Designated Caregiver & Emergency Phone
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Caregiver Name & Relationship
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Sunita Sharma (Daughter)"
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Phone Number
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full touch-target px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full touch-target py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-99 text-white font-black text-lg shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-6 h-6 stroke-[2.5]" />
          <span>Save Profile & Medical Details</span>
        </button>
      </form>
    </div>
  );
}
